import { useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { update, index } from '@/routes/admin/users';

interface Props {
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        unit_id: number;
        role: string;
        status: string;
    };
    units: Array<{ id: number; nama: string; kode: string }>;
    roles: Record<string, string>;
}

export default function AdminUsersEdit({ user, units, roles }: Props) {
    const { data, setData, post, processing } = useForm({
        _method: 'put' as const,
        name: user.name,
        username: user.username,
        email: user.email,
        unit_id: String(user.unit_id),
        role: user.role,
        status: user.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update({ user: user.id }).url);
    };

    return (
        <AppLayout>
            <PageHeader
                title="Edit User"
                actions={
                    <ButtonLink href={index.url()} variant="ghost" size="icon" aria-label="Kembali">
                        <ArrowLeft className="icon-nav" />
                    </ButtonLink>
                }
            />

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
                    <ButtonLink href={index.url()} variant="outline">
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
