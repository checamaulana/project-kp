<?php

namespace App\Enums;

enum StatusDisposisiEnum: string
{
    case PENDING = 'pending';
    case SELESAI = 'selesai';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::SELESAI => 'Selesai',
        };
    }
}
