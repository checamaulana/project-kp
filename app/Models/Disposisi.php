<?php

namespace App\Models;

use App\Enums\AksiDisposisiEnum;
use App\Enums\StatusDisposisiEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disposisi extends Model
{
    use HasFactory;

    protected $fillable = [
        'surat_masuk_id',
        'parent_id',
        'dari_user_id',
        'kepada_user_id',
        'kepada_unit_id',
        'isi',
        'aksi',
        'status',
        'dibaca_at',
        'selesai_at',
    ];

    protected function casts(): array
    {
        return [
            'dibaca_at' => 'datetime',
            'selesai_at' => 'datetime',
            'aksi' => AksiDisposisiEnum::class,
            'status' => StatusDisposisiEnum::class,
        ];
    }

    public function suratMasuk(): BelongsTo
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Disposisi::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Disposisi::class, 'parent_id');
    }

    public function dariUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dari_user_id');
    }

    public function kepadaUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kepada_user_id');
    }

    public function kepadaUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'kepada_unit_id');
    }
}
