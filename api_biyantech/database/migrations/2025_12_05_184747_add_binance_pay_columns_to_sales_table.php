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
            $table->string('binance_order_id')->nullable()->after('method_payment');
            $table->string('binance_prepay_id')->nullable();
            $table->text('binance_qr_content')->nullable();
            $table->text('binance_deep_link')->nullable();
            $table->text('binance_universal_url')->nullable();
            $table->string('binance_transaction_id')->nullable();
            $table->timestamp('binance_paid_at')->nullable();
            $table->string('binance_status')->default('PENDING'); // PENDING, PAID, EXPIRED, ERROR
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
            $table->dropColumn([
                'binance_order_id',
                'binance_prepay_id',
                'binance_qr_content',
                'binance_deep_link',
                'binance_universal_url',
                'binance_transaction_id',
                'binance_paid_at',
                'binance_status'
            ]);
        });
    }
};
