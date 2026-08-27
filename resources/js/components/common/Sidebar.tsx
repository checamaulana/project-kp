import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileInput, FileOutput, ClipboardList, Inbox, BarChart3, Settings } from 'lucide-react';
import { User } from '@/types';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/surat-masuk', label: 'Surat Masuk', icon: FileInbox },
    { href: '/surat-keluar', label: 'Surat Keluar', icon: FileOutbox },
    { href: '/pelayanan', label: 'Pelayanan', icon: ClipboardList },
    { href: '/notifications', label: 'Notifikasi', icon: Inbox },
    { href: '/rekap', label: 'Rekap', icon: BarChart3 },
    { href: '/admin/users', label: 'Admin', icon: Settings, roles: ['superadmin', 'admin_tu'] },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    return (
        <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
                if (item.roles && !item.roles.includes(user.role)) return null;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
