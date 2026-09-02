<?php

namespace App\Models;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
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

    public function helpdeskTickets(): HasMany
    {
        return $this->hasMany(HelpdeskTicket::class, 'pelapor_id');
    }

    public function handledTickets(): HasMany
    {
        return $this->hasMany(HelpdeskTicket::class, 'handler_id');
    }

    public function suratMasuks(): HasMany
    {
        return $this->hasMany(SuratMasuk::class, 'created_by');
    }

    public function isActive(): bool
    {
        return $this->status === StatusUserEnum::ACTIVE;
    }

    public function isPending(): bool
    {
        return $this->status === StatusUserEnum::PENDING;
    }

    public function hasRole(RoleEnum $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(RoleEnum ...$roles): bool
    {
        foreach ($roles as $role) {
            if ($this->role === $role) {
                return true;
            }
        }

        return false;
    }

    public function canApproveSuratKeluar(): bool
    {
        return $this->role === RoleEnum::SUPERADMIN;
    }

    public function canManageUsers(): bool
    {
        return $this->role === RoleEnum::SUPERADMIN;
    }

    public function canDeleteSurat(): bool
    {
        return in_array($this->role, [RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU]);
    }

    public function canHandleHelpdesk(): bool
    {
        return in_array($this->role, [RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU]);
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusUserEnum::ACTIVE);
    }
}
