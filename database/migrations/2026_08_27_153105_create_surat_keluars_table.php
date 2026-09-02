<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_keluars', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('no_urut');
            $table->unsignedSmallInteger('tahun');
            $table->string('nomor_surat', 100)->unique();
            $table->foreignId('kode_surat_id')->constrained('kode_surats')->cascadeOnDelete();
            $table->foreignId('indeks_id')->constrained('indeks')->cascadeOnDelete();
            $table->string('kode_turunan', 10)->nullable();
            $table->date('tanggal_surat');
            $table->string('kepada', 255);
            $table->string('perihal', 255);
            $table->string('penanda_tangan', 255);
            $table->text('tembusan')->nullable();
            $table->text('keterangan')->nullable();
            $table->date('tanggal_mulai_penugasan')->nullable();
            $table->date('tanggal_selesai_penugasan')->nullable();
            $table->string('file_path', 255)->nullable();
            $table->string('file_name', 255)->nullable();
            $table->foreignId('unit_pembuat_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['draft', 'menunggu_acc', 'disetujui', 'ditolak'])->default('draft');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tahun', 'no_urut']);
            $table->index('status');
            $table->index('unit_pembuat_id');
            $table->index('tanggal_surat');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_keluars');
    }
};
