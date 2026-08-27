import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
    return (
        <Button variant="ghost" size="icon" asChild>
            <a href="/notifications" aria-label="Notifikasi">
                <Bell className="h-5 w-5" />
            </a>
        </Button>
    );
}
