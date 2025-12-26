<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Sale\SaleCollection;
use App\Mail\SaleMail;
use App\Mail\PagoMovilApprovedMail;
use App\Models\CoursesStudent;
use App\Models\Sale\Cart;
use App\Models\Sale\Sale;
use App\Models\Sale\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // NECESARIO para manejar archivos
use App\Services\BinancePayService;
use App\Services\ImageVerificationService;

class CheckoutController extends Controller
{
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
            return response()->json(["message" => 401, "message_text" => "ERROR: Usuario no autenticado para el checkout."], 401);
        }
        $user_id = $user->id;
        $request->request->add(["user_id" => $user_id]);

        // ----------------------------------------------------
        // LÓGICA DE PAGO MÓVIL: PROCESAMIENTO DEL COMPROBANTE (Base64)
        // ----------------------------------------------------
        
        $comprobante_url = null;
        
        // Verificamos si el método es Pago Móvil y si se adjuntó el comprobante
        if ($request->method_payment === 'PAGO_MOVIL' && $request->comprobante) {
            try {
                // El frontend (Angular) envía 'comprobante' en Base64
                $base64_image = $request->comprobante;
                
                // Dividir el Base64 para obtener el contenido puro
                @list($type, $file_data) = explode(';', $base64_image);
                @list(, $file_data) = explode(',', $file_data);
                
                // Determinar la extensión
                $ext = 'png'; 
                if (str_contains($type, 'image/jpeg')) $ext = 'jpg';
                if (str_contains($type, 'image/gif')) $ext = 'gif';
                
                // Generar nombre de archivo único
                $file_name = 'pago_movil_' . $user_id . '_' . time() . '_' . uniqid() . '.' . $ext;
                $path = 'sales/comprobantes/' . $file_name;

                // Guardar el archivo en el disco 'public' (requiere `php artisan storage:link`)
                Storage::disk('public')->put($path, base64_decode($file_data));
                
                // Almacenar la ruta pública para la base de datos
                $comprobante_url = $path;
                
            } catch (\Exception $e) {
                Log::error("Error procesando comprobante de Pago Móvil para el usuario {$user_id}: " . $e->getMessage());
                return response()->json(["message" => 400, "message_text" => "Error al procesar el comprobante. Por favor, intente de nuevo."], 400);
            }
        }

        // ----------------------------------------------------
        // 2. AÑADIR/SOBREESCRIBIR CAMPOS AL REQUEST ANTES DE CREAR LA VENTA
        // ----------------------------------------------------
        
        // Añade el comprobante y establece el estado inicial
        $request->request->add([
            "capture_pgmovil" => $comprobante_url,
            // status_pgmovil: 0 para Pago Móvil (Pendiente), 1 para pagos automáticos
            "status_pgmovil" => ($request->method_payment !== 'PAGO_MOVIL') ? 1 : 0, 
        ]);

        // ----------------------------------------------------
        // VERIFICACIÓN AUTOMÁTICA DE COMPROBANTE (Google Cloud Vision)
        // ----------------------------------------------------
        if ($comprobante_url && $request->method_payment === 'PAGO_MOVIL') {
            try {
                $verificationService = new ImageVerificationService();
                $fullPath = storage_path('app/public/' . $comprobante_url);
                $result = $verificationService->verifyScreenshot(
                    $fullPath, 
                    $request->reference_number, 
                    $request->total_bs
                );

                if ($result['success']) {
                    $request->request->add([
                        'screenshot_verified' => $result['is_valid'],
                        'verification_details' => $result['details']
                    ]);
                    Log::info("Verificación de Pago Móvil: " . ($result['is_valid'] ? 'VÁLIDO' : 'SOSPECHOSO') . " - Ref: " . $request->reference_number);
                } else {
                    // Si falla por error técnico (ej: API no habilitada), dejamos en NULL para que salga como PENDIENTE
                    // Pero guardamos el error en detalles para que el admin sepa qué pasó.
                    $request->request->add([
                        'screenshot_verified' => null,
                        'verification_details' => $result['details'] ?? 'Error desconocido en el servicio de verificación.'
                    ]);
                }
            } catch (\Exception $e) {
                Log::error("Fallo la verificación automática de imagen: " . $e->getMessage());
                $request->request->add([
                    'screenshot_verified' => null,
                    'verification_details' => "Excepción: " . $e->getMessage()
                ]);
            }
        }
        
        // Crea el registro de Venta con todos los datos (total_bs, exchange_rate, etc.)
        $sale = Sale::create($request->all());

        // ----------------------------------------------------
        // 3. PROCESAR CARRITO Y DETALLES DE VENTA
        // ----------------------------------------------------
        
        $carts = Cart::where("user_id", $user_id)->get();

        foreach ($carts as $key => $cart){
            $cart->delete(); // Eliminar el item del carrito
            
            $new_detail = $cart->toArray();
            $new_detail["sale_id"] = $sale->id;
            
            // Crear detalle de venta
            SaleDetail::create($new_detail);
            
            // Asignar curso al estudiante (se hace inmediatamente)
            CoursesStudent::create([
                "course_id" => $new_detail["course_id"],
                "user_id" => $user_id,
            ]);
        }
        
        // 4. ENVÍO DE CORREO
        try {
            Mail::to($sale->user->email)->send(new SaleMail($sale));
        } catch (\Exception $e) {
            Log::error("Fallo el envío de correo para la venta {$sale->id}: " . $e->getMessage());
        }

        // 5. RESPUESTA ESPECÍFICA
            if ($request->method_payment === 'PAGO_MOVIL') {
                return response()->json(["message" => 200, "message_text" => "¡Pago Móvil registrado con éxito! Su compra está en estado de revisión y los cursos se activarán una vez verifiquemos el comprobante."], 200);
            }

        // Respuesta estándar para pagos automáticos
        return response()->json(["message" => 200, "message_text" => "LOS CURSOS SE HAN ADQUIRIDO CORRECTAMENTE"], 200);
    }


    public function listPagosMovilPendientes()
    {
        // 1. Filtrar las ventas donde el método de pago es 'PAGO_MOVIL'
        // Mostramos tanto pendientes (0) como aprobados (1) para que el admin pueda ver el historial
        $pagos_pendientes = Sale::where('method_payment', 'PAGO_MOVIL')
                                ->with(['user', 'sale_details.course']) // Precarga de relaciones
                                ->orderBy('status_pgmovil', 'asc') // Pendientes primero
                                ->orderBy('created_at', 'desc')
                                ->paginate(10); // Paginamos los resultados

        // 2. Devolvemos la colección transformada.
        // La SaleCollection usa SaleResource, que ya expone todos los detalles del Pago Móvil.
        return new SaleCollection($pagos_pendientes);
    }

    /**
     * Aprueba un pago móvil pendiente.
     * Actualiza el status_pgmovil a 1 y envía correo de confirmación al usuario.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function approvePagoMovil($id)
    {
        // 1. Buscar la venta por ID
        $sale = Sale::with(['user', 'sale_details.course'])->find($id);

        if (!$sale) {
            return response()->json([
                "message" => 404,
                "message_text" => "Venta no encontrada."
            ], 404);
        }

        // 2. Verificar que sea un pago móvil pendiente
        if ($sale->method_payment !== 'PAGO_MOVIL') {
            return response()->json([
                "message" => 400,
                "message_text" => "Esta venta no es un pago móvil."
            ], 400);
        }

        if ($sale->status_pgmovil == 1) {
            return response()->json([
                "message" => 400,
                "message_text" => "Este pago ya fue aprobado anteriormente."
            ], 400);
        }

        // 3. Actualizar el estado a aprobado
        $sale->status_pgmovil = 1;
        $sale->save();

        // 4. Enviar correo de confirmación al usuario
        try {
            Mail::to($sale->user->email)->send(new PagoMovilApprovedMail($sale));
        } catch (\Exception $e) {
            Log::error("Error al enviar correo de aprobación para la venta {$sale->id}: " . $e->getMessage());
            // No retornamos error aquí porque el pago ya fue aprobado
        }

        // 5. Retornar respuesta exitosa
        return response()->json([
            "message" => 200,
            "message_text" => "Pago móvil aprobado exitosamente. Se ha enviado un correo de confirmación al usuario.",
            "sale" => $sale
        ], 200);
    }

    /**
     * Rechaza y elimina un pago móvil pendiente.
     * Elimina el registro de venta y sus detalles asociados.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function rejectPagoMovil($id)
    {
        // 1. Buscar la venta por ID
        $sale = Sale::with(['sale_details'])->find($id);

        if (!$sale) {
            return response()->json([
                "message" => 404,
                "message_text" => "Venta no encontrada."
            ], 404);
        }

        // 2. Verificar que sea un pago móvil
        if ($sale->method_payment !== 'PAGO_MOVIL') {
            return response()->json([
                "message" => 400,
                "message_text" => "Esta venta no es un pago móvil."
            ], 400);
        }

        // 3. Verificar que esté pendiente (no se puede rechazar un pago ya aprobado)
        if ($sale->status_pgmovil == 1) {
            return response()->json([
                "message" => 400,
                "message_text" => "No se puede rechazar un pago que ya fue aprobado."
            ], 400);
        }

        // 4. Eliminar los detalles de venta primero (por la relación de clave foránea)
        foreach ($sale->sale_details as $detail) {
            $detail->delete();
        }

        // 5. Eliminar la venta
        $sale->delete();

        // 6. Retornar respuesta exitosa
        return response()->json([
            "message" => 200,
            "message_text" => "Pago móvil rechazado y eliminado exitosamente."
        ], 200);
    }

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

    /**
     * Crear orden de pago con Binance Pay
     */
    public function createBinancePayment(Request $request)
    {
        $user = auth("api")->user();
        if (!$user) {
            return response()->json(["message" => 401, "message_text" => "Usuario no autenticado"], 401);
        }

        // Obtener carrito del usuario
        $carts = Cart::where("user_id", $user->id)->get();
        
        if ($carts->isEmpty()) {
            return response()->json(["message" => 400, "message_text" => "El carrito está vacío"], 400);
        }

        // Calcular total
        $total = $carts->sum('total');

        // Crear venta pendiente
        $sale = Sale::create([
            'user_id' => $user->id,
            'method_payment' => 'BINANCE_PAY',
            'currency_total' => 'USD',
            'currency_payment' => 'USD',
            'total' => $total,
            'n_transaccion' => 'BP_' . time() . '_' . $user->id,
            'binance_status' => 'PENDING'
        ]);

        // Crear detalles de venta
        foreach ($carts as $cart) {
            $new_detail = $cart->toArray();
            $new_detail["sale_id"] = $sale->id;
            SaleDetail::create($new_detail);
        }

        // Crear orden en Binance Pay
        $binanceService = new BinancePayService();
        $orderData = [
            'merchant_trade_no' => $sale->n_transaccion,
            'amount' => $total,
            'currency' => 'USD',
            'reference_id' => 'SALE_' . $sale->id,
            'goods_name' => 'Cursos Biyantech',
            'goods_detail' => $carts->count() . ' curso(s)',
            'return_url' => env('APP_URL') . '/payment-success',
            'cancel_url' => env('APP_URL') . '/payment-cancel'
        ];

        $binanceResponse = $binanceService->createOrder($orderData);

        if ($binanceResponse['status'] === 'SUCCESS') {
            // Actualizar venta con datos de Binance
            $sale->update([
                'binance_prepay_id' => $binanceResponse['data']['prepayId'],
                'binance_qr_content' => $binanceResponse['data']['qrContent'],
                'binance_deep_link' => $binanceResponse['data']['deeplink'],
                'binance_universal_url' => $binanceResponse['data']['universalUrl']
            ]);

            // Limpiar carrito
            foreach ($carts as $cart) {
                $cart->delete();
            }

            return response()->json([
                'message' => 200,
                'message_text' => 'Orden de Binance Pay creada exitosamente',
                'sale_id' => $sale->id,
                'binance_data' => $binanceResponse['data']
            ], 200);
        }

        // Si falla, eliminar la venta
        $sale->delete();
        return response()->json([
            'message' => 500,
            'message_text' => 'Error al crear orden de Binance Pay',
            'error' => $binanceResponse
        ], 500);
    }

    /**
     * Webhook de Binance Pay
     */
    public function binanceWebhook(Request $request)
    {
        $binanceService = new BinancePayService();
        
        // Verificar firma del webhook
        $signature = $request->header('BinancePay-Signature');
        $timestamp = $request->header('BinancePay-Timestamp');
        $nonce = $request->header('BinancePay-Nonce');
        $payload = $request->all();

        if (!$binanceService->verifyWebhook($payload, $signature, $timestamp, $nonce)) {
            Log::warning('Binance Pay Webhook: Firma inválida');
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Procesar webhook
        $bizStatus = $payload['bizStatus'] ?? null;
        $prepayId = $payload['data']['prepayId'] ?? null;

        if (!$prepayId) {
            return response()->json(['message' => 'Missing prepayId'], 400);
        }

        $sale = Sale::where('binance_prepay_id', $prepayId)->first();

        if (!$sale) {
            Log::warning('Binance Pay Webhook: Venta no encontrada', ['prepayId' => $prepayId]);
            return response()->json(['message' => 'Sale not found'], 404);
        }

        // Actualizar estado según el webhook
        if ($bizStatus === 'PAY_SUCCESS') {
            $sale->update([
                'binance_status' => 'PAID',
                'binance_transaction_id' => $payload['data']['transactionId'] ?? null,
                'binance_paid_at' => now()
            ]);

            // Dar acceso a los cursos
            foreach ($sale->sale_details as $detail) {
                CoursesStudent::firstOrCreate([
                    'course_id' => $detail->course_id,
                    'user_id' => $sale->user_id
                ]);
            }

            // Enviar email de confirmación
            try {
                Mail::to($sale->user->email)->send(new SaleMail($sale));
            } catch (\Exception $e) {
                Log::error('Error enviando email de confirmación Binance Pay', ['error' => $e->getMessage()]);
            }

            Log::info('Binance Pay: Pago exitoso', ['sale_id' => $sale->id]);
        } elseif ($bizStatus === 'PAY_CLOSED') {
            $sale->update(['binance_status' => 'EXPIRED']);
        }

        return response()->json(['returnCode' => 'SUCCESS', 'returnMessage' => null]);
    }

    /**
     * Verificar estado de pago de Binance
     */
    public function checkBinanceStatus($saleId)
    {
        $user = auth("api")->user();
        $sale = Sale::where('id', $saleId)->where('user_id', $user->id)->first();

        if (!$sale) {
            return response()->json(['message' => 404, 'message_text' => 'Venta no encontrada'], 404);
        }

        if ($sale->method_payment !== 'BINANCE_PAY') {
            return response()->json(['message' => 400, 'message_text' => 'Esta venta no es de Binance Pay'], 400);
        }

        // Consultar estado en Binance
        $binanceService = new BinancePayService();
        $response = $binanceService->queryOrder($sale->binance_prepay_id);

        if ($response['status'] === 'SUCCESS' && isset($response['data']['status'])) {
            $binanceStatus = $response['data']['status'];
            
            // Actualizar estado local si cambió
            if ($binanceStatus === 'PAID' && $sale->binance_status !== 'PAID') {
                $sale->update([
                    'binance_status' => 'PAID',
                    'binance_transaction_id' => $response['data']['transactionId'] ?? null,
                    'binance_paid_at' => now()
                ]);

                // Dar acceso a cursos
                foreach ($sale->sale_details as $detail) {
                    CoursesStudent::firstOrCreate([
                        'course_id' => $detail->course_id,
                        'user_id' => $sale->user_id
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 200,
            'sale' => $sale,
            'binance_status' => $sale->binance_status
        ]);
    }
}
