<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Indeks extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'kode_turunan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'kode_turunan' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function suratMasuks(): HasMany
    {
        return $this->hasMany(SuratMasuk::class);
    }

    public function suratKeluars(): HasMany
    {
        return $this->hasMany(SuratKeluar::class);
    }
}
