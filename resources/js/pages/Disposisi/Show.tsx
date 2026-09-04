import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/disposisi';

interface DisposisiDetail {
    id: number;
    isi: string;
    aksi: 'di_disposisi' | 'di_arsipkan';
    status: 'pending' | 'selesai';
    dari_user: { name: string } | null;
    kepada_user: { name: string } | null;
    kepada_unit: { nama: string } | null;
}

interface Props {
    disposisi: DisposisiDetail;
}

export default function DisposisiShow({ disposisi }: Props) {
    return (
        <AppLayout>
            <PageHeader
                title="Rincian Disposisi"
                description={`Dari ${disposisi.dari_user?.name ?? '-'} • Status ${disposisi.status}`}
                breadcrumb={[{ label: 'Disposisi', href: index.url() }, { label: 'Rincian' }]}
            />
            <Card>
                <CardHeader>
                    <CardTitle>Disposisi</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Dari: {disposisi.dari_user?.name ?? '-'}</p>
                    <p>Kepada: {disposisi.kepada_user?.name ?? disposisi.kepada_unit?.nama ?? '-'}</p>
                    <p>Status: {disposisi.status}</p>
                    <p>Aksi: {disposisi.aksi}</p>
                    <p className="mt-3">{disposisi.isi}</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
