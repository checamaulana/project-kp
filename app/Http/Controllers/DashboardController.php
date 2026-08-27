<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use App\Models\Disposisi;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_surat' =>
                Surat::count(),

            'surat_masuk' =>
                Surat::where(
                    'tipe',
                    'masuk'
                )->count(),

            'surat_keluar' =>
                Surat::where(
                    'tipe',
                    'keluar'
                )->count(),

            'surat_didiposisikan' =>
                Surat::where(
                    'status',
                    'didisposisi'
                )->count(),

            'disposisi_menunggu' =>
                Disposisi::where(
                    'status',
                    'menunggu'
                )->count(),

            'disposisi_selesai' =>
                Disposisi::where(
                    'status',
                    'selesai'
                )->count(),

            'surat_terbaru' =>
                Surat::with('unit')
                    ->latest()
                    ->limit(5)
                    ->get(),
        ]);
    }
}