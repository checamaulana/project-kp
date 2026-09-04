<?php

namespace App\Http\Requests\Auth;

use App\Enums\StatusUserEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $user = \App\Models\User::where('username', $this->input('username'))->first();

        if (! $user || ! Hash::check($this->input('password'), $user->password)) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'username' => 'Username atau password salah.',
            ]);
        }

        if ($user->status !== StatusUserEnum::ACTIVE) {
            throw ValidationException::withMessages([
                'username' => 'Akun Anda belum aktif. Hubungi admin.',
            ]);
        }

        Auth::login($user, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        throw ValidationException::withMessages([
            'username' => 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.',
        ]);
    }

    public function throttleKey(): string
    {
        return 'login:'.strtolower((string) $this->input('username')).'|'.($this->ip() ?? 'unknown');
    }
}
