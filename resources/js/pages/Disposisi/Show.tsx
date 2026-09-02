import AppLayout from '@/components/common/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';;

interface Props {
    disposisi: any;
}

export default function DisposisiShow({ disposisi }: Props) {
    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/disposisi" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Rincian Disposisi</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Disposisi</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Dari: {disposisi.dariUser?.name}</p>
                    <p>Kepada: {disposisi.kepadaUser?.name ?? disposisi.kepadaUnit?.nama}</p>
                    <p>Status: {disposisi.status}</p>
                    <p>Aksi: {disposisi.aksi}</p>
                    <p className="mt-3">{disposisi.isi}</p>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
