<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'nomor_surat' => ['nullable', 'string', 'max:255'],
            'jenis_surat' => ['required', 'in:external,internal,penawaran,pengadaan'],
            'tipe' => ['required', 'in:masuk,keluar'],
            'indeks' => ['nullable', 'string', 'max:255'],
            'perihal' => ['required', 'string', 'max:255'],
            'asal_surat' => ['nullable', 'string', 'max:255'],
            'tujuan_surat' => ['nullable', 'string', 'max:255'],
            'tanggal_surat' => ['nullable', 'date'],
            'tanggal_diterima' => ['nullable', 'date'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'file_surat' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'keterangan' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'jenis_surat.required' => 'Jenis surat wajib dipilih.',
            'tipe.required' => 'Tipe surat wajib dipilih.',
            'perihal.required' => 'Perihal surat wajib diisi.',
            'file_surat.mimes' => 'File surat harus berupa PDF, JPG, JPEG, atau PNG.',
            'file_surat.max' => 'Ukuran file surat maksimal 10 MB.',
        ];
    }
}
