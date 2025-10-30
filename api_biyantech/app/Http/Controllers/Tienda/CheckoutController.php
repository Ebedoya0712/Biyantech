<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Mail\SaleMail;
use App\Models\CoursesStudent;
use App\Models\Sale\Cart;
use App\Models\Sale\Sale;
use App\Models\Sale\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // 1. OBTENER Y VALIDAR USUARIO AUTENTICADO
        $user = auth("api")->user();
        if (!$user) {
            // Manejo de error si el usuario no está autenticado
            return response()->json(["message" => 401, "message_text" => "ERROR: Usuario no autenticado para el checkout."], 401);
        }
        $user_id = $user->id;

        // 2. CREAR LA VENTA
        // Se inyecta el user_id al request antes de crear la venta
        $request->request->add(["user_id" => $user_id]);
        $sale = Sale::create($request->all());

        // 3. PROCESAR CARRITO Y DETALLES DE VENTA
        // Se usa el $user_id validado
        $carts = Cart::where("user_id", $user_id)->get();

        foreach ($carts as $key => $cart){
            $cart->delete(); // Eliminar el item del carrito
            
            $new_detail = $cart->toArray();
            $new_detail["sale_id"] = $sale->id;
            
            // Crear detalle de venta
            SaleDetail::create($new_detail);
            
            // Asignar curso al estudiante
            CoursesStudent::create([
                "course_id" => $new_detail["course_id"],
                "user_id" => $user_id, // Usar el ID de usuario validado
            ]);
        }
        
        try {
            // Asegúrate de que el modelo Sale tenga la relación 'user' definida
            Mail::to($sale->user->email)->send(new SaleMail($sale));
        } catch (\Exception $e) {
            // Opcional: Loguear el error de correo si falla
            Log::error("Fallo el envío de correo para la venta {$sale->id}: " . $e->getMessage());
        }

        // Se agrega el código 201 (Created) para mayor semántica HTTP
        return response()->json(["message" => 200, "message_text" => "LOS CURSOS SE HAN ADQUIRIDO CORRECTAMENTE"], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
