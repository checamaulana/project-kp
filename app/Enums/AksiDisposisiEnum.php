<?php

namespace App\Enums;

enum AksiDisposisiEnum: string
{
    case DI_DISPOSISI = 'di_disposisi';
    case DI_ARSIPKAN = 'di_arsipkan';

    public function label(): string
    {
        return match ($this) {
            self::DI_DISPOSISI => 'Diteruskan',
            self::DI_ARSIPKAN => 'Diarsipkan',
        };
    }
}
