<?php

namespace App\Enums;

enum StatusSuratKeluarEnum: string
{
    case DRAFT = 'draft';
    case MENUNGGU_ACC = 'menunggu_acc';
    case DISETUJUI = 'disetujui';
    case DITOLAK = 'ditolak';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::MENUNGGU_ACC => 'Menunggu ACC',
            self::DISETUJUI => 'Disetujui',
            self::DITOLAK => 'Ditolak',
        };
    }
}
