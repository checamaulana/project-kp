<?php

namespace App\Http\Controllers\Auth;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

use App\Http\Controllers\Controller;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
        ]);
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'unit_id' => $request->unit_id,
            'role' => $request->role,
            'status' => StatusUserEnum::PENDING,
        ]);

        return redirect()->route('login')->with('success', 'Pendaftaran berhasil. Akun Anda menunggu persetujuan admin.');
    }
}
