<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lembar Disposisi - {{ $surat->nomor_surat }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px; }
        .header h1 { margin: 0; font-size: 16px; }
        .header p { margin: 2px 0; font-size: 10px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .info-table th { text-align: left; padding: 4px 8px; background: #f0f0f0; width: 30%; }
        .info-table td { padding: 4px 8px; border-bottom: 1px solid #ddd; }
        .disposisi-title { background: #1E40AF; color: #fff; padding: 6px 10px; margin: 16px 0 8px; font-weight: bold; }
        table.disposisi { width: 100%; border-collapse: collapse; }
        table.disposisi th, table.disposisi td { border: 1px solid #000; padding: 6px; vertical-align: top; }
        table.disposisi th { background: #f0f0f0; text-align: left; }
        .footer { margin-top: 30px; text-align: right; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RSGM UNIVERSITAS MUHAMMADIYAH SEMARANG</h1>
        <p>Jl. Kedungmundu Raya No. 18, Semarang</p>
        <p>Telp. (024) 76740296 • Laman: rsgm.unimus.ac.id</p>
        <h2 style="margin-top:8px">LEMBAR DISPOSISI SURAT MASUK</h2>
    </div>

    <table class="info-table">
        <tr>
            <th>No. Surat</th>
            <td>{{ $surat->nomor_surat }}</td>
        </tr>
        <tr>
            <th>Tanggal Terima</th>
            <td>{{ \Carbon\Carbon::parse($surat->tanggal_terima)->format('d F Y') }}</td>
        </tr>
        <tr>
            <th>Tanggal Surat</th>
            <td>{{ \Carbon\Carbon::parse($surat->tanggal_surat)->format('d F Y') }}</td>
        </tr>
        <tr>
            <th>Pengirim</th>
            <td>{{ $surat->pengirim }}</td>
        </tr>
        <tr>
            <th>Perihal</th>
            <td><strong>{{ $surat->perihal }}</strong></td>
        </tr>
        @if($surat->keterangan)
        <tr>
            <th>Keterangan</th>
            <td>{{ $surat->keterangan }}</td>
        </tr>
        @endif
        <tr>
            <th>Indeks</th>
            <td>{{ $surat->indeks ? $surat->indeks->kode . ' - ' . $surat->indeks->nama : '-' }}</td>
        </tr>
        <tr>
            <th>Unit Penerima</th>
            <td>{{ $surat->unitPenerima->nama ?? '-' }}</td>
        </tr>
    </table>

    <div class="disposisi-title">RIWAYAT DISPOSISI</div>
    @if($surat->disposisis->count() > 0)
    <table class="disposisi">
        <thead>
            <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Tanggal</th>
                <th style="width: 20%">Dari</th>
                <th style="width: 20%">Kepada</th>
                <th style="width: 30%">Isi Disposisi</th>
                <th style="width: 10%">Tanda Tangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($surat->disposisis as $idx => $d)
            <tr>
                <td>{{ $idx + 1 }}</td>
                <td>{{ \Carbon\Carbon::parse($d->created_at)->format('d/m/Y H:i') }}</td>
                <td>{{ $d->dariUser->name ?? '-' }}</td>
                <td>
                    @if($d->kepadaUser)
                        {{ $d->kepadaUser->name }}
                    @elseif($d->kepadaUnit)
                        Unit: {{ $d->kepadaUnit->nama }}
                    @else
                        -
                    @endif
                </td>
                <td>
                    <strong>{{ ucfirst(str_replace('_', ' ', $d->aksi->value)) }}</strong><br>
                    {{ $d->isi }}
                </td>
                <td>{{ $idx + 1 }}........................</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <p style="text-align: center; padding: 20px;">Belum ada disposisi.</p>
    @endif

    <div class="footer">
        <p>Dicetak pada: {{ $tanggalCetak }}</p>
    </div>
</body>
</html>
