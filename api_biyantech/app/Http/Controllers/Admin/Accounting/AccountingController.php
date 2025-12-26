<?php

namespace App\Http\Controllers\Admin\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale\Sale;
use App\Models\Sale\SaleDetail;
use App\Models\Course\Categorie;
use Illuminate\Support\Facades\DB;

use App\Models\Accounting\Expense;

class AccountingController extends Controller
{
    // 1. Contabilidad Financiera: Resumen General
    public function financial_summary(Request $request)
    {
        // Total Revenue (Ingresos Totales)
        $total_revenue = Sale::sum('total');

        // Total Costs (Gastos Registrados)
        $total_costs = Expense::sum('amount');

        // Net Profit (Ganancia Neta)
        $net_profit = $total_revenue - $total_costs;

        // Company Reserve (20%)
        $company_reserve = $net_profit * 0.20;

        // Distributable Amount (Monto a Repartir)
        $distributable = $net_profit - $company_reserve;

        // Profit Split (50/50 of Distributable)
        $profit_me = $distributable * 0.50;
        $profit_partner = $distributable * 0.50;

        // Monthly Revenue Trend (Last 12 Months)
        $monthly_revenue = Sale::select(
            DB::raw('sum(total) as sums'), 
            DB::raw("DATE_FORMAT(created_at,'%Y-%m') as months")
        )
        ->groupBy('months')
        ->orderBy('months', 'desc')
        ->take(12)
        ->get();

        return response()->json([
            'total_revenue' => $total_revenue,
            'total_costs' => $total_costs,
            'net_profit' => $net_profit,
            'company_reserve' => $company_reserve,
            'profit_split' => [
                'me' => $profit_me,
                'partner' => $profit_partner
            ],
            'monthly_trend' => $monthly_revenue
        ]);
    }

    // 2. Contabilidad de Ingresos: Detalle de Ventas
    public function revenue_details(Request $request) {
        $sales = Sale::with(['user', 'sale_details.course'])->orderBy('created_at', 'desc')->paginate(20);
        
        return response()->json([
            'sales' => $sales
        ]);
    }

    // 3. Contabilidad de Costos: Gastos y Comisiones
    public function cost_details(Request $request) {
        $expenses = Expense::orderBy('date', 'desc')->orderBy('created_at', 'desc')->paginate(20);
        return response()->json([
            'costs' => $expenses
        ]);
    }

    public function store_expense(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'type' => 'required|integer',
            'date' => 'required|date',
        ]);

        $expense = Expense::create($request->all());

        return response()->json([
            'message' => 200,
            'expense' => $expense
        ]);
    }

    // 4. Contabilidad por Departamentos: Categorías
    public function department_details(Request $request) {
        // Group Revenue by Course Category
        $departments = SaleDetail::join('courses', 'sale_details.course_id', '=', 'courses.id')
            ->join('categories', 'courses.categorie_id', '=', 'categories.id')
            ->select('categories.name as category_name', DB::raw('sum(sale_details.total) as total_revenue'))
            ->groupBy('categories.name')
            ->orderBy('total_revenue', 'desc')
            ->get();

        return response()->json([
            'departments' => $departments
        ]);
    }
}
