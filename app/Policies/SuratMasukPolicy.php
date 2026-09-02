<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\SuratMasuk;
use App\Models\User;

class SuratMasukPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, SuratMasuk $surat): bool
    {
        if ($user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            return true;
        }

        return $surat->unit_penerima_id === $user->unit_id;
    }

    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function update(User $user, SuratMasuk $surat): bool
    {
        if (! $user->isActive()) {
            return false;
        }
        if ($user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            return true;
        }

        return $surat->created_by === $user->id && $surat->unit_penerima_id === $user->unit_id;
    }

    public function delete(User $user, SuratMasuk $surat): bool
    {
        return $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU);
    }

    public function restore(User $user, SuratMasuk $surat): bool
    {
        return $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU);
    }
}
