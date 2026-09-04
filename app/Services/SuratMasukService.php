<?php

namespace App\Services;

use App\Enums\StatusSuratMasukEnum;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SuratMasukService
{
    public function create(array $data, UploadedFile $file, int $userId): SuratMasuk
    {
        return DB::transaction(function () use ($data, $file, $userId) {
            $tahun = now()->year;

            $lastNo = SuratMasuk::where('tahun', $tahun)->lockForUpdate()->max('no_urut');
            $noUrut = ($lastNo ?? 0) + 1;

            $fileName = $file->getClientOriginalName();
            $fileHash = $file->hashName();
            $filePath = $file->storeAs("surat/{$tahun}", $fileHash, 'local');

            return SuratMasuk::create([
                'no_urut' => $noUrut,
                'tahun' => $tahun,
                'tanggal_terima' => $data['tanggal_terima'],
                'tanggal_surat' => $data['tanggal_surat'],
                'nomor_surat' => $data['nomor_surat'],
                'pengirim' => $data['pengirim'],
                'perihal' => $data['perihal'],
                'keterangan' => $data['keterangan'] ?? null,
                'indeks_id' => $data['indeks_id'] ?? null,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'unit_penerima_id' => $data['unit_penerima_id'],
                'created_by' => $userId,
                'status' => StatusSuratMasukEnum::AKTIF,
            ]);
        });
    }

    public function update(SuratMasuk $surat, array $data, ?UploadedFile $file, int $userId): SuratMasuk
    {
        return DB::transaction(function () use ($surat, $data, $file, $userId) {
            if ($file) {
                if ($surat->file_path && Storage::disk('local')->exists($surat->file_path)) {
                    Storage::disk('local')->delete($surat->file_path);
                }
                $fileName = $file->getClientOriginalName();
                $fileHash = $file->hashName();
                $filePath = $file->storeAs("surat/{$surat->tahun}", $fileHash, 'local');
                $data['file_path'] = $filePath;
                $data['file_name'] = $fileName;
            }

            $data['updated_by'] = $userId;
            $surat->update($data);

            return $surat;
        });
    }

    public function delete(SuratMasuk $surat): bool
    {
        return $surat->delete();
    }

    public function restore(int $id): SuratMasuk
    {
        $surat = SuratMasuk::onlyTrashed()->findOrFail($id);
        $surat->restore();

        return $surat;
    }

    public function purgeOldTrashed(): int
    {
        $threshold = now()->subDays(30);
        $purged = 0;

        SuratMasuk::onlyTrashed()->where('deleted_at', '<', $threshold)->chunkById(100, function ($trashed) use (&$purged) {
            foreach ($trashed as $surat) {
                if ($surat->file_path && Storage::disk('local')->exists($surat->file_path)) {
                    Storage::disk('local')->delete($surat->file_path);
                }
                $surat->forceDelete();
                $purged++;
            }
        });

        SuratKeluar::onlyTrashed()->where('deleted_at', '<', $threshold)->chunkById(100, function ($trashed) use (&$purged) {
            foreach ($trashed as $surat) {
                if ($surat->file_path && Storage::disk('local')->exists($surat->file_path)) {
                    Storage::disk('local')->delete($surat->file_path);
                }
                $surat->forceDelete();
                $purged++;
            }
        });

        return $purged;
    }
}
