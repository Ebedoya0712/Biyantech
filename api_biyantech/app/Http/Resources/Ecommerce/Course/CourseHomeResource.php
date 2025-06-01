<?php

namespace App\Http\Resources\Ecommerce\Course;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseHomeResource extends JsonResource
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
            "title" => $this->resource->title,
            "subtitle" => $this->resource->subtitle,
            "imagen" => env("APP_URL") . "storage/" . $this->resource->imagen,
            "precio_usd" => $this->resource->precio_usd,
            "precio_bs" => $this->resource->precio_bs,
            "count_class" => $this->resource->count_class,
            "time_course" => $this->resource->time_course,
            "instructor" => $this->resource->instructor ? [
                "id" => $this->resource->instructor->id,
                "full_name" => $this->resource->instructor->name . ' ' . $this->resource->instructor->surname,
                "avatar" => env("APP_URL") . "storage/" . $this->resource->instructor->avatar,
                "profesion" =>$this->resource->instructor->profesion,
            ] : NULL
        ];
    }
}
