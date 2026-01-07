<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$users = User::all();

foreach ($users as $u) {
    echo "ID: {$u->id} | Name: {$u->name} {$u->surname} | Email: {$u->email} | Type: {$u->type_user} | Role: {$u->role_id} | IsInst: {$u->is_instructor}\n";
}
