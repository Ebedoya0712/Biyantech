<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register','login_tienda']]);
    }
 
 
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register() {
        // confirmed
        $validator = Validator::make(request()->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);
 
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
 
        $user = new User;
        $user->name = request()->name;
        $user->email = request()->email;
        $user->password = bcrypt(request()->password);
        $user->save();
 
        return response()->json($user, 201);
    }
 
 
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);
 
        if (! $token = auth('api')->attempt(["email" => $request->email,"password" => $request->password,"type_user" => 2, "state" => 1])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
 
        return $this->respondWithToken($token);
    }
    
    public function login_tienda(Request $request)
    {
        $credentials = request(['email', 'password']);
 
        if (! $token = auth('api')->attempt(["email" => $request->email,"password" => $request->password, "state" => 1])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
 
        return $this->respondWithToken($token);
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }
 
    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();
 
        return response()->json(['message' => 'Successfully logged out']);
    }
 
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }
 
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            "user" => [
                "name" => auth('api')->user()->name,
                "surname" => auth('api')->user()->surname,
                "email" => auth('api')->user()->email,
                "role" => auth('api')->user()->role,
                "role_id" => auth('api')->user()->role_id,
                "is_instructor" => auth('api')->user()->is_instructor,
                "avatar" => auth('api')->user()->avatar,
            ]
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'El correo no existe en nuestro sistema'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $token = Str::random(60);

        // Guardar token en tabla password_resets (asumiendo que existe por defecto en Laravel)
        \DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // Enviar Correo
        try {
            Mail::to($user->email)->send(new ForgotPasswordMail($user, $token));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al enviar el correo: ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña']);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $resetData = \DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetData || !Hash::check($request->token, $resetData->token)) {
            return response()->json(['error' => 'El token es inválido o ha expirado'], 400);
        }

        // Actualizar contraseña
        $user = User::where('email', $request->email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        // Borrar token usado
        \DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña restablecida correctamente']);
    }
}
