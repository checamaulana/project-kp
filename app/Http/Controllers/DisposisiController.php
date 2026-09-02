<?php

namespace App\Http\Controllers;

use App\Http\Requests\DisposisiStoreRequest;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Services\DisposisiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DisposisiController extends Controller
{
    public function __construct(
        private readonly DisposisiService $service,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $disposisis = Disposisi::with(['suratMasuk', 'dariUser', 'kepadaUser', 'kepadaUnit'])
            ->where('kepada_user_id', $user->id)
            ->latest('created_at')
            ->paginate(25);

        return Inertia::render('Disposisi/Index', [
            'disposisis' => $disposisis,
        ]);
    }

    public function show(Disposisi $disposisi): Response
    {
        $disposisi->load(['suratMasuk', 'dariUser', 'kepadaUser', 'kepadaUnit']);

        return Inertia::render('Disposisi/Show', [
            'disposisi' => $disposisi,
        ]);
    }

    public function store(DisposisiStoreRequest $request, SuratMasuk $suratMasuk): RedirectResponse
    {
        $this->service->create(
            $suratMasuk,
            $request->user(),
            $request->validated()
        );

        return back()->with('success', 'Disposisi berhasil disimpan.');
    }
}
