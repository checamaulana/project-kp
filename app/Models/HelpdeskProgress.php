<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpdeskProgress extends Model
{
    use HasFactory;

    protected $table = 'helpdesk_progress';

    public $timestamps = false;

    protected $fillable = [
        'helpdesk_ticket_id',
        'user_id',
        'komentar',
        'status_sebelum',
        'status_sesudah',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(HelpdeskTicket::class, 'helpdesk_ticket_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
