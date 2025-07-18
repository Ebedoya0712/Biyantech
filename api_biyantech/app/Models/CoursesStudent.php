<?php

namespace App\Models;

use App\Models\Course\Course;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoursesStudent extends Model
{
    use HasFactory;
    protected $fillable = [
        "course_id",
        "user_id",
        "clases_checkeds"
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("America/Caracas");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set("America/Caracas");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function course(){
        return $this->belongsTo(Course::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
