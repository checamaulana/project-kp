import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Eye, Inbox } from 'lucide-react';

interface DisposisiItem {
    id: number;
    aksi: 'di_disposisi' | 'di_arsipkan';
    status: 'pending' | 'selesai';
    created_at: string;
    suratMasuk: { id: number; nomor_surat: string; perihal: string; pengirim: string } | null;
    dariUser: { name: string };
    kepadaUser: { name: string } | null;
    kepadaUnit: { nama: string } | null;
}

interface Props {
    disposisis: {
        data: DisposisiItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function DisposisiIndex({ disposisis }: Props) {
    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Disposisi</h1>
                <p className="text-sm text-muted-foreground">Disposisi yang ditujukan kepada Anda</p>
            </div>

            {disposisis.data.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">Belum ada disposisi untuk Anda.</CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {disposisis.data.map((d) => (
                        <Card key={d.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Inbox className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">{d.suratMasuk?.perihal ?? '-'}</span>
                                        <span className="text-xs text-muted-foreground">({d.suratMasuk?.nomor_surat})</span>
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        Dari: {d.dariUser.name} • {d.kepadaUser ? `Kepada: ${d.kepadaUser.name}` : `Unit: ${d.kepadaUnit?.nama}`} •{' '}
                                        {new Date(d.created_at).toLocaleString('id-ID')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded px-2 py-1 text-xs font-medium ${d.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {d.status}
                                    </span>
                                    {d.suratMasuk && (
                                        <ButtonLink href={`/surat-masuk/${d.suratMasuk.id}`} size="icon" variant="ghost" title="Lihat">
                                            <Eye className="icon-nav" />
                                        </ButtonLink>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
