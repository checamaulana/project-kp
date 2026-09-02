<?php

namespace App\Http\Controllers;

use App\Enums\HelpdeskStatusEnum;
use App\Models\Disposisi;
use App\Models\HelpdeskTicket;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeYear = session('active_year', now()->year);

        $stats = [
            'surat_masuk' => SuratMasuk::where('unit_penerima_id', $user->unit_id)
                ->where('tahun', $activeYear)
                ->count(),
            'surat_keluar' => SuratKeluar::where('unit_pembuat_id', $user->unit_id)
                ->where('tahun', $activeYear)
                ->count(),
            'disposisi_pending' => Disposisi::where('kepada_user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'helpdesk_baru' => $user->canHandleHelpdesk()
                ? HelpdeskTicket::where('status', HelpdeskStatusEnum::BARU)->count()
                : HelpdeskTicket::where('pelapor_id', $user->id)
                    ->where('status', HelpdeskStatusEnum::BARU)
                    ->count(),
        ];

        $recentSuratMasuk = SuratMasuk::with(['unitPenerima', 'indeks'])
            ->where('unit_penerima_id', $user->unit_id)
            ->where('tahun', $activeYear)
            ->latest('tanggal_terima')
            ->limit(5)
            ->get();

        $recentHelpdesk = HelpdeskTicket::with(['unit', 'handler'])
            ->when(! $user->canHandleHelpdesk(), fn ($q) => $q->where('pelapor_id', $user->id))
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentSuratMasuk' => $recentSuratMasuk,
            'recentHelpdesk' => $recentHelpdesk,
            'activeYear' => $activeYear,
        ]);
    }
}
