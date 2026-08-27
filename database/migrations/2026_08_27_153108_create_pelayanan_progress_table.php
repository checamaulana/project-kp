<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('helpdesk_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('helpdesk_ticket_id')->constrained('helpdesk_tickets')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('komentar');
            $table->string('status_sebelum', 20)->nullable();
            $table->string('status_sesudah', 20)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['helpdesk_ticket_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('helpdesk_progress');
    }
};
