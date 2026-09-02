<?php

namespace App\Notifications;

use App\Models\SuratKeluar;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SuratKeluarRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(public SuratKeluar $surat) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'surat_keluar_id' => $this->surat->id,
            'nomor_surat' => $this->surat->nomor_surat,
            'perihal' => $this->surat->perihal,
            'reason' => $this->surat->rejection_reason,
            'type' => 'surat_keluar_rejected',
        ];
    }
}
