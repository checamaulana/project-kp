<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('helpdesk_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('kode_tiket', 20)->unique();
            $table->string('nama_pelapor', 100);
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->enum('kategori', ['hardware', 'jaringan', 'aplikasi_simrs', 'lainnya']);
            $table->enum('jenis_permintaan', ['perbaikan', 'konsultasi', 'instalasi_baru']);
            $table->text('deskripsi');
            $table->json('lampiran')->nullable();
            $table->foreignId('pelapor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('handler_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['baru', 'diproses', 'selesai', 'ditutup'])->default('baru');
            $table->text('tindak_lanjut')->nullable();
            $table->timestamp('diproses_at')->nullable();
            $table->timestamp('selesai_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('kategori');
            $table->index('jenis_permintaan');
            $table->index('unit_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('helpdesk_tickets');
    }
};
