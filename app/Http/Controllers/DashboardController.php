<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Dashboard', [
            'stats' => [
                'surat_masuk' => \App\Models\SuratMasuk::where('unit_penerima_id', $user->unit_id)->count(),
                'surat_keluar' => \App\Models\SuratKeluar::where('unit_pembuat_id', $user->unit_id)->count(),
                'disposisi_pending' => \App\Models\Disposisi::where('kepada_user_id', $user->id)->where('status', 'pending')->count(),
                'pelayanan' => \App\Models\Pelayanan::where('pengaju_id', $user->id)->count(),
            ],
        ]);
    }
}
