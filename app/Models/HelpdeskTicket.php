<?php

namespace App\Models;

use App\Enums\HelpdeskJenisPermintaanEnum;
use App\Enums\HelpdeskKategoriEnum;
use App\Enums\HelpdeskStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HelpdeskTicket extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'helpdesk_tickets';

    protected $fillable = [
        'kode_tiket',
        'nama_pelapor',
        'unit_id',
        'kategori',
        'jenis_permintaan',
        'deskripsi',
        'lampiran',
        'pelapor_id',
        'handler_id',
        'status',
        'tindak_lanjut',
        'diproses_at',
        'selesai_at',
    ];

    protected function casts(): array
    {
        return [
            'kategori' => HelpdeskKategoriEnum::class,
            'jenis_permintaan' => HelpdeskJenisPermintaanEnum::class,
            'status' => HelpdeskStatusEnum::class,
            'lampiran' => 'array',
            'diproses_at' => 'datetime',
            'selesai_at' => 'datetime',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pelapor_id');
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(HelpdeskProgress::class, 'helpdesk_ticket_id')->orderBy('created_at');
    }

    public function isBaru(): bool
    {
        return $this->status === HelpdeskStatusEnum::BARU;
    }

    public function isDiproses(): bool
    {
        return $this->status === HelpdeskStatusEnum::DIPROSES;
    }

    public function isSelesai(): bool
    {
        return $this->status === HelpdeskStatusEnum::SELESAI;
    }

    public function lampiranList(): array
    {
        return $this->lampiran ?? [];
    }
}
