<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PelayananProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelayanan_id',
        'user_id',
        'komentar',
        'status_sebelum',
        'status_sesudah',
    ];

    public function pelayanan(): BelongsTo
    {
        return $this->belongsTo(Pelayanan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
