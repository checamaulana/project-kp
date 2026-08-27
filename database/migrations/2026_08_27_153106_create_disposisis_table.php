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
            $table->foreignId('surat_masuk_id')->constrained('surat_masuks')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('disposisis')->nullOnDelete();
            $table->foreignId('dari_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('kepada_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('kepada_unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->text('isi');
            $table->enum('aksi', ['di_disposisi', 'di_arsipkan']);
            $table->enum('status', ['pending', 'selesai'])->default('pending');
            $table->timestamp('dibaca_at')->nullable();
            $table->timestamp('selesai_at')->nullable();
            $table->timestamps();

            $table->index(['surat_masuk_id', 'created_at']);
            $table->index(['kepada_user_id', 'status']);
            $table->index('dari_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disposisis');
    }
};
