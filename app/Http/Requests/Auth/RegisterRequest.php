<?php

namespace App\Http\Requests\Auth;

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:100', 'unique:users,username', 'regex:/^[a-zA-Z0-9._-]+$/'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'unit_id' => ['required', 'exists:units,id'],
            'role' => ['required', Rule::in([RoleEnum::KEPALA_UNIT->value, RoleEnum::STAF->value])],
        ];
    }

    public function messages(): array
    {
        return [
            'username.regex' => 'Username hanya boleh mengandung huruf, angka, titik, underscore, dan strip.',
            'username.unique' => 'Username sudah digunakan.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.in' => 'Role yang dipilih tidak valid. Superadmin dan Admin TU hanya dapat dibuat oleh superadmin.',
        ];
    }
}
