import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface Props {
    user: any;
    units: Array<{ id: number; nama: string; kode: string }>;
    roles: Record<string, string>;
}

export default function AdminUsersEdit({ user, units, roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        unit_id: String(user.unit_id),
        role: user.role,
        status: user.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/users/${user.id}`, { _method: 'put' });
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/admin/users" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Edit User</h1>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-lg border bg-card p-6">
                <div className="space-y-2">
                    <Label>Nama *</Label>
                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Username *</Label>
                    <Input value={data.username} onChange={(e) => setData('username', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Unit *</Label>
                    <Select value={data.unit_id} onValueChange={(v) => setData('unit_id', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)}>
                                    {u.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Role *</Label>
                    <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(roles).map(([k, v]) => (
                                <SelectItem key={k} value={k}>
                                    {v}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end gap-2">
                    <ButtonLink href="/admin/users" variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Save className="icon-nav" />
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
