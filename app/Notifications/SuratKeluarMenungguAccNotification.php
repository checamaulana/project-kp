<?php

namespace App\Notifications;

use App\Models\SuratKeluar;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SuratKeluarMenungguAccNotification extends Notification
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
            'created_by_name' => $this->surat->createdBy?->name,
            'type' => 'surat_keluar_menunggu_acc',
        ];
    }
}
