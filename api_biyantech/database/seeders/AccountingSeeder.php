<?php

namespace Database\Seeders;

use App\Models\AccountingCategory;
use App\Models\Department;
use Illuminate\Database\Seeder;

class AccountingSeeder extends Seeder
{
    public function run()
    {
        // Categorías de Ingresos
        $incomeCategories = [
            ['name' => 'Ventas de Cursos', 'type' => 'INCOME'],
            ['name' => 'Suscripciones', 'type' => 'INCOME'],
            ['name' => 'Servicios Personalizados', 'type' => 'INCOME'],
            ['name' => 'Publicidad', 'type' => 'INCOME'],
            ['name' => 'Patrocinios', 'type' => 'INCOME'],
        ];

        // Categorías de Costos
        $costCategories = [
            ['name' => 'Pagos a Docentes', 'type' => 'COST'],
            ['name' => 'Producción de Videos', 'type' => 'COST'],
            ['name' => 'Equipos de Producción', 'type' => 'COST'],
            ['name' => 'Publicidad y Marketing', 'type' => 'COST'],
            ['name' => 'Salarios Empleados', 'type' => 'COST'],
            ['name' => 'Plataforma y Hosting', 'type' => 'COST'],
            ['name' => 'Materiales Educativos', 'type' => 'COST'],
        ];

        // Categorías de Activos
        $assetCategories = [
            ['name' => 'Efectivo', 'type' => 'ASSET'],
            ['name' => 'Cuentas por Cobrar', 'type' => 'ASSET'],
            ['name' => 'Equipos de Oficina', 'type' => 'ASSET'],
            ['name' => 'Software', 'type' => 'ASSET'],
        ];

        // Categorías de Pasivos
        $liabilityCategories = [
            ['name' => 'Cuentas por Pagar', 'type' => 'LIABILITY'],
            ['name' => 'Préstamos', 'type' => 'LIABILITY'],
        ];

        $allCategories = array_merge(
            $incomeCategories,
            $costCategories,
            $assetCategories,
            $liabilityCategories
        );

        foreach ($allCategories as $category) {
            AccountingCategory::create($category);
        }

        // Departamentos
        $departments = [
            ['name' => 'Ventas y Marketing', 'code' => 'VM', 'budget' => 50000],
            ['name' => 'Producción de Contenido', 'code' => 'PC', 'budget' => 75000],
            ['name' => 'Desarrollo de Plataforma', 'code' => 'DP', 'budget' => 60000],
            ['name' => 'Soporte al Cliente', 'code' => 'SC', 'budget' => 30000],
            ['name' => 'Administración', 'code' => 'AD', 'budget' => 25000],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
