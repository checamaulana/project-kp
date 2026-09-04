import { Home } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface Props {
    message?: string;
}

export default function Error404({ message }: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <div className="max-w-md text-center">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <p className="mt-2 text-xl font-semibold">Halaman Tidak Ditemukan</p>
                <p className="mt-2 text-sm text-muted-foreground">{message ?? 'Halaman yang Anda cari tidak ada.'}</p>
                <ButtonLink href={dashboard.url()} className="mt-6">
                    <Home className="icon-nav" />
                    Dashboard
                </ButtonLink>
            </div>
        </div>
    );
}
