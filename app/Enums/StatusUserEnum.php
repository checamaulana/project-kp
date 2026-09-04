<?php

namespace App\Enums;

enum StatusUserEnum: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu',
            self::ACTIVE => 'Aktif',
            self::REJECTED => 'Ditolak',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function options(): array
    {
        return [
            self::PENDING->value => self::PENDING->label(),
            self::ACTIVE->value => self::ACTIVE->label(),
            self::REJECTED->value => self::REJECTED->label(),
        ];
    }
}
