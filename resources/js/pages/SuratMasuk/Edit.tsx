import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface Props {
    surat: {
        id: number;
        tanggal_terima: string;
        tanggal_surat: string;
        nomor_surat: string;
        pengirim: string;
        perihal: string;
        keterangan: string | null;
        indeks_id: number | null;
        unit_penerima_id: number;
    };
    indeksOptions: Array<{ id: number; kode: string; nama: string }>;
    units: Array<{ id: number; nama: string; kode: string }>;
}

export default function SuratMasukEdit({ surat, indeksOptions, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal_terima: surat.tanggal_terima,
        tanggal_surat: surat.tanggal_surat,
        nomor_surat: surat.nomor_surat,
        pengirim: surat.pengirim,
        perihal: surat.perihal,
        keterangan: surat.keterangan ?? '',
        indeks_id: surat.indeks_id ? String(surat.indeks_id) : '',
        unit_penerima_id: String(surat.unit_penerima_id),
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/surat-masuk/${surat.id}`, { forceFormData: true, _method: 'put' });
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href={`/surat-masuk/${surat.id}`} variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Edit Surat Masuk</h1>
            </div>

            <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-lg border bg-card p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="tanggal_terima">Tanggal Terima *</Label>
                        <Input id="tanggal_terima" type="date" value={data.tanggal_terima} onChange={(e) => setData('tanggal_terima', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tanggal_surat">Tanggal Surat *</Label>
                        <Input id="tanggal_surat" type="date" value={data.tanggal_surat} onChange={(e) => setData('tanggal_surat', e.target.value)} required />
                        {errors.tanggal_surat && <p className="text-sm text-destructive">{errors.tanggal_surat}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Nomor Surat *</Label>
                    <Input value={data.nomor_surat} onChange={(e) => setData('nomor_surat', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Pengirim *</Label>
                    <Input value={data.pengirim} onChange={(e) => setData('pengirim', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Perihal *</Label>
                    <Input value={data.perihal} onChange={(e) => setData('perihal', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Keterangan</Label>
                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Indeks</Label>
                        <Select value={data.indeks_id} onValueChange={(v) => setData('indeks_id', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih indeks" /></SelectTrigger>
                            <SelectContent>
                                {indeksOptions.map((i) => (
                                    <SelectItem key={i.id} value={String(i.id)}>{i.kode} - {i.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Unit *</Label>
                        <Select value={data.unit_penerima_id} onValueChange={(v) => setData('unit_penerima_id', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {units.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>{u.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>File Surat (opsional, replace)</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                    {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                </div>

                <div className="flex justify-end gap-2">
                    <ButtonLink href={`/surat-masuk/${surat.id}`} variant="outline">
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
