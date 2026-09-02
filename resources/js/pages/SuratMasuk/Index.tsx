import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink, ButtonAnchor } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Link, router, usePage } from '@inertiajs/react';
import { FileText, Plus, Edit, Trash2, Eye, Download, Printer } from 'lucide-react';
import { useState } from 'react';

interface SuratMasukItem {
    id: number;
    no_urut: number;
    tanggal_terima: string;
    tanggal_surat: string;
    nomor_surat: string;
    pengirim: string;
    perihal: string;
    status: string;
    unit_penerima: { id: number; nama: string; kode: string };
    creator: { id: number; name: string };
    indeks: { id: number; kode: string; nama: string } | null;
}

interface SuratMasukIndexProps {
    suratMasuks: {
        data: SuratMasukItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        tanggal_mulai?: string;
        tanggal_selesai?: string;
        per_page?: number;
    };
    units: Array<{ id: number; nama: string; kode: string }>;
    activeYear: number;
}

export default function SuratMasukIndex({ suratMasuks, filters, activeYear }: SuratMasukIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/surat-masuk', { ...filters, search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus surat ini? Data masuk Trash selama 30 hari.')) {
            router.delete(`/surat-masuk/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Surat Masuk</h1>
                    <p className="text-sm text-muted-foreground">Tahun aktif: {activeYear}</p>
                </div>
                <ButtonLink href="/surat-masuk/create">
                    <Plus className="icon-nav" />
                    Tambah Surat
                </ButtonLink>
            </div>

            <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
                <Input
                    type="search"
                    placeholder="Cari pengirim / perihal / nomor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Input type="date" name="tanggal_mulai" defaultValue={filters.tanggal_mulai} className="max-w-[180px]" />
                <Input type="date" name="tanggal_selesai" defaultValue={filters.tanggal_selesai} className="max-w-[180px]" />
                <Button type="submit" variant="secondary">
                    Filter
                </Button>
            </form>

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left">No</th>
                                <th className="p-3 text-left">Tgl Terima</th>
                                <th className="p-3 text-left">Pengirim</th>
                                <th className="p-3 text-left">No Surat</th>
                                <th className="p-3 text-left">Perihal</th>
                                <th className="p-3 text-left">Unit</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suratMasuks.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        Belum ada surat masuk untuk tahun {activeYear}.
                                    </td>
                                </tr>
                            ) : (
                                suratMasuks.data.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        <td className="p-3">{s.no_urut}</td>
                                        <td className="p-3">{s.tanggal_terima}</td>
                                        <td className="p-3 font-medium">{s.pengirim}</td>
                                        <td className="p-3">{s.nomor_surat}</td>
                                        <td className="p-3">{s.perihal}</td>
                                        <td className="p-3 text-xs">{s.unit_penerima?.nama}</td>
                                        <td className="p-3">
                                            <div className="flex gap-1">
                                                <ButtonLink href={`/surat-masuk/${s.id}`} size="icon" variant="ghost" title="Lihat">
                                                    <Eye className="icon-nav" />
                                                </ButtonLink>
                                                <ButtonLink href={`/surat-masuk/${s.id}/edit`} size="icon" variant="ghost" title="Edit">
                                                    <Edit className="icon-nav" />
                                                </ButtonLink>
                                                <ButtonAnchor href={`/surat-masuk/${s.id}/download`} size="icon" variant="ghost" title="Download">
                                                    <Download className="icon-nav" />
                                                </ButtonAnchor>
                                                <Button size="icon" variant="ghost" title="Hapus" onClick={() => handleDelete(s.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {suratMasuks.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total: {suratMasuks.total} surat</p>
                    <div className="flex gap-1">
                        {suratMasuks.links.map((link, i) =>
                            link.url ? (
                                <ButtonLink key={i} href={link.url} size="sm" variant={link.active ? 'default' : 'outline'}>
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </ButtonLink>
                            ) : (
                                <Button key={i} size="sm" variant={link.active ? 'default' : 'outline'} disabled>
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            )
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
