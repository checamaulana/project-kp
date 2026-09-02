<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class SessionController extends Controller
{
    public function setYear(Request $request): RedirectResponse
    {
        $request->validate([
            'year' => ['required', 'integer', 'between:2000,2100'],
        ]);

        $request->session()->put('active_year', (int) $request->input('year'));

        return back();
    }
}
