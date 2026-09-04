import { usePage } from '@inertiajs/react';
import { FileInput, FileOutput, Inbox, Wrench, Clock, AlertCircle, CheckCircle2, ArrowUpRight } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTanggal } from '@/lib/format';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as disposisiIndex } from '@/routes/disposisi';
import { index as helpdeskIndex, create as helpdeskCreate } from '@/routes/helpdesk';
import { create as suratKeluarCreate } from '@/routes/surat-keluar';
import { index as suratMasukIndex } from '@/routes/surat-masuk';
import type { User } from '@/types';

interface DashboardProps {
    stats: {
        surat_masuk: number;
        surat_keluar: number;
        disposisi_pending: number;
        helpdesk_baru: number;
        helpdesk_diproses: number;
        helpdesk_selesai: number;
    };
    recentSuratMasuk: Array<{
        id: number;
        no_urut: number;
        pengirim: string;
        perihal: string;
        tanggal_terima: string;
    }>;
    recentHelpdesk: Array<{
        id: number;
        kode_tiket: string;
        nama_pelapor: string;
        unit: { nama: string };
        status: string;
        created_at: string;
    }>;
    activeYear: number;
}

export default function Dashboard({ stats, recentSuratMasuk, recentHelpdesk, activeYear }: DashboardProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    return (
        <AppLayout title="Dashboard" breadcrumb={[{ label: 'Beranda', href: dashboard.url() }, { label: 'Dashboard' }]}>
            <PageHeader
                title={`Selamat datang kembali, ${user.name.split(' ')[0]}`}
                description={`Pantau operasional surat & IT Helpdesk RSGM Unimus • Tahun Aktif ${activeYear}`}
            />

            {/* KPI Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Surat Masuk"
                    value={stats.surat_masuk}
                    icon={<FileInput className="icon-md" />}
                    accent="green"
                    sublabel="Total tahun aktif"
                />
                <StatCard
                    label="Surat Keluar"
                    value={stats.surat_keluar}
                    icon={<FileOutput className="icon-md" />}
                    accent="blue"
                    sublabel="Total tahun aktif"
                />
                <StatCard
                    label="Disposisi Tertunda"
                    value={stats.disposisi_pending}
                    icon={<Inbox className="icon-md" />}
                    accent="amber"
                    sublabel="Belum ditindaklanjuti"
                />
                <StatCard
                    label="Tiket IT Baru"
                    value={stats.helpdesk_baru}
                    icon={<Wrench className="icon-md" />}
                    accent="red"
                    sublabel="Memerlukan perhatian"
                />
            </div>

            {/* Recent activity + Helpdesk */}
            <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Surat Masuk Terbaru</CardTitle>
                            <p className="text-meta mt-1">5 surat terakhir yang diterima</p>
                        </div>
                        <a href={suratMasukIndex.url()} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                            Lihat semua
                            <ArrowUpRight className="h-3 w-3" />
                        </a>
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                        {recentSuratMasuk.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <FileInput className="icon-md text-muted-foreground" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-foreground">Belum ada surat masuk</p>
                                <p className="mt-1 text-xs text-muted-foreground">Surat yang masuk akan muncul di sini</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-[#E2E8E0]">
                                {recentSuratMasuk.slice(0, 5).map((s) => (
                                    <li key={s.id} className="flex items-start gap-3 px-6 py-3 hover:bg-muted/50">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#DCFCE7] text-[#166534]">
                                            <FileInput className="icon-sm" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[11px] font-semibold text-muted-foreground">#{s.no_urut}</span>
                                                <span className="truncate text-sm font-medium text-foreground">{s.pengirim}</span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.perihal}</p>
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">{formatTanggal(s.tanggal_terima)}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tiket Helpdesk Aktif</CardTitle>
                        <p className="text-meta mt-1">Status penanganan</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { label: 'Baru', value: stats.helpdesk_baru, color: 'text-[#DC2626]', bgSoft: 'bg-[#FEE2E2]', icon: AlertCircle },
                                { label: 'Diproses', value: stats.helpdesk_diproses, color: 'text-[#D97706]', bgSoft: 'bg-[#FEF3C7]', icon: Clock },
                                {
                                    label: 'Selesai',
                                    value: stats.helpdesk_selesai,
                                    color: 'text-[#15803D]',
                                    bgSoft: 'bg-[#DCFCE7]',
                                    icon: CheckCircle2,
                                },
                            ].map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-md', s.bgSoft, s.color)}>
                                            <Icon className="icon-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
                                            <div className="text-lg font-semibold text-foreground">{s.value}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <a
                            href={helpdeskIndex.url()}
                            className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-md border border-border bg-background py-2 text-xs font-medium text-foreground hover:bg-muted"
                        >
                            Buka IT Helpdesk
                            <ArrowUpRight className="h-3 w-3" />
                        </a>
                        {recentHelpdesk.length > 0 && (
                            <ul className="mt-3 divide-y divide-[#E2E8E0] rounded-md border border-border">
                                {recentHelpdesk.map((t) => (
                                    <li key={t.id} className="flex items-center justify-between gap-2 px-3 py-2">
                                        <span className="truncate font-mono text-[11px] font-semibold text-foreground">{t.kode_tiket}</span>
                                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                                            {t.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick links */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Akses Cepat</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {[
                        { label: 'Surat Masuk', href: suratMasukIndex.url(), icon: FileInput },
                        { label: 'Buat Surat', href: suratKeluarCreate.url(), icon: FileOutput },
                        { label: 'Disposisi', href: disposisiIndex.url(), icon: Inbox },
                        { label: 'Lapor IT', href: helpdeskCreate.url(), icon: Wrench },
                    ].map((q) => {
                        const Icon = q.icon;
                        return (
                            <a
                                key={q.label}
                                href={q.href}
                                className="group flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/30 hover:bg-[#DCFCE7]/50"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#DCFCE7] text-[#166534] transition-colors group-hover:bg-[#BBF7D0]">
                                    <Icon className="icon-sm" />
                                </div>
                                <span className="text-xs font-medium text-foreground">{q.label}</span>
                            </a>
                        );
                    })}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
