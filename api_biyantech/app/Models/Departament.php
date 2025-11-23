<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'budget', 'is_active'];

    public function transactions()
    {
        return $this->hasMany(AccountingTransaction::class);
    }

    public function getTotalSpentAttribute()
    {
        return $this->transactions()
            ->cost()
            ->approved()
            ->sum('amount');
    }

    public function getRemainingBudgetAttribute()
    {
        return $this->budget - $this->total_spent;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
