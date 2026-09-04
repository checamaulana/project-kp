<?php

namespace App\Http\Requests;

use App\Models\Indeks;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SuratKeluarUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $indeks = $this->input('indeks_id') ? Indeks::find($this->input('indeks_id')) : null;
        $isSuratTugas = $indeks?->kode === 'ST';

        $rules = [
            'kode_surat_id' => ['required', 'exists:kode_surats,id'],
            'indeks_id' => ['required', 'exists:indeks,id'],
            'unit_pembuat_id' => ['required', 'exists:units,id'],
            'tanggal_surat' => ['required', 'date'],
            'kepada' => ['required', 'string', 'max:255'],
            'perihal' => ['required', 'string', 'max:255'],
            'penanda_tangan' => ['required', 'string', 'max:255'],
            'tembusan' => ['nullable', 'string', 'max:1000'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];

        if ($isSuratTugas) {
            $rules['kode_turunan'] = ['required', Rule::in(['KP', 'KM'])];
            $rules['tanggal_mulai_penugasan'] = ['required', 'date'];
            $rules['tanggal_selesai_penugasan'] = ['required', 'date', 'after_or_equal:tanggal_mulai_penugasan'];
        } else {
            $rules['kode_turunan'] = ['nullable'];
            $rules['tanggal_mulai_penugasan'] = ['nullable', 'date'];
            $rules['tanggal_selesai_penugasan'] = ['nullable', 'date'];
        }

        return $rules;
    }
}
