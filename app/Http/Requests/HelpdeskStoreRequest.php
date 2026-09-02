<?php

namespace App\Http\Requests;

use App\Enums\HelpdeskJenisPermintaanEnum;
use App\Enums\HelpdeskKategoriEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HelpdeskStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'nama_pelapor' => ['required', 'string', 'max:100'],
            'unit_id' => ['required', 'exists:units,id'],
            'kategori' => ['required', Rule::enum(HelpdeskKategoriEnum::class)],
            'jenis_permintaan' => ['required', Rule::enum(HelpdeskJenisPermintaanEnum::class)],
            'deskripsi' => ['required', 'string', 'min:5', 'max:2000'],
            'lampiran' => ['nullable', 'array', 'max:5'],
            'lampiran.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'deskripsi.required' => 'Deskripsi kendala wajib diisi.',
            'deskripsi.min' => 'Deskripsi minimal 5 karakter.',
            'lampiran.*.max' => 'Ukuran file maksimal 5MB per file.',
        ];
    }
}
