<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $rektorat = Unit::where('kode', 'REK')->first();

        User::updateOrCreate(['username' => 'superadmin'], [
            'name' => 'Super Admin',
            'email' => 'superadmin@rsgm.unimus.ac.id',
            'password' => bcrypt('password'),
            'unit_id' => $rektorat?->id ?? Unit::first()->id,
            'role' => RoleEnum::SUPERADMIN,
            'status' => StatusUserEnum::ACTIVE,
        ]);

        User::updateOrCreate(['username' => 'admin_tu'], [
            'name' => 'Admin TU',
            'email' => 'admin.tu@rsgm.unimus.ac.id',
            'password' => bcrypt('password'),
            'unit_id' => Unit::where('kode', 'TU')->first()?->id ?? Unit::first()->id,
            'role' => RoleEnum::ADMIN_TU,
            'status' => StatusUserEnum::ACTIVE,
        ]);

        User::updateOrCreate(['username' => 'kepala_unit'], [
            'name' => 'Kepala Unit IT',
            'email' => 'kepala.it@rsgm.unimus.ac.id',
            'password' => bcrypt('password'),
            'unit_id' => Unit::where('kode', 'IT')->first()?->id ?? Unit::first()->id,
            'role' => RoleEnum::KEPALA_UNIT,
            'status' => StatusUserEnum::ACTIVE,
        ]);

        User::updateOrCreate(['username' => 'staf_it'], [
            'name' => 'Staf IT',
            'email' => 'staf.it@rsgm.unimus.ac.id',
            'password' => bcrypt('password'),
            'unit_id' => Unit::where('kode', 'IT')->first()?->id ?? Unit::first()->id,
            'role' => RoleEnum::STAF,
            'status' => StatusUserEnum::ACTIVE,
        ]);
    }
}
