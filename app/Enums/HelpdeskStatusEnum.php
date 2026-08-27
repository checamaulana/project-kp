<?php

namespace App\Enums;

enum HelpdeskStatusEnum: string
{
    case BARU = 'baru';
    case DIPROSES = 'diproses';
    case SELESAI = 'selesai';
    case DITUTUP = 'ditutup';

    public function label(): string
    {
        return match ($this) {
            self::BARU => 'Baru',
            self::DIPROSES => 'Diproses',
            self::SELESAI => 'Selesai',
            self::DITUTUP => 'Ditutup',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::BARU => 'destructive',
            self::DIPROSES => 'warning',
            self::SELESAI => 'success',
            self::DITUTUP => 'muted',
        };
    }
}
