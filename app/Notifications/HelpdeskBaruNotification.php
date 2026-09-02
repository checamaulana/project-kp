<?php

namespace App\Notifications;

use App\Models\HelpdeskTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class HelpdeskBaruNotification extends Notification
{
    use Queueable;

    public function __construct(public HelpdeskTicket $ticket) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'kode_tiket' => $this->ticket->kode_tiket,
            'nama_pelapor' => $this->ticket->nama_pelapor,
            'kategori' => $this->ticket->kategori?->value,
            'perihal' => $this->ticket->deskripsi,
            'type' => 'helpdesk_baru',
        ];
    }
}
