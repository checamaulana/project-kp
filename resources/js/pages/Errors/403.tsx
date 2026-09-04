import { Home, ArrowLeft } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface Props {
    status?: number;
    message?: string;
}

export default function Error403({ message }: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <div className="max-w-md text-center">
                <h1 className="text-6xl font-bold text-primary">403</h1>
                <p className="mt-2 text-xl font-semibold">Akses Ditolak</p>
                <p className="mt-2 text-sm text-muted-foreground">{message ?? 'Anda tidak memiliki akses ke halaman ini.'}</p>
                <div className="mt-6 flex justify-center gap-2">
                    <ButtonLink href={dashboard.url()}>
                        <Home className="icon-nav" />
                        Dashboard
                    </ButtonLink>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="icon-nav" />
                        Kembali
                    </Button>
                </div>
            </div>
        </div>
    );
}
