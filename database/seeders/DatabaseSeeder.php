<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UnitSeeder::class,
            KodeSuratSeeder::class,
            IndeksSeeder::class,
            UserSeeder::class,
        ]);
    }
}
