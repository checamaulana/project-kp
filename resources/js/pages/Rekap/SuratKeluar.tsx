import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonAnchor } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';

interface Props {
    data: {
        data: any[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { tahun?: number; per_page?: number };
}

export default function RekapSuratKeluar({ data, filters }: Props) {
    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        router.get('/rekap/surat-keluar', { tahun: fd.get('tahun'), per_page: filters.per_page }, { preserveState: true });
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Rekap Surat Keluar</h1>
                    <p className="text-sm text-muted-foreground">Total: {data.total} surat</p>
                </div>
                <ButtonAnchor href={`/rekap/surat-keluar/export?tahun=${filters.tahun ?? ''}`}>
                    <FileSpreadsheet className="icon-nav" />
                    Export Excel
                </ButtonAnchor>
            </div>

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
                                        <td className="p-3">{s.tanggal_surat}</td>
                                        <td className="p-3 font-mono text-xs">{s.nomor_surat}</td>
                                        <td className="p-3">{s.kepada}</td>
                                        <td className="p-3">{s.perihal}</td>
                                        <td className="p-3">
                                            <span className="rounded bg-muted px-2 py-1 text-xs">{s.status?.label}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
