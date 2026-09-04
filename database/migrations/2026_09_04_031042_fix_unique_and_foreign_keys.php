<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surat_keluars', function (Blueprint $table) {
            $table->dropUnique(['tahun', 'no_urut']);
            $table->unique(['tahun', 'unit_pembuat_id', 'no_urut'], 'surat_keluars_tahun_unit_nourut_unique');
        });

        Schema::table('surat_masuks', function (Blueprint $table) {
            $table->dropForeign(['unit_penerima_id']);
            $table->foreign('unit_penerima_id')->references('id')->on('units')->restrictOnDelete();
        });

        Schema::table('surat_keluars', function (Blueprint $table) {
            $table->dropForeign(['unit_pembuat_id']);
            $table->foreign('unit_pembuat_id')->references('id')->on('units')->restrictOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->foreign('unit_id')->references('id')->on('units')->restrictOnDelete();
        });

        Schema::table('disposisis', function (Blueprint $table) {
            $table->dropForeign(['dari_user_id']);
            $table->foreign('dari_user_id')->references('id')->on('users')->restrictOnDelete();
        });

        Schema::table('helpdesk_tickets', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->foreign('unit_id')->references('id')->on('units')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('helpdesk_tickets', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->foreign('unit_id')->references('id')->on('units')->cascadeOnDelete();
        });

        Schema::table('disposisis', function (Blueprint $table) {
            $table->dropForeign(['dari_user_id']);
            $table->foreign('dari_user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->foreign('unit_id')->references('id')->on('units')->cascadeOnDelete();
        });

        Schema::table('surat_keluars', function (Blueprint $table) {
            $table->dropForeign(['unit_pembuat_id']);
            $table->foreign('unit_pembuat_id')->references('id')->on('units')->cascadeOnDelete();
        });

        Schema::table('surat_masuks', function (Blueprint $table) {
            $table->dropForeign(['unit_penerima_id']);
            $table->foreign('unit_penerima_id')->references('id')->on('units')->cascadeOnDelete();
        });

        Schema::table('surat_keluars', function (Blueprint $table) {
            $table->dropUnique('surat_keluars_tahun_unit_nourut_unique');
            $table->unique(['tahun', 'no_urut']);
        });
    }
};
