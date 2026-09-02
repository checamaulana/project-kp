<?php

namespace App\Models;

use App\Enums\StatusSuratMasukEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SuratMasuk extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'no_urut',
        'tahun',
        'tanggal_terima',
        'tanggal_surat',
        'nomor_surat',
        'pengirim',
        'perihal',
        'keterangan',
        'indeks_id',
        'file_path',
        'file_name',
        'unit_penerima_id',
        'created_by',
        'updated_by',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_terima' => 'date',
            'tanggal_surat' => 'date',
            'status' => StatusSuratMasukEnum::class,
        ];
    }

    public function indeks(): BelongsTo
    {
        return $this->belongsTo(Indeks::class);
    }

    public function unitPenerima(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_penerima_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function disposisis(): HasMany
    {
        return $this->hasMany(Disposisi::class);
    }
}
