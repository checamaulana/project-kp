<?php

namespace App\Enums;

enum HelpdeskJenisPermintaanEnum: string
{
    case PERBAIKAN = 'perbaikan';
    case KONSULTASI = 'konsultasi';
    case INSTALASI_BARU = 'instalasi_baru';

    public function label(): string
    {
        return match ($this) {
            self::PERBAIKAN => 'Perbaikan',
            self::KONSULTASI => 'Konsultasi',
            self::INSTALASI_BARU => 'Instalasi Baru',
        };
    }

    public static function options(): array
    {
        return [
            self::PERBAIKAN->value => self::PERBAIKAN->label(),
            self::KONSULTASI->value => self::KONSULTASI->label(),
            self::INSTALASI_BARU->value => self::INSTALASI_BARU->label(),
        ];
    }
}
