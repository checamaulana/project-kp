<?php

namespace App\Observers;

use App\Models\SuratKeluar;
use App\Services\AuditLogger;

class SuratKeluarObserver
{
    public function created(SuratKeluar $surat): void
    {
        AuditLogger::log('created', $surat, null, $surat->toArray());
    }

    public function updated(SuratKeluar $surat): void
    {
        AuditLogger::log('updated', $surat, $surat->getOriginal(), $surat->getChanges());
    }

    public function deleted(SuratKeluar $surat): void
    {
        AuditLogger::log('deleted', $surat, $surat->toArray(), null);
    }
}
