<?php

namespace Database\Factories;

use App\Enums\AksiDisposisiEnum;
use App\Enums\StatusDisposisiEnum;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DisposisiFactory extends Factory
{
    protected $model = Disposisi::class;

    public function definition(): array
    {
        return [
            'surat_masuk_id' => SuratMasuk::factory(),
            'parent_id' => null,
            'dari_user_id' => User::factory(),
            'kepada_user_id' => User::factory(),
            'kepada_unit_id' => null,
            'isi' => fake()->sentence(8),
            'aksi' => AksiDisposisiEnum::DI_DISPOSISI,
            'status' => StatusDisposisiEnum::PENDING,
        ];
    }
}
