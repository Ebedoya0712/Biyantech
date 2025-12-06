<?php

namespace App\Models\Course;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Sale\Review;
use App\Models\CoursesStudent;
use App\Models\Discount\DiscountCourse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    public function getImagenAttribute($value)
    {
        if($value){
            return url("storage/".$value);
        }
        return NULL;
    }
    protected $fillable = [
        "title",
        "subtitle",
        "slug",
        "imagen",
        "precio_usd",
        "precio_pen",
        "categorie_id",
        "sub_categorie_id",
        "user_id",
        "level",
        "idioma",
        "vimeo_id",
        "time",
        "description",
        "requirements",
        "who_is_it_for",
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

    public function instructor()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function sub_categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function sections()
    {
        return $this->hasMany(CourseSection::class);
    }

    public function discount_courses()
    {
        return $this->hasMany(DiscountCourse::class);
    }

    public function courses_students()
    {
        return $this->hasMany(CoursesStudent::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getDiscountCAttribute()
    {
        date_default_timezone_set("America/Lima");
        $discount = null;
        foreach ($this->discount_courses as $key => $discount_course) {
           if ($discount_course->discount && $discount_course->discount->type_campaing == 1 &&  $discount_course->discount->state == 1) {
            if(Carbon::now()->between($discount_course->discount->start_date,Carbon::parse($discount_course->discount->end_date)->addDays(1))){
                // EXISTE UNA CAMPAÑA DE DESCUENTO CON EL CURSO
                $discount = $discount_course->discount;
                break;
            }
           }
        }
        return $discount;
    }

    public function getDiscountCTAttribute()
    {
        date_default_timezone_set("America/Lima");
        $discount = null;
        foreach ($this->categorie->discount_categories as $key => $discount_categorie) {
           if ($discount_categorie->discount && $discount_categorie->discount->type_campaing == 1 && $discount_categorie->discount->state == 1) {
            if(Carbon::now()->between($discount_categorie->discount->start_date,Carbon::parse($discount_categorie->discount->end_date)->addDays(1))){
                // EXISTE UNA CAMPAÑA DE DESCUENTO CON EL CURSO
                $discount = $discount_categorie->discount;
                break;
            }
           }
        }
        return $discount;
    }

    public function getFilesCountAttribute()
    {
        $files_count = 0;

        foreach ($this->sections as $keyS => $section) {
            foreach ($section->clases as $keyC => $clase) {
                $files_count += $clase->files->count();
            }
        }

        return $files_count;
    }

    function AddTimes($horas)
{
    $total = 0;
    foreach ($horas as $h) {
        // 1. Ignorar valores nulos o vacíos para evitar errores
        if (!$h) {
            continue;
        }

        $parts = explode(":", $h);
        $count = count($parts);

        // 2. Comprobar el formato del tiempo antes de sumar
        if ($count === 3) {
            // Formato HH:mm:ss
            $total += (int)$parts[2] + ((int)$parts[1] * 60) + ((int)$parts[0] * 3600);
        } elseif ($count === 2) {
            // Formato mm:ss (manejo opcional pero recomendado)
            $total += (int)$parts[1] + ((int)$parts[0] * 60);
        }
        // Si el formato es incorrecto (ej: un solo número), simplemente lo ignora
    }

    $hours = floor($total / 3600);
    $minutes = floor(($total / 60) % 60);
    $seconds = $total % 60; // Aunque no lo usas en el return, es bueno tenerlo

    return $hours . " hrs " . $minutes . " mins";
}

    public function getCountClassAttribute()
    {
        $num = 0;

        foreach ($this->sections as $key => $section) {
            $num += $section->clases->count();
        }

        return $num;
    }

    public function getTimeCourseAttribute()
    {
       $times = [];
       foreach ($this->sections as $keyS => $section) {
        foreach ($section->clases as $keyC => $clase) {
            array_push($times,$clase->time);
        }
       }
       return $this->AddTimes($times);
    }

    public function getCountStudentsAttribute()
    {
        return $this->courses_students->count();
    }

    public function getCountReviewsAttribute()
    {
        return $this->reviews->count();
    }

    public function getAvgReviewsAttribute()
    {
        return $this->reviews->avg("rating");
    }

    function scopeFilterAdvance($query,$search,$state)
    {
        if($search){
            $query->where("title","like","%".$search."%");
        }
        if($state){
            $query->where("state",$state);
        }
        
        return $query;
    }

    function scopeFilterAdvanceEcommerce($query,$search,$selected_categories = [],$instructores_selected = [],
                                        $min_price = 0,$max_price = 0,$idiomas_selected = [],$levels_selected = [],
                                        $courses_a = [],$rating_selected = 0)
    {
        if($search){
            $query->where("title","like","%".$search."%");
        }
        if(sizeof($selected_categories) > 0){
            $query->whereIn("categorie_id",$selected_categories);
        }
        if(sizeof($instructores_selected) > 0){
            $query->whereIn("user_id",$instructores_selected);
        }
        if($min_price > 0 && $max_price > 0){
            $query->whereBetween("precio_usd",[$min_price,$max_price]);
        }
        if(sizeof($idiomas_selected) > 0){
            $query->whereIn("idioma",$idiomas_selected);
        }
        if(sizeof($levels_selected) > 0){
            $query->whereIn("level",$levels_selected);
        }
        if($courses_a || $rating_selected){
            $query->whereIn("id",$courses_a);
        }
        return $query;
    }
}
