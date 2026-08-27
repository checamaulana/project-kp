<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Surat extends Model
{
    protected $fillable = [
        'nomor_surat',
        'jenis_surat',
        'tipe',
        'indeks',
        'perihal',
        'asal_surat',
        'tujuan_surat',
        'tanggal_surat',
        'tanggal_diterima',
        'unit_id',
        'user_id',
        'file_surat',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_surat' => 'date',
        'tanggal_diterima' => 'date',
    ];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function disposisi(): HasMany
    {
        return $this->hasMany(Disposisi::class);
    }
}