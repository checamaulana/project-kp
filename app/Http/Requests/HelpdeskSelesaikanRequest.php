<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HelpdeskSelesaikanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tindak_lanjut' => ['required', 'string', 'min:5', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'tindak_lanjut.required' => 'Tindak lanjut wajib diisi.',
            'tindak_lanjut.min' => 'Tindak lanjut minimal 5 karakter.',
        ];
    }
}
