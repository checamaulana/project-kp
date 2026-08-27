<?php

namespace Database\Factories;

use App\Enums\StatusSuratMasukEnum;
use App\Models\SuratMasuk;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuratMasukFactory extends Factory
{
    protected $model = SuratMasuk::class;

    public function definition(): array
    {
        return [
            'no_urut' => fake()->numberBetween(1, 999),
            'tahun' => now()->year,
            'tanggal_terima' => fake()->dateTimeBetween('-1 month', 'now'),
            'tanggal_surat' => fake()->dateTimeBetween('-1 month', 'now'),
            'nomor_surat' => fake()->bothify('SM/####/??'),
            'pengirim' => fake()->company(),
            'perihal' => fake()->sentence(4),
            'keterangan' => fake()->paragraph(),
            'indeks_id' => null,
            'file_path' => 'surat/masuk/contoh.pdf',
            'file_name' => 'contoh.pdf',
            'unit_penerima_id' => Unit::factory(),
            'created_by' => User::factory(),
            'status' => fake()->randomElement(StatusSuratMasukEnum::cases())->value,
        ];
    }
}
