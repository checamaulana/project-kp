<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Keluar - {{ $surat->nomor_surat }}</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; }
        .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 16pt; font-weight: bold; }
        .header p { margin: 2px 0; font-size: 11pt; }
        .kopsurat { display: flex; align-items: center; gap: 16px; }
        .logo { width: 80px; height: 80px; }
        .info { flex: 1; text-align: center; }
        table.meta { width: 100%; margin-bottom: 20px; }
        table.meta td { padding: 2px 4px; vertical-align: top; }
        table.meta td:first-child { width: 25%; }
        .perihal { margin: 20px 0; }
        .content { text-align: justify; min-height: 200px; }
        .signature { margin-top: 60px; text-align: right; width: 50%; margin-left: 50%; }
        .footer { margin-top: 40px; font-size: 10pt; }
    </style>
</head>
<body>
    <div class="header">
        <h1>RSGM UNIVERSITAS MUHAMMADIYAH SEMARANG</h1>
        <p>Jl. Kedungmundu Raya No. 18, Semarang</p>
        <p>Telp. (024) 76740296 • Laman: rsgm.unimus.ac.id</p>
    </div>

    <table class="meta">
        <tr>
            <td>Nomor</td>
            <td>: {{ $surat->nomor_surat }}</td>
        </tr>
        <tr>
            <td>Lampiran</td>
            <td>: {{ $surat->file_name ?? '-' }}</td>
        </tr>
        <tr>
            <td>Perihal</td>
            <td>: <strong>{{ $surat->perihal }}</strong></td>
        </tr>
        <tr>
            <td colspan="2" style="height: 20px;"></td>
        </tr>
        <tr>
            <td>Kepada</td>
            <td>:<br>{{ $surat->kepada }}</td>
        </tr>
    </table>

    <div class="content">
        <p>Dengan hormat,</p>
        <p>Sehubungan dengan {{ strtolower($surat->perihal) }}, dengan ini kami sampaikan hal-hal sebagai berikut:</p>
        <p>{{ $surat->keterangan ?? '[Isi surat ditulis di sini]' }}</p>
        <p>Demikian surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
    </div>

    <div class="signature">
        <p>Semarang, {{ \Carbon\Carbon::parse($surat->tanggal_surat)->format('d F Y') }}</p>
        <p>{{ $surat->penanda_tangan }}</p>
        <br><br><br><br>
        <p><strong><u>{{ $surat->approvedBy->name ?? $surat->penanda_tangan }}</u></strong></p>
        @if($surat->approvedBy)
        <p style="font-size: 10pt;">Disetujui: {{ \Carbon\Carbon::parse($surat->approved_at)->format('d/m/Y H:i') }}</p>
        @endif
    </div>

    @if($surat->tembusan)
    <div class="footer">
        <strong>Tembusan:</strong>
        <pre style="font-family: inherit; margin: 0;">{!! $surat->tembusan !!}</pre>
    </div>
    @endif
</body>
</html>
