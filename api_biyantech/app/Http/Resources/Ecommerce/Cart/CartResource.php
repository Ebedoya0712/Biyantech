<?php

namespace App\Http\Resources\Ecommerce\Cart;

use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            "id" => $this->id,
            "user_id" => $this->user_id,
            "course_id" => $this->course_id,
            "course" => [
                "title" => $this->resource->course->title,
                "imagen" => env("APP_URL")."storage/".$this->resource->course->imagen,
                "subtitle" => $this->resource->course->subtitle,
                "slug" => $this->resource->course->slug,
            ],
            "type_discount" => $this->type_discount,
            "discount" => $this->discount,
            "type_campaing" => $this->type_campaing,
            "code_cupon" => $this->code_cupon,
            "code_discount" => $this->code_discount,
            "precio_unitario" => $this->precio_unitario,
            "total" => $this->total,
        ];
    }
}
