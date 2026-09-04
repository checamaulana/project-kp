import { router } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/components/common/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ButtonLink } from '@/components/ui/button';
import { create, edit, destroy as destroyUnit } from '@/routes/admin/units';

interface Unit {
    id: number;
    kode: string;
    nama: string;
    keterangan: string | null;
    is_active: boolean;
}

interface Props {
    units: { data: Unit[]; total: number };
}

export default function AdminUnitsIndex({ units }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus unit ini?')) {
            router.delete(destroyUnit({ unit: id }).url);
        }
    };

    return (
        <AppLayout>
            <PageHeader
                title="Manajemen Unit"
                description={`Total: ${units.total} unit`}
                actions={
                    <ButtonLink href={create.url()}>
                        <Plus className="icon-nav" />
                        Tambah Unit
                    </ButtonLink>
                }
            />

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 text-left">Kode</th>
                                <th className="p-3 text-left">Nama</th>
                                <th className="p-3 text-left">Keterangan</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        Belum ada unit.
                                    </td>
                                </tr>
                            ) : (
                                units.data.map((u) => (
                                    <tr key={u.id} className="border-t">
                                        <td className="p-3 font-mono">{u.kode}</td>
                                        <td className="p-3 font-medium">{u.nama}</td>
                                        <td className="p-3 text-xs">{u.keterangan ?? '-'}</td>
                                        <td className="p-3">
                                            <span
                                                className={`rounded px-2 py-1 text-xs ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                            >
                                                {u.is_active ? 'Aktif' : 'Non-aktif'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1">
                                                <ButtonLink href={edit({ unit: u.id }).url} size="icon" variant="ghost" title="Edit">
                                                    <Edit className="icon-nav" />
                                                </ButtonLink>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(u.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
