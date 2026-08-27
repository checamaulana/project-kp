<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['kode' => 'REK', 'nama' => 'Rektorat', 'keterangan' => 'Pimpinan universitas'],
            ['kode' => 'TU', 'nama' => 'Tata Usaha', 'keterangan' => 'Administrasi umum'],
            ['kode' => 'AKD', 'nama' => 'Akademik', 'keterangan' => 'Biro Akademik'],
            ['kode' => 'KMN', 'nama' => 'Kemahasiswaan', 'keterangan' => 'Biro Kemahasiswaan'],
            ['kode' => 'KEU', 'nama' => 'Keuangan', 'keterangan' => 'Biro Keuangan'],
            ['kode' => ' hum', 'nama' => 'Humas & Protokol', 'keterangan' => 'Hubungan masyarakat'],
            ['kode' => 'LPM', 'nama' => 'LPM', 'keterangan' => 'Lembaga Penjamin Mutu'],
            ['kode' => 'LAB', 'nama' => 'Laboratorium', 'keterangan' => 'Lab terpadu'],
            ['kode' => 'RS', 'nama' => 'Rumah Sakit', 'keterangan' => 'RSGMP Unimus'],
            ['kode' => 'POL', 'nama' => 'Poliklinik', 'keterangan' => 'Poliklinik gigi & umum'],
            ['kode' => 'IGD', 'nama' => 'IGD', 'keterangan' => 'Instalasi Gawat Darurat'],
            ['kode' => 'APM', 'nama' => 'Apotek', 'keterangan' => 'Instalasi Farmasi'],
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
