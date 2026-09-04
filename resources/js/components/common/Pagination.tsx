import { Button, ButtonLink } from '@/components/ui/button';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    total: number;
    itemLabel?: string;
}

export function Pagination({ links, total, itemLabel = 'data' }: PaginationProps) {
    if (links.length <= 3) {
        return (
            <p className="mt-4 text-sm text-muted-foreground">
                Total: {total} {itemLabel}
            </p>
        );
    }

    return (
        <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Total: {total} {itemLabel}
            </p>
            <div className="flex gap-1">
                {links.map((link, i) =>
                    link.url ? (
                        <ButtonLink key={i} href={link.url} size="sm" variant={link.active ? 'default' : 'outline'}>
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </ButtonLink>
                    ) : (
                        <Button key={i} size="sm" variant={link.active ? 'default' : 'outline'} disabled>
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ),
                )}
            </div>
        </div>
    );
}
