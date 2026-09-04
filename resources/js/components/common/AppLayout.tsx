import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumb?: { label: string; href?: string }[];
}

export default function AppLayout({ children, title, breadcrumb }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#F7F9F7]">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header title={title} breadcrumb={breadcrumb} />
                <main className="flex-1 px-6 py-6">{children}</main>
            </div>
        </div>
    );
}
