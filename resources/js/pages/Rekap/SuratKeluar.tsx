import { router } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination, type PaginationLink } from '@/components/common/Pagination';
import { Button, ButtonAnchor } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTanggal } from '@/lib/format';
import { suratKeluar } from '@/routes/rekap';
import { exportMethod as exportSuratKeluar } from '@/routes/rekap/surat-keluar';

interface SuratKeluarRow {
    id: number;
    no_urut: number;
    tanggal_surat: string;
    nomor_surat: string;
    kepada: string;
    perihal: string;
    status: 'draft' | 'menunggu_acc' | 'disetujui' | 'ditolak';
}

interface Props {
    data: {
        data: SuratKeluarRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: PaginationLink[];
    };
    filters: { tahun?: number; per_page?: number };
}

const STATUS_LABELS: Record<SuratKeluarRow['status'], string> = {
    draft: 'Draft',
    menunggu_acc: 'Menunggu ACC',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

export default function RekapSuratKeluar({ data, filters }: Props) {
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        router.get(suratKeluar.url(), { tahun: fd.get('tahun'), per_page: filters.per_page }, { preserveState: true });
    };

    return (
        <AppLayout>
            <PageHeader
                title="Rekap Surat Keluar"
                description={`Total: ${data.total} surat`}
                actions={
                    <ButtonAnchor href={`${exportSuratKeluar.url()}?tahun=${filters.tahun ?? ''}`}>
                        <FileSpreadsheet className="icon-nav" />
                        Export Excel
                    </ButtonAnchor>
                }
            />

            <form onSubmit={handleFilter} className="mb-4 flex gap-2">
                <Input type="number" name="tahun" placeholder="Tahun" defaultValue={filters.tahun} className="max-w-[150px]" />
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
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Tidak ada data.
                                    </td>
                                </tr>
                            ) : (
                                data.data.map((s) => (
                                    <tr key={s.id} className="border-t">
                                        <td className="p-3">{s.no_urut}</td>
                                        <td className="p-3">{formatTanggal(s.tanggal_surat)}</td>
                                        <td className="p-3 font-mono text-xs">{s.nomor_surat}</td>
                                        <td className="p-3">{s.kepada}</td>
                                        <td className="p-3">{s.perihal}</td>
                                        <td className="p-3">
                                            <span className="rounded bg-muted px-2 py-1 text-xs">{STATUS_LABELS[s.status] ?? s.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination links={data.links} total={data.total} itemLabel="surat" />
        </AppLayout>
    );
}
