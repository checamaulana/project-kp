import { Link, usePage } from '@inertiajs/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { YearToggle } from '@/components/common/YearToggle';
import { NotificationBell } from '@/components/common/NotificationBell';
import { User } from '@/types';
import { edit as profileEdit } from '@/routes/profile';
import { logout } from '@/routes';

export function Header() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const initials = user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
            <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">RSGM Unimus</span>
            </div>
            <div className="flex items-center gap-2">
                <YearToggle />
                <NotificationBell />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-2 rounded-pill')}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="hidden text-sm md:inline">{user.name}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem render={<Link href={profileEdit.url()} />}>
                            <UserIcon className="icon-nav" />
                            Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href={logout.url()} method="post" as="button" className="w-full" />}>
                            <LogOut className="icon-nav" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
