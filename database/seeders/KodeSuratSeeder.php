<?php

namespace Database\Seeders;

use App\Models\KodeSurat;
use Illuminate\Database\Seeder;

class KodeSuratSeeder extends Seeder
{
    public function run(): void
    {
        $kodes = [
            ['kode' => 'ST', 'keterangan' => 'Surat Tugas'],
            ['kode' => 'SK', 'keterangan' => 'Surat Keputusan'],
            ['kode' => 'ND', 'keterangan' => 'Nota Dinas'],
            ['kode' => 'SM', 'keterangan' => 'Surat Mandat'],
            ['kode' => 'SP', 'keterangan' => 'Surat Pengantar'],
            ['kode' => 'SU', 'keterangan' => 'Surat Umum'],
        ];

        foreach ($kodes as $kode) {
            KodeSurat::updateOrCreate(['kode' => $kode['kode']], [
                'keterangan' => $kode['keterangan'],
                'is_active' => true,
            ]);
        }
    }
}
