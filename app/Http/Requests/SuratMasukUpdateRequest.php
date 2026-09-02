<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SuratMasukUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tanggal_terima' => ['required', 'date'],
            'tanggal_surat' => ['required', 'date', 'before_or_equal:tanggal_terima'],
            'nomor_surat' => ['required', 'string', 'max:100'],
            'pengirim' => ['required', 'string', 'max:255'],
            'perihal' => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'indeks_id' => ['nullable', 'exists:indeks,id'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal_surat.before_or_equal' => 'Tanggal surat tidak boleh setelah tanggal terima.',
            'file.mimes' => 'File harus berformat PDF, JPG, atau PNG.',
            'file.max' => 'Ukuran file maksimal 10MB.',
        ];
    }
}
