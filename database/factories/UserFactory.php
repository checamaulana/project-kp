<?php

namespace Database\Factories;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $name = fake()->name();

        return [
            'name' => $name,
            'username' => Str::slug($name).'_'.fake()->unique()->numerify('###'),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'unit_id' => Unit::factory(),
            'role' => RoleEnum::STAF,
            'status' => StatusUserEnum::ACTIVE,
        ];
    }

    public function superadmin(): static
    {
        return $this->state(fn (): array => [
            'role' => RoleEnum::SUPERADMIN,
            'status' => StatusUserEnum::ACTIVE,
        ]);
    }
}
