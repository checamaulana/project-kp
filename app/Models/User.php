<?php

namespace App\Models;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'unit_id',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => RoleEnum::class,
            'status' => StatusUserEnum::class,
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function disposisiDiterima(): HasMany
    {
        return $this->hasMany(Disposisi::class, 'kepada_user_id');
    }

    public function disposisiDikirim(): HasMany
    {
        return $this->hasMany(Disposisi::class, 'dari_user_id');
    }

    public function isSuperadmin(): bool
    {
        return $this->role === RoleEnum::SUPERADMIN;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', StatusUserEnum::ACTIVE);
    }
}
