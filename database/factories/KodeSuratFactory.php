<?php

namespace Database\Factories;

use App\Models\KodeSurat;
use Illuminate\Database\Eloquent\Factories\Factory;

class KodeSuratFactory extends Factory
{
    protected $model = KodeSurat::class;

    public function definition(): array
    {
        return [
            'kode' => strtoupper(fake()->unique()->lexify('???')),
            'keterangan' => fake()->sentence(3),
            'is_active' => true,
        ];
    }
}
