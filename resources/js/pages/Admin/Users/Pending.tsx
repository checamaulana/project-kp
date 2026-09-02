import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Card, CardContent } from '@/components/ui/card';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const { data, setData, post } = useForm<{ user_id: string; role: string }>({ user_id: '', role: 'staf' });

    const handleApprove = (userId: number, role: string) => {
        router.post(`/admin/users/${userId}/approve`, { role });
    };

    const handleReject = (userId: number) => {
        if (confirm('Tolak user ini?')) {
            router.post(`/admin/users/${userId}/reject`);
        }
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/admin/users" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <div>
                    <h1 className="text-2xl font-bold">User Pending</h1>
                    <p className="text-sm text-muted-foreground">{users.total} user menunggu persetujuan</p>
                </div>
            </div>

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
                                        {u.email} • {u.unit?.nama}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select onValueChange={(v) => handleApprove(u.id, v)} defaultValue="staf">
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
                                    <Button onClick={() => handleApprove(u.id, 'staf')}>
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
