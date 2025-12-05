<?php

namespace App\Models\Sale;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "user_id",
        "method_payment",
        "currency_total",
        "currency_payment",
        "total",
        "price_dolar",
        "n_transaccion",
        "total_bs",            // Monto total en Bolívares
        "exchange_rate",       // Tasa de cambio usada
        "exchange_source",     // Fuente de la tasa (ej: BCV Oficial)
        "capture_pgmovil",     // Ruta de la imagen del comprobante de Pago Móvil
        "status_pgmovil", 
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sale_details()
    {
        return $this->hasMany(SaleDetail::class);
    }
}
