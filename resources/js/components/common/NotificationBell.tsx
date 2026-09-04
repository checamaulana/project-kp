import { Bell } from 'lucide-react';
import { ButtonAnchor } from '@/components/ui/button';
import { index as notificationsIndex } from '@/routes/notifications';

interface NotificationBellProps {
    unreadCount?: number;
}

export function NotificationBell({ unreadCount = 0 }: NotificationBellProps) {
    return (
        <ButtonAnchor href={notificationsIndex.url()} variant="ghost" size="icon" className="relative" aria-label="Notifikasi">
            <Bell className="icon-sm" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </ButtonAnchor>
    );
}
