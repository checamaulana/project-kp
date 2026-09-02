<?php

namespace App\Notifications;

use App\Models\Disposisi;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DisposisiBaruNotification extends Notification
{
    use Queueable;

    public function __construct(public Disposisi $disposisi) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $surat = $this->disposisi->suratMasuk;

        return [
            'disposisi_id' => $this->disposisi->id,
            'surat_masuk_id' => $surat?->id,
            'dari_user_name' => $this->disposisi->dariUser?->name,
            'perihal' => $surat?->perihal,
            'isi' => $this->disposisi->isi,
            'type' => 'disposisi_baru',
        ];
    }
}
