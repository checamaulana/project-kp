<?php

namespace App\Http\Controllers;

use App\Http\Requests\HelpdeskSelesaikanRequest;
use App\Http\Requests\HelpdeskStoreRequest;
use App\Models\HelpdeskTicket;
use App\Models\Unit;
use App\Services\HelpdeskService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HelpdeskController extends Controller
{
    public function __construct(
        private readonly HelpdeskService $service,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $perPage = $request->input('per_page', 25);

        $query = HelpdeskTicket::with(['unit', 'pelapor', 'handler'])
            ->latest();

        if (! $user->canHandleHelpdesk()) {
            $query->where('pelapor_id', $user->id);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }
        if ($kategori = $request->input('kategori')) {
            $query->where('kategori', $kategori);
        }
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_tiket', 'like', "%{$search}%")
                    ->orWhere('nama_pelapor', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        $tickets = $query->paginate($perPage)->withQueryString();

        $counts = HelpdeskTicket::selectRaw('status, COUNT(*) as total')
            ->when(! $user->canHandleHelpdesk(), fn ($q) => $q->where('pelapor_id', $user->id))
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Helpdesk/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'kategori', 'per_page']),
            'counts' => [
                'baru' => $counts['baru'] ?? 0,
                'diproses' => $counts['diproses'] ?? 0,
                'selesai' => $counts['selesai'] ?? 0,
                'ditutup' => $counts['ditutup'] ?? 0,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Helpdesk/Create', [
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
            'defaultName' => $user->name,
            'defaultUnitId' => $user->unit_id,
        ]);
    }

    public function store(HelpdeskStoreRequest $request): RedirectResponse
    {
        $ticket = $this->service->create(
            $request->validated(),
            $request->file('lampiran'),
            $request->user()
        );

        return redirect()
            ->route('helpdesk.show', $ticket)
            ->with('success', 'Laporan berhasil dikirim. Kode tiket: '.$ticket->kode_tiket);
    }

    public function show(HelpdeskTicket $helpdesk): Response
    {
        $this->authorize('view', $helpdesk);

        $helpdesk->load(['unit', 'pelapor', 'handler', 'progress.user']);

        return Inertia::render('Helpdesk/Show', [
            'ticket' => $helpdesk,
        ]);
    }

    public function proses(Request $request, HelpdeskTicket $helpdesk): RedirectResponse
    {
        $this->authorize('proses', $helpdesk);

        $this->service->proses($helpdesk, $request->user(), $request->input('komentar'));

        return back()->with('success', 'Tiket mulai diproses.');
    }

    public function selesaikan(HelpdeskSelesaikanRequest $request, HelpdeskTicket $helpdesk): RedirectResponse
    {
        $this->authorize('selesaikan', $helpdesk);

        $this->service->selesaikan($helpdesk, $request->user(), $request->input('tindak_lanjut'));

        return back()->with('success', 'Tiket selesai. Tindak lanjut telah disimpan.');
    }

    public function tutup(Request $request, HelpdeskTicket $helpdesk): RedirectResponse
    {
        $this->authorize('tutup', $helpdesk);

        $this->service->tutup($helpdesk, $request->user(), $request->input('komentar'));

        return back()->with('success', 'Tiket ditutup.');
    }

    public function downloadLampiran(HelpdeskTicket $helpdesk, int $index)
    {
        $this->authorize('view', $helpdesk);

        $lampiran = $helpdesk->lampiranList();
        if (! isset($lampiran[$index])) {
            abort(404);
        }

        $file = $lampiran[$index];
        if (! Storage::disk('local')->exists($file['path'])) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('local')->download($file['path'], $file['name']);
    }
}
