<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_masuks', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('no_urut');
            $table->unsignedSmallInteger('tahun');
            $table->date('tanggal_terima');
            $table->date('tanggal_surat');
            $table->string('nomor_surat', 100);
            $table->string('pengirim', 255);
            $table->string('perihal', 255);
            $table->text('keterangan')->nullable();
            $table->foreignId('indeks_id')->nullable()->constrained('indeks')->nullOnDelete();
            $table->string('file_path', 255);
            $table->string('file_name', 255);
            $table->foreignId('unit_penerima_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['aktif', 'on_route', 'selesai'])->default('aktif');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tahun', 'no_urut']);
            $table->index('tanggal_terima');
            $table->index('unit_penerima_id');
            $table->index('status');
            $table->fullText(['pengirim', 'perihal', 'nomor_surat']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_masuks');
    }
};
