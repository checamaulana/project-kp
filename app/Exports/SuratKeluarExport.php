<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SuratKeluarExport implements FromCollection, WithHeadings
{
    public function __construct(public Collection $data) {}

    public function collection(): Collection
    {
        return $this->data->map(fn ($item) => [
            'No Urut' => $item->no_urut,
            'Tanggal Surat' => $item->tanggal_surat?->format('d/m/Y'),
            'Nomor Surat' => $item->nomor_surat,
            'Kepada' => $item->kepada,
            'Perihal' => $item->perihal,
            'Indeks' => $item->indeks?->kode,
            'Unit Pembuat' => $item->unitPembuat?->nama,
            'Status' => $item->status?->label(),
            'Tgl ACC' => $item->approved_at?->format('d/m/Y'),
        ]);
    }

    public function headings(): array
    {
        return [
            'No Urut',
            'Tanggal Surat',
            'Nomor Surat',
            'Kepada',
            'Perihal',
            'Indeks',
            'Unit Pembuat',
            'Status',
            'Tgl ACC',
        ];
    }
}
