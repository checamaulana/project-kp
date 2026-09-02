import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Send, Paperclip } from 'lucide-react';
import { useState } from 'react';

interface Props {
    units: Array<{ id: number; nama: string; kode: string }>;
    defaultName: string;
    defaultUnitId: number;
}

export default function HelpdeskCreate({ units, defaultName, defaultUnitId }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nama_pelapor: defaultName,
        unit_id: String(defaultUnitId),
        kategori: '',
        jenis_permintaan: '',
        deskripsi: '',
        lampiran: [] as File[],
    });
    const [files, setFiles] = useState<File[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/helpdesk', { forceFormData: true });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files ?? []);
        const updated = [...files, ...newFiles].slice(0, 5);
        setFiles(updated);
        setData('lampiran', updated);
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/helpdesk" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Lapor Kendala IT</h1>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <div className="space-y-2">
                    <Label>Nama Pelapor *</Label>
                    <Input value={data.nama_pelapor} onChange={(e) => setData('nama_pelapor', e.target.value)} required />
                </div>

                <div className="space-y-2">
                    <Label>Unit / Bagian *</Label>
                    <Select value={data.unit_id} onValueChange={(v) => setData('unit_id', v)}>
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
                    {errors.unit_id && <p className="text-sm text-destructive">{errors.unit_id}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Kategori Kendala *</Label>
                    <Select value={data.kategori} onValueChange={(v) => setData('kategori', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="jaringan">Jaringan</SelectItem>
                            <SelectItem value="aplikasi_simrs">Aplikasi SIM-RS</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.kategori && <p className="text-sm text-destructive">{errors.kategori}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Permintaan *</Label>
                    <Select value={data.jenis_permintaan} onValueChange={(v) => setData('jenis_permintaan', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis permintaan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="perbaikan">Perbaikan</SelectItem>
                            <SelectItem value="konsultasi">Konsultasi</SelectItem>
                            <SelectItem value="instalasi_baru">Instalasi Baru</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.jenis_permintaan && <p className="text-sm text-destructive">{errors.jenis_permintaan}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Deskripsi Kendala *</Label>
                    <Textarea
                        value={data.deskripsi}
                        onChange={(e) => setData('deskripsi', e.target.value)}
                        placeholder="Jelaskan kendala yang dialami..."
                        rows={5}
                        required
                    />
                    {errors.deskripsi && <p className="text-sm text-destructive">{errors.deskripsi}</p>}
                </div>

                <div className="space-y-2">
                    <Label>File Pendukung (opsional, max 5 file, 5MB per file)</Label>
                    <div className="rounded-md border-2 border-dashed p-4 text-center">
                        <Input id="lampiran" type="file" accept=".jpg,.jpeg,.png,.pdf" multiple onChange={handleFileChange} className="hidden" />
                        <Label htmlFor="lampiran" className="cursor-pointer">
                            <Paperclip className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-1 text-sm">Seret file ke sini atau klik untuk upload</p>
                            <p className="text-xs text-muted-foreground">Format: JPEG, PNG, PDF. Maks 5MB per file.</p>
                        </Label>
                    </div>
                    {files.length > 0 && (
                        <ul className="space-y-1 text-sm">
                            {files.map((f, i) => (
                                <li key={i} className="flex items-center justify-between rounded bg-muted px-2 py-1">
                                    <span className="truncate">{f.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const u = files.filter((_, j) => j !== i);
                                            setFiles(u);
                                            setData('lampiran', u);
                                        }}
                                        className="text-xs text-destructive"
                                    >
                                        Hapus
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <ButtonLink href="/helpdesk" variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Send className="icon-nav" />
                        Kirim Laporan
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
