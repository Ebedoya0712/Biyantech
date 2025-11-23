<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AccountingTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'concept',
        'description',
        'category_id',
        'amount',
        'transaction_date',
        'type',
        'status',
        'course_id',
        'department_id',
        'metadata'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date',
        'metadata' => 'array'
    ];

    public function category()
    {
        return $this->belongsTo(AccountingCategory::class);
    }

    public function course()
    {
        return $this->belongsTo(CoursesStudent::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'INCOME');
    }

    public function scopeCost($query)
    {
        return $query->where('type', 'COST');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('transaction_date', [$startDate, $endDate]);
    }

    public function scopeByCategoryType($query, $type)
    {
        return $query->whereHas('category', function ($q) use ($type) {
            $q->where('type', $type);
        });
    }
}
