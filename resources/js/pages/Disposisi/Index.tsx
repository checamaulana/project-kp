import { Eye, Inbox } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Pagination, type PaginationLink } from '@/components/common/Pagination';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { show } from '@/routes/surat-masuk';

interface DisposisiItem {
    id: number;
    aksi: 'di_disposisi' | 'di_arsipkan';
    status: 'pending' | 'selesai';
    created_at: string;
    surat_masuk: { id: number; nomor_surat: string; perihal: string; pengirim: string } | null;
    dari_user: { name: string } | null;
    kepada_user: { name: string } | null;
    kepada_unit: { nama: string } | null;
}

interface Props {
    disposisis: {
        data: DisposisiItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
}

export default function DisposisiIndex({ disposisis }: Props) {
    return (
        <AppLayout>
            <PageHeader
                title="Disposisi"
                description="Disposisi yang ditujukan kepada Anda"
                breadcrumb={[{ label: 'Beranda', href: dashboard.url() }, { label: 'Disposisi' }]}
            />

            {disposisis.data.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Inbox className="icon-md text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-foreground">Belum ada disposisi untuk Anda</p>
                        <p className="mt-1 text-xs text-muted-foreground">Disposisi baru akan muncul di sini</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {disposisis.data.map((d) => (
                        <Card key={d.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Inbox className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{d.surat_masuk?.perihal ?? '-'}</span>
                                        <span className="text-xs text-muted-foreground">({d.surat_masuk?.nomor_surat})</span>
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        Dari: {d.dari_user?.name ?? '-'} •{' '}
                                        {d.kepada_user ? `Kepada: ${d.kepada_user.name}` : `Unit: ${d.kepada_unit?.nama ?? '-'}`} •{' '}
                                        {new Date(d.created_at).toLocaleString('id-ID')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded px-2 py-1 text-xs font-medium ${d.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {d.status}
                                    </span>
                                    {d.surat_masuk && (
                                        <ButtonLink href={show({ surat_masuk: d.surat_masuk.id }).url} size="icon" variant="ghost" title="Lihat">
                                            <Eye className="icon-nav" />
                                        </ButtonLink>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Pagination links={disposisis.links} total={disposisis.total} itemLabel="disposisi" />
        </AppLayout>
    );
}
