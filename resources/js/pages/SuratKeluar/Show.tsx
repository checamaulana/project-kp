import { router, useForm } from '@inertiajs/react';
import { Check, Edit, Printer, Send, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatTanggal } from '@/lib/format';
import { approve, cetak, edit, index, reject, submit } from '@/routes/surat-keluar';

interface Props {
    surat: {
        id: number;
        no_urut: number;
        tahun: number;
        nomor_surat: string;
        tanggal_surat: string;
        kepada: string;
        perihal: string;
        penanda_tangan: string;
        tembusan: string | null;
        keterangan: string | null;
        status: 'draft' | 'menunggu_acc' | 'disetujui' | 'ditolak';
        rejection_reason: string | null;
        approved_at: string | null;
        kode_turunan: string | null;
        tanggal_mulai_penugasan: string | null;
        tanggal_selesai_penugasan: string | null;
        kode_surat: { kode: string; keterangan: string } | null;
        indeks: { kode: string; nama: string } | null;
        unit_pembuat: { nama: string } | null;
        created_by: { name: string } | null;
        approved_by: { name: string } | null;
    };
    canApprove: boolean;
}

export default function SuratKeluarShow({ surat, canApprove }: Props) {
    const [showReject, setShowReject] = useState(false);
    const { data, setData, post, processing } = useForm({ alasan_penolakan: '' });

    const sb: Record<string, { label: string; color: string }> = {
        draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
        menunggu_acc: { label: 'Menunggu ACC', color: 'bg-yellow-100 text-yellow-800' },
        disetujui: { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
        ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
    };
    const badge = sb[surat.status];

    return (
        <AppLayout>
            <PageHeader
                title={`Surat Keluar #${surat.no_urut}/${surat.tahun}`}
                description={surat.nomor_surat}
                breadcrumb={[{ label: 'Surat Keluar', href: index.url() }, { label: `#${surat.no_urut}/${surat.tahun}` }]}
                actions={
                    surat.status === 'disetujui' && (
                        <ButtonAnchor href={cetak({ suratKeluar: surat.id }).url} target="_blank">
                            <Printer className="icon-nav" />
                            Cetak PDF
                        </ButtonAnchor>
                    )
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Informasi</CardTitle>
                            <span className={`rounded px-3 py-1 text-xs font-medium ${badge.color}`}>{badge.label}</span>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-muted-foreground">Tanggal:</span> {formatTanggal(surat.tanggal_surat)}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Kepada:</span> {surat.kepada}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Indeks:</span>{' '}
                                    {surat.indeks ? `${surat.indeks.kode} - ${surat.indeks.nama}` : '-'}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Unit:</span> {surat.unit_pembuat?.nama ?? '-'}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Penanda Tangan:</span> {surat.penanda_tangan}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Dibuat oleh:</span> {surat.created_by?.name ?? '-'}
                                </div>
                            </div>
                            <div className="pt-2">
                                <span className="text-muted-foreground">Perihal:</span>
                                <p className="font-medium">{surat.perihal}</p>
                            </div>
                            {surat.tembusan && (
                                <div>
                                    <span className="text-muted-foreground">Tembusan:</span> <p>{surat.tembusan}</p>
                                </div>
                            )}
                            {surat.keterangan && (
                                <div>
                                    <span className="text-muted-foreground">Keterangan:</span> <p>{surat.keterangan}</p>
                                </div>
                            )}
                            {surat.kode_turunan && (
                                <div className="rounded-md border bg-muted/30 p-3">
                                    <p className="text-xs font-semibold text-muted-foreground">Khusus Surat Tugas (ST):</p>
                                    <p>
                                        Kode Turunan: <strong>{surat.kode_turunan}</strong>
                                    </p>
                                    <p>
                                        Periode: {surat.tanggal_mulai_penugasan} s/d {surat.tanggal_selesai_penugasan}
                                    </p>
                                </div>
                            )}
                            {surat.approved_at && (
                                <p className="text-xs text-muted-foreground">
                                    {surat.status === 'disetujui' ? 'Disetujui' : 'Ditolak'} oleh {surat.approved_by?.name ?? '-'} pada{' '}
                                    {surat.approved_at}
                                </p>
                            )}
                            {surat.rejection_reason && (
                                <div className="rounded-md border border-red-200 bg-red-50 p-3">
                                    <p className="text-sm font-semibold text-red-900">Alasan Penolakan:</p>
                                    <p className="text-sm text-red-800">{surat.rejection_reason}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {surat.status === 'draft' && (
                                <>
                                    <ButtonLink href={edit({ surat_keluar: surat.id }).url} variant="outline" className="w-full">
                                        <Edit className="icon-nav" />
                                        Edit
                                    </ButtonLink>
                                    <Button className="w-full" onClick={() => router.post(submit({ suratKeluar: surat.id }).url)}>
                                        <Send className="icon-nav" />
                                        Submit untuk ACC
                                    </Button>
                                </>
                            )}
                            {surat.status === 'ditolak' && (
                                <ButtonLink href={edit({ surat_keluar: surat.id }).url} variant="outline" className="w-full">
                                    <Edit className="icon-nav" />
                                    Edit & Revisi
                                </ButtonLink>
                            )}
                            {canApprove && surat.status === 'menunggu_acc' && (
                                <>
                                    <Button className="w-full" onClick={() => router.post(approve({ suratKeluar: surat.id }).url)}>
                                        <Check className="icon-nav" />
                                        ACC / Setujui
                                    </Button>
                                    <Button variant="destructive" className="w-full" onClick={() => setShowReject(!showReject)}>
                                        <X className="icon-nav" />
                                        Tolak
                                    </Button>
                                    {showReject && (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                post(reject({ suratKeluar: surat.id }).url);
                                            }}
                                            className="space-y-2"
                                        >
                                            <Textarea
                                                value={data.alasan_penolakan}
                                                onChange={(e) => setData('alasan_penolakan', e.target.value)}
                                                placeholder="Alasan penolakan..."
                                                rows={3}
                                                required
                                            />
                                            <Button type="submit" variant="destructive" className="w-full" disabled={processing}>
                                                Konfirmasi Tolak
                                            </Button>
                                        </form>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
