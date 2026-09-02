<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // Unit RSGM (sesuai screenshot Lapor Kendala IT + tambahan)
            ['kode' => 'REK', 'nama' => 'Rektorat', 'keterangan' => 'Pimpinan RSGM UNIMUS'],
            ['kode' => 'TU', 'nama' => 'Tata Usaha', 'keterangan' => 'Administrasi umum RSGM'],
            ['kode' => 'PEN', 'nama' => 'Pendaftaran', 'keterangan' => 'Unit pendaftaran pasien'],
            ['kode' => 'RM', 'nama' => 'Rekam Medis', 'keterangan' => 'Unit rekam medis'],
            ['kode' => 'IGD', 'nama' => 'IGD', 'keterangan' => 'Instalasi Gawat Darurat'],
            ['kode' => 'RAD', 'nama' => 'Radiologi', 'keterangan' => 'Unit radiologi gigi'],
            ['kode' => 'RJ', 'nama' => 'Rawat Jalan', 'keterangan' => 'Unit rawat jalan'],
            ['kode' => 'RI', 'nama' => 'Rawat Inap', 'keterangan' => 'Unit rawat inap'],
            ['kode' => 'FAR', 'nama' => 'Farmasi', 'keterangan' => 'Unit farmasi'],
            ['kode' => 'CSSD', 'nama' => 'CSSD', 'keterangan' => 'Central Sterile Supply Department'],
            ['kode' => 'KEU', 'nama' => 'Keuangan', 'keterangan' => 'Unit keuangan'],
            ['kode' => 'INT', 'nama' => 'Integrasi', 'keterangan' => 'Unit integrasi sistem'],
            ['kode' => 'IT', 'nama' => 'IT Rumah Sakit', 'keterangan' => 'Unit teknologi informasi RSGM'],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(['kode' => trim($unit['kode'])], [
                'nama' => $unit['nama'],
                'keterangan' => $unit['keterangan'],
                'is_active' => true,
            ]);
        }
    }
}
