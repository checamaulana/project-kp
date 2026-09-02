<?php

namespace App\Observers;

use App\Models\SuratMasuk;
use App\Services\AuditLogger;

class SuratMasukObserver
{
    public function created(SuratMasuk $surat): void
    {
        AuditLogger::log('created', $surat, null, $surat->toArray());
    }

    public function updated(SuratMasuk $surat): void
    {
        AuditLogger::log('updated', $surat, $surat->getOriginal(), $surat->getChanges());
    }

    public function deleted(SuratMasuk $surat): void
    {
        AuditLogger::log('deleted', $surat, $surat->toArray(), null);
    }
}
