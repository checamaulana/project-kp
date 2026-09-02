export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    unit_id: number;
    role: 'superadmin' | 'admin_tu' | 'kepala_unit' | 'staf';
    status: 'pending' | 'active' | 'rejected';
    unit?: Unit;
    created_at?: string;
}

export interface Unit {
    id: number;
    kode: string;
    nama: string;
    keterangan?: string | null;
    is_active: boolean;
}

export interface KodeSurat {
    id: number;
    kode: string;
    keterangan: string | null;
    is_active: boolean;
}

export interface Indeks {
    id: number;
    kode: string;
    nama: string;
    kode_turunan: string[] | null;
    is_active: boolean;
}

export interface AuthProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    active_year?: number;
    [key: string]: unknown;
}
