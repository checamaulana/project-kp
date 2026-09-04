<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSuratRequest;
use App\Http\Requests\UpdateSuratRequest;
use App\Models\Surat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Storage;

class SuratController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Surat::with(['unit', 'user']);

        if ($request->filled('jenis_surat')) {
            $query->where(
                'jenis_surat',
                $request->jenis_surat
            );
        }

        if ($request->filled('tipe')) {
            $query->where(
                'tipe',
                $request->tipe
            );
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where(
                    'nomor_surat',
                    'like',
                    '%'.$request->search.'%'
                )
                    ->orWhere(
                        'perihal',
                        'like',
                        '%'.$request->search.'%'
                    );
            });
        }

        $surats = $query
            ->latest()
            ->paginate(10);

        return response()->json($surats);
    }

    public function create(): JsonResponse
    {
        return response()->json([
            'jenis_surat' => ['external', 'internal', 'penawaran', 'pengadaan'],
            'tipe' => ['masuk', 'keluar'],
        ]);
    }

    public function store(StoreSuratRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        if ($request->hasFile('file_surat')) {
            $data['file_surat'] =
                $request
                    ->file('file_surat')
                    ->store(
                        'surat',
                        'public'
                    );
        }

        $data['user_id'] = $user->getAuthIdentifier();

        $data['status'] =
            $data['tipe'] === 'masuk'
                ? 'diterima'
                : 'draft';

        Surat::create($data);

        return redirect()
            ->route('surat.index')
            ->with(
                'success',
                'Surat berhasil ditambahkan'
            );
    }

    public function show(Surat $surat): JsonResponse
    {
        return response()->json($surat->load(['unit', 'user', 'disposisi']));
    }

    public function edit(Surat $surat): JsonResponse
    {
        return response()->json($surat);
    }

    public function update(
        UpdateSuratRequest $request,
        Surat $surat
    ): RedirectResponse {
        $data = $request->validated();
        $fileSuratLama = $surat->file_surat;

        if ($request->hasFile('file_surat')) {
            $data['file_surat'] = $request->file('file_surat')->store('surat', 'public');
        }

        $surat->update($data);

        if ($request->hasFile('file_surat') && $fileSuratLama) {
            Storage::disk('public')->delete($fileSuratLama);
        }

        return redirect()
            ->route('surat.index')
            ->with(
                'success',
                'Surat berhasil diperbarui'
            );
    }

    public function destroy(Surat $surat): RedirectResponse
    {
        if ($surat->file_surat) {
            Storage::disk('public')
                ->delete($surat->file_surat);
        }

        $surat->delete();

        return redirect()
            ->route('surat.index')
            ->with(
                'success',
                'Surat berhasil dihapus'
            );
    }
}
