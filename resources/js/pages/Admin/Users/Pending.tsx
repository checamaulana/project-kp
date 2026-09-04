import { router } from '@inertiajs/react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, approve, reject } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    unit: { nama: string } | null;
}

interface Props {
    users: { data: User[]; total: number };
}

export default function AdminUsersPending({ users }: Props) {
    const [roles, setRoles] = useState<Record<number, string>>({});

    const handleApprove = (userId: number) => {
        const role = roles[userId] ?? 'staf';
        if (confirm(`Setujui user ini sebagai ${role}?`)) {
            router.post(approve({ user: userId }).url, { role });
        }
    };

    const handleReject = (userId: number) => {
        if (confirm('Tolak user ini?')) {
            router.post(reject({ user: userId }).url);
        }
    };

    return (
        <AppLayout>
            <PageHeader
                title="User Pending"
                description={`${users.total} user menunggu persetujuan`}
                actions={
                    <ButtonLink href={index.url()} variant="ghost" size="icon" aria-label="Kembali">
                        <ArrowLeft className="icon-nav" />
                    </ButtonLink>
                }
            />

            {users.data.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">Tidak ada user pending.</CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {users.data.map((u) => (
                        <Card key={u.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-medium">
                                        {u.name} <span className="text-sm text-muted-foreground">(@{u.username})</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {u.email} • {u.unit?.nama ?? '-'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={roles[u.id] ?? 'staf'}
                                        onValueChange={(v: string | null) => {
                                            if (v) setRoles((prev) => ({ ...prev, [u.id]: v }));
                                        }}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="staf">Staf</SelectItem>
                                            <SelectItem value="kepala_unit">Kepala Unit</SelectItem>
                                            <SelectItem value="admin_tu">Admin TU</SelectItem>
                                            <SelectItem value="superadmin">Superadmin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={() => handleApprove(u.id)} title="Setujui">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleReject(u.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
