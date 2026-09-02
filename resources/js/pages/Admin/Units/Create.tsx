import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';;
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function AdminUnitsCreate() {
    const { data, setData, post, processing } = useForm({
        kode: '',
        nama: '',
        keterangan: '',
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/units');
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center gap-4">
                <ButtonLink href="/admin/units" variant="ghost" size="icon" aria-label="Kembali">
                    <ArrowLeft className="icon-nav" />
                </ButtonLink>
                <h1 className="text-2xl font-bold">Tambah Unit</h1>
            </div>

            <form onSubmit={submit} className="max-w-xl space-y-4 rounded-lg border bg-card p-6">
                <div className="space-y-2">
                    <Label>Kode *</Label>
                    <Input value={data.kode} onChange={(e) => setData('kode', e.target.value.toUpperCase())} maxLength={10} required />
                </div>
                <div className="space-y-2">
                    <Label>Nama *</Label>
                    <Input value={data.nama} onChange={(e) => setData('nama', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Keterangan</Label>
                    <Textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={2} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                    Aktif
                </label>
                <div className="flex justify-end gap-2">
                    <ButtonLink href="/admin/units" variant="outline">
                        Batal
                    </ButtonLink>
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="icon-nav animate-spin" />}
                        <Save className="icon-nav" />
                        Simpan
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
