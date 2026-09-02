<?php

namespace App\Services;

use App\Enums\AksiDisposisiEnum;
use App\Enums\StatusDisposisiEnum;
use App\Enums\StatusSuratMasukEnum;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use App\Notifications\DisposisiBaruNotification;
use Illuminate\Support\Facades\DB;

class DisposisiService
{
    public function create(SuratMasuk $surat, User $dari, array $data): Disposisi
    {
        return DB::transaction(function () use ($surat, $dari, $data) {
            $parent = $surat->disposisis()->latest('created_at')->first();

            $disposisi = Disposisi::create([
                'surat_masuk_id' => $surat->id,
                'parent_id' => $parent?->id,
                'dari_user_id' => $dari->id,
                'kepada_user_id' => $data['kepada_user_id'] ?? null,
                'kepada_unit_id' => $data['kepada_unit_id'] ?? null,
                'isi' => $data['isi'],
                'aksi' => $data['aksi'],
                'status' => StatusDisposisiEnum::PENDING,
            ]);

            if ($data['aksi'] === AksiDisposisiEnum::DI_ARSIPKAN->value) {
                $surat->update(['status' => StatusSuratMasukEnum::SELESAI]);
                $disposisi->update([
                    'status' => StatusDisposisiEnum::SELESAI,
                    'selesai_at' => now(),
                ]);
            } else {
                $surat->update(['status' => StatusSuratMasukEnum::ON_ROUTE]);
            }

            if ($disposisi->kepada_user_id) {
                $penerima = User::find($disposisi->kepada_user_id);
                if ($penerima) {
                    $penerima->notify(new DisposisiBaruNotification($disposisi));
                }
            }

            return $disposisi;
        });
    }
}
