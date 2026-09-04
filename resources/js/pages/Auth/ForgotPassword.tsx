import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email as passwordEmail } from '@/routes/password';

interface ForgotPasswordForm {
    email: string;
}

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<ForgotPasswordForm>({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(passwordEmail.url());
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-display tracking-tight text-foreground">Lupa Password</CardTitle>
                    <CardDescription className="text-eyebrow text-muted-foreground">
                        Masukkan email terdaftar. Kami akan mengirim link reset password (berlaku 60 menit).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status && <p className="text-body mb-4 text-green-700">{status}</p>}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-eyebrow text-foreground">
                                Email
                            </Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} autoFocus />
                            {errors.email && <p className="text-meta text-destructive">{errors.email}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <Loader2 className="icon-nav animate-spin" />}
                            Kirim Link Reset
                        </Button>
                        <p className="text-eyebrow text-center text-muted-foreground">
                            <a href={login.url()} className="text-foreground underline underline-offset-4">
                                Kembali ke login
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
