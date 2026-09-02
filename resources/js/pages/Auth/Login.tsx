import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { login, register } from '@/routes';

interface LoginForm {
    username: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(login.url());
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-display tracking-tight text-foreground">SIM Surat RSGM</CardTitle>
                    <CardDescription className="text-eyebrow text-muted-foreground">Masuk dengan username dan password Anda.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-eyebrow text-foreground">Username</Label>
                            <Input id="username" value={data.username} onChange={(e) => setData('username', e.target.value)} autoFocus />
                            {errors.username && <p className="text-meta text-destructive">{errors.username}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-eyebrow text-foreground">Password</Label>
                            <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && <p className="text-meta text-destructive">{errors.password}</p>}
                        </div>
                        <label className="flex items-center gap-2 text-body text-foreground">
                            <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="rounded-nav" />
                            Ingat saya
                        </label>
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <Loader2 className="icon-nav animate-spin" />}
                            Masuk
                        </Button>
                        <p className="text-center text-eyebrow text-muted-foreground">
                            Belum punya akun?{' '}
                            <a href={register.url()} className="text-foreground underline underline-offset-4">
                                Daftar
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
