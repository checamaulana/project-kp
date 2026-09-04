import { useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { store, index } from '@/routes/admin/users';

interface Props {
    units: Array<{ id: number; nama: string; kode: string }>;
    roles: Record<string, string>;
}

export default function AdminUsersCreate({ units, roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        unit_id: '',
        role: 'staf',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout>
            <PageHeader
                title="Tambah User"
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
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Username *</Label>
                    <Input value={data.username} onChange={(e) => setData('username', e.target.value)} required />
                    {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Password *</Label>
                        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Konfirmasi *</Label>
                        <Input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Unit *</Label>
                    <Select value={data.unit_id} onValueChange={(v) => setData('unit_id', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)}>
                                    {u.nama}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.unit_id && <p className="text-sm text-destructive">{errors.unit_id}</p>}
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
                <div className="flex justify-end gap-2">
                    <ButtonLink href={index.url()} variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Save className="icon-nav" />
                        Simpan
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
