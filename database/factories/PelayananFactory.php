<?php

namespace Database\Factories;

use App\Enums\StatusPelayananEnum;
use App\Models\Pelayanan;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PelayananFactory extends Factory
{
    protected $model = Pelayanan::class;

    public function definition(): array
    {
        return [
            'judul' => fake()->sentence(3),
            'jenis_pelayanan' => fake()->randomElement(['pendaftaran', 'rawat_jalan', 'rawat_inap', 'penunjang']),
            'aplikasi' => fake()->randomElement(['trouble', 'pengembangan_fitur', 'permintaan_data']),
            'detail' => '<p>'.fake()->paragraph().'</p>',
            'pengaju_id' => User::factory(),
            'unit_pengaju_id' => Unit::factory(),
            'handler_id' => null,
            'status' => fake()->randomElement(StatusPelayananEnum::cases())->value,
            'lampiran' => null,
        ];
    }
}
