<?php

namespace App\Models\Course;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "title",
        "slug",
        "subtitle",
        "imagen",
        "precio_usd",
        "precio_bs", //aqui se define precio en bolivares
        "user_id",
        "categorie_id",
        "sub_categorie_id",
        "level",
        "idioma",
        "vimeo_id",
        "time",
        "description",
        "requirements",
        "who_is_it_for",
        "state"
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("America/Caracas");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdateAtAttribute($value)
    {
        date_default_timezone_set("America/Caracas");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function instructor()
    {
            return $this->belongsTo(User::class, 'user_id');
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

    function scopeFilterAdvance($query, $search, $state)
    {
        if($search){
            $query->where("title","like","%".$search."%");
        }
        if($state){
            $query->where("state",$state);
        }
        return $query;
    }
}
