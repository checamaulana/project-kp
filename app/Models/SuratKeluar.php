<?php

namespace App\Models;

use App\Enums\StatusSuratKeluarEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SuratKeluar extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'no_urut',
        'tahun',
        'nomor_surat',
        'kode_surat_id',
        'indeks_id',
        'kode_turunan',
        'tanggal_surat',
        'kepada',
        'perihal',
        'penanda_tangan',
        'tembusan',
        'keterangan',
        'tanggal_mulai_penugasan',
        'tanggal_selesai_penugasan',
        'file_path',
        'file_name',
        'unit_pembuat_id',
        'created_by',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_surat' => 'date',
            'tanggal_mulai_penugasan' => 'date',
            'tanggal_selesai_penugasan' => 'date',
            'approved_at' => 'datetime',
            'status' => StatusSuratKeluarEnum::class,
        ];
    }

    public function kodeSurat(): BelongsTo
    {
        return $this->belongsTo(KodeSurat::class);
    }

    public function indeks(): BelongsTo
    {
        return $this->belongsTo(Indeks::class);
    }

    public function unitPembuat(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_pembuat_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function isSuratTugas(): bool
    {
        return $this->kode_turunan !== null;
    }
}
