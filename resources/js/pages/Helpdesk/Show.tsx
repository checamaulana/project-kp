import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Play, CheckCircle, X, Paperclip, User, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { index, lampiran, proses, selesaikan, tutup } from '@/routes/helpdesk';

interface Progress {
    id: number;
    komentar: string;
    status_sebelum: string | null;
    status_sesudah: string;
    created_at: string;
    user: { name: string };
}

interface Props {
    ticket: {
        id: number;
        kode_tiket: string;
        nama_pelapor: string;
        kategori: string;
        jenis_permintaan: string;
        deskripsi: string;
        status: 'baru' | 'diproses' | 'selesai' | 'ditutup';
        tindak_lanjut: string | null;
        created_at: string;
        diproses_at: string | null;
        selesai_at: string | null;
        unit: { nama: string };
        pelapor: { name: string } | null;
        handler: { name: string } | null;
        lampiran: Array<{ name: string; path: string }> | null;
        progress: Progress[];
    };
    canProcess: boolean;
    canFinish: boolean;
    canClose: boolean;
}

const statusColor: Record<string, string> = {
    baru: 'bg-red-100 text-red-800',
    diproses: 'bg-yellow-100 text-yellow-800',
    selesai: 'bg-green-100 text-green-800',
    ditutup: 'bg-gray-100 text-gray-800',
};

export default function HelpdeskShow({ ticket, canProcess, canFinish, canClose }: Props) {
    const [showSelesaikan, setShowSelesaikan] = useState(false);
    const [komentarProses, setKomentarProses] = useState('');
    const [komentarTutup, setKomentarTutup] = useState('');

    const { data, setData, post, processing } = useForm({
        tindak_lanjut: '',
    });

    return (
        <AppLayout>
            <PageHeader
                title={ticket.kode_tiket}
                description={`Dilaporkan oleh ${ticket.nama_pelapor} • ${new Date(ticket.created_at).toLocaleString('id-ID')}`}
                actions={
                    <>
                        <ButtonLink href={index.url()} variant="ghost" size="icon" aria-label="Kembali">
                            <ArrowLeft className="icon-nav" />
                        </ButtonLink>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[ticket.status]}`}>
                            {ticket.status.toUpperCase()}
                        </span>
                    </>
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Laporan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{ticket.nama_pelapor}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span>{ticket.unit?.nama ?? '-'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">{ticket.kategori.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">{ticket.jenis_permintaan.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="rounded-md border bg-muted/30 p-3">
                                <p className="text-xs font-semibold text-muted-foreground">Deskripsi:</p>
                                <p className="mt-1 whitespace-pre-wrap">{ticket.deskripsi}</p>
                            </div>
                            {ticket.lampiran && ticket.lampiran.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground">Lampiran:</p>
                                    <ul className="mt-1 space-y-1">
                                        {ticket.lampiran.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <Paperclip className="h-3 w-3" />
                                                <a href={lampiran({ helpdesk: ticket.id, index: i }).url} className="text-blue-600 hover:underline">
                                                    {f.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {ticket.tindak_lanjut && (
                                <div className="rounded-md border border-green-200 bg-green-50 p-3">
                                    <p className="text-xs font-semibold text-green-900">Tindak Lanjut / Solusi:</p>
                                    <p className="mt-1 text-sm whitespace-pre-wrap text-green-800">{ticket.tindak_lanjut}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {ticket.progress.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Belum ada progress.</p>
                            ) : (
                                <div className="space-y-3">
                                    {ticket.progress.map((p, i) => (
                                        <div key={p.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`rounded-full p-2 ${p.status_sesudah === 'selesai' ? 'bg-green-100 text-green-600' : p.status_sesudah === 'diproses' ? 'bg-yellow-100 text-yellow-600' : p.status_sesudah === 'ditutup' ? 'bg-gray-100' : 'bg-blue-100 text-blue-600'}`}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                {i < ticket.progress.length - 1 && <div className="mt-2 w-px flex-1 bg-border" />}
                                            </div>
                                            <div className="flex-1 pb-3">
                                                <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString('id-ID')}</div>
                                                <div className="font-medium">{p.user.name}</div>
                                                <div className="mt-1 text-sm">{p.komentar}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">Handler:</span> {ticket.handler?.name ?? '-'}
                            </p>
                            {ticket.diproses_at && (
                                <p>
                                    <span className="text-muted-foreground">Diproses:</span> {new Date(ticket.diproses_at).toLocaleString('id-ID')}
                                </p>
                            )}
                            {ticket.selesai_at && (
                                <p>
                                    <span className="text-muted-foreground">Selesai:</span> {new Date(ticket.selesai_at).toLocaleString('id-ID')}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {(canProcess || canFinish || canClose) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Aksi Tim IT</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {canProcess && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            router.post(proses({ helpdesk: ticket.id }).url, { komentar: komentarProses || undefined });
                                        }}
                                        className="space-y-2"
                                    >
                                        <Textarea
                                            value={komentarProses}
                                            onChange={(e) => setKomentarProses(e.target.value)}
                                            placeholder="Komentar (opsional)..."
                                            rows={2}
                                        />
                                        <Button type="submit" className="w-full">
                                            <Play className="icon-nav" />
                                            Mulai Proses
                                        </Button>
                                    </form>
                                )}

                                {canFinish && (
                                    <>
                                        {!showSelesaikan ? (
                                            <Button onClick={() => setShowSelesaikan(true)} className="w-full">
                                                <CheckCircle className="icon-nav" />
                                                Tandai Selesai
                                            </Button>
                                        ) : (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    post(selesaikan({ helpdesk: ticket.id }).url);
                                                }}
                                                className="space-y-2"
                                            >
                                                <Textarea
                                                    value={data.tindak_lanjut}
                                                    onChange={(e) => setData('tindak_lanjut', e.target.value)}
                                                    placeholder="Tindak lanjut / solusi..."
                                                    rows={4}
                                                    required
                                                />
                                                <Button type="submit" disabled={processing} className="w-full">
                                                    {processing ? 'Menyimpan...' : 'Konfirmasi Selesai'}
                                                </Button>
                                            </form>
                                        )}
                                    </>
                                )}

                                {canClose && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            router.post(tutup({ helpdesk: ticket.id }).url, { komentar: komentarTutup || undefined });
                                        }}
                                        className="space-y-2"
                                    >
                                        <Textarea
                                            value={komentarTutup}
                                            onChange={(e) => setKomentarTutup(e.target.value)}
                                            placeholder="Alasan tutup (opsional)..."
                                            rows={2}
                                        />
                                        <Button type="submit" variant="outline" className="w-full">
                                            <X className="icon-nav" />
                                            Tutup Tiket
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
