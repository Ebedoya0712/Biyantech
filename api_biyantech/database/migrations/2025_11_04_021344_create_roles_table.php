<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_roles_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('permissions')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        // Insertar roles básicos
        DB::table('roles')->insert([
            [
                'name' => 'Administrador',
                'description' => 'Acceso completo al sistema',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Editor',
                'description' => 'Puede editar contenido',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Usuario',
                'description' => 'Usuario regular',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Instructor',
                'description' => 'Puede crear cursos',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
};