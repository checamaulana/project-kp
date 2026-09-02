<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 100)->unique()->after('name');
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->enum('role', ['superadmin', 'admin_tu', 'kepala_unit', 'staf'])->default('staf');
            $table->enum('status', ['pending', 'active', 'rejected'])->default('pending');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['username', 'unit_id', 'role', 'status']);
        });
    }
};
