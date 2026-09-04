import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileInput, FileOutput, Inbox, Wrench, HelpCircle, Bell, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard, logout } from '@/routes';
import { index as adminUsersIndex } from '@/routes/admin/users';
import { index as disposisiIndex } from '@/routes/disposisi';
import { index as helpdeskIndex, create as helpdeskCreate } from '@/routes/helpdesk';
import { index as notificationsIndex } from '@/routes/notifications';
import { index as rekapIndex } from '@/routes/rekap';
import { index as suratKeluarIndex } from '@/routes/surat-keluar';
import { index as suratMasukIndex } from '@/routes/surat-masuk';
import type { User } from '@/types';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
}

interface NavSection {
    label?: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        items: [{ href: dashboard.url(), label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'Surat & Disposisi',
        items: [
            { href: suratMasukIndex.url(), label: 'Surat Masuk', icon: FileInput },
            { href: suratKeluarIndex.url(), label: 'Surat Keluar', icon: FileOutput },
            { href: disposisiIndex.url(), label: 'Disposisi', icon: Inbox },
        ],
    },
    {
        label: 'Operasional IT',
        items: [
            { href: helpdeskIndex.url(), label: 'IT Helpdesk', icon: Wrench },
            { href: helpdeskCreate.url(), label: 'Lapor Kendala', icon: HelpCircle },
        ],
    },
    {
        label: 'Laporan',
        items: [
            { href: notificationsIndex.url(), label: 'Notifikasi', icon: Bell },
            { href: rekapIndex.url(), label: 'Rekap & Laporan', icon: BarChart3 },
        ],
    },
    {
        label: 'Sistem',
        items: [{ href: adminUsersIndex.url(), label: 'Manajemen User', icon: Settings, roles: ['superadmin'] }],
    },
];

interface SidebarProps {
    currentPath?: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const path = currentPath ?? (typeof window !== 'undefined' ? window.location.pathname : '');

    const isActive = (href: string) => {
        if (href === dashboard.url()) return path === dashboard.url();
        return path === href || path.startsWith(href + '/');
    };

    const initials = user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#E2E8E0] bg-white">
            {/* Hospital Logo */}
            <div className="flex items-center gap-3 border-b border-[#E2E8E0] px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[#17201A]">RSGM Unimus</div>
                    <div className="truncate text-xs text-muted-foreground">Sistem Manajemen Surat</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
                {navSections.map((section, idx) => {
                    const visibleItems = section.items.filter((item) => !item.roles || item.roles.includes(user.role));
                    if (visibleItems.length === 0) return null;
                    return (
                        <div key={idx} className="mb-1">
                            {section.label && <div className="nav-section-label">{section.label}</div>}
                            <div className="space-y-0.5">
                                {visibleItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link key={item.href} href={item.href} className={cn('nav-link', active && 'nav-link-active')}>
                                            <Icon className={cn('icon-nav', active ? 'text-[#166534]' : 'text-[#647067]')} />
                                            <span className="flex-1 truncate">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* User profile at bottom */}
            <div className="border-t border-[#E2E8E0] p-3">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-[#17201A]">{user.name}</div>
                        <div className="truncate text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                    <Link
                        href={logout.url()}
                        method="post"
                        as="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
                        title="Keluar"
                    >
                        <LogOut className="icon-sm" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
