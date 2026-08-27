<?php

namespace App\Enums;

enum HelpdeskKategoriEnum: string
{
    case HARDWARE = 'hardware';
    case JARINGAN = 'jaringan';
    case APLIKASI_SIMRS = 'aplikasi_simrs';
    case LAINNYA = 'lainnya';

    public function label(): string
    {
        return match ($this) {
            self::HARDWARE => 'Hardware',
            self::JARINGAN => 'Jaringan',
            self::APLIKASI_SIMRS => 'Aplikasi SIM-RS',
            self::LAINNYA => 'Lainnya',
        };
    }

    public static function options(): array
    {
        return [
            self::HARDWARE->value => self::HARDWARE->label(),
            self::JARINGAN->value => self::JARINGAN->label(),
            self::APLIKASI_SIMRS->value => self::APLIKASI_SIMRS->label(),
            self::LAINNYA->value => self::LAINNYA->label(),
        ];
    }
}
