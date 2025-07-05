<?php

namespace App\Models\Course;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseClase extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "course_section_id",
        "name",
        "description",
        "vimeo_id",
        "time",
        "state",
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function course_section()
    {
        return $this->belongsTo(CourseSection::class);
    }

    public function files()
    {
        return $this->hasMany(CourseClaseFile::class,"course_clase_id");
    }

    function AddTimes($horas)
{
    $total = 0;

    foreach ($horas as $h) {
        // Divide el string por ":" y completa con ceros si faltan partes
        $parts = explode(":", $h);
        $parts = array_reverse($parts); // Asegura que segundos estén al final
        $parts = array_pad($parts, 3, 0); // Asegura que siempre haya [segundos, minutos, horas]

        $seconds = (int) $parts[0];
        $minutes = (int) $parts[1];
        $hours   = (int) $parts[2];

        $total += $seconds + $minutes * 60 + $hours * 3600;
    }

    $hours = floor($total / 3600);
    $minutes = floor(($total % 3600) / 60);
    $seconds = $total % 60;

    return $hours . " hrs " . $minutes . " mins";   
    }
}
