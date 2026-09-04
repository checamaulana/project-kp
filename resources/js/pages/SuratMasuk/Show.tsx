import { useForm } from '@inertiajs/react';
import { Download, Printer, Archive, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonAnchor } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatTanggal } from '@/lib/format';
import { store as storeDisposisi } from '@/routes/disposisi';
import { cetakDisposisi, download, index } from '@/routes/surat-masuk';

interface UserOption {
    id: number;
    name: string;
    unit_id: number;
}

interface DisposisiItem {
    id: number;
    dari_user_id: number;
    kepada_user_id: number | null;
    kepada_unit_id: number | null;
    isi: string;
    aksi: 'di_disposisi' | 'di_arsipkan';
    status: 'pending' | 'selesai';
    created_at: string;
    dari_user: { id: number; name: string } | null;
    kepada_user: { id: number; name: string } | null;
    kepada_unit: { id: number; nama: string } | null;
}

interface Props {
    surat: {
        id: number;
        no_urut: number;
        tahun: number;
        tanggal_terima: string;
        tanggal_surat: string;
        nomor_surat: string;
        pengirim: string;
        perihal: string;
        keterangan: string | null;
        file_path: string;
        file_name: string;
        status: 'aktif' | 'on_route' | 'selesai';
        indeks: { id: number; kode: string; nama: string } | null;
        unit_penerima: { id: number; nama: string; kode: string } | null;
        creator: { id: number; name: string } | null;
        disposisis: DisposisiItem[];
    };
    users: UserOption[];
    units: Array<{ id: number; nama: string; kode: string }>;
}

export default function SuratMasukShow({ surat, users, units }: Props) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        aksi: 'di_disposisi' as 'di_disposisi' | 'di_arsipkan',
        kepada_user_id: '',
        kepada_unit_id: '',
        isi: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(storeDisposisi({ suratMasuk: surat.id }).url, {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AppLayout>
            <PageHeader
                title={`Surat Masuk #${surat.no_urut}/${surat.tahun}`}
                description={`${surat.pengirim} - ${surat.perihal}`}
                breadcrumb={[{ label: 'Surat Masuk', href: index.url() }, { label: `#${surat.no_urut}/${surat.tahun}` }]}
                actions={
                    <>
                        <ButtonAnchor href={download({ suratMasuk: surat.id }).url} variant="outline">
                            <Download className="icon-nav" />
                            Download
                        </ButtonAnchor>
                        <ButtonAnchor href={cetakDisposisi({ suratMasuk: surat.id }).url} target="_blank">
                            <Printer className="icon-nav" />
                            Cetak Disposisi
                        </ButtonAnchor>
                    </>
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Surat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-muted-foreground">Tanggal Terima:</span> {formatTanggal(surat.tanggal_terima)}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Tanggal Surat:</span> {formatTanggal(surat.tanggal_surat)}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Nomor Surat:</span> {surat.nomor_surat}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Pengirim:</span> {surat.pengirim}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Indeks:</span>{' '}
                                    {surat.indeks ? `${surat.indeks.kode} - ${surat.indeks.nama}` : '-'}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Unit:</span> {surat.unit_penerima?.nama ?? '-'}
                                </div>
                            </div>
                            <div className="pt-2">
                                <span className="text-muted-foreground">Perihal:</span>
                                <p className="font-medium">{surat.perihal}</p>
                            </div>
                            {surat.keterangan && (
                                <div>
                                    <span className="text-muted-foreground">Keterangan:</span>
                                    <p>{surat.keterangan}</p>
                                </div>
                            )}
                            <div className="pt-2 text-xs text-muted-foreground">
                                Dibuat oleh: {surat.creator?.name} • File: {surat.file_name}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Timeline Disposisi</CardTitle>
                            <Button size="sm" onClick={() => setShowForm(!showForm)}>
                                {showForm ? 'Tutup' : '+ Buat Disposisi'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {showForm && (
                                <form onSubmit={submit} className="mb-4 space-y-3 rounded-md border bg-muted/30 p-4">
                                    <div className="space-y-2">
                                        <Label>Aksi *</Label>
                                        <Select value={data.aksi} onValueChange={(v) => setData('aksi', v as 'di_disposisi' | 'di_arsipkan')}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="di_disposisi">Di Disposisi</SelectItem>
                                                <SelectItem value="di_arsipkan">Di Arsipkan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {data.aksi === 'di_disposisi' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <Label>Kepada User</Label>
                                                <Select value={data.kepada_user_id} onValueChange={(v) => setData('kepada_user_id', v)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih user" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {users.map((u) => (
                                                            <SelectItem key={u.id} value={String(u.id)}>
                                                                {u.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Atau kepada Unit</Label>
                                                <Select value={data.kepada_unit_id} onValueChange={(v) => setData('kepada_unit_id', v)}>
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
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label>Isi Disposisi *</Label>
                                        <Textarea value={data.isi} onChange={(e) => setData('isi', e.target.value)} rows={3} required />
                                        {errors.isi && <p className="text-sm text-destructive">{errors.isi}</p>}
                                        {(errors.kepada_user_id || errors.kepada_unit_id) && (
                                            <p className="text-sm text-destructive">{errors.kepada_user_id ?? errors.kepada_unit_id}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {processing && <Loader2 className="icon-nav animate-spin" />}
                                            Simpan
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {surat.disposisis.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada disposisi.</p>
                            ) : (
                                <div className="space-y-3">
                                    {surat.disposisis.map((d, idx) => (
                                        <div key={d.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`rounded-full p-2 ${d.aksi === 'di_disposisi' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {d.aksi === 'di_disposisi' ? <Mail className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                                                </div>
                                                {idx < surat.disposisis.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                                            </div>
                                            <div className="flex-1 pb-3">
                                                <div className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString('id-ID')}</div>
                                                <div className="font-medium">
                                                    Dari: {d.dari_user?.name ?? '-'}
                                                    {d.kepada_user && ` → Kepada: ${d.kepada_user.name}`}
                                                    {d.kepada_unit && ` → Unit: ${d.kepada_unit.nama}`}
                                                </div>
                                                <div className="mt-1 text-sm">{d.isi}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Status:</span>{' '}
                                <span
                                    className={`rounded px-2 py-1 text-xs font-medium ${
                                        surat.status === 'selesai'
                                            ? 'bg-green-100 text-green-800'
                                            : surat.status === 'on_route'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
                                    {surat.status === 'selesai' ? 'Selesai' : surat.status === 'on_route' ? 'Dalam Disposisi' : 'Aktif'}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
