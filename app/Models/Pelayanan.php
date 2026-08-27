<?php

namespace App\Models;

use App\Enums\StatusPelayananEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pelayanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'jenis_pelayanan',
        'aplikasi',
        'detail',
        'pengaju_id',
        'unit_pengaju_id',
        'handler_id',
        'status',
        'lampiran',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'lampiran' => 'array',
            'closed_at' => 'datetime',
            'status' => StatusPelayananEnum::class,
        ];
    }

    public function pengaju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pengaju_id');
    }

    public function unitPengaju(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_pengaju_id');
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(PelayananProgress::class);
    }
}
