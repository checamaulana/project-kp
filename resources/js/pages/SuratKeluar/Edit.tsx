import { useForm } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { show, update } from '@/routes/surat-keluar';

interface SuratKeluar {
    id: number;
    kode_surat_id: number;
    unit_pembuat_id: number;
    indeks_id: number;
    kode_turunan: string | null;
    tanggal_surat: string;
    kepada: string;
    perihal: string;
    penanda_tangan: string;
    tembusan: string | null;
    keterangan: string | null;
    tanggal_mulai_penugasan: string | null;
    tanggal_selesai_penugasan: string | null;
}

interface Props {
    surat: SuratKeluar;
    kodeSuratOptions: Array<{ id: number; kode: string; keterangan: string | null }>;
    indeksOptions: Array<{ id: number; kode: string; nama: string; kode_turunan: string[] | null }>;
    units: Array<{ id: number; nama: string; kode: string }>;
}

export default function SuratKeluarEdit({ surat, kodeSuratOptions, indeksOptions, units }: Props) {
    const { data, setData, post, processing } = useForm({
        _method: 'put' as const,
        kode_surat_id: String(surat.kode_surat_id),
        unit_pembuat_id: String(surat.unit_pembuat_id),
        indeks_id: String(surat.indeks_id),
        kode_turunan: surat.kode_turunan ?? '',
        tanggal_surat: surat.tanggal_surat,
        kepada: surat.kepada,
        perihal: surat.perihal,
        penanda_tangan: surat.penanda_tangan,
        tembusan: surat.tembusan ?? '',
        keterangan: surat.keterangan ?? '',
        tanggal_mulai_penugasan: surat.tanggal_mulai_penugasan ?? '',
        tanggal_selesai_penugasan: surat.tanggal_selesai_penugasan ?? '',
        file: null as File | null,
    });

    const selectedIndeks = indeksOptions.find((i) => String(i.id) === data.indeks_id);
    const isST = selectedIndeks?.kode === 'ST';

    useEffect(() => {
        if (!isST && data.kode_turunan) {
            setData('kode_turunan', '');
        }
    }, [data.indeks_id, data.kode_turunan, isST, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update({ surat_keluar: surat.id }).url, { forceFormData: true });
    };

    return (
        <AppLayout>
            <PageHeader
                title="Edit Surat Keluar"
                description={`Revisi draf surat kepada ${surat.kepada}`}
                breadcrumb={[{ label: 'Surat Keluar', href: show({ surat_keluar: surat.id }).url }, { label: 'Edit' }]}
            />

            <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-lg border bg-card p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Kode Surat</Label>
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
                        <Label>Unit</Label>
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
                        <Label>Indeks</Label>
                        <Select value={data.indeks_id} onValueChange={(v) => setData('indeks_id', v)}>
                            <SelectTrigger>
                                <SelectValue />
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

                {isST && selectedIndeks?.kode_turunan && (
                    <div className="grid grid-cols-1 gap-4 rounded-md border bg-muted/30 p-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Kode Turunan (ST)</Label>
                            <Select value={data.kode_turunan} onValueChange={(v) => setData('kode_turunan', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedIndeks.kode_turunan.map((kt) => (
                                        <SelectItem key={kt} value={kt}>
                                            {kt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Mulai</Label>
                            <Input
                                type="date"
                                value={data.tanggal_mulai_penugasan}
                                onChange={(e) => setData('tanggal_mulai_penugasan', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tanggal Selesai</Label>
                            <Input
                                type="date"
                                value={data.tanggal_selesai_penugasan}
                                onChange={(e) => setData('tanggal_selesai_penugasan', e.target.value)}
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
                    <Label>File Lampiran (opsional, replace)</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                </div>

                <div className="flex justify-end gap-2">
                    <ButtonLink href={show({ surat_keluar: surat.id }).url} variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Save className="icon-nav" />
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
