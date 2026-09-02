<?php

namespace App\Observers;

use App\Models\HelpdeskTicket;
use App\Services\AuditLogger;

class HelpdeskObserver
{
    public function created(HelpdeskTicket $ticket): void
    {
        AuditLogger::log('created', $ticket, null, $ticket->toArray());
    }

    public function updated(HelpdeskTicket $ticket): void
    {
        AuditLogger::log('updated', $ticket, $ticket->getOriginal(), $ticket->getChanges());
    }

    public function deleted(HelpdeskTicket $ticket): void
    {
        AuditLogger::log('deleted', $ticket, $ticket->toArray(), null);
    }
}
