import AppLayout from '@/components/common/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { Bell, CheckCheck, Check } from 'lucide-react';

interface Notif {
    id: string;
    type: string;
    data: any;
    read_at: string | null;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notif[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const typeLabel: Record<string, string> = {
    disposisi_baru: 'Disposisi Baru',
    surat_keluar_menunggu_acc: 'Surat Keluar Menunggu ACC',
    surat_keluar_approved: 'Surat Keluar Disetujui',
    surat_keluar_rejected: 'Surat Keluar Ditolak',
    helpdesk_baru: 'Tiket Helpdesk Baru',
    helpdesk_progress: 'Update Helpdesk',
    user_pending_approval: 'User Baru Mendaftar',
};

export default function NotificationsIndex({ notifications }: Props) {
    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Notifikasi</h1>
                    <p className="text-sm text-muted-foreground">Total: {notifications.total}</p>
                </div>
                <Button variant="outline" onClick={() => router.post('/notifications/read-all')}>
                    <CheckCheck className="icon-nav" />
                    Tandai Semua Dibaca
                </Button>
            </div>

            {notifications.data.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <Bell className="mx-auto mb-2 h-8 w-8" />
                        Belum ada notifikasi.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.data.map((n) => {
                        const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                        const isRead = n.read_at !== null;
                        return (
                            <Card key={n.id} className={isRead ? 'opacity-60' : 'border-primary'}>
                                <CardContent className="flex items-start justify-between gap-4 p-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {typeLabel[n.type] ?? n.type}
                                            </span>
                                            {!isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                        <p className="mt-1 font-medium">{data?.perihal ?? data?.kode_tiket ?? 'Notifikasi'}</p>
                                        <p className="text-sm text-muted-foreground">{data?.isi ?? data?.komentar ?? ''}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                    {!isRead && (
                                        <Button size="sm" variant="ghost" onClick={() => router.post(`/notifications/${n.id}/read`)}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </AppLayout>
    );
}
