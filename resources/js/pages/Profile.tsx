import AppLayout from '@/components/common/AppLayout';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { User } from '@/types';

export default function Profile() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const { data: pw, setData: setPw, put, processing: pwProcessing, errors: pwErrors } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('profile.password'));
    };

    return (
        <AppLayout>
            <h1 className="mb-6 text-2xl font-bold">Profil</h1>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Diri</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ganti Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Password Saat Ini</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={pw.current_password}
                                    onChange={(e) => setPw('current_password', e.target.value)}
                                />
                                {pwErrors.current_password && (
                                    <p className="text-sm text-destructive">{pwErrors.current_password}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={pw.password}
                                    onChange={(e) => setPw('password', e.target.value)}
                                />
                                {pwErrors.password && <p className="text-sm text-destructive">{pwErrors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={pw.password_confirmation}
                                    onChange={(e) => setPw('password_confirmation', e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={pwProcessing}>
                                {pwProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ubah Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
