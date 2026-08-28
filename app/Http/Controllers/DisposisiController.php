<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDisposisiRequest;
use App\Http\Requests\UpdateDisposisiRequest;
use App\Models\Disposisi;
use App\Models\Notifikasi;
use App\Models\Surat;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DisposisiController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Menampilkan daftar disposisi
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): JsonResponse
    {
        $query = Disposisi::with([
            'surat',
            'dariUnit',
            'keUnit',
            'dariUser',
            'keUser',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Pencarian
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('surat', function ($q) use ($search) {
                $q->where('nomor_surat', 'like', "%{$search}%")
                    ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Filter status
        |--------------------------------------------------------------------------
        */

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->status
            );
        }

        return response()->json($query
            ->latest()
            ->paginate(10)
            ->withQueryString());
    }

    /*
    |--------------------------------------------------------------------------
    | Form membuat disposisi
    |--------------------------------------------------------------------------
    */

    public function create(Request $request): JsonResponse
    {
        $surat = null;

        if ($request->filled('surat_id')) {
            $surat = Surat::findOrFail(
                $request->surat_id
            );
        }

        $surats = Surat::latest()->get();

        $units = Unit::orderBy(
            'nama_unit'
        )->get();

        return response()->json([
            'surat' => $surat,
            'surats' => $surats,
            'units' => $units,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Menyimpan disposisi
    |--------------------------------------------------------------------------
    */

    public function store(StoreDisposisiRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        $disposisi = DB::transaction(function () use ($data, $user): Disposisi {
            $surat = Surat::findOrFail($data['surat_id']);

            $disposisi = Disposisi::create([
                ...$data,
                'dari_unit_id' => $user->unit_id,
                'dari_user_id' => $user->getAuthIdentifier(),
                'status' => 'menunggu',
            ]);

            $surat->update(['status' => 'didisposisi']);

            if (isset($data['ke_user_id'])) {
                Notifikasi::create([
                    'user_id' => $data['ke_user_id'],
                    'judul' => 'Disposisi Surat Baru',
                    'pesan' => 'Anda menerima disposisi surat: '.$surat->perihal,
                    'link' => '/disposisi/'.$disposisi->id,
                    'dibaca' => false,
                ]);
            }

            return $disposisi;
        });

        return redirect()
            ->route('disposisi.show', $disposisi)
            ->with('success', 'Disposisi berhasil dibuat.');
    }

    /*
    |--------------------------------------------------------------------------
    | Detail disposisi
    |--------------------------------------------------------------------------
    */

    public function show(Disposisi $disposisi): JsonResponse
    {
        return response()->json($disposisi->load([
            'surat',
            'dariUnit',
            'keUnit',
            'dariUser',
            'keUser',
        ]));
    }

    /*
    |--------------------------------------------------------------------------
    | Update disposisi
    |--------------------------------------------------------------------------
    */

    public function update(
        UpdateDisposisiRequest $request,
        Disposisi $disposisi
    ): RedirectResponse {
        $data = $request->validated();

        $disposisi->update($data);

        if ($data['status'] === 'selesai') {
            $disposisi->surat()->update([
                'status' => 'selesai',
            ]);
        }

        if ($data['status'] === 'ditolak') {
            $disposisi->surat()->update([
                'status' => 'ditolak',
            ]);
        }

        return redirect()
            ->route('disposisi.show', $disposisi)
            ->with('success', 'Disposisi berhasil diperbarui.');
    }
}
