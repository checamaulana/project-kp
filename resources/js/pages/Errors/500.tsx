import { Home } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface Props {
    message?: string;
}

export default function Error500({ message }: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <div className="max-w-md text-center">
                <h1 className="text-6xl font-bold text-destructive">500</h1>
                <p className="mt-2 text-xl font-semibold">Terjadi Kesalahan Server</p>
                <p className="mt-2 text-sm text-muted-foreground">{message ?? 'Mohon coba lagi nanti.'}</p>
                <ButtonLink href={dashboard.url()} className="mt-6">
                    <Home className="icon-nav" />
                    Dashboard
                </ButtonLink>
            </div>
        </div>
    );
}
