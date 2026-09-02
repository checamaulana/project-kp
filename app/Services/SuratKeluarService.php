<?php

namespace App\Services;

use App\Enums\StatusSuratKeluarEnum;
use App\Models\SuratKeluar;
use App\Models\User;
use App\Notifications\SuratKeluarApprovedNotification;
use App\Notifications\SuratKeluarMenungguAccNotification;
use App\Notifications\SuratKeluarRejectedNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SuratKeluarService
{
    public function __construct(
        private readonly NomorSuratGenerator $nomorGenerator,
    ) {}

    public function create(array $data, ?UploadedFile $file, User $user): SuratKeluar
    {
        return DB::transaction(function () use ($data, $file, $user) {
            $nomorSurat = $this->nomorGenerator->generate(
                $data['kode_surat_id'],
                $data['unit_pembuat_id'],
                $data['indeks_id'],
                $data['kode_turunan'] ?? null
            );

            $filePath = null;
            $fileName = null;
            if ($file) {
                $fileName = $file->getClientOriginalName();
                $fileHash = $file->hashName();
                $filePath = $file->storeAs('surat-keluar/'.now()->year, $fileHash, 'local');
            }

            return SuratKeluar::create([
                'no_urut' => $this->extractNoUrut($nomorSurat),
                'tahun' => now()->year,
                'nomor_surat' => $nomorSurat,
                'kode_surat_id' => $data['kode_surat_id'],
                'indeks_id' => $data['indeks_id'],
                'kode_turunan' => $data['kode_turunan'] ?? null,
                'tanggal_surat' => $data['tanggal_surat'],
                'kepada' => $data['kepada'],
                'perihal' => $data['perihal'],
                'penanda_tangan' => $data['penanda_tangan'],
                'tembusan' => $data['tembusan'] ?? null,
                'keterangan' => $data['keterangan'] ?? null,
                'tanggal_mulai_penugasan' => $data['tanggal_mulai_penugasan'] ?? null,
                'tanggal_selesai_penugasan' => $data['tanggal_selesai_penugasan'] ?? null,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'unit_pembuat_id' => $data['unit_pembuat_id'],
                'created_by' => $user->id,
                'status' => StatusSuratKeluarEnum::DRAFT,
            ]);
        });
    }

    public function update(SuratKeluar $surat, array $data, ?UploadedFile $file, User $user): SuratKeluar
    {
        return DB::transaction(function () use ($surat, $data, $file) {
            if ($file) {
                if ($surat->file_path) {
                    Storage::disk('local')->delete($surat->file_path);
                }
                $fileName = $file->getClientOriginalName();
                $fileHash = $file->hashName();
                $filePath = $file->storeAs('surat-keluar/'.now()->year, $fileHash, 'local');
                $data['file_path'] = $filePath;
                $data['file_name'] = $fileName;
            }

            $surat->update($data);

            return $surat;
        });
    }

    public function submitForApproval(SuratKeluar $surat): SuratKeluar
    {
        $surat->update(['status' => StatusSuratKeluarEnum::MENUNGGU_ACC]);

        $admins = User::where('role', \App\Enums\RoleEnum::SUPERADMIN)->get();
        foreach ($admins as $admin) {
            $admin->notify(new SuratKeluarMenungguAccNotification($surat));
        }

        return $surat;
    }

    public function approve(SuratKeluar $surat, User $approver): SuratKeluar
    {
        $surat->update([
            'status' => StatusSuratKeluarEnum::DISETUJUI,
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ]);

        $surat->createdBy->notify(new SuratKeluarApprovedNotification($surat));

        return $surat;
    }

    public function reject(SuratKeluar $surat, User $approver, string $reason): SuratKeluar
    {
        $surat->update([
            'status' => StatusSuratKeluarEnum::DITOLAK,
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'rejection_reason' => $reason,
        ]);

        $surat->createdBy->notify(new SuratKeluarRejectedNotification($surat));

        return $surat;
    }

    private function extractNoUrut(string $nomorSurat): int
    {
        $parts = explode('/', $nomorSurat);
        foreach ($parts as $part) {
            if (preg_match('/^\d{3}$/', $part)) {
                return (int) $part;
            }
        }

        return 1;
    }
}
