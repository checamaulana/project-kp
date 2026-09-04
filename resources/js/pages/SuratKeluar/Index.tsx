import { router } from '@inertiajs/react';
import { Plus, Eye, Printer } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { Button, ButtonLink, ButtonAnchor } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTanggal } from '@/lib/format';
import { dashboard } from '@/routes';
import { cetak, create, index, show } from '@/routes/surat-keluar';

interface SuratKeluarItem {
    id: number;
    no_urut: number;
    tanggal_surat: string;
    nomor_surat: string;
    kepada: string;
    perihal: string;
    status: 'draft' | 'menunggu_acc' | 'disetujui' | 'ditolak';
    kode_surat: { kode: string } | null;
    indeks: { kode: string; nama: string } | null;
    unit_pembuat: { nama: string } | null;
    created_by: { name: string } | null;
}

interface Props {
    suratKeluars: {
        data: SuratKeluarItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string; status?: string; tanggal_mulai?: string; tanggal_selesai?: string; per_page?: number };
    pendingCount: number;
    activeYear: number;
}

const statusBadge: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    menunggu_acc: { label: 'Menunggu ACC', color: 'bg-yellow-100 text-yellow-800' },
    disetujui: { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
    ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
};

export default function SuratKeluarIndex({ suratKeluars, filters, pendingCount, activeYear }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [tanggalMulai, setTanggalMulai] = useState(filters.tanggal_mulai ?? '');
    const [tanggalSelesai, setTanggalSelesai] = useState(filters.tanggal_selesai ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index.url(),
            { ...filters, search, tanggal_mulai: tanggalMulai || undefined, tanggal_selesai: tanggalSelesai || undefined },
            { preserveState: true },
        );
    };

    return (
        <AppLayout>
            <PageHeader
                title="Surat Keluar"
                description={`Tahun aktif: ${activeYear} • ${pendingCount} menunggu ACC`}
                breadcrumb={[{ label: 'Beranda', href: dashboard.url() }, { label: 'Surat Keluar' }]}
                actions={
                    <ButtonLink href={create.url()}>
                        <Plus className="icon-nav" />
                        Buat Surat
                    </ButtonLink>
                }
            />

            <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
                <Input
                    type="search"
                    placeholder="Cari nomor / kepada / perihal..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select
                    value={filters.status ?? 'semua'}
                    onValueChange={(v: string | null) =>
                        router.get(index.url(), { ...filters, status: v === 'semua' ? undefined : (v ?? undefined) })
                    }
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="semua">Semua Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="menunggu_acc">Menunggu ACC</SelectItem>
                        <SelectItem value="disetujui">Disetujui</SelectItem>
                        <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                </Select>
                <Input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="max-w-[180px]" />
                <Input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} className="max-w-[180px]" />
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
                                <th className="p-3 text-left">Tanggal</th>
                                <th className="p-3 text-left">Nomor Surat</th>
                                <th className="p-3 text-left">Kepada</th>
                                <th className="p-3 text-left">Perihal</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suratKeluars.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        Belum ada surat keluar.
                                    </td>
                                </tr>
                            ) : (
                                suratKeluars.data.map((s) => {
                                    const sb = statusBadge[s.status];
                                    return (
                                        <tr key={s.id} className="border-t">
                                            <td className="p-3">{s.no_urut}</td>
                                            <td className="p-3">{formatTanggal(s.tanggal_surat)}</td>
                                            <td className="p-3 font-mono text-xs">{s.nomor_surat}</td>
                                            <td className="p-3">{s.kepada}</td>
                                            <td className="p-3">{s.perihal}</td>
                                            <td className="p-3">
                                                <span className={`rounded px-2 py-1 text-xs font-medium ${sb.color}`}>{sb.label}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-1">
                                                    <ButtonLink href={show({ surat_keluar: s.id }).url} size="icon" variant="ghost" title="Lihat">
                                                        <Eye className="icon-nav" />
                                                    </ButtonLink>
                                                    {s.status === 'disetujui' && (
                                                        <ButtonAnchor
                                                            href={cetak({ suratKeluar: s.id }).url}
                                                            size="icon"
                                                            variant="ghost"
                                                            title="Cetak PDF"
                                                            target="_blank"
                                                        >
                                                            <Printer className="icon-nav" />
                                                        </ButtonAnchor>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={suratKeluars.links} total={suratKeluars.total} itemLabel="surat" />
        </AppLayout>
    );
}
