<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\Notifikasi;
use App\Models\Surat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DisposisiController extends Controller
{
    public function index(Request $request)
    {
        $query = Disposisi::with([
            'surat',
            'dariUnit',
            'keUnit',
            'dariUser',
            'keUser',
        ]);

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->status
            );
        }

        return response()->json(
            $query
                ->latest()
                ->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'surat_id' => [
                'required',
                'exists:surats,id'
            ],

            'ke_unit_id' => [
                'required',
                'exists:units,id'
            ],

            'ke_user_id' => [
                'nullable',
                'exists:users,id'
            ],

            'instruksi' => [
                'required',
                'string'
            ],

            'tanggal_disposisi' => [
                'required',
                'date'
            ],

            'batas_waktu' => [
                'nullable',
                'date',
                'after_or_equal:tanggal_disposisi'
            ],

            'catatan' => [
                'nullable',
                'string'
            ],
        ]);

        $disposisi = DB::transaction(function () use (
            $validated,
            $request
        ) {

            $surat = Surat::findOrFail(
                $validated['surat_id']
            );

            $disposisi = Disposisi::create([
                'surat_id' => $surat->id,

                'dari_unit_id' =>
                    $request->user()->unit_id,

                'ke_unit_id' =>
                    $validated['ke_unit_id'],

                'dari_user_id' =>
                    $request->user()->id,

                'ke_user_id' =>
                    $validated['ke_user_id'] ?? null,

                'instruksi' =>
                    $validated['instruksi'],

                'tanggal_disposisi' =>
                    $validated['tanggal_disposisi'],

                'batas_waktu' =>
                    $validated['batas_waktu'] ?? null,

                'status' => 'menunggu',

                'catatan' =>
                    $validated['catatan'] ?? null,
            ]);

            $surat->update([
                'status' => 'didisposisi'
            ]);

            if ($validated['ke_user_id'] ?? null) {

                Notifikasi::create([
                    'user_id' =>
                        $validated['ke_user_id'],

                    'judul' =>
                        'Disposisi Surat Baru',

                    'pesan' =>
                        'Anda menerima disposisi surat: '
                        . $surat->perihal,

                    'link' =>
                        '/disposisi/'
                        . $disposisi->id,

                    'dibaca' => false,
                ]);
            }

            return $disposisi;
        });

        return response()->json([
            'message' =>
                'Disposisi berhasil dibuat dan notifikasi telah dikirim',

            'data' =>
                $disposisi->load([
                    'surat',
                    'keUnit',
                    'keUser'
                ])
        ], 201);
    }

    public function show(Disposisi $disposisi)
    {
        return response()->json(
            $disposisi->load([
                'surat',
                'dariUnit',
                'keUnit',
                'dariUser',
                'keUser',
            ])
        );
    }

    public function update(
        Request $request,
        Disposisi $disposisi
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:menunggu,diproses,selesai,ditolak'
            ],

            'catatan' => [
                'nullable',
                'string'
            ],
        ]);

        $disposisi->update($validated);

        if ($validated['status'] === 'selesai') {

            $disposisi
                ->surat()
                ->update([
                    'status' => 'selesai'
                ]);
        }

        return response()->json([
            'message' =>
                'Status disposisi berhasil diperbarui',

            'data' =>
                $disposisi->fresh()
        ]);
    }
}
