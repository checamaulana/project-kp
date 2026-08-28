<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDisposisiRequest extends FormRequest
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
            'ke_unit_id' => ['required', 'exists:units,id'],
            'ke_user_id' => ['nullable', 'exists:users,id'],
            'instruksi' => ['required', 'string'],
            'status' => ['required', 'in:menunggu,diproses,selesai,ditolak'],
            'catatan' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ke_unit_id.required' => 'Unit tujuan wajib dipilih.',
            'instruksi.required' => 'Instruksi disposisi wajib diisi.',
            'status.required' => 'Status disposisi wajib dipilih.',
        ];
    }
}
