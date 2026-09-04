<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\SuratMasukStoreRequest;
use App\Http\Requests\SuratMasukUpdateRequest;
use App\Models\Indeks;
use App\Models\SuratMasuk;
use App\Models\Unit;
use App\Services\PdfGeneratorService;
use App\Services\SuratMasukService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SuratMasukController extends Controller
{
    public function __construct(
        private readonly SuratMasukService $service,
        private readonly PdfGeneratorService $pdf,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeYear = session('active_year', now()->year);

        $request->validate([
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $perPage = (int) $request->input('per_page', 25);

        $query = SuratMasuk::query()
            ->with(['indeks', 'unitPenerima', 'creator'])
            ->where('tahun', $activeYear)
            ->latest('tanggal_terima');

        if (! $user->hasAnyRole(RoleEnum::SUPERADMIN, RoleEnum::ADMIN_TU)) {
            $query->where('unit_penerima_id', $user->unit_id);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_surat', 'like', "%{$search}%")
                    ->orWhere('pengirim', 'like', "%{$search}%")
                    ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        if ($tglMulai = $request->input('tanggal_mulai')) {
            $query->whereDate('tanggal_terima', '>=', $tglMulai);
        }
        if ($tglSelesai = $request->input('tanggal_selesai')) {
            $query->whereDate('tanggal_terima', '<=', $tglSelesai);
        }

        $suratMasuks = $query->paginate($perPage)->withQueryString();

        return Inertia::render('SuratMasuk/Index', [
            'suratMasuks' => $suratMasuks,
            'filters' => $request->only(['search', 'tanggal_mulai', 'tanggal_selesai', 'per_page']),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
            'activeYear' => $activeYear,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SuratMasuk/Create', [
            'indeksOptions' => Indeks::where('is_active', true)->get(['id', 'kode', 'nama']),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
        ]);
    }

    public function store(SuratMasukStoreRequest $request): RedirectResponse
    {
        $surat = $this->service->create(
            $request->validated(),
            $request->file('file'),
            $request->user()->id
        );

        return redirect()
            ->route('surat-masuk.show', $surat)
            ->with('success', 'Surat masuk berhasil disimpan.');
    }

    public function show(SuratMasuk $suratMasuk): Response
    {
        $this->authorize('view', $suratMasuk);

        $suratMasuk->load([
            'indeks',
            'unitPenerima',
            'creator',
            'disposisis.dariUser',
            'disposisis.kepadaUser',
            'disposisis.kepadaUnit',
        ]);

        return Inertia::render('SuratMasuk/Show', [
            'surat' => $suratMasuk,
            'users' => \App\Models\User::active()->get(['id', 'name', 'unit_id'])->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'unit_id' => $u->unit_id,
            ]),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
        ]);
    }

    public function edit(SuratMasuk $suratMasuk): Response
    {
        $this->authorize('update', $suratMasuk);

        return Inertia::render('SuratMasuk/Edit', [
            'surat' => $suratMasuk,
            'indeksOptions' => Indeks::where('is_active', true)->get(['id', 'kode', 'nama']),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
        ]);
    }

    public function update(SuratMasukUpdateRequest $request, SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->service->update(
            $suratMasuk,
            $request->validated(),
            $request->file('file'),
            $request->user()->id
        );

        return redirect()
            ->route('surat-masuk.show', $suratMasuk)
            ->with('success', 'Surat masuk berhasil diperbarui.');
    }

    public function destroy(SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->authorize('delete', $suratMasuk);
        $this->service->delete($suratMasuk);

        return redirect()
            ->route('surat-masuk.index')
            ->with('success', 'Surat masuk dihapus. Dapat direstore dalam 30 hari dari Trash.');
    }

    public function restore(int $id): RedirectResponse
    {
        $surat = SuratMasuk::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $surat);
        $this->service->restore($id);

        return back()->with('success', 'Surat masuk dipulihkan.');
    }

    public function cetakDisposisi(SuratMasuk $suratMasuk)
    {
        $this->authorize('view', $suratMasuk);

        return $this->pdf->generateLembarDisposisi($suratMasuk)
            ->stream("lembar-disposisi-{$suratMasuk->no_urut}-{$suratMasuk->tahun}.pdf");
    }

    public function download(SuratMasuk $suratMasuk)
    {
        $this->authorize('view', $suratMasuk);

        if (! Storage::disk('local')->exists($suratMasuk->file_path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('local')->download(
            $suratMasuk->file_path,
            $suratMasuk->file_name
        );
    }
}
