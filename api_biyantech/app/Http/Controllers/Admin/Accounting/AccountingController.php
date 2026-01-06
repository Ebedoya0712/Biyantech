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
        // 1. Total Revenue (Ingresos Totales) - Solo ventas aprobadas
        $total_revenue = Sale::where(function($q) {
            $q->where('method_payment', 'PAGO_MOVIL')->where('status_pgmovil', 1);
        })->orWhere(function($q) {
            $q->where('method_payment', 'BINANCE_PAY')->where('binance_status', 'PAID');
        })->orWhere(function($q) {
            $q->whereNotIn('method_payment', ['PAGO_MOVIL', 'BINANCE_PAY']);
        })->sum('total');

        // 2. Total Costs (Gastos Registrados Manualmente)
        $total_costs = Expense::sum('amount');

        // 3. Cálculo de Comisiones de Profesores (5% Automático)
        $details = SaleDetail::with('course')
            ->whereHas('sale', function($q) {
                $q->where(function($sub) {
                    $sub->where('method_payment', 'PAGO_MOVIL')->where('status_pgmovil', 1);
                })->orWhere(function($sub) {
                    $sub->where('method_payment', 'BINANCE_PAY')->where('binance_status', 'PAID');
                })->orWhere(function($sub) {
                    $sub->whereNotIn('method_payment', ['PAGO_MOVIL', 'BINANCE_PAY']);
                });
            })->get();

        $total_instructor_commission = 0;
        foreach ($details as $detail) {
            $total_instructor_commission += $detail->total * 0.05;
        }

        // 4. Ganancia Neta Real (Ingresos - Gastos - Comisiones Profesores)
        $net_profit = round($total_revenue - $total_costs - $total_instructor_commission, 2);

        // 5. Distribución de Utilidades
        // Empresa: 20%
        $company_reserve = round($net_profit * 0.20, 2);

        // Monto a Repartir entre Socios (el 80% restante)
        $distributable = $net_profit - $company_reserve;

        // Socio: 50% de lo repartible
        $profit_partner = round($distributable * 0.50, 2);
        
        // Dueño: 50% de lo repartible (el otro 50% que lo hace 100% de lo repartible)
        $profit_me = round($distributable * 0.50, 2);

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
            'total_revenue' => round($total_revenue, 2),
            'total_costs' => round($total_costs, 2),
            'total_instructor_commission' => round($total_instructor_commission, 2),
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

    public function instructor_summary(Request $request) {
        $user = auth('api')->user();
        
        // Obtenemos los detalles de venta de los cursos que pertenecen a este instructor
        $details = SaleDetail::with('course')
            ->whereHas('course', function($q) use($user) {
                $q->where('user_id', $user->id);
            })
            ->whereHas('sale', function($q) {
                $q->where(function($sub) {
                    $sub->where('method_payment', 'PAGO_MOVIL')->where('status_pgmovil', 1);
                })->orWhere(function($sub) {
                    $sub->where('method_payment', 'BINANCE_PAY')->where('binance_status', 'PAID');
                })->orWhere(function($sub) {
                    $sub->whereNotIn('method_payment', ['PAGO_MOVIL', 'BINANCE_PAY']);
                });
            })->get();

        $total_revenue = $details->sum('total');
        $total_commission = $total_revenue * 0.05;

        // Agrupado por curso para mayor detalle
        $earnings_by_course = SaleDetail::join('courses', 'sale_details.course_id', '=', 'courses.id')
            ->where('courses.user_id', $user->id)
            ->whereHas('sale', function($q) {
                $q->where(function($sub) {
                    $sub->where('method_payment', 'PAGO_MOVIL')->where('status_pgmovil', 1);
                })->orWhere(function($sub) {
                    $sub->where('method_payment', 'BINANCE_PAY')->where('binance_status', 'PAID');
                })->orWhere(function($sub) {
                    $sub->whereNotIn('method_payment', ['PAGO_MOVIL', 'BINANCE_PAY']);
                });
            })
            ->select('courses.title', DB::raw('sum(sale_details.total) as total_revenue'))
            ->groupBy('courses.title')
            ->get()
            ->map(function($item) {
                $item->commission = $item->total_revenue * 0.05;
                return $item;
            });

        return response()->json([
            'total_revenue' => $total_revenue,
            'total_commission' => $total_commission,
            'earnings_by_course' => $earnings_by_course
        ]);
    }
}
