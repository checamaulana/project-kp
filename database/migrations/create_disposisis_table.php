<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disposisis', function (Blueprint $table) {
            $table->id();

            $table->foreignId('surat_id')
                ->constrained('surats')
                ->cascadeOnDelete();

            $table->foreignId('dari_unit_id')
                ->nullable()
                ->constrained('units')
                ->nullOnDelete();

            $table->foreignId('ke_unit_id')
                ->constrained('units')
                ->cascadeOnDelete();

            $table->foreignId('dari_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('ke_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('instruksi');

            $table->date('tanggal_disposisi');

            $table->date('batas_waktu')->nullable();

            $table->enum('status', [
                'menunggu',
                'diproses',
                'selesai',
                'ditolak'
            ])->default('menunggu');

            $table->text('catatan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disposisis');
    }
};