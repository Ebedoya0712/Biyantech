<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Resources\Json\JsonResource;

class LandingCourseTrailerResource extends JsonResource
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
            "description" => $this->resource->description,
            "vimeo_id" => $this->resource->vimeo_id,
            "imagen" => $this->resource->imagen,
            "state" => $this->resource->state,
            "link_video" => $this->resource->vimeo_id ? url("storage/" . $this->resource->vimeo_id) : null,
        ];
    }
}
