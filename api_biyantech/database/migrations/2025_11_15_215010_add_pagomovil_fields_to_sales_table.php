<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales', function (Blueprint $table) {
            // Columna para la URL o ruta de la imagen del comprobante de Pago Móvil.
            $table->string('capture_pgmovil')->nullable()->after('n_transaccion');

            // Columna para el estado de verificación del pago móvil.
            // 0: Pendiente de revisión (defecto), 1: Aprobado
            $table->unsignedTinyInteger('status_pgmovil')->default(0)->after('capture_pgmovil');

            // Campos de tasa de cambio utilizados en la transacción
            $table->decimal('exchange_rate', 10, 4)->nullable()->after('status_pgmovil');
            $table->string('exchange_source')->nullable()->after('exchange_rate');
            $table->decimal('total_bs', 10, 2)->nullable()->after('total');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sales', function (Blueprint $table) {
            // Eliminamos las columnas si se revierte la migración
            $table->dropColumn('capture_pgmovil');
            $table->dropColumn('status_pgmovil');
            $table->dropColumn('exchange_rate');
            $table->dropColumn('exchange_source');
            $table->dropColumn('total_bs');
        });
    }
};