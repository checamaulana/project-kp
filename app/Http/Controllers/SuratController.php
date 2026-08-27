<?php

namespace App\Http\Controllers;

use App\Models\Surat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SuratController extends Controller
{
    public function index(Request $request)
    {
        $query = Surat::with([
            'unit',
            'user',
        ]);

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

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request->status
            );
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where(
                    'nomor_surat',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'perihal',
                    'like',
                    "%{$search}%"
                )
                ->orWhere(
                    'asal_surat',
                    'like',
                    "%{$search}%"
                );
            });
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
            'nomor_surat' => 'nullable|string|max:255',

            'jenis_surat' => [
                'required',
                'in:external,internal,penawaran,pengadaan'
            ],

            'tipe' => [
                'required',
                'in:masuk,keluar'
            ],

            'indeks' => 'nullable|string|max:100',

            'perihal' => 'required|string|max:255',

            'asal_surat' => 'nullable|string|max:255',

            'tujuan_surat' => 'nullable|string|max:255',

            'tanggal_surat' => 'nullable|date',

            'tanggal_diterima' => 'nullable|date',

            'unit_id' => 'nullable|exists:units,id',

            'file_surat' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:10240'
            ],

            'keterangan' => 'nullable|string',
        ]);

        if ($request->hasFile('file_surat')) {
            $validated['file_surat'] =
                $request
                    ->file('file_surat')
                    ->store('surat', 'public');
        }

        $validated['user_id'] = $request->user()->id;

        $validated['status'] =
            $validated['tipe'] === 'masuk'
                ? 'diterima'
                : 'draft';

        $surat = Surat::create($validated);

        return response()->json([
            'message' => 'Surat berhasil ditambahkan',
            'data' => $surat->load('unit'),
        ], 201);
    }

    public function show(Surat $surat)
    {
        return response()->json(
            $surat->load([
                'unit',
                'user',
                'disposisi.keUnit',
                'disposisi.keUser',
            ])
        );
    }

    public function update(Request $request, Surat $surat)
    {
        $validated = $request->validate([
            'nomor_surat' => 'nullable|string|max:255',

            'jenis_surat' => [
                'sometimes',
                'in:external,internal,penawaran,pengadaan'
            ],

            'tipe' => [
                'sometimes',
                'in:masuk,keluar'
            ],

            'indeks' => 'nullable|string|max:100',

            'perihal' => 'sometimes|string|max:255',

            'asal_surat' => 'nullable|string|max:255',

            'tujuan_surat' => 'nullable|string|max:255',

            'tanggal_surat' => 'nullable|date',

            'tanggal_diterima' => 'nullable|date',

            'unit_id' => 'nullable|exists:units,id',

            'file_surat' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:10240'
            ],

            'status' => [
                'nullable',
                'in:draft,diterima,diproses,didisposisi,selesai,ditolak'
            ],

            'keterangan' => 'nullable|string',
        ]);

        if ($request->hasFile('file_surat')) {

            if ($surat->file_surat) {
                Storage::disk('public')
                    ->delete($surat->file_surat);
            }

            $validated['file_surat'] =
                $request
                    ->file('file_surat')
                    ->store('surat', 'public');
        }

        $surat->update($validated);

        return response()->json([
            'message' => 'Surat berhasil diperbarui',
            'data' => $surat->fresh()
        ]);
    }

    public function destroy(Surat $surat)
    {
        if ($surat->file_surat) {
            Storage::disk('public')
                ->delete($surat->file_surat);
        }

        $surat->delete();

        return response()->json([
            'message' => 'Surat berhasil dihapus'
        ]);
    }
}