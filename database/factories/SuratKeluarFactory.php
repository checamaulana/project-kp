<?php

namespace Database\Factories;

use App\Enums\StatusSuratKeluarEnum;
use App\Models\Indeks;
use App\Models\KodeSurat;
use App\Models\SuratKeluar;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuratKeluarFactory extends Factory
{
    protected $model = SuratKeluar::class;

    public function definition(): array
    {
        return [
            'no_urut' => fake()->numberBetween(1, 999),
            'tahun' => now()->year,
            'nomor_surat' => fake()->unique()->bothify('UNIMUS/IT/ST/###/VIII/'.now()->year),
            'kode_surat_id' => KodeSurat::factory(),
            'indeks_id' => Indeks::factory(),
            'kode_turunan' => null,
            'tanggal_surat' => fake()->dateTimeBetween('-1 month', 'now'),
            'kepada' => fake()->company(),
            'perihal' => fake()->sentence(4),
            'penanda_tangan' => fake()->name(),
            'tembusan' => fake()->optional()->sentence(),
            'keterangan' => fake()->paragraph(),
            'unit_pembuat_id' => Unit::factory(),
            'created_by' => User::factory(),
            'status' => fake()->randomElement(StatusSuratKeluarEnum::cases())->value,
        ];
    }
}
