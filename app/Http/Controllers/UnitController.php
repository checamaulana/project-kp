<?php

namespace App\Http\Controllers;

use App\Models\Unit;

class UnitController extends Controller
{
    public function index()
    {
        return response()->json(
            Unit::where('aktif', true)
                ->orderBy('nama_unit')
                ->get()
        );
    }
}