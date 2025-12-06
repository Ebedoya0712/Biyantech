<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course\Course;
use App\Models\Course\Categorie;
use App\Models\Sale\Sale;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Contadores Básicos
        $students_count = User::where('type_user', 2)->count(); // 2 = Estudiante típicamente
        $instructors_count = User::where('is_instructor', 1)->count();
        // Incluimos estado 1 (Test/Creado) y 2 (Público)
        $courses_count = Course::whereIn('state', [1, 2])->count(); 
        $categories_count = Categorie::count();

        // 2. Cálculo de Ganancias (Revenue)
        // Se suman solo las ventas aprobadas/pagadas
        $total_revenue = Sale::where(function($q) {
            // Pago Móvil Aprobado
            $q->where('method_payment', 'PAGO_MOVIL')
              ->where('status_pgmovil', 1);
        })->orWhere(function($q) {
            // Binance Pay Pagado
            $q->where('method_payment', 'BINANCE_PAY')
              ->where('binance_status', 'PAID');
        })->orWhere(function($q) {
            // Otros métodos (asumimos aprobación inmediata si no son los anteriores)
            // Ajustar según lógica de negocio real si hay Paypal/Stripe
            $q->whereNotIn('method_payment', ['PAGO_MOVIL', 'BINANCE_PAY']);
        })->sum('total');

        // 3. Ganancias por Mes (Últimos 6 meses) para Gráfica
        // Formato esperado: { month: 'Ene', income: 100 }, ...
        $revenue_by_month = Sale::select(
            DB::raw('sum(total) as total'), 
            DB::raw("DATE_FORMAT(created_at,'%M') as month_name"),
            DB::raw("MONTH(created_at) as month_num")
        )
        ->whereYear('created_at', date('Y'))
        ->groupBy('month_name', 'month_num')
        ->orderBy('month_num')
        ->get();

        // 4. Cursos por Categoría
        $courses_by_category = Categorie::withCount('courses')
            ->having('courses_count', '>', 0)
            ->get()
            ->map(function($cat) {
                return [
                    'name' => $cat->name,
                    'value' => $cat->courses_count
                ];
            });

        // 5. Ventas Recientes (Últimas 5)
        $recent_sales = Sale::with(['user', 'sale_details.course'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 6. Últimos Estudiantes (5)
        $latest_students = User::where('type_user', 2)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 7. Instructores (Todos o top 5 - por ahora últimos agregados)
        $latest_instructors = User::where('is_instructor', 1)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // 8. Cursos Destacados (Top 5 por cantidad de estudiantes)
        // Usamos withCount para ordenar por la relación courses_students
        $best_courses = Course::withCount('courses_students')
            ->orderBy('courses_students_count', 'desc')
            ->take(5)
            ->get();

        // 9. Lista de Categorías con conteo
        $categories_list = Categorie::withCount('courses')
            ->orderBy('courses_count', 'desc')
            ->get();

        // 10. Todos los cursos Activos (1 y 2)
        $active_courses = Course::whereIn("state", [1, 2])->with('categorie')->get();

        return response()->json([
            'stats' => [
                 'students' => $students_count,
                 'instructors' => $instructors_count,
                 'courses' => $courses_count,
                 'categories' => $categories_count,
                 'total_revenue' => $total_revenue
            ],
            'charts' => [
                'revenue_by_month' => $revenue_by_month,
                'courses_by_category' => $courses_by_category
            ],
            'recent_sales' => $recent_sales,
            'latest_students' => $latest_students,
            'latest_instructors' => $latest_instructors,
            'best_courses' => $best_courses,
            'categories_list' => $categories_list,
            'active_courses' => $active_courses
        ]);
    }
}
