<?php

namespace App\Http\Requests;

use App\Enums\AksiDisposisiEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DisposisiStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $aksi = $this->input('aksi');

        $rules = [
            'surat_masuk_id' => ['required', 'exists:surat_masuks,id'],
            'aksi' => ['required', Rule::enum(AksiDisposisiEnum::class)],
            'isi' => ['required', 'string', 'min:5', 'max:1000'],
        ];

        if ($aksi === AksiDisposisiEnum::DI_DISPOSISI->value) {
            $rules['kepada_user_id'] = ['required_without:kepada_unit_id', 'nullable', 'exists:users,id'];
            $rules['kepada_unit_id'] = ['required_without:kepada_user_id', 'nullable', 'exists:units,id'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'isi.required' => 'Isi disposisi wajib diisi.',
            'isi.min' => 'Isi disposisi minimal 5 karakter.',
            'kepada_user_id.required_without' => 'Pilih user atau unit tujuan disposisi.',
        ];
    }
}
