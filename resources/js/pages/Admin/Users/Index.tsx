import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    status: 'pending' | 'active' | 'rejected';
    unit: { nama: string; kode: string } | null;
}

interface Props {
    users: { data: UserItem[]; current_page: number; last_page: number; total: number };
    filters: { search?: string };
    pendingCount: number;
}

const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const roleLabel: Record<string, string> = {
    superadmin: 'Superadmin',
    admin_tu: 'Admin TU',
    kepala_unit: 'Kepala Unit',
    staf: 'Staf',
};

export default function AdminUsersIndex({ users, filters, pendingCount }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus user ini?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen User</h1>
                    <p className="text-sm text-muted-foreground">
                        Total: {users.total} user {pendingCount > 0 && `• ${pendingCount} pending`}
                    </p>
                </div>
                <div className="flex gap-2">
                    {pendingCount > 0 && (
                        <ButtonLink href="/admin/users-pending" variant="outline">
                            <UserCheck className="icon-nav" />
                            Pending ({pendingCount})
                        </ButtonLink>
                    )}
                    <ButtonLink href="/admin/users/create">
                        <Plus className="icon-nav" />
                        Tambah User
                    </ButtonLink>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-left">Username</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Unit</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        Tidak ada user.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((u) => (
                                    <tr key={u.id} className="border-t">
                                        <td className="p-3 font-medium">{u.name}</td>
                                        <td className="p-3">{u.username}</td>
                                        <td className="p-3">{u.email}</td>
                                        <td className="p-3 text-xs">{u.unit?.nama ?? '-'}</td>
                                        <td className="p-3 text-xs">{roleLabel[u.role]}</td>
                                        <td className="p-3">
                                            <span className={`rounded px-2 py-1 text-xs font-medium ${statusColor[u.status]}`}>{u.status}</span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1">
                                                <ButtonLink href={`/admin/users/${u.id}/edit`} size="icon" variant="ghost" title="Edit">
                                                    <Edit className="icon-nav" />
                                                </ButtonLink>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(u.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
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
