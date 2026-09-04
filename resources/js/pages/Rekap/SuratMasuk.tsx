import { router } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination, type PaginationLink } from '@/components/common/Pagination';
import { Button, ButtonAnchor } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTanggal } from '@/lib/format';
import { suratMasuk } from '@/routes/rekap';
import { exportMethod as exportSuratMasuk } from '@/routes/rekap/surat-masuk';

interface SuratMasukRow {
    id: number;
    no_urut: number;
    tanggal_terima: string;
    pengirim: string;
    nomor_surat: string;
    perihal: string;
    unit_penerima: { nama: string } | null;
}

interface Props {
    data: {
        data: SuratMasukRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: PaginationLink[];
    };
    filters: { tahun?: number; per_page?: number };
}

export default function RekapSuratMasuk({ data, filters }: Props) {
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        router.get(
            suratMasuk.url(),
            {
                tahun: fd.get('tahun'),
                per_page: filters.per_page,
            },
            { preserveState: true },
        );
    };

    return (
        <AppLayout>
            <PageHeader
                title="Rekap Surat Masuk"
                description={`Total: ${data.total} surat`}
                actions={
                    <ButtonAnchor href={`${exportSuratMasuk.url()}?tahun=${filters.tahun ?? ''}`}>
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
                                <th className="p-3 text-left">Tgl Terima</th>
                                <th className="p-3 text-left">Pengirim</th>
                                <th className="p-3 text-left">No Surat</th>
                                <th className="p-3 text-left">Perihal</th>
                                <th className="p-3 text-left">Unit</th>
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
                                        <td className="p-3">{formatTanggal(s.tanggal_terima)}</td>
                                        <td className="p-3 font-medium">{s.pengirim}</td>
                                        <td className="p-3">{s.nomor_surat}</td>
                                        <td className="p-3">{s.perihal}</td>
                                        <td className="p-3 text-xs">{s.unit_penerima?.nama ?? '-'}</td>
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
