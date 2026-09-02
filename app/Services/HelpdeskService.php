<?php

namespace App\Services;

use App\Enums\HelpdeskStatusEnum;
use App\Models\HelpdeskProgress;
use App\Models\HelpdeskTicket;
use App\Models\User;
use App\Notifications\HelpdeskBaruNotification;
use App\Notifications\HelpdeskProgressNotification;
use Illuminate\Support\Facades\DB;

class HelpdeskService
{
    public function create(array $data, ?array $files, User $user): HelpdeskTicket
    {
        return DB::transaction(function () use ($data, $files, $user) {
            $tahun = now()->year;
            $lastNo = HelpdeskTicket::whereYear('created_at', $tahun)->lockForUpdate()->max('id') ?? 0;
            $kodeTiket = str_pad((string) (($lastNo ?: 0) + 1), 4, '0', STR_PAD_LEFT);

            $lampiranPaths = [];
            if ($files) {
                foreach ($files as $file) {
                    $hash = $file->hashName();
                    $path = $file->storeAs("helpdesk/{$tahun}", $hash, 'local');
                    $lampiranPaths[] = [
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                    ];
                }
            }

            $ticket = HelpdeskTicket::create([
                'kode_tiket' => '#'.$kodeTiket,
                'nama_pelapor' => $data['nama_pelapor'] ?? $user->name,
                'unit_id' => $data['unit_id'],
                'kategori' => $data['kategori'],
                'jenis_permintaan' => $data['jenis_permintaan'],
                'deskripsi' => $data['deskripsi'],
                'lampiran' => $lampiranPaths,
                'pelapor_id' => $user->id,
                'status' => HelpdeskStatusEnum::BARU,
            ]);

            HelpdeskProgress::create([
                'helpdesk_ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'komentar' => 'Tiket dibuat.',
                'status_sebelum' => null,
                'status_sesudah' => HelpdeskStatusEnum::BARU->value,
                'created_at' => now(),
            ]);

            // Notif ke admin/superadmin
            $handlers = User::whereIn('role', [\App\Enums\RoleEnum::SUPERADMIN, \App\Enums\RoleEnum::ADMIN_TU])->get();
            foreach ($handlers as $handler) {
                $handler->notify(new HelpdeskBaruNotification($ticket));
            }

            return $ticket;
        });
    }

    public function proses(HelpdeskTicket $ticket, User $handler, ?string $komentar = null): HelpdeskTicket
    {
        return DB::transaction(function () use ($ticket, $handler, $komentar) {
            $sebelum = $ticket->status;
            $ticket->update([
                'status' => HelpdeskStatusEnum::DIPROSES,
                'handler_id' => $handler->id,
                'diproses_at' => now(),
            ]);

            HelpdeskProgress::create([
                'helpdesk_ticket_id' => $ticket->id,
                'user_id' => $handler->id,
                'komentar' => $komentar ?? 'Tiket mulai diproses.',
                'status_sebelum' => $sebelum->value,
                'status_sesudah' => HelpdeskStatusEnum::DIPROSES->value,
                'created_at' => now(),
            ]);

            if ($ticket->pelapor) {
                $ticket->pelapor->notify(new HelpdeskProgressNotification($ticket, 'diproses'));
            }

            return $ticket;
        });
    }

    public function selesaikan(HelpdeskTicket $ticket, User $handler, string $tindakLanjut): HelpdeskTicket
    {
        return DB::transaction(function () use ($ticket, $handler, $tindakLanjut) {
            $sebelum = $ticket->status;
            $ticket->update([
                'status' => HelpdeskStatusEnum::SELESAI,
                'tindak_lanjut' => $tindakLanjut,
                'selesai_at' => now(),
            ]);

            HelpdeskProgress::create([
                'helpdesk_ticket_id' => $ticket->id,
                'user_id' => $handler->id,
                'komentar' => 'Tiket selesai. Tindak lanjut: '.$tindakLanjut,
                'status_sebelum' => $sebelum->value,
                'status_sesudah' => HelpdeskStatusEnum::SELESAI->value,
                'created_at' => now(),
            ]);

            if ($ticket->pelapor) {
                $ticket->pelapor->notify(new HelpdeskProgressNotification($ticket, 'selesai'));
            }

            return $ticket;
        });
    }

    public function tutup(HelpdeskTicket $ticket, User $user, ?string $komentar = null): HelpdeskTicket
    {
        return DB::transaction(function () use ($ticket, $user, $komentar) {
            $sebelum = $ticket->status;
            $ticket->update([
                'status' => HelpdeskStatusEnum::DITUTUP,
            ]);

            HelpdeskProgress::create([
                'helpdesk_ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'komentar' => $komentar ?? 'Tiket ditutup.',
                'status_sebelum' => $sebelum->value,
                'status_sesudah' => HelpdeskStatusEnum::DITUTUP->value,
                'created_at' => now(),
            ]);

            return $ticket;
        });
    }
}
