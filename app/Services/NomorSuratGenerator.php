<?php

namespace App\Services;

use App\Models\Indeks;
use App\Models\KodeSurat;
use App\Models\SuratKeluar;
use App\Models\Unit;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class NomorSuratGenerator
{
    /**
     * Generate nomor surat keluar otomatis.
     * Format: [KodeSurat]/[KodeUnit]/[Indeks][KodeTurunan]/[NoUrut]/[BulanRomawi]/[Tahun]
     * Contoh: UNIMUS/IT/ST.KP/001/VIII/2026
     */
    public function generate(int $kodeSuratId, int $unitId, int $indeksId, ?string $kodeTurunan = null): string
    {
        return DB::transaction(function () use ($kodeSuratId, $unitId, $indeksId, $kodeTurunan) {
            $kodeSurat = KodeSurat::findOrFail($kodeSuratId);
            $unit = Unit::findOrFail($unitId);
            $indeks = Indeks::findOrFail($indeksId);
            $tahun = Carbon::now()->year;
            $bulanRomawi = $this->toRoman(Carbon::now()->month);

            $lastNo = SuratKeluar::where('tahun', $tahun)
                ->where('unit_pembuat_id', $unitId)
                ->lockForUpdate()
                ->max('no_urut');

            $noUrut = ($lastNo ?? 0) + 1;
            $noUrutFormatted = str_pad((string) $noUrut, 3, '0', STR_PAD_LEFT);

            $kodeIndeks = $indeks->kode.($kodeTurunan ? '.'.$kodeTurunan : '');

            return "{$kodeSurat->kode}/{$unit->kode}/{$kodeIndeks}/{$noUrutFormatted}/{$bulanRomawi}/{$tahun}";
        });
    }

    public function preview(int $kodeSuratId, int $unitId, int $indeksId, ?string $kodeTurunan = null): string
    {
        $kodeSurat = KodeSurat::find($kodeSuratId);
        $unit = Unit::find($unitId);
        $indeks = Indeks::find($indeksId);
        $tahun = Carbon::now()->year;
        $bulanRomawi = $this->toRoman(Carbon::now()->month);

        if (! $kodeSurat || ! $unit || ! $indeks) {
            return '';
        }

        $kodeIndeks = $indeks->kode.($kodeTuranan = $kodeTurunan ? '.'.$kodeTurunan : '');
        $lastNo = SuratKeluar::where('tahun', $tahun)
            ->where('unit_pembuat_id', $unitId)
            ->max('no_urut');
        $noUrut = str_pad((string) (($lastNo ?? 0) + 1), 3, '0', STR_PAD_LEFT);

        return "{$kodeSurat->kode}/{$unit->kode}/{$kodeIndeks}/{$noUrut}/{$bulanRomawi}/{$tahun}";
    }

    private function toRoman(int $num): string
    {
        $map = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII',
        ];

        return $map[$num];
    }
}
