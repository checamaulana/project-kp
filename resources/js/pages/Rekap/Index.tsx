import { Link } from '@inertiajs/react';
import { FileInput, FileOutput, BarChart3 } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { suratMasuk, suratKeluar } from '@/routes/rekap';

export default function RekapIndex() {
    return (
        <AppLayout>
            <PageHeader title="Rekap" description="Rekapitulasi surat & disposisi RSGM UNIMUS" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link href={suratMasuk.url()}>
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <FileInput className="h-5 w-5 text-blue-600" />
                            <CardTitle>Rekap Surat Masuk</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">Lihat & export data surat masuk</CardContent>
                    </Card>
                </Link>
                <Link href={suratKeluar.url()}>
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <FileOutput className="h-5 w-5 text-green-600" />
                            <CardTitle>Rekap Surat Keluar</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">Lihat & export data surat keluar</CardContent>
                    </Card>
                </Link>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <CardTitle>Rekap Disposisi</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">Segera hadir</CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
