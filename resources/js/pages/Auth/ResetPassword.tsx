import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as passwordStore } from '@/routes/password';

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm<ResetPasswordForm>({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(passwordStore.url());
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-display tracking-tight text-foreground">Reset Password</CardTitle>
                    <CardDescription className="text-eyebrow text-muted-foreground">
                        Masukkan password baru Anda (minimal 8 karakter).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-eyebrow text-foreground">
                                Email
                            </Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-meta text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-eyebrow text-foreground">
                                Password Baru
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoFocus
                            />
                            {errors.password && <p className="text-meta text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-eyebrow text-foreground">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <Loader2 className="icon-nav animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
