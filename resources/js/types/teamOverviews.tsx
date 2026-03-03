export interface TeamOverviews {
    id: number;
    name: string;
    game: string;
    playerCount: number;
    achievements: number;
    winrate?: number;
    logo: string;
    color: string;
    status: 'pending' | 'verified' | 'rejected';
    created_at: string;
    slot_type?: string;
}

export interface Player {
    id: number;
    name: string;
    nickname: string;
    id_server: string;
    no_hp: string;
    email: string;
    alamat: string;
    role: string;
    foto: string | null;
    tanda_tangan: string | null;
}

export interface TeamDetail extends TeamOverviews {
    payment_proof: string | null;
    slot_count?: number;
    players: Player[];
}
