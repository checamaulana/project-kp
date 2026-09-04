import { Link, usePage } from '@inertiajs/react';
import { Calendar, ChevronDown, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { NotificationBell } from '@/components/common/NotificationBell';
import { YearToggle } from '@/components/common/YearToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { edit as profileEdit } from '@/routes/profile';
import type { User } from '@/types';

interface HeaderProps {
    title?: string;
    breadcrumb?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumb }: HeaderProps) {
    const { auth, unread_notifications_count } = usePage<{ auth: { user: User }; unread_notifications_count: number }>().props;
    const user = auth.user;

    const initials = user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E2E8E0] bg-white px-6">
            {/* Left: title + breadcrumb */}
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="min-w-0">
                    {breadcrumb && breadcrumb.length > 0 ? (
                        <nav className="text-meta flex items-center gap-1.5">
                            {breadcrumb.map((b, i) => (
                                <span key={i} className="flex items-center gap-1.5">
                                    {i > 0 && <span className="text-muted-foreground/60">/</span>}
                                    {b.href ? (
                                        <Link href={b.href} className="text-muted-foreground hover:text-foreground">
                                            {b.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-foreground">{b.label}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    ) : title ? (
                        <h1 className="text-section-title truncate">{title}</h1>
                    ) : null}
                </div>
            </div>

            {/* Center: archive year */}
            <div className="max-w-[140px] flex-1 sm:max-w-[180px]">
                <YearToggle />
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
                {/* Date */}
                <div className="hidden items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 xl:flex">
                    <Calendar className="icon-sm text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{today}</span>
                </div>

                {/* Notifications */}
                <NotificationBell unreadCount={unread_notifications_count ?? 0} />

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className={cn(
                            'flex h-9 items-center gap-2 rounded-md border border-border bg-white pr-2 pl-1 hover:bg-muted',
                            'data-[popup-open]:bg-muted',
                        )}
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
                            {initials}
                        </div>
                        <div className="hidden text-left md:block">
                            <div className="text-xs leading-tight font-semibold text-foreground">{user.name}</div>
                            <div className="text-[10px] leading-tight text-muted-foreground capitalize">{user.role.replace('_', ' ')}</div>
                        </div>
                        <ChevronDown className="icon-sm text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-lg border border-border bg-white p-1 shadow-lg">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="px-2 py-1.5">
                                <div className="text-sm font-semibold text-foreground">{user.name}</div>
                                <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="my-1 bg-border" />
                        <DropdownMenuItem
                            render={<Link href={profileEdit.url()} />}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted focus:bg-muted"
                        >
                            <UserIcon className="icon-sm text-muted-foreground" />
                            Profil Saya
                        </DropdownMenuItem>
                        {user.role === 'superadmin' && (
                            <DropdownMenuItem
                                render={<Link href={adminUsersIndex.url()} />}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted focus:bg-muted"
                            >
                                <Settings className="icon-sm text-muted-foreground" />
                                Pengaturan
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="my-1 bg-border" />
                        <DropdownMenuItem
                            render={<Link href={logout.url()} method="post" as="button" className="w-full text-left" />}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[#DC2626] hover:bg-[#FEE2E2] focus:bg-[#FEE2E2]"
                        >
                            <LogOut className="icon-sm" />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
