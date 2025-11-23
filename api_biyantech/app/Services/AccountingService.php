<?php

namespace App\Services;

use App\Models\AccountingTransaction;
use App\Models\AccountingCategory;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class AccountingService
{
    public function getFinancialSummary($startDate, $endDate)
    {
        $transactions = AccountingTransaction::approved()
            ->byDateRange($startDate, $endDate)
            ->get();

        $totalIncome = $transactions->where('type', 'INCOME')->sum('amount');
        $totalCosts = $transactions->where('type', 'COST')->sum('amount');
        $netIncome = $totalIncome - $totalCosts;

        // Ingresos por categoría
        $incomeByCategory = AccountingTransaction::approved()
            ->income()
            ->byDateRange($startDate, $endDate)
            ->with('category')
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->get();

        // Costos por categoría
        $costsByCategory = AccountingTransaction::approved()
            ->cost()
            ->byDateRange($startDate, $endDate)
            ->with('category')
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->get();

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'totals' => [
                'total_income' => $totalIncome,
                'total_costs' => $totalCosts,
                'net_income' => $netIncome,
                'margin' => $totalIncome > 0 ? ($netIncome / $totalIncome) * 100 : 0
            ],
            'income_by_category' => $incomeByCategory,
            'costs_by_category' => $costsByCategory,
            'transaction_count' => $transactions->count()
        ];
    }

    public function generateIncomeStatement($startDate, $endDate)
    {
        $incomeCategories = AccountingCategory::byType('INCOME')->active()->get();
        $costCategories = AccountingCategory::byType('COST')->active()->get();

        $incomeData = [];
        $totalIncome = 0;

        foreach ($incomeCategories as $category) {
            $amount = AccountingTransaction::approved()
                ->income()
                ->where('category_id', $category->id)
                ->byDateRange($startDate, $endDate)
                ->sum('amount');

            $incomeData[] = [
                'category' => $category->name,
                'amount' => $amount
            ];
            $totalIncome += $amount;
        }

        $costData = [];
        $totalCosts = 0;

        foreach ($costCategories as $category) {
            $amount = AccountingTransaction::approved()
                ->cost()
                ->where('category_id', $category->id)
                ->byDateRange($startDate, $endDate)
                ->sum('amount');

            $costData[] = [
                'category' => $category->name,
                'amount' => $amount
            ];
            $totalCosts += $amount;
        }

        $netIncome = $totalIncome - $totalCosts;

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'income' => [
                'items' => $incomeData,
                'total' => $totalIncome
            ],
            'costs' => [
                'items' => $costData,
                'total' => $totalCosts
            ],
            'net_income' => $netIncome,
            'margin' => $totalIncome > 0 ? ($netIncome / $totalIncome) * 100 : 0
        ];
    }

    public function generateBalanceSheet($date)
    {
        // Activos
        $assets = AccountingCategory::byType('ASSET')->active()->get();
        $totalAssets = 0;
        $assetData = [];

        foreach ($assets as $asset) {
            $amount = AccountingTransaction::approved()
                ->where('category_id', $asset->id)
                ->where('transaction_date', '<=', $date)
                ->sum('amount');

            $assetData[] = [
                'category' => $asset->name,
                'amount' => $amount
            ];
            $totalAssets += $amount;
        }

        // Pasivos
        $liabilities = AccountingCategory::byType('LIABILITY')->active()->get();
        $totalLiabilities = 0;
        $liabilityData = [];

        foreach ($liabilities as $liability) {
            $amount = AccountingTransaction::approved()
                ->where('category_id', $liability->id)
                ->where('transaction_date', '<=', $date)
                ->sum('amount');

            $liabilityData[] = [
                'category' => $liability->name,
                'amount' => $amount
            ];
            $totalLiabilities += $amount;
        }

        // Patrimonio
        $equity = $totalAssets - $totalLiabilities;

        return [
            'date' => $date,
            'assets' => [
                'items' => $assetData,
                'total' => $totalAssets
            ],
            'liabilities' => [
                'items' => $liabilityData,
                'total' => $totalLiabilities
            ],
            'equity' => $equity,
            'balance' => $totalAssets === ($totalLiabilities + $equity)
        ];
    }

    public function getDepartmentPerformance($startDate, $endDate)
    {
        $departments = Department::active()->get();
        $performance = [];

        foreach ($departments as $department) {
            $income = AccountingTransaction::approved()
                ->income()
                ->where('department_id', $department->id)
                ->byDateRange($startDate, $endDate)
                ->sum('amount');

            $costs = AccountingTransaction::approved()
                ->cost()
                ->where('department_id', $department->id)
                ->byDateRange($startDate, $endDate)
                ->sum('amount');

            $performance[] = [
                'department' => $department->name,
                'budget' => $department->budget,
                'income' => $income,
                'costs' => $costs,
                'net' => $income - $costs,
                'budget_utilization' => $department->budget > 0 ? ($costs / $department->budget) * 100 : 0,
                'remaining_budget' => $department->budget - $costs
            ];
        }

        return $performance;
    }

    public function analyzeCosts($startDate, $endDate)
    {
        $costCategories = AccountingCategory::byType('COST')->active()->get();
        $analysis = [];
        $totalCosts = 0;

        foreach ($costCategories as $category) {
            $amount = AccountingTransaction::approved()
                ->cost()
                ->where('category_id', $category->id)
                ->byDateRange($startDate, $endDate)
                ->sum('amount');

            $analysis[] = [
                'category' => $category->name,
                'amount' => $amount,
                'percentage' => 0 // Se calculará después
            ];
            $totalCosts += $amount;
        }

        // Calcular porcentajes
        foreach ($analysis as &$item) {
            $item['percentage'] = $totalCosts > 0 ? ($item['amount'] / $totalCosts) * 100 : 0;
        }

        // Costos por mes (últimos 6 meses)
        $monthlyCosts = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = now()->subMonths($i)->startOfMonth();
            $monthEnd = now()->subMonths($i)->endOfMonth();

            $monthlyTotal = AccountingTransaction::approved()
                ->cost()
                ->byDateRange($monthStart, $monthEnd)
                ->sum('amount');

            $monthlyCosts[] = [
                'month' => $monthStart->format('Y-m'),
                'name' => $monthStart->format('M Y'),
                'amount' => $monthlyTotal
            ];
        }

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'total_costs' => $totalCosts,
            'cost_breakdown' => $analysis,
            'monthly_trends' => $monthlyCosts
        ];
    }
}
