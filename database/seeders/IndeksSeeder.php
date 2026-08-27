<?php

namespace Database\Seeders;

use App\Models\Indeks;
use Illuminate\Database\Seeder;

class IndeksSeeder extends Seeder
{
    public function run(): void
    {
        $indeks = [
            ['kode' => 'UM', 'nama' => 'Umum', 'kode_turunan' => null],
            ['kode' => 'KP', 'nama' => 'Kemahasiswaan & Pembelajaran', 'kode_turunan' => ['KP', 'KM']],
            ['kode' => 'KE', 'nama' => 'Kepegawaian', 'kode_turunan' => null],
            ['kode' => 'KEU', 'nama' => 'Keuangan', 'kode_turunan' => null],
            ['kode' => 'LIT', 'nama' => 'Penelitian & Pengabdian', 'kode_turunan' => null],
            ['kode' => 'KES', 'nama' => 'Kesehatan & Rumah Sakit', 'kode_turunan' => null],
            ['kode' => 'HUK', 'nama' => 'Hukum & Kepegawaian', 'kode_turunan' => null],
            ['kode' => 'PRT', 'nama' => 'Protokol & Humas', 'kode_turunan' => null],
        ];

        foreach ($indeks as $item) {
            Indeks::updateOrCreate(['kode' => $item['kode']], [
                'nama' => $item['nama'],
                'kode_turunan' => $item['kode_turunan'],
                'is_active' => true,
            ]);
        }
    }
}
