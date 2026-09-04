<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class RekapController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Rekap/Index');
    }

    public function suratMasuk(Request $request): Response
    {
        $user = $request->user();

        $request->validate([
            'tahun' => ['nullable', 'integer', 'between:2000,2100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $tahun = (int) $request->input('tahun', session('active_year', now()->year));
        $perPage = (int) $request->input('per_page', 50);

        $query = SuratMasuk::with(['unitPenerima', 'indeks'])
            ->where('tahun', $tahun)
            ->latest('tanggal_terima');

        if (! $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            $query->where('unit_penerima_id', $user->unit_id);
        }

        $data = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Rekap/SuratMasuk', [
            'data' => $data,
            'filters' => $request->only(['tahun', 'per_page']),
        ]);
    }

    public function suratKeluar(Request $request): Response
    {
        $user = $request->user();

        $request->validate([
            'tahun' => ['nullable', 'integer', 'between:2000,2100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $tahun = (int) $request->input('tahun', session('active_year', now()->year));
        $perPage = (int) $request->input('per_page', 50);

        $query = SuratKeluar::with(['kodeSurat', 'indeks', 'unitPembuat', 'createdBy'])
            ->where('tahun', $tahun)
            ->latest('tanggal_surat');

        if (! $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            $query->where('unit_pembuat_id', $user->unit_id);
        }

        $data = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Rekap/SuratKeluar', [
            'data' => $data,
            'filters' => $request->only(['tahun', 'per_page']),
        ]);
    }

    public function exportSuratMasuk(Request $request): BinaryFileResponse
    {
        $user = $request->user();
        $tahun = $request->input('tahun', session('active_year', now()->year));

        $query = SuratMasuk::with(['unitPenerima', 'indeks'])->where('tahun', $tahun);
        if (! $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            $query->where('unit_penerima_id', $user->unit_id);
        }

        $data = $query->get();

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\SuratMasukExport($data),
            "rekap-surat-masuk-{$tahun}.xlsx"
        );
    }

    public function exportSuratKeluar(Request $request): BinaryFileResponse
    {
        $user = $request->user();
        $tahun = $request->input('tahun', session('active_year', now()->year));

        $query = SuratKeluar::with(['kodeSurat', 'indeks', 'unitPembuat'])->where('tahun', $tahun);
        if (! $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            $query->where('unit_pembuat_id', $user->unit_id);
        }

        $data = $query->get();

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\SuratKeluarExport($data),
            "rekap-surat-keluar-{$tahun}.xlsx"
        );
    }
}
