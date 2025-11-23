<?php

namespace App\Http\Controllers;

use App\Models\AccountingTransaction;
use App\Models\AccountingCategory;
use App\Models\Department;
use App\Models\FinancialReport;
use App\Services\AccountingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountingController extends Controller
{
    protected $accountingService;

    public function __construct(AccountingService $accountingService)
    {
        $this->accountingService = $accountingService;
    }

    // TRANSACCIONES
    public function index(Request $request)
    {
        $query = AccountingTransaction::with(['category', 'course', 'department']);

        // Filtros
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('start_date') && $request->start_date) {
            $query->where('transaction_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->where('transaction_date', '<=', $request->end_date);
        }

        $transactions = $query->orderBy('transaction_date', 'desc')->paginate(20);

        return response()->json([
            'transactions' => $transactions,
            'filters' => $request->all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'concept' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:accounting_categories,id',
            'amount' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'type' => 'required|in:INCOME,COST',
            'course_id' => 'nullable|exists:courses,id',
            'department_id' => 'nullable|exists:departments,id',
            'metadata' => 'nullable|array'
        ]);

        $transaction = AccountingTransaction::create($validated);

        return response()->json([
            'message' => 'Transacción creada exitosamente',
            'transaction' => $transaction->load(['category', 'course', 'department'])
        ], 201);
    }

    public function update(Request $request, AccountingTransaction $transaction)
    {
        $validated = $request->validate([
            'concept' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:accounting_categories,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'transaction_date' => 'sometimes|required|date',
            'type' => 'sometimes|required|in:INCOME,COST',
            'status' => 'sometimes|required|in:PENDING,APPROVED,REJECTED',
            'course_id' => 'nullable|exists:courses,id',
            'department_id' => 'nullable|exists:departments,id',
            'metadata' => 'nullable|array'
        ]);

        $transaction->update($validated);

        return response()->json([
            'message' => 'Transacción actualizada exitosamente',
            'transaction' => $transaction->load(['category', 'course', 'department'])
        ]);
    }

    public function destroy(AccountingTransaction $transaction)
    {
        $transaction->delete();

        return response()->json([
            'message' => 'Transacción eliminada exitosamente'
        ]);
    }

    public function updateStatus(Request $request, AccountingTransaction $transaction)
    {
        $request->validate([
            'status' => 'required|in:PENDING,APPROVED,REJECTED'
        ]);

        $transaction->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Estado actualizado exitosamente',
            'transaction' => $transaction
        ]);
    }

    // REPORTES FINANCIEROS
    public function financialSummary(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $summary = $this->accountingService->getFinancialSummary($startDate, $endDate);

        return response()->json($summary);
    }

    public function incomeStatement(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $statement = $this->accountingService->generateIncomeStatement($startDate, $endDate);

        return response()->json($statement);
    }

    public function balanceSheet(Request $request)
    {
        $date = $request->get('date', now());

        $balanceSheet = $this->accountingService->generateBalanceSheet($date);

        return response()->json($balanceSheet);
    }

    public function departmentPerformance(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $performance = $this->accountingService->getDepartmentPerformance($startDate, $endDate);

        return response()->json($performance);
    }

    public function costAnalysis(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $analysis = $this->accountingService->analyzeCosts($startDate, $endDate);

        return response()->json($analysis);
    }

    // CATEGORÍAS
    public function categories(Request $request)
    {
        $categories = AccountingCategory::active()->get();

        return response()->json(['categories' => $categories]);
    }

    // DEPARTAMENTOS
    public function departments(Request $request)
    {
        $departments = Department::active()->withCount(['transactions'])->get();

        return response()->json(['departments' => $departments]);
    }
}
