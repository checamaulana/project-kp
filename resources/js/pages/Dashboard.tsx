import AppLayout from '@/components/common/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { FileInput, FileOutput, Inbox, ClipboardList } from 'lucide-react';
import { User } from '@/types';

interface DashboardProps {
    stats: {
        surat_masuk: number;
        surat_keluar: number;
        disposisi_pending: number;
        pelayanan: number;
    };
}

const cards = [
    { key: 'surat_masuk', label: 'Surat Masuk', icon: FileInbox },
    { key: 'surat_keluar', label: 'Surat Keluar', icon: FileOutbox },
    { key: 'disposisi_pending', label: 'Disposisi Pending', icon: Inbox },
    { key: 'pelayanan', label: 'Pelayanan', icon: ClipboardList },
] as const;

export default function Dashboard({ stats }: DashboardProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    return (
        <AppLayout>
            <h1 className="mb-6 text-2xl font-bold">Selamat datang, {auth.user.name}</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Card key={c.key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats[c.key]}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </AppLayout>
    );
}
