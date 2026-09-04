<?php

namespace Database\Factories;

use App\Models\Indeks;
use Illuminate\Database\Eloquent\Factories\Factory;

class IndeksFactory extends Factory
{
    protected $model = Indeks::class;

    public function definition(): array
    {
        return [
            'kode' => strtoupper(fake()->unique()->lexify('???')),
            'nama' => fake()->words(2, true),
            'kode_turunan' => null,
            'is_active' => true,
        ];
    }
}
