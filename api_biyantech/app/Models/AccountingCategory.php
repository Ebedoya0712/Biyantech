<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AccountingCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'description', 'is_active'];

    public function transactions()
    {
        return $this->hasMany(AccountingTransaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
