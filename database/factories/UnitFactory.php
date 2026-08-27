<?php

namespace Database\Factories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnitFactory extends Factory
{
    protected $model = Unit::class;

    public function definition(): array
    {
        return [
            'kode' => fake()->unique()->bothify('U###'),
            'nama' => fake()->company(),
            'keterangan' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
