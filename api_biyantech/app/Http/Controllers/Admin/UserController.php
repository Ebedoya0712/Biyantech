<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserGCollection;
use App\Http\Resources\User\UserGResource;
use App\Models\User;
use App\Models\Role; // Asegúrate de tener este modelo
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $state = $request->state;

        $users = User::filterAdvance($search, $state)
                    ->where("type_user", 2)
                    ->orderBy("id", "desc")
                    ->get();

        return response()->json([
            "users" => UserGCollection::make($users),
        ]);
    }

    /**
     * Get all roles for dropdown
     *
     * @return \Illuminate\Http\Response
     */
    public function getRoles()
    {
        try {
            // Opción 1: Si tienes modelo Role
            if (class_exists(Role::class)) {
                $roles = Role::where('status', 1)
                            ->select('id', 'name', 'description')
                            ->orderBy('name', 'asc')
                            ->get();
            } 
            // Opción 2: Roles estáticos por si no tienes la tabla
            else {
                $roles = [
                    ['id' => 1, 'name' => 'Administrador', 'description' => 'Acceso completo al sistema'],
                    ['id' => 2, 'name' => 'Editor', 'description' => 'Puede editar contenido'],
                    ['id' => 3, 'name' => 'Usuario', 'description' => 'Usuario regular'],
                    ['id' => 4, 'name' => 'Instructor', 'description' => 'Puede crear cursos'],
                ];
                $roles = collect($roles); // Convertir a colección
            }

            return response()->json([
                "success" => true,
                "roles" => $roles
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => "Error al cargar roles",
                "message" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
            'state' => 'sometimes|in:1,2',
            'is_instructor' => 'sometimes|boolean',
            'profesion' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = $request->all();

            // Procesar imagen
            if ($request->hasFile("imagen")) {
                $path = Storage::putFile("users", $request->file("imagen"));
                $data['avatar'] = $path;
            }

            // Encriptar password
            if ($request->password) {
                $data['password'] = bcrypt($request->password);
            }

            // Forzar tipo de usuario
            $data['type_user'] = 2;

            $user = User::create($data);

            DB::commit();

            return response()->json([
                "success" => true,
                "user" => UserGResource::make($user),
                "message" => "Usuario creado exitosamente"
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Eliminar imagen si se subió pero falló la transacción
            if (isset($path) && Storage::exists($path)) {
                Storage::delete($path);
            }

            return response()->json([
                "success" => false,
                "error" => "Error al crear usuario",
                "message" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {   
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'surname' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role_id' => 'sometimes|exists:roles,id',
            'state' => 'sometimes|in:1,2',
            'is_instructor' => 'sometimes|boolean',
            'profesion' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "errors" => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = $request->all();
            $oldAvatar = $user->avatar;

            // Procesar imagen
            if ($request->hasFile("imagen")) {
                // Eliminar avatar anterior si existe
                if ($user->avatar && Storage::exists($user->avatar)) {
                    Storage::delete($user->avatar);
                }
                
                $path = Storage::putFile("users", $request->file("imagen"));
                $data['avatar'] = $path;
            }

            // Procesar password (solo si viene)
            if ($request->password) {
                $data['password'] = bcrypt($request->password);
            } else {
                unset($data['password']);
            }

            // Actualizar usuario
            $user->update($data);

            DB::commit();

            return response()->json([
                "success" => true,
                "user" => UserGResource::make($user),
                "message" => "Usuario actualizado exitosamente"
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            // Eliminar nueva imagen si falló la transacción
            if (isset($path) && Storage::exists($path)) {
                Storage::delete($path);
            }

            return response()->json([
                "success" => false,
                "error" => "Error al actualizar usuario",
                "message" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Verificar dependencias antes de eliminar
            if (method_exists($user, 'orders') && $user->orders()->where('status', 'active')->exists()) {
                return response()->json([
                    "success" => false,
                    "message" => "No se puede eliminar el usuario porque tiene órdenes activas"
                ], 422);
            }

            $avatarPath = $user->avatar;
            
            $user->delete();

            // Eliminar imagen después de eliminar usuario
            if ($avatarPath && Storage::exists($avatarPath)) {
                Storage::delete($avatarPath);
            }

            return response()->json([
                "success" => true,
                "message" => "Usuario eliminado exitosamente"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => "Error al eliminar usuario",
                "message" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = User::with('role')->findOrFail($id);

            return response()->json([
                "success" => true,
                "user" => UserGResource::make($user)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "error" => "Usuario no encontrado",
                "message" => $e->getMessage()
            ], 404);
        }
    }
}