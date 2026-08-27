<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surats', function (Blueprint $table) {
            $table->id();

            $table->string('nomor_surat')->nullable();

            $table->enum('jenis_surat', [
                'external',
                'internal',
                'penawaran',
                'pengadaan'
            ]);

            $table->enum('tipe', [
                'masuk',
                'keluar'
            ]);

            $table->string('indeks')->nullable();

            $table->string('perihal');

            $table->string('asal_surat')->nullable();

            $table->string('tujuan_surat')->nullable();

            $table->date('tanggal_surat')->nullable();

            $table->date('tanggal_diterima')->nullable();

            $table->foreignId('unit_id')
                ->nullable()
                ->constrained('units')
                ->nullOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('file_surat')->nullable();

            $table->enum('status', [
                'draft',
                'diterima',
                'diproses',
                'didisposisi',
                'selesai',
                'ditolak'
            ])->default('draft');

            $table->text('keterangan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surats');
    }
};