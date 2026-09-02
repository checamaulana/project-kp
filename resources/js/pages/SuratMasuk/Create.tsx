import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface Props {
    indeksOptions: Array<{ id: number; kode: string; nama: string }>;
    units: Array<{ id: number; nama: string; kode: string }>;
}

export default function SuratMasukCreate({ indeksOptions, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tanggal_terima: new Date().toISOString().split('T')[0],
        tanggal_surat: '',
        nomor_surat: '',
        pengirim: '',
        perihal: '',
        keterangan: '',
        indeks_id: '',
        unit_penerima_id: '',
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/surat-masuk', { forceFormData: true });
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/surat-masuk" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Tambah Surat Masuk</h1>
            </div>

            <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-lg border bg-card p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="tanggal_terima">Tanggal Terima *</Label>
                        <Input
                            id="tanggal_terima"
                            type="date"
                            value={data.tanggal_terima}
                            onChange={(e) => setData('tanggal_terima', e.target.value)}
                            required
                        />
                        {errors.tanggal_terima && <p className="text-sm text-destructive">{errors.tanggal_terima}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tanggal_surat">Tanggal Surat *</Label>
                        <Input
                            id="tanggal_surat"
                            type="date"
                            value={data.tanggal_surat}
                            onChange={(e) => setData('tanggal_surat', e.target.value)}
                            required
                        />
                        {errors.tanggal_surat && <p className="text-sm text-destructive">{errors.tanggal_surat}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nomor_surat">Nomor Surat *</Label>
                    <Input id="nomor_surat" value={data.nomor_surat} onChange={(e) => setData('nomor_surat', e.target.value)} required />
                    {errors.nomor_surat && <p className="text-sm text-destructive">{errors.nomor_surat}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pengirim">Pengirim *</Label>
                    <Input id="pengirim" value={data.pengirim} onChange={(e) => setData('pengirim', e.target.value)} required />
                    {errors.pengirim && <p className="text-sm text-destructive">{errors.pengirim}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="perihal">Perihal *</Label>
                    <Input id="perihal" value={data.perihal} onChange={(e) => setData('perihal', e.target.value)} required />
                    {errors.perihal && <p className="text-sm text-destructive">{errors.perihal}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Textarea id="keterangan" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={3} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Indeks</Label>
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
                    <div className="space-y-2">
                        <Label>Unit Penerima *</Label>
                        <Select value={data.unit_penerima_id} onValueChange={(v) => setData('unit_penerima_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.unit_penerima_id && <p className="text-sm text-destructive">{errors.unit_penerima_id}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="file">File Surat (PDF/JPG/PNG, max 10MB) *</Label>
                    <Input
                        id="file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                        required
                    />
                    {errors.file && <p className="text-sm text-destructive">{errors.file}</p>}
                </div>

                <div className="flex justify-end gap-2">
                    <ButtonLink href="/surat-masuk" variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Save className="icon-nav" />
                        Simpan
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
