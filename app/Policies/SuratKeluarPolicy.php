<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\SuratKeluar;
use App\Models\User;

class SuratKeluarPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, SuratKeluar $surat): bool
    {
        if ($user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            return true;
        }

        return $surat->unit_pembuat_id === $user->unit_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU, RoleEnum::KEPALA_UNIT]);
    }

    public function update(User $user, SuratKeluar $surat): bool
    {
        if (! $surat->isEditable()) {
            return false;
        }
        if ($user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            return true;
        }

        return $surat->created_by === $user->id;
    }

    public function approve(User $user, SuratKeluar $surat): bool
    {
        return $user->hasRole(RoleEnum::SUPERADMIN) && $surat->isApprovable();
    }
}
