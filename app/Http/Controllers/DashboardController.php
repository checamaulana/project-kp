<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\Surat;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'total_surat' => Surat::count(),
            'surat_masuk' => Surat::where('tipe', 'masuk')->count(),
            'surat_keluar' => Surat::where('tipe', 'keluar')->count(),
            'surat_didisposisikan' => Surat::where('status', 'didisposisi')->count(),
            'disposisi_menunggu' => Disposisi::where('status', 'menunggu')->count(),
            'disposisi_selesai' => Disposisi::where('status', 'selesai')->count(),
            'surat_terbaru' => Surat::with(['unit', 'user'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
