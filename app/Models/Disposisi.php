<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disposisi extends Model
{
    protected $fillable = [
        'surat_id',
        'dari_unit_id',
        'ke_unit_id',
        'dari_user_id',
        'ke_user_id',
        'instruksi',
        'tanggal_disposisi',
        'batas_waktu',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal_disposisi' => 'date',
        'batas_waktu' => 'date',
    ];

    public function surat(): BelongsTo
    {
        return $this->belongsTo(Surat::class);
    }

    public function dariUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'dari_unit_id');
    }

    public function keUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'ke_unit_id');
    }

    public function dariUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dari_user_id');
    }

    public function keUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ke_user_id');
    }
}