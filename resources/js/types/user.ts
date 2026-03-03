export type RoleType = {
    id: number;
    name: string;
};

export type UserType = {
    id: number;
    name: string;
    email: string;
    address?: string | null;
    phone?: string | null;
    password?: string | null;
    KTM?: string | null;
    email_verified_at?: string | null;
    status: 'active' | 'inactive' | 'blocked';
    created_at?: string;
    updated_at?: string;
    remember_token?: string | null;
    roles: RoleType[];
};
