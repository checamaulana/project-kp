<?php

namespace App\Notifications;

use App\Models\HelpdeskTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class HelpdeskProgressNotification extends Notification
{
    use Queueable;

    public function __construct(public HelpdeskTicket $ticket, public string $aksi) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'kode_tiket' => $this->ticket->kode_tiket,
            'status' => $this->ticket->status?->value,
            'aksi' => $this->aksi,
            'tindak_lanjut' => $this->ticket->tindak_lanjut,
            'type' => 'helpdesk_progress',
        ];
    }
}
