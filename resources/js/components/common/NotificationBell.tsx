import { Bell } from 'lucide-react';
import { ButtonAnchor } from '@/components/ui/button';

export function NotificationBell() {
    return (
        <ButtonAnchor href="/notifications" variant="ghost" size="icon" aria-label="Notifikasi">
            <Bell className="icon-nav" />
        </ButtonAnchor>
    );
}
