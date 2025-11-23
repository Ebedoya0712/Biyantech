<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinancialReport extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'start_date', 'end_date', 'data', 'is_final'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'data' => 'array'
    ];

    public function scopeFinal($query)
    {
        return $query->where('is_final', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
