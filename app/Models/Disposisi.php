<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disposisi extends Model
{
    protected $table = 'disposisis';

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

    /*
    |--------------------------------------------------------------------------
    | Relasi ke Surat
    |--------------------------------------------------------------------------
    */

    public function surat(): BelongsTo
    {
        return $this->belongsTo(Surat::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Relasi ke Unit Asal
    |--------------------------------------------------------------------------
    */

    public function dariUnit(): BelongsTo
    {
        return $this->belongsTo(
            Unit::class,
            'dari_unit_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Relasi ke Unit Tujuan
    |--------------------------------------------------------------------------
    */

    public function keUnit(): BelongsTo
    {
        return $this->belongsTo(
            Unit::class,
            'ke_unit_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | User pengirim disposisi
    |--------------------------------------------------------------------------
    */

    public function dariUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dari_user_id');
    }

    public function keUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ke_user_id');
    }
}
