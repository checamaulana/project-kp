import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface IndeksOption {
    id: number;
    kode: string;
    nama: string;
    kode_turunan: string[] | null;
}

interface Props {
    kodeSuratOptions: Array<{ id: number; kode: string; keterangan: string | null }>;
    indeksOptions: IndeksOption[];
    units: Array<{ id: number; nama: string; kode: string }>;
    userUnitId: number;
}

export default function SuratKeluarCreate({ kodeSuratOptions, indeksOptions, units, userUnitId }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kode_surat_id: kodeSuratOptions[0] ? String(kodeSuratOptions[0].id) : '',
        unit_pembuat_id: String(userUnitId),
        indeks_id: '',
        kode_turunan: '',
        tanggal_surat: new Date().toISOString().split('T')[0],
        kepada: '',
        perihal: '',
        penanda_tangan: '',
        tembusan: '',
        keterangan: '',
        tanggal_mulai_penugasan: '',
        tanggal_selesai_penugasan: '',
        file: null as File | null,
    });

    const [nomorPreview, setNomorPreview] = useState('');
    const [showSTFields, setShowSTFields] = useState(false);

    useEffect(() => {
        const selected = indeksOptions.find((i) => String(i.id) === data.indeks_id);
        setShowSTFields(selected?.kode === 'ST');
        if (selected?.kode !== 'ST') {
            setData('kode_turunan', '');
        }
    }, [data.indeks_id]);

    useEffect(() => {
        if (data.kode_surat_id && data.unit_pembuat_id && data.indeks_id) {
            const fd = new FormData();
            fd.append('kode_surat_id', data.kode_surat_id);
            fd.append('unit_pembuat_id', data.unit_pembuat_id);
            fd.append('indeks_id', data.indeks_id);
            if (data.kode_turunan) fd.append('kode_turunan', data.kode_turunan);
            fetch('/surat-keluar/preview-nomor', { method: 'POST', body: fd, headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then((r) => r.json())
                .then((d) => setNomorPreview(d.nomor_surat))
                .catch(() => setNomorPreview(''));
        } else {
            setNomorPreview('');
        }
    }, [data.kode_surat_id, data.unit_pembuat_id, data.indeks_id, data.kode_turunan]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/surat-keluar', { forceFormData: true });
    };

    const selectedIndeks = indeksOptions.find((i) => String(i.id) === data.indeks_id);

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/surat-keluar" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Buat Surat Keluar</h1>
            </div>

            <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-lg border bg-card p-6">
                {nomorPreview && (
                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm">
                        <div className="flex items-center gap-2 font-medium text-blue-900">
                            <Sparkles className="h-4 w-4" />
                            Preview Nomor Surat:
                        </div>
                        <div className="mt-1 font-mono text-blue-800">{nomorPreview}</div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Kode Surat *</Label>
                        <Select value={data.kode_surat_id} onValueChange={(v) => setData('kode_surat_id', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {kodeSuratOptions.map((k) => (
                                    <SelectItem key={k.id} value={String(k.id)}>
                                        {k.kode} - {k.keterangan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Unit Pembuat *</Label>
                        <Select value={data.unit_pembuat_id} onValueChange={(v) => setData('unit_pembuat_id', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Indeks *</Label>
                        <Select value={data.indeks_id} onValueChange={(v) => setData('indeks_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih indeks" />
                            </SelectTrigger>
                            <SelectContent>
                                {indeksOptions.map((i) => (
                                    <SelectItem key={i.id} value={String(i.id)}>
                                        {i.kode} - {i.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {showSTFields && selectedIndeks?.kode_turunan && (
                    <div className="grid grid-cols-1 gap-4 rounded-md border bg-muted/30 p-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Kode Turunan (Khusus ST) *</Label>
                            <Select value={data.kode_turunan} onValueChange={(v) => setData('kode_turunan', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedIndeks.kode_turunan.map((kt) => (
                                        <SelectItem key={kt} value={kt}>
                                            {kt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">KP=Keterangan Penugasan, KM=Keterangan Menghadiri</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Mulai Penugasan *</Label>
                            <Input
                                type="date"
                                value={data.tanggal_mulai_penugasan}
                                onChange={(e) => setData('tanggal_mulai_penugasan', e.target.value)}
                                required={showSTFields}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Selesai Penugasan *</Label>
                            <Input
                                type="date"
                                value={data.tanggal_selesai_penugasan}
                                onChange={(e) => setData('tanggal_selesai_penugasan', e.target.value)}
                                required={showSTFields}
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Tanggal Surat *</Label>
                        <Input type="date" value={data.tanggal_surat} onChange={(e) => setData('tanggal_surat', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Penanda Tangan *</Label>
                        <Input value={data.penanda_tangan} onChange={(e) => setData('penanda_tangan', e.target.value)} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Kepada *</Label>
                    <Input value={data.kepada} onChange={(e) => setData('kepada', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Perihal *</Label>
                    <Input value={data.perihal} onChange={(e) => setData('perihal', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Tembusan</Label>
                    <Textarea value={data.tembusan} onChange={(e) => setData('tembusan', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                    <Label>Keterangan</Label>
                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                    <Label>File Lampiran (opsional)</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                </div>

                <div className="flex justify-end gap-2">
                    <ButtonLink href="/surat-keluar" variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Save className="icon-nav" />
                        Simpan sebagai Draft
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
