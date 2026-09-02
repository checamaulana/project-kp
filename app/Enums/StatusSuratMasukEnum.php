<?php

namespace App\Enums;

enum StatusSuratMasukEnum: string
{
    case AKTIF = 'aktif';
    case ON_ROUTE = 'on_route';
    case SELESAI = 'selesai';

    public function label(): string
    {
        return match ($this) {
            self::AKTIF => 'Aktif',
            self::ON_ROUTE => 'Dalam Disposisi',
            self::SELESAI => 'Selesai',
        };
    }
}
