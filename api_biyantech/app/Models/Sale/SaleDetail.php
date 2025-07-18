<?php

namespace App\Models\Sale;

use App\Models\Course\Course;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleDetail extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "sale_id",
        "course_id",
        "type_discount",
        "discount",
        "type_campaing",
        "code_cupon",
        "code_discount",
        "precio_unitario",
        "total",
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

    public function sale(){
        return $this->belongsTo(Sale::class);
    }
}
