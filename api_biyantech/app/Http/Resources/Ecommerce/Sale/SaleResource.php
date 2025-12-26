<?php

namespace App\Http\Resources\Ecommerce\Sale;

use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // Usamos $this->resource para referirnos a la instancia del modelo Sale
        return [
            "id" => $this->resource->id,
            "method_payment" => $this->resource->method_payment,
            "currency_payment" => $this->resource->currency_payment,
            "total" => $this->resource->total, // CORREGIDO: Usar $this->resource->total en lugar de $this->resource->id
            
            // --- NUEVOS CAMPOS AÑADIDOS PARA PAGO MÓVIL Y TASAS ---
            "total_bs" => $this->resource->total_bs,
            "exchange_rate" => $this->resource->exchange_rate,
            "exchange_source" => $this->resource->exchange_source,
            "reference_number" => $this->resource->reference_number, // Número de referencia del Pago Móvil
            "screenshot_verified" => $this->resource->screenshot_verified, // IA: Válido/Sospechoso
            "verification_details" => $this->resource->verification_details, // Detalles de la validación
            "capture_pgmovil" => $this->resource->capture_pgmovil ? env("APP_URL")."/storage/".$this->resource->capture_pgmovil : null, // 🚨 Generamos la URL completa corregida con slash
            "status_pgmovil" => $this->resource->status_pgmovil, // Estado de verificación (0/1)
            "n_transaccion" => $this->resource->n_transaccion,
            
            // --- INFORMACIÓN DEL USUARIO/CLIENTE ---
            "user" => $this->resource->user ? [
                "id" => $this->resource->user->id,
                "name" => $this->resource->user->name,
                "email" => $this->resource->user->email,
            ] : null,
            
            "sale_details" => $this->resource->sale_details->filter(function($sale_detail){
                return $sale_detail->course; // Filter out if course is null
            })->map(function($sale_detail){
                return [
                    "id" => $sale_detail->id,
                    "course" => [
                        "id" => $sale_detail->course->id,
                        "title" => $sale_detail->course->title,
                        "imagen" => env("APP_URL")."storage/".$sale_detail->course->imagen,
                    ],
                    "type_discount" => $sale_detail->type_discount,
                    "discount" => $sale_detail->discount,
                    "type_campaing" => $sale_detail->type_campaing,
                    "code_cupon" => $sale_detail->code_cupon,
                    "code_discount" => $sale_detail->code_discount,
                    "precio_unitario" => $sale_detail->precio_unitario,
                    "total" => $sale_detail->total,
                    "created_at" => $sale_detail->created_at->format("Y-m-d h:i:s"),
                ];
            }),
            "created_at" => $this->resource->created_at->format("Y-m-d h:i:s"),
        ];
    }
}