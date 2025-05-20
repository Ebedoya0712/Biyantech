<?php

namespace App\Http\Resources\Course\Coupon;

use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->resource->id,
            "code" => $this->resource->code,
            "type_discount" => $this->resource->type_discount,//1 es % y 2 es monto fijo
            "discount"  => $this->resource->discount,//el monto de descuento
            "type_count"    => $this->resource->type_count,//1 es ilimitado y 2 es limitado
            "num_use"   => $this->resource->num_use,// el numero de usos permitidos
            "type_coupon"   => $this->resource->type_coupon,//1 es por productos y 2 es por categorias
            "courses" => $this->resource->courses->map(function($course_axu){
                return [
                        "id" => $course_axu->course->id,
                        "title" => $course_axu->course->title,
                        "imagen" => env("APP_URL")."storage/".$course_axu->course->imagen,
                        "aux_id" => $course_axu->id,
                ];
            }),
            "categories" => $this->resource->categories->map(function($categorie_aux){
                return [
                        "id" => $categorie_aux->categorie->id,
                        "name" => $categorie_aux->categorie->name,
                        "imagen" => env("APP_URL")."storage/".$categorie_aux->categorie->imagen,
                        "aux_id" => $categorie_aux->id,
                ];
            }),
        ];
    }
}
