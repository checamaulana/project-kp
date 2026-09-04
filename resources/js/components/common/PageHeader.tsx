import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumb?: { label: string; href?: string }[];
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
    return (
        <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
            <div className="min-w-0">
                {breadcrumb && breadcrumb.length > 0 && (
                    <nav className="mb-2 flex items-center gap-1.5 text-meta">
                        {breadcrumb.map((b, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {i > 0 && <span className="text-muted-foreground/50">/</span>}
                                {b.href ? (
                                    <Link href={b.href} className="text-muted-foreground hover:text-foreground">
                                        {b.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground">{b.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <h1 className="text-page-title-lg">{title}</h1>
                {description && (
                    <p className="mt-1 text-body-secondary">{description}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
