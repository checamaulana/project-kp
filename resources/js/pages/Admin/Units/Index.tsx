import AppLayout from '@/components/common/AppLayout';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
            router.delete(`/admin/units/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Unit</h1>
                    <p className="text-sm text-muted-foreground">Total: {units.total} unit</p>
                </div>
                <ButtonLink href="/admin/units/create">
                    <Plus className="icon-nav" />
                    Tambah Unit
                </ButtonLink>
            </div>

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
                            {units.data.map((u) => (
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
                                            <ButtonLink href={`/admin/units/${u.id}/edit`} size="icon" variant="ghost" title="Edit">
                                                <Edit className="icon-nav" />
                                            </ButtonLink>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(u.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
