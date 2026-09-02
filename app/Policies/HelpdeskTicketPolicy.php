<?php

namespace App\Policies;

use App\Models\HelpdeskTicket;
use App\Models\User;

class HelpdeskTicketPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, HelpdeskTicket $ticket): bool
    {
        if ($user->canHandleHelpdesk()) {
            return true;
        }

        return $ticket->pelapor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function proses(User $user, HelpdeskTicket $ticket): bool
    {
        return $user->canHandleHelpdesk() && $ticket->status->value === 'baru';
    }

    public function selesaikan(User $user, HelpdeskTicket $ticket): bool
    {
        return $user->canHandleHelpdesk() && $ticket->status->value === 'diproses';
    }

    public function tutup(User $user, HelpdeskTicket $ticket): bool
    {
        return $user->canHandleHelpdesk() && in_array($ticket->status->value, ['baru', 'diproses']);
    }
}
