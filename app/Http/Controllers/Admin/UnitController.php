<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Units/Index', [
            'units' => Unit::latest()->paginate(25),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Units/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'kode' => ['required', 'string', 'max:10', 'unique:units,kode'],
            'nama' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        Unit::create($data);

        return redirect()->route('admin.units.index')->with('success', 'Unit berhasil ditambahkan.');
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('Admin/Units/Edit', [
            'unit' => $unit,
        ]);
    }

    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $data = $request->validate([
            'kode' => ['required', 'string', 'max:10', 'unique:units,kode,'.$unit->id],
            'nama' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $unit->update($data);

        return back()->with('success', 'Unit diperbarui.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $unit->delete();

        return back()->with('success', 'Unit dihapus.');
    }
}
