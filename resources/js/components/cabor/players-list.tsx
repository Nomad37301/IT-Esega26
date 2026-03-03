"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreVertical, Edit, Trash2, Filter, Download, X, FileText } from "lucide-react"
import { toast } from "react-hot-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import axios from 'axios'

type Player = {
    id: number
    name: string
    nickname: string
    role: "ketua" | "anggota" | "cadangan"
    avatar: string
    status: string // Status aktif/nonaktif/lainnya 
    joinDate: string
    team_name?: string
    id_server?: string
    no_hp?: string
    email?: string
    alamat?: string
    foto?: string
    tanda_tangan?: string
}

// Struktur data dari API
interface ApiPlayer {
    id: number
    name: string
    nickname: string
    role?: string
    foto?: string
    team_name?: string
    created_at: string
    status?: string
    email?: string
    no_hp?: string
    alamat?: string
    id_server?: string
    tanda_tangan?: string
}

// Data dummy sebagai fallback
const freeFirePlayers: Player[] = []
const mobileLegendPlayers: Player[] = []

export function PlayersList({ gameType }: { gameType: "free-fire" | "mobile-legends" }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [realPlayers, setRealPlayers] = useState<Player[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null)
    const [playerForm, setPlayerForm] = useState({
        name: "",
        nickname: "",
        role: "anggota" as "ketua" | "anggota" | "cadangan",
        id_server: "",
        no_hp: "",
        email: "",
        alamat: "",
    })
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        role: "all",
        team: "",
    })
    
    // Fungsi untuk memuat data pemain dari API
    const fetchPlayers = async (filterParams = {}) => {
        try {
            setLoading(true);
            const game = gameType === "free-fire" ? 'ff' : 'ml';
            
            // Jika ada filter, gunakan endpoint filter
            if (Object.keys(filterParams).length > 0) {
                const params = new URLSearchParams();
                
                // Tambahkan parameter filter ke URL
                Object.entries(filterParams).forEach(([key, value]) => {
                    if (value && value !== 'all') {
                        params.append(key, value as string);
                    }
                });
                
                if (searchQuery) params.append('search', searchQuery);
                
                const response = await fetch(`/api/players/${game}/filter?${params.toString()}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch players');
                }
                
                const data = await response.json();
                setRealPlayers(formatPlayersData(Array.isArray(data) ? data : []));
            } else {
                // Jika tidak ada filter, gunakan endpoint normal
                const response = await fetch(`/api/${game}-players`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch players');
                }
                
                const data = await response.json();
                setRealPlayers(formatPlayersData(Array.isArray(data) ? data : []));
            }
        } catch (error) {
            console.error("Error fetching players:", error);
            toast.error(error instanceof Error ? error.message : "Gagal memuat data pemain");
            setRealPlayers([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Format data pemain dari API ke format yang digunakan komponen
    const formatPlayersData = (apiData: ApiPlayer[]): Player[] => {
        if (!Array.isArray(apiData)) {
            console.error('Invalid API response format:', apiData);
            return [];
        }
        
        return apiData.map((player: ApiPlayer) => ({
            id: player.id,
            name: player.name,
            nickname: player.nickname,
            role: (player.role as "ketua" | "anggota" | "cadangan") || "anggota",
            avatar: player.foto || "/placeholder.svg?height=40&width=40",
            status: player.status || "active",
            joinDate: player.created_at,
            team_name: player.team_name,
            id_server: player.id_server,
            no_hp: player.no_hp,
            email: player.email,
            alamat: player.alamat,
            foto: player.foto,
            tanda_tangan: player.tanda_tangan
        }));
    };
    
    // Load data saat komponen dimuat atau gameType berubah
    useEffect(() => {
        fetchPlayers()
    }, [gameType])
    
    // Fungsi untuk menghapus pemain
    const handleDeletePlayer = async () => {
        if (!playerToDelete) return;
        
        try {
            setLoading(true);
            const game = gameType === "free-fire" ? 'ff' : 'ml';
            
            const response = await fetch(`/api/players/${game}/${playerToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete player');
            }

            toast.success(`Pemain ${playerToDelete.name} (${playerToDelete.nickname}) berhasil dihapus.`);
            fetchPlayers();
            setIsDeleteDialogOpen(false);
            setPlayerToDelete(null);
        } catch (error) {
            console.error("Error deleting player:", error);
            toast.error("Gagal menghapus pemain. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };
    
    // Fungsi untuk mempersiapkan edit pemain
    const handleEditClick = (player: Player) => {
        setPlayerToEdit(player);
        setPlayerForm({
            name: player.name,
            nickname: player.nickname,
            role: player.role,
            id_server: player.id_server || "",
            no_hp: player.no_hp || "",
            email: player.email || "",
            alamat: player.alamat || "",
        });
        setIsEditDialogOpen(true);
    };
    
    // Fungsi untuk menyimpan perubahan pemain
    const handleSaveEdit = async () => {
        if (!playerToEdit) return;
        
        try {
            setLoading(true);
            
            // Validasi input
            if (!playerForm.name || !playerForm.nickname) {
                toast.error("Nama dan nickname harus diisi");
                return;
            }

            // Format data pemain
            const playerData = {
                name: playerForm.name.trim(),
                nickname: playerForm.nickname.trim(),
                role: playerForm.role,
                id_server: playerForm.id_server?.trim() || null,
                no_hp: playerForm.no_hp?.trim() || null,
                email: playerForm.email?.trim() || null,
                alamat: playerForm.alamat?.trim() || null
            };

            // Tentukan game type yang benar
            const game = gameType === "free-fire" ? "ff" : "ml";

            const response = await axios.put(`/secure-admin-essega/players/${game}/${playerToEdit.id}`, playerData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                withCredentials: true
            });

            if (response.data.success) {
                toast.success(`Data pemain ${playerForm.name} berhasil diperbarui.`);
                fetchPlayers();
                setIsEditDialogOpen(false);
                setPlayerToEdit(null);
            } else {
                throw new Error(response.data.message || 'Failed to update player');
            }
        } catch (error) {
            console.error("Error updating player:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
            } else {
                toast.error(error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Fungsi untuk menerapkan filter
    const handleApplyFilters = () => {
        const filterParams: Record<string, string> = {};
        
        // Hanya tambahkan role jika bukan 'all'
        if (filters.role && filters.role !== 'all') {
            filterParams.role = filters.role;
        }
        
        // Hanya tambahkan team jika tidak kosong
        if (filters.team && filters.team.trim() !== '') {
            filterParams.team = filters.team.trim();
        }
        
        fetchPlayers(filterParams);
        setFilterOpen(false);
    };
    
    // Fungsi untuk mereset filter
    const handleResetFilters = () => {
        setFilters({
            role: "all",
            team: "",
        });
        fetchPlayers();
        setFilterOpen(false);
    };
    
    // Gunakan real data jika tersedia, jika tidak gunakan dummy data
    const players = realPlayers.length > 0 
        ? realPlayers 
        : (gameType === "free-fire" ? freeFirePlayers : mobileLegendPlayers)

    const filteredPlayers = players.filter(
        (player) =>
            player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (player.team_name && player.team_name.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    const handleExportCSV = () => {
        // Redirect ke endpoint CSV export sesuai dengan game type
        window.location.href = gameType === "free-fire" 
            ? "/secure-admin-essega/export/FFplayers" 
            : "/secure-admin-essega/export/MLplayers"
    }

    return (
        <>
            <Card className="border-none shadow-md">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Daftar Pemain</CardTitle>
                            <CardDescription>
                                Kelola pemain {gameType === "free-fire" ? "Free Fire" : "Mobile Legends"}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 gap-1"
                                onClick={handleExportCSV}
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span>CSV</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari pemain atau tim..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                Total: {filteredPlayers.length} pemain
                            </Badge>
                            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Filter Pemain</h4>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0"
                                                onClick={() => setFilterOpen(false)}
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Close</span>
                                            </Button>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Status Anggota</Label>
                                            <Select
                                                value={filters.role}
                                                onValueChange={(value) => setFilters({...filters, role: value})}
                                            >
                                                <SelectTrigger id="role">
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Status</SelectItem>
                                                    <SelectItem value="ketua">Ketua</SelectItem>
                                                    <SelectItem value="anggota">Anggota</SelectItem>
                                                    <SelectItem value="cadangan">Cadangan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="team">Tim</Label>
                                            <Input
                                                id="team"
                                                placeholder="Masukkan nama tim"
                                                value={filters.team}
                                                onChange={(e) => setFilters({...filters, team: e.target.value})}
                                            />
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <Button variant="outline" size="sm" onClick={handleResetFilters}>
                                                Reset
                                            </Button>
                                            <Button size="sm" onClick={handleApplyFilters}>
                                                Terapkan Filter
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Pemain</TableHead>
                                    <TableHead>Tim</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>ID Server</TableHead>
                                    <TableHead>No. HP</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead>Dokumen</TableHead>
                                    <TableHead>Terdaftar Pada</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-6">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-3"></div>
                                                <span className="text-gray-500">Memuat data pemain...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPlayers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-6">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-gray-500">Tidak ada pemain yang ditemukan</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPlayers.map((player) => (
                                        <TableRow key={player.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                                                        <AvatarFallback>{player.nickname.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{player.name}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                            {player.nickname}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{player.team_name || '-'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={`font-normal ${
                                                    player.role === "ketua" ? "bg-purple-100 text-purple-800" : 
                                                    player.role === "anggota" ? "bg-green-100 text-green-800" : 
                                                    "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                    {player.role === "ketua" ? "Ketua" : 
                                                     player.role === "anggota" ? "Anggota" : 
                                                     "Cadangan"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{player.id_server || '-'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{player.no_hp || '-'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{player.email || '-'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm truncate max-w-[150px]" title={player.alamat || '-'}>
                                                    {player.alamat || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {player.tanda_tangan ? (
                                                        <a href={player.tanda_tangan} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                                            <FileText className="h-4 w-4 mr-1" />
                                                            Tanda Tangan
                                                        </a>
                                                    ) : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {typeof player.joinDate === 'string' 
                                                        ? new Date(player.joinDate).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })
                                                        : "N/A"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className="flex gap-2 cursor-pointer"
                                                            onClick={() => handleEditClick(player)}
                                                        >
                                                            <Edit className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex gap-2 text-red-600 cursor-pointer"
                                                            onClick={() => {
                                                                setPlayerToDelete(player);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">Hapus Pemain</DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus pemain ini?<br />
                            <span className="font-semibold">{playerToDelete?.name}</span> ({playerToDelete?.nickname})
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeletePlayer}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Dialog Edit Pemain */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Data Pemain</DialogTitle>
                        <DialogDescription>
                            Edit informasi pemain ini. Klik simpan saat selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Lengkap</Label>
                                <Input
                                    id="edit-name"
                                    value={playerForm.name}
                                    onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                                    placeholder="Nama lengkap pemain"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-nickname">Nickname</Label>
                                <Input
                                    id="edit-nickname"
                                    value={playerForm.nickname}
                                    onChange={(e) => setPlayerForm({...playerForm, nickname: e.target.value})}
                                    placeholder="Nickname dalam game"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Status Anggota</Label>
                                <Select
                                    value={playerForm.role}
                                    onValueChange={(value) => setPlayerForm({...playerForm, role: value as "ketua" | "anggota" | "cadangan"})}
                                >
                                    <SelectTrigger id="edit-role">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ketua">Ketua</SelectItem>
                                        <SelectItem value="anggota">Anggota</SelectItem>
                                        <SelectItem value="cadangan">Cadangan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-id-server">ID Server</Label>
                                <Input
                                    id="edit-id-server"
                                    value={playerForm.id_server}
                                    onChange={(e) => setPlayerForm({...playerForm, id_server: e.target.value})}
                                    placeholder="ID Server dalam game"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={playerForm.email}
                                    onChange={(e) => setPlayerForm({...playerForm, email: e.target.value})}
                                    placeholder="Email pemain"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Nomor HP</Label>
                                <Input
                                    id="edit-phone"
                                    value={playerForm.no_hp}
                                    onChange={(e) => setPlayerForm({...playerForm, no_hp: e.target.value})}
                                    placeholder="Nomor HP pemain"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-address">Alamat</Label>
                            <Input
                                id="edit-address"
                                value={playerForm.alamat}
                                onChange={(e) => setPlayerForm({...playerForm, alamat: e.target.value})}
                                placeholder="Alamat pemain"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveEdit}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
