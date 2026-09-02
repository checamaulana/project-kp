import AppLayout from '@/components/common/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { useState } from 'react';

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
    filters: any;
}

export default function AdminAuditLogs({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/audit-logs', { ...filters, search });
    };

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Audit Logs</h1>
                <p className="text-sm text-muted-foreground">Riwayat perubahan data sistem</p>
            </div>

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <Input
                    type="search"
                    placeholder="Cari aksi / model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Input
                    type="text"
                    name="action"
                    placeholder="Action (created/updated/deleted)"
                    defaultValue={filters.action}
                    className="max-w-[200px]"
                />
                <Input type="text" name="model_type" placeholder="Model" defaultValue={filters.model_type} className="max-w-[300px]" />
                <button type="submit" className="rounded-md bg-primary px-4 text-white">
                    Filter
                </button>
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
