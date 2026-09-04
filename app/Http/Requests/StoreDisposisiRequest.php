<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDisposisiRequest extends FormRequest
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
            'surat_id' => ['required', 'exists:surats,id'],
            'ke_unit_id' => ['required', 'exists:units,id'],
            'ke_user_id' => ['nullable', 'exists:users,id'],
            'instruksi' => ['required', 'string'],
            'tanggal_disposisi' => ['required', 'date'],
            'batas_waktu' => ['nullable', 'date', 'after_or_equal:tanggal_disposisi'],
            'catatan' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'surat_id.required' => 'Surat wajib dipilih.',
            'ke_unit_id.required' => 'Unit tujuan wajib dipilih.',
            'instruksi.required' => 'Instruksi disposisi wajib diisi.',
            'tanggal_disposisi.required' => 'Tanggal disposisi wajib diisi.',
            'batas_waktu.after_or_equal' => 'Batas waktu tidak boleh sebelum tanggal disposisi.',
        ];
    }
}
