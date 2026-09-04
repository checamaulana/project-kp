import { router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index } from '@/routes/admin/audit-logs';

interface Log {
    id: number;
    action: string;
    model_type: string;
    model_id: number | null;
    user: { name: string } | null;
    ip_address: string | null;
    created_at: string;
}

interface Props {
    logs: { data: Log[]; total: number };
    filters: { user_id?: string; model_type?: string; action?: string };
}

export default function AdminAuditLogs({ logs, filters }: Props) {
    const [userId, setUserId] = useState(filters.user_id ?? '');
    const [action, setAction] = useState(filters.action ?? '');
    const [modelType, setModelType] = useState(filters.model_type ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            index.url(),
            {
                user_id: userId || undefined,
                action: action || undefined,
                model_type: modelType || undefined,
            },
            { preserveState: true },
        );
    };

    return (
        <AppLayout>
            <PageHeader title="Audit Logs" description="Riwayat perubahan data sistem" />

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <Input type="number" placeholder="ID User" value={userId} onChange={(e) => setUserId(e.target.value)} className="max-w-[150px]" />
                <Input
                    type="text"
                    placeholder="Action (created/updated/deleted)"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="max-w-[200px]"
                />
                <Input type="text" placeholder="Model" value={modelType} onChange={(e) => setModelType(e.target.value)} className="max-w-[300px]" />
                <Button type="submit">Filter</Button>
            </form>

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left">Waktu</th>
                                <th className="p-3 text-left">User</th>
                                <th className="p-3 text-left">Action</th>
                                <th className="p-3 text-left">Model</th>
                                <th className="p-3 text-left">IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        Tidak ada log.
                                    </td>
                                </tr>
                            ) : (
                                logs.data.map((l) => (
                                    <tr key={l.id} className="border-t">
                                        <td className="p-3 text-xs">{new Date(l.created_at).toLocaleString('id-ID')}</td>
                                        <td className="p-3">{l.user?.name ?? '-'}</td>
                                        <td className="p-3">
                                            <span className="rounded bg-muted px-2 py-0.5 text-xs">{l.action}</span>
                                        </td>
                                        <td className="p-3 text-xs">
                                            {l.model_type.split('\\').pop()}
                                            {l.model_id ? ` #${l.model_id}` : ''}
                                        </td>
                                        <td className="p-3 text-xs">{l.ip_address ?? '-'}</td>
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
