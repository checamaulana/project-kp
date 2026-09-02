<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SuratMasukExport implements FromCollection, WithHeadings
{
    public function __construct(public Collection $data) {}

    public function collection(): Collection
    {
        return $this->data->map(fn ($item) => [
            'No Urut' => $item->no_urut,
            'Tanggal Terima' => $item->tanggal_terima?->format('d/m/Y'),
            'Tanggal Surat' => $item->tanggal_surat?->format('d/m/Y'),
            'Nomor Surat' => $item->nomor_surat,
            'Pengirim' => $item->pengirim,
            'Perihal' => $item->perihal,
            'Indeks' => $item->indeks?->kode,
            'Unit' => $item->unitPenerima?->nama,
            'Status' => $item->status?->label(),
        ]);
    }

    public function headings(): array
    {
        return [
            'No Urut',
            'Tanggal Terima',
            'Tanggal Surat',
            'Nomor Surat',
            'Pengirim',
            'Perihal',
            'Indeks',
            'Unit',
            'Status',
        ];
    }
}
