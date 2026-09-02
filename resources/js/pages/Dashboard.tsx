import AppLayout from '@/components/common/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { FileInput, FileOutput, Inbox, Wrench } from 'lucide-react';
import { User } from '@/types';

interface DashboardProps {
    stats: {
        surat_masuk: number;
        surat_keluar: number;
        disposisi_pending: number;
        helpdesk_baru: number;
    };
    recentSuratMasuk: Array<{
        id: number;
        no_urut: number;
        pengirim: string;
        perihal: string;
        tanggal_terima: string;
    }>;
    recentHelpdesk: Array<{
        id: number;
        kode_tiket: string;
        nama_pelapor: string;
        unit: { nama: string };
        status: string;
        created_at: string;
    }>;
    activeYear: number;
}

export default function Dashboard({ stats, recentSuratMasuk, recentHelpdesk, activeYear }: DashboardProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const cards = [
        { key: 'surat_masuk', label: 'Surat Masuk', icon: FileInput, color: 'text-blue-600' },
        { key: 'surat_keluar', label: 'Surat Keluar', icon: FileOutput, color: 'text-green-600' },
        { key: 'disposisi_pending', label: 'Disposisi Pending', icon: Inbox, color: 'text-yellow-600' },
        { key: 'helpdesk_baru', label: 'Tiket IT Baru', icon: Wrench, color: 'text-red-600' },
    ] as const;

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Selamat datang, {user.name}</h1>
                <p className="text-sm text-muted-foreground">
                    Unit: {user.unit?.nama ?? '-'} • Role: {user.role} • Tahun Aktif: {activeYear}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Card key={c.key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                                <Icon className={`h-4 w-4 ${c.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats[c.key]}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Surat Masuk Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentSuratMasuk.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada surat masuk.</p>
                        ) : (
                            <ul className="space-y-2">
                                {recentSuratMasuk.map((s) => (
                                    <li key={s.id} className="border-b pb-2 text-sm last:border-0">
                                        <div className="font-medium">{s.pengirim}</div>
                                        <div className="text-muted-foreground">{s.perihal}</div>
                                        <div className="text-xs text-muted-foreground">{s.tanggal_terima}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Tiket Helpdesk Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentHelpdesk.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada tiket helpdesk.</p>
                        ) : (
                            <ul className="space-y-2">
                                {recentHelpdesk.map((t) => (
                                    <li key={t.id} className="border-b pb-2 text-sm last:border-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">#{t.kode_tiket}</span>
                                            <span className="text-xs text-muted-foreground">{t.status}</span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            {t.nama_pelapor} • {t.unit?.nama}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
