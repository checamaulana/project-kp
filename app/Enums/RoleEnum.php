<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPERADMIN = 'superadmin';
    case ADMIN_TU = 'admin_tu';
    case KEPALA_UNIT = 'kepala_unit';
    case STAF = 'staf';

    public function label(): string
    {
        return match ($this) {
            self::SUPERADMIN => 'Superadmin',
            self::ADMIN_TU => 'Admin TU',
            self::KEPALA_UNIT => 'Kepala Unit',
            self::STAF => 'Staf',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function options(): array
    {
        return [
            self::SUPERADMIN->value => self::SUPERADMIN->label(),
            self::ADMIN_TU->value => self::ADMIN_TU->label(),
            self::KEPALA_UNIT->value => self::KEPALA_UNIT->label(),
            self::STAF->value => self::STAF->label(),
        ];
    }
}
