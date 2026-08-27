<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    protected $fillable = [
        'kode_unit',
        'nama_unit',
        'keterangan',
        'aktif',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class);
    }
}