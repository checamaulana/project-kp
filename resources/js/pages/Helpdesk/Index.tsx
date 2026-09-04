import { router } from '@inertiajs/react';
import { Plus, Eye, AlertCircle, Clock, CheckCircle, Wrench, Paperclip } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination } from '@/components/common/Pagination';
import { StatCard } from '@/components/common/StatCard';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, create, show } from '@/routes/helpdesk';

interface Ticket {
    id: number;
    kode_tiket: string;
    nama_pelapor: string;
    kategori: 'hardware' | 'jaringan' | 'aplikasi_simrs' | 'lainnya';
    jenis_permintaan: 'perbaikan' | 'konsultasi' | 'instalasi_baru';
    deskripsi: string;
    status: 'baru' | 'diproses' | 'selesai' | 'ditutup';
    created_at: string;
    unit: { nama: string };
    handler: { name: string } | null;
    lampiran: Array<{ name: string; path: string }> | null;
}

interface Props {
    tickets: {
        data: Ticket[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search?: string; status?: string; kategori?: string; per_page?: number };
    counts: { baru: number; diproses: number; selesai: number; ditutup: number };
}

const statusColor: Record<string, string> = {
    baru: 'bg-red-100 text-red-800',
    diproses: 'bg-yellow-100 text-yellow-800',
    selesai: 'bg-green-100 text-green-800',
    ditutup: 'bg-gray-100 text-gray-800',
};

const kategoriLabel: Record<string, string> = {
    hardware: 'Hardware',
    jaringan: 'Jaringan',
    aplikasi_simrs: 'Aplikasi SIM-RS',
    lainnya: 'Lainnya',
};

export default function HelpdeskIndex({ tickets, filters, counts }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url(), { ...filters, search }, { preserveState: true });
    };

    return (
        <AppLayout>
            <PageHeader
                title="IT Helpdesk"
                description="Laporan & penanganan kendala IT RSGM"
                actions={
                    <ButtonLink href={create.url()}>
                        <Plus className="icon-nav" />
                        Lapor Kendala
                    </ButtonLink>
                }
            />

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Tiket Baru"
                    value={counts.baru}
                    icon={<AlertCircle className="icon-md" />}
                    accent="red"
                    sublabel="Menunggu diproses"
                />
                <StatCard label="Diproses" value={counts.diproses} icon={<Clock className="icon-md" />} accent="amber" sublabel="Sedang ditangani" />
                <StatCard
                    label="Selesai"
                    value={counts.selesai}
                    icon={<CheckCircle className="icon-md" />}
                    accent="green"
                    sublabel="Penanganan selesai"
                />
                <StatCard label="Total" value={tickets.total} icon={<Wrench className="icon-md" />} accent="blue" sublabel="Keseluruhan tiket" />
            </div>

            <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
                <Input
                    type="search"
                    placeholder="Cari tiket / pelapor / deskripsi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select
                    value={filters.status ?? 'all'}
                    onValueChange={(v: string | null) => router.get(index.url(), { ...filters, status: v === 'all' ? undefined : (v ?? undefined) })}
                >
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="baru">Baru</SelectItem>
                        <SelectItem value="diproses">Diproses</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="ditutup">Ditutup</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filters.kategori ?? 'all'}
                    onValueChange={(v: string | null) =>
                        router.get(index.url(), { ...filters, kategori: v === 'all' ? undefined : (v ?? undefined) })
                    }
                >
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="jaringan">Jaringan</SelectItem>
                        <SelectItem value="aplikasi_simrs">Aplikasi SIM-RS</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit" variant="secondary">
                    Filter
                </Button>
            </form>

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left">Tiket</th>
                                <th className="p-3 text-left">Unit</th>
                                <th className="p-3 text-left">Kategori</th>
                                <th className="p-3 text-left">Permintaan</th>
                                <th className="p-3 text-left">Lampiran</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        Belum ada tiket.
                                    </td>
                                </tr>
                            ) : (
                                tickets.data.map((t) => (
                                    <tr key={t.id} className="border-t">
                                        <td className="p-3 font-mono font-medium">{t.kode_tiket}</td>
                                        <td className="p-3">{t.unit?.nama ?? '-'}</td>
                                        <td className="p-3 text-xs">{kategoriLabel[t.kategori]}</td>
                                        <td className="p-3 text-xs capitalize">{t.jenis_permintaan.replace('_', ' ')}</td>
                                        <td className="p-3">
                                            {t.lampiran && t.lampiran.length > 0 ? (
                                                <Paperclip className="h-4 w-4 text-blue-600" />
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className={`rounded px-2 py-1 text-xs font-medium ${statusColor[t.status]}`}>{t.status}</span>
                                        </td>
                                        <td className="p-3">
                                            <ButtonLink href={show({ helpdesk: t.id }).url} size="icon" variant="ghost" title="Lihat">
                                                <Eye className="icon-nav" />
                                            </ButtonLink>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={tickets.links} total={tickets.total} itemLabel="tiket" />
        </AppLayout>
    );
}
