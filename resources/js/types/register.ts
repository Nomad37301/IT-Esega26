export interface TeamData {
    id?: number | null
    team_name: string
    proof_of_payment: File | null
    team_logo: File | null
    email: string
    game_type?: "ml" | "ff"
    slot_type?: "single" | "double"
    teamIdToReuse?: number | null
}


export interface MLPlayer {
    name: string;
    nickname: string;
    id: string;
    id_server: string;
    no_hp: string;
    email: string;
    alamat: string;
    tanda_tangan: string | File | null;
    foto: string | File | null;
    ml_team_id?: number | null;
    role: 'ketua' | 'anggota' | 'cadangan';
    created_at?: string;
    updated_at?: string;
}

export interface FFPlayer {
    id: string;
    ff_team_id?: number | null;
    name: string;
    nickname: string;
    id_server: string;
    no_hp: string;
    email: string;
    alamat: string;
    tanda_tangan?: string | File | null;
    foto?: string | File | null;
    role: 'ketua' | 'anggota' | 'cadangan';
    created_at?: string;
    updated_at?: string;
}

export interface PlayerFFFormProps {
    player: FFPlayer;
    allPlayers: FFPlayer[];
    index: number;
    onChange: <K extends keyof FFPlayer>(index: number, field: K, value: FFPlayer[K]) => void;
    onDelete: () => void;
    errorsBE: Record<string, string>;
}

export interface PlayerFormProps {
    player: MLPlayer;
    allPlayers: MLPlayer[];
    index: number;
    onChange: <K extends keyof MLPlayer>(index: number, field: K, value: MLPlayer[K]) => void;
    onDelete: () => void;
    errorsBE: Record<string, string>;
}

export interface FFPlayerFormProps {
    player: FFPlayer
    index: number
    onChange: <K extends keyof FFPlayer>(index: number, field: K, value: FFPlayer[K]) => void
    onDelete: () => void
}

export interface GameStats {
    game_type: string;
    total_slots: number;
    used_slots: number;
    registered_teams: string;
}

export interface GameSelectionFormProps {
    onGameSelect: (game: "ml" | "ff") => void;
    gameStats?: GameStats[];
}

export interface TeamRegistrationFormProps {
    teamData: TeamData
    gameType: "ml" | "ff"
    onSubmit: (data: TeamData) => void
    resetStep?: () => void
}

export interface PlayerRegistrationFormProps {
    teamData: TeamData;
    gameType: 'ml' | 'ff';
}

export interface QRCodeSectionProps {
    title: string
    description: string
    instructions: string[]
    amount?: string
    gameType: "ml" | "ff"
    slotType?: "single" | "double"
    resetStep?: () => void
}

export interface FileUploadFieldProps {
    id: string;
    label: string;
    accept: string;
    value: File | null;
    onChange: (file: File | null) => void;
    helpText?: string;
}
