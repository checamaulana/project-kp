<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Enums\StatusSuratKeluarEnum;
use App\Http\Requests\SuratKeluarApprovalRequest;
use App\Http\Requests\SuratKeluarStoreRequest;
use App\Http\Requests\SuratKeluarUpdateRequest;
use App\Models\Indeks;
use App\Models\KodeSurat;
use App\Models\SuratKeluar;
use App\Models\Unit;
use App\Services\NomorSuratGenerator;
use App\Services\PdfGeneratorService;
use App\Services\SuratKeluarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuratKeluarController extends Controller
{
    public function __construct(
        private readonly SuratKeluarService $service,
        private readonly PdfGeneratorService $pdf,
        private readonly NomorSuratGenerator $nomorGen,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeYear = session('active_year', now()->year);

        $request->validate([
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'status' => ['nullable', 'in:'.implode(',', array_column(StatusSuratKeluarEnum::cases(), 'value'))],
        ]);
        $perPage = (int) $request->input('per_page', 25);

        $query = SuratKeluar::query()
            ->with(['kodeSurat', 'indeks', 'unitPembuat', 'createdBy', 'approvedBy'])
            ->where('tahun', $activeYear)
            ->latest('tanggal_surat');

        if (! $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            $query->where('unit_pembuat_id', $user->unit_id);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_surat', 'like', "%{$search}%")
                    ->orWhere('kepada', 'like', "%{$search}%")
                    ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        $suratKeluars = $query->paginate($perPage)->withQueryString();

        $pendingCount = SuratKeluar::where('status', StatusSuratKeluarEnum::MENUNGGU_ACC)->count();

        return Inertia::render('SuratKeluar/Index', [
            'suratKeluars' => $suratKeluars,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'pendingCount' => $pendingCount,
            'activeYear' => $activeYear,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('SuratKeluar/Create', [
            'kodeSuratOptions' => KodeSurat::where('is_active', true)->get(['id', 'kode', 'keterangan']),
            'indeksOptions' => Indeks::where('is_active', true)->get(['id', 'kode', 'nama', 'kode_turunan']),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
            'userUnitId' => $user->unit_id,
        ]);
    }

    public function store(SuratKeluarStoreRequest $request): RedirectResponse
    {
        $surat = $this->service->create(
            $request->validated(),
            $request->file('file'),
            $request->user()
        );

        return redirect()
            ->route('surat-keluar.show', $surat)
            ->with('success', 'Draft surat keluar berhasil dibuat. Submit untuk approval Rektor.');
    }

    public function show(SuratKeluar $suratKeluar): Response
    {
        $this->authorize('view', $suratKeluar);

        $suratKeluar->load(['kodeSurat', 'indeks', 'unitPembuat', 'createdBy', 'approvedBy']);

        return Inertia::render('SuratKeluar/Show', [
            'surat' => $suratKeluar,
        ]);
    }

    public function edit(SuratKeluar $suratKeluar): Response
    {
        $this->authorize('update', $suratKeluar);

        return Inertia::render('SuratKeluar/Edit', [
            'surat' => $suratKeluar,
            'kodeSuratOptions' => KodeSurat::where('is_active', true)->get(['id', 'kode', 'keterangan']),
            'indeksOptions' => Indeks::where('is_active', true)->get(['id', 'kode', 'nama', 'kode_turunan']),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
        ]);
    }

    public function update(SuratKeluarUpdateRequest $request, SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->service->update(
            $suratKeluar,
            $request->validated(),
            $request->file('file'),
            $request->user()
        );

        return redirect()
            ->route('surat-keluar.show', $suratKeluar)
            ->with('success', 'Surat keluar diperbarui.');
    }

    public function submitForApproval(SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('update', $suratKeluar);

        if ($suratKeluar->status !== StatusSuratKeluarEnum::DRAFT) {
            return back()->with('error', 'Hanya draft yang bisa disubmit.');
        }

        $this->service->submitForApproval($suratKeluar);

        return back()->with('success', 'Surat keluar disubmit. Menunggu approval Rektor.');
    }

    public function approve(SuratKeluarApprovalRequest $request, SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('approve', $suratKeluar);

        $this->service->approve($suratKeluar, $request->user());

        return back()->with('success', 'Surat keluar disetujui.');
    }

    public function reject(SuratKeluarApprovalRequest $request, SuratKeluar $suratKeluar): RedirectResponse
    {
        $this->authorize('approve', $suratKeluar);

        $request->validate(['alasan_penolakan' => ['required', 'string', 'max:1000']]);

        $this->service->reject($suratKeluar, $request->user(), $request->input('alasan_penolakan'));

        return back()->with('success', 'Surat keluar ditolak. Pengaju dapat merevisi.');
    }

    public function cetak(SuratKeluar $suratKeluar)
    {
        $this->authorize('view', $suratKeluar);

        if ($suratKeluar->status !== StatusSuratKeluarEnum::DISETUJUI) {
            abort(403, 'Surat belum disetujui.');
        }

        return $this->pdf->generateSuratKeluar($suratKeluar)
            ->stream("surat-keluar-{$suratKeluar->nomor_surat}.pdf");
    }

    public function previewNomor(Request $request)
    {
        $request->validate([
            'kode_surat_id' => ['required', 'exists:kode_surats,id'],
            'unit_pembuat_id' => ['required', 'exists:units,id'],
            'indeks_id' => ['required', 'exists:indeks,id'],
            'kode_turunan' => ['nullable', 'string'],
        ]);

        $preview = $this->nomorGen->preview(
            $request->integer('kode_surat_id'),
            $request->integer('unit_pembuat_id'),
            $request->integer('indeks_id'),
            $request->input('kode_turunan')
        );

        return response()->json(['nomor_surat' => $preview]);
    }
}
