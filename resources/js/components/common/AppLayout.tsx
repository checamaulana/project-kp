import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/40">
            <aside className="hidden w-60 shrink-0 border-r bg-card md:block">
                <div className="border-b p-4">
                    <Link href={route('dashboard')} className="text-lg font-bold text-primary">
                        SIM Surat
                    </Link>
                </div>
                <Sidebar />
            </aside>

            <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2 border-b bg-card px-4 md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-60 p-0">
                            <div className="border-b p-4">
                                <span className="text-lg font-bold text-primary">SIM Surat</span>
                            </div>
                            <Sidebar onNavigate={() => setOpen(false)} />
                        </SheetContent>
                    </Sheet>
                    <Header />
                </div>
                <div className="hidden md:block">
                    <Header />
                </div>
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
