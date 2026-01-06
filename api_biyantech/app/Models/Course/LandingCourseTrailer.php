<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingCourseTrailer extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "subtitle",
        "description",
        "vimeo_id",
        "imagen",
        "state",
    ];

    public function getImagenAttribute($value)
    {
        if($value){
            return url("storage/".$value);
        }
        return NULL;
    }
}
