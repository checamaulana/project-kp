<?php

namespace App\Services;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfGeneratorService
{
    public function generateLembarDisposisi(SuratMasuk $surat): \Barryvdh\DomPDF\PDF
    {
        $surat->load(['disposisis.dariUser', 'disposisis.kepadaUser', 'disposisis.kepadaUnit', 'indeks', 'unitPenerima']);

        $pdf = Pdf::loadView('pdf.lembar-disposisi', [
            'surat' => $surat,
            'tanggalCetak' => now()->format('d F Y'),
        ]);

        $pdf->setPaper('a4', 'landscape');

        return $pdf;
    }

    public function generateSuratKeluar(SuratKeluar $suratKeluar): \Barryvdh\DomPDF\PDF
    {
        $suratKeluar->load(['kodeSurat', 'indeks', 'unitPembuat', 'approver']);

        $pdf = Pdf::loadView('pdf.surat-keluar', [
            'surat' => $suratKeluar,
        ]);

        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}
