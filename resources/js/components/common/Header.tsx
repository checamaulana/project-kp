import { Link, usePage } from '@inertiajs/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { YearToggle } from '@/components/common/YearToggle';
import { NotificationBell } from '@/components/common/NotificationBell';
import { User } from '@/types';

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
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm md:inline">{user.name}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={route('profile.edit')}>
                                <UserIcon className="mr-2 h-4 w-4" />
                                Profil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('logout')} method="post" as="button" className="w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Keluar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
