import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { Plus, Eye, AlertCircle, Clock, CheckCircle, Wrench, Paperclip } from 'lucide-react';
import { useState } from 'react';

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
        router.get('/helpdesk', { ...filters, search }, { preserveState: true });
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">IT Helpdesk</h1>
                    <p className="text-sm text-muted-foreground">Laporan & penanganan kendala IT RSGM</p>
                </div>
                <ButtonLink href="/helpdesk/create">
                    <Plus className="icon-nav" />
                    Lapor Kendala
                </ButtonLink>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tiket Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-3xl font-bold text-red-600">
                            <AlertCircle className="h-6 w-6" />
                            {counts.baru}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Diproses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-3xl font-bold text-yellow-600">
                            <Clock className="h-6 w-6" />
                            {counts.diproses}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-3xl font-bold text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            {counts.selesai}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-3xl font-bold">
                            <Wrench className="h-6 w-6 text-blue-600" />
                            {tickets.total}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
                <Input
                    type="search"
                    placeholder="Cari tiket / pelapor / deskripsi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <select
                    value={filters.status ?? ''}
                    onChange={(e) => router.get('/helpdesk', { ...filters, status: e.target.value || undefined })}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="baru">Baru</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditutup">Ditutup</option>
                </select>
                <select
                    value={filters.kategori ?? ''}
                    onChange={(e) => router.get('/helpdesk', { ...filters, kategori: e.target.value || undefined })}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                    <option value="">Semua Kategori</option>
                    <option value="hardware">Hardware</option>
                    <option value="jaringan">Jaringan</option>
                    <option value="aplikasi_simrs">Aplikasi SIM-RS</option>
                    <option value="lainnya">Lainnya</option>
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
                                        <td className="p-3">{t.unit.nama}</td>
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
                                            <ButtonLink href={`/helpdesk/${t.id}`} size="icon" variant="ghost" title="Lihat">
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

            {tickets.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total: {tickets.total} tiket</p>
                    <div className="flex gap-1">
                        {tickets.links.map((link, i) =>
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
