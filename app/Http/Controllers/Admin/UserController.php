<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::with('unit');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(25)->withQueryString();
        $pendingCount = User::where('status', StatusUserEnum::PENDING)->count();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
            'pendingCount' => $pendingCount,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
            'roles' => RoleEnum::options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'min:3', 'max:100', 'unique:users,username', 'regex:/^[a-zA-Z0-9._-]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'unit_id' => ['required', 'exists:units,id'],
            'role' => ['required', 'in:'.implode(',', RoleEnum::values())],
        ]);

        User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'unit_id' => $data['unit_id'],
            'role' => $data['role'],
            'status' => StatusUserEnum::ACTIVE,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil dibuat.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('unit'),
            'units' => Unit::active()->get(['id', 'nama', 'kode']),
            'roles' => RoleEnum::options(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'min:3', 'max:100', 'unique:users,username,'.$user->id, 'regex:/^[a-zA-Z0-9._-]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'unit_id' => ['required', 'exists:units,id'],
            'role' => ['required', 'in:'.implode(',', RoleEnum::values())],
            'status' => ['required', 'in:'.implode(',', StatusUserEnum::values())],
        ]);

        $user->update($data);

        return back()->with('success', 'User diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Tidak bisa menghapus akun sendiri.');
        }
        $user->delete();

        return back()->with('success', 'User dihapus.');
    }

    public function pending(Request $request): Response
    {
        $users = User::with('unit')
            ->where('status', StatusUserEnum::PENDING)
            ->latest()
            ->paginate(25);

        return Inertia::render('Admin/Users/Pending', [
            'users' => $users,
        ]);
    }

    public function approve(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => ['required', 'in:'.implode(',', RoleEnum::values())],
        ]);

        $user->update([
            'status' => StatusUserEnum::ACTIVE,
            'role' => $request->input('role'),
        ]);

        return back()->with('success', 'User disetujui.');
    }

    public function reject(User $user): RedirectResponse
    {
        $user->update(['status' => StatusUserEnum::REJECTED]);

        return back()->with('success', 'User ditolak.');
    }
}
