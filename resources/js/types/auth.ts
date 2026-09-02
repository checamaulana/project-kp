export type Unit = {
    id: number;
    kode: string;
    nama: string;
    keterangan?: string;
    is_active: boolean;
};

export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'superadmin' | 'admin_tu' | 'kepala_unit' | 'staf';
    status: 'pending' | 'active' | 'rejected';
    unit_id: number;
    unit?: Unit;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User;
};
