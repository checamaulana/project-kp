import { router } from '@inertiajs/react';
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { create, edit, pending, destroy as destroyUser } from '@/routes/admin/users';

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

const statusLabel: Record<string, string> = {
    pending: 'Pending',
    active: 'Active',
    rejected: 'Rejected',
};

const roleLabel: Record<string, string> = {
    superadmin: 'Superadmin',
    admin_tu: 'Admin TU',
    kepala_unit: 'Kepala Unit',
    staf: 'Staf',
};

export default function AdminUsersIndex({ users, pendingCount }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus user ini?')) {
            router.delete(destroyUser({ user: id }).url);
        }
    };

    return (
        <AppLayout>
            <PageHeader
                title="Manajemen User"
                description={`Total: ${users.total} user${pendingCount > 0 ? ` • ${pendingCount} pending` : ''}`}
                actions={
                    <>
                        {pendingCount > 0 && (
                            <ButtonLink href={pending.url()} variant="outline">
                                <UserCheck className="icon-nav" />
                                Pending ({pendingCount})
                            </ButtonLink>
                        )}
                        <ButtonLink href={create.url()}>
                            <Plus className="icon-nav" />
                            Tambah User
                        </ButtonLink>
                    </>
                }
            />

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
                                            <span className={`rounded px-2 py-1 text-xs font-medium ${statusColor[u.status]}`}>
                                                {statusLabel[u.status] ?? u.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1">
                                                <ButtonLink href={edit({ user: u.id }).url} size="icon" variant="ghost" title="Edit">
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
