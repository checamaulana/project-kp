import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink, ButtonAnchor } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Eye, Printer, Send, Check, X, Clock } from 'lucide-react';
import { useState } from 'react';

interface SuratKeluarItem {
    id: number;
    no_urut: number;
    tanggal_surat: string;
    nomor_surat: string;
    kepada: string;
    perihal: string;
    status: 'draft' | 'menunggu_acc' | 'disetujui' | 'ditolak';
    kodeSurat: { kode: string } | null;
    indeks: { kode: string; nama: string } | null;
    unitPembuat: { nama: string };
    createdBy: { name: string };
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
    filters: { search?: string; status?: string; per_page?: number };
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/surat-keluar', { ...filters, search }, { preserveState: true });
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Surat Keluar</h1>
                    <p className="text-sm text-muted-foreground">
                        Tahun aktif: {activeYear} • {pendingCount} menunggu ACC Rektor
                    </p>
                </div>
                <ButtonLink href="/surat-keluar/create">
                    <Plus className="icon-nav" />
                    Buat Surat
                </ButtonLink>
            </div>

            <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
                <Input
                    type="search"
                    placeholder="Cari nomor / kepada / perihal..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => router.get('/surat-keluar', { ...filters, status: e.target.value || undefined })}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="draft">Draft</option>
                    <option value="menunggu_acc">Menunggu ACC</option>
                    <option value="disetujui">Disetujui</option>
                    <option value="ditolak">Ditolak</option>
                </select>
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
                                            <td className="p-3">{s.tanggal_surat}</td>
                                            <td className="p-3 font-mono text-xs">{s.nomor_surat}</td>
                                            <td className="p-3">{s.kepada}</td>
                                            <td className="p-3">{s.perihal}</td>
                                            <td className="p-3">
                                                <span className={`rounded px-2 py-1 text-xs font-medium ${sb.color}`}>{sb.label}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-1">
                                                    <ButtonLink href={`/surat-keluar/${s.id}`} size="icon" variant="ghost" title="Lihat">
                                                        <Eye className="icon-nav" />
                                                    </ButtonLink>
                                                    {s.status === 'disetujui' && (
                                                        <ButtonAnchor href={`/surat-keluar/${s.id}/cetak`} size="icon" variant="ghost" title="Cetak PDF" target="_blank">
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

            {suratKeluars.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total: {suratKeluars.total} surat</p>
                    <div className="flex gap-1">
                        {suratKeluars.links.map((link, i) =>
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
