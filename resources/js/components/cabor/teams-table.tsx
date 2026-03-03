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
import { Search, MoreVertical, Edit, Trash2, Filter, Download, X, Users } from "lucide-react"
import axios from "axios"
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
import { Link } from "@inertiajs/react"

// Tipe respons API untuk Tim FF
interface FFTeamResponse {
    id: number
    team_name: string
    team_logo?: string
    participant_count?: number
    status: string
    created_at: string
}

// Tipe respons API untuk Tim ML
interface MLTeamResponse {
    id: number
    team_name: string
    team_logo?: string
    participant_count?: number
    status: string
    slot_type?: string
    created_at: string
}

type Team = {
    id: number
    name: string
    game: string
    playerCount: number
    logo: string
    color: string
    status: string
    created_at: string
    slot_type?: string
}

export function TeamsTable({ gameType }: { gameType: "free-fire" | "mobile-legends" | "all" }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [teams, setTeams] = useState<Team[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        status: "",
        slot_type: "",
    })
    
    // Status untuk filter dropdown
    const statusOptions = ["pending", "verified", "rejected"]
    
    // Slot types untuk Mobile Legends
    const slotTypes = gameType === "mobile-legends" ? ["single", "double"] : []
    
    // Fungsi untuk memuat data tim dari API
    const fetchTeams = async (filterParams = {}) => {
        try {
            setLoading(true)
            let endpoint;
            
            // Tentukan endpoint berdasarkan gameType
            if (gameType === "free-fire") {
                endpoint = '/api/teams/ff';
            } else if (gameType === "mobile-legends") {
                endpoint = '/api/teams/ml';
            } else {
                // Jika all, gabungkan data dari kedua endpoint
                const [ffResponse, mlResponse] = await Promise.all([
                    axios.get('/api/teams/ff'),
                    axios.get('/api/teams/ml')
                ]);
                
                // Format data FF
                const ffTeams = ffResponse.data.map((team: FFTeamResponse) => ({
                    id: team.id,
                    name: team.team_name,
                    game: "Free Fire",
                    playerCount: team.participant_count || 0,
                    logo: team.team_logo ? `/storage/${team.team_logo}` : "/placeholder.svg",
                    color: "from-orange-500 to-red-600",
                    status: team.status,
                    created_at: new Date(team.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }),
                }));
                
                // Format data ML
                const mlTeams = mlResponse.data.map((team: MLTeamResponse) => ({
                    id: team.id,
                    name: team.team_name,
                    game: "Mobile Legends",
                    playerCount: team.participant_count || 0,
                    logo: team.team_logo ? `/storage/${team.team_logo}` : "/placeholder.svg",
                    color: "from-blue-500 to-purple-600",
                    status: team.status,
                    slot_type: team.slot_type,
                    created_at: new Date(team.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }),
                }));
                
                setTeams([...ffTeams, ...mlTeams]);
                setLoading(false);
                return;
            }
            
            // Jika memilih game tertentu dan ada filter, gunakan endpoint filter
            if (Object.keys(filterParams).length > 0) {
                const game = gameType === "free-fire" ? 'ff' : 'ml';
                const params = new URLSearchParams();
                
                // Tambahkan parameter filter ke URL
                Object.entries(filterParams).forEach(([key, value]) => {
                    if (value) params.append(key, value as string);
                });
                
                if (searchQuery) params.append('search', searchQuery);
                
                const response = await axios.get(`/api/teams/${game}/filter?${params.toString()}`);
                
                if (gameType === "free-fire") {
                    setTeams(response.data.map((team: FFTeamResponse) => ({
                        id: team.id,
                        name: team.team_name,
                        game: "Free Fire",
                        playerCount: team.participant_count || 0,
                        logo: team.team_logo ? `/storage/${team.team_logo}` : "/placeholder.svg",
                        color: "from-orange-500 to-red-600",
                        status: team.status,
                        created_at: new Date(team.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }),
                    })));
                } else {
                    setTeams(response.data.map((team: MLTeamResponse) => ({
                        id: team.id,
                        name: team.team_name,
                        game: "Mobile Legends",
                        playerCount: team.participant_count || 0,
                        logo: team.team_logo ? `/storage/${team.team_logo}` : "/placeholder.svg",
                        color: "from-blue-500 to-purple-600",
                        status: team.status,
                        slot_type: team.slot_type,
                        created_at: new Date(team.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }),
                    })));
                }
            } else {
                // Jika tidak ada filter, ambil semua data tim dari endpoint
                const response = await axios.get(endpoint);
                
                if (gameType === "free-fire") {
                    setTeams(response.data.map((team: FFTeamResponse) => ({
                        id: team.id,
                        name: team.team_name,
                        game: "Free Fire",
                        playerCount: team.participant_count || 0,
                        logo: team.team_logo ? `/storage/${team.team_logo}` : "/placeholder.svg",
                        color: "from-orange-500 to-red-600",
                        status: team.status,
                        created_at: new Date(team.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }),
                    })));
                } else {
                    setTeams(response.data.map((team: MLTeamResponse) => ({
                        id: team.id,
                        name: team.team_name,
                        game: "Mobile Legends",
                        playerCount: team.participant_count || 0,
                        logo: team.team_logo ? `/storage/${team.team_logo}` : "/placeholder.svg",
                        color: "from-blue-500 to-purple-600",
                        status: team.status,
                        slot_type: team.slot_type,
                        created_at: new Date(team.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        }),
                    })));
                }
            }
        } catch (error) {
            console.error("Error fetching teams:", error)
            setTeams([])
        } finally {
            setLoading(false)
        }
    }
    
    // Load data saat komponen dimuat atau gameType berubah
    useEffect(() => {
        fetchTeams()
    }, [gameType])
    
    // Fungsi untuk menghapus tim
    const handleDeleteTeam = async () => {
        if (!teamToDelete) return
        
        try {
            setLoading(true)
            const game = teamToDelete.game === 'Free Fire' ? 'ff' : 'ml'
            await axios.delete(`/api/teams/${game}/${teamToDelete.id}`)
            
            toast.success(`Tim ${teamToDelete.name} berhasil dihapus beserta semua pemainnya.`)
            
            // Refresh daftar tim
            await fetchTeams()
            
            setIsDeleteDialogOpen(false)
            setTeamToDelete(null)
        } catch (error) {
            console.error("Error deleting team:", error)
            toast.error("Gagal menghapus tim. Silakan coba lagi.")
        } finally {
            setLoading(false)
        }
    }
    
    // Fungsi untuk menerapkan filter
    const handleApplyFilters = () => {
        fetchTeams(filters)
        setFilterOpen(false)
    }
    
    // Fungsi untuk mereset filter
    const handleResetFilters = () => {
        setFilters({
            status: "",
            slot_type: "",
        })
        fetchTeams()
        setFilterOpen(false)
    }
    
    // Filter teams berdasarkan search query
    const filteredTeams = teams.filter(
        (team) => team.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Ambil warna status untuk badge
    const getStatusColor = (status: string) => {
        switch (status) {
            case "verified":
                return "bg-green-500"
            case "pending":
                return "bg-yellow-500"
            case "rejected":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }
    
    // Handle export teams
    const handleExportCSV = () => {
        window.location.href = "/secure-admin-essega/export/teams"
    }

    return (
        <>
            <Card className="border-none shadow-md">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Daftar Tim</CardTitle>
                            <CardDescription>
                                {gameType === "all" 
                                    ? "Kelola semua tim" 
                                    : `Kelola tim ${gameType === "free-fire" ? "Free Fire" : "Mobile Legends"}`}
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
                                placeholder="Cari tim..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                Total: {filteredTeams.length} tim
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
                                            <h4 className="font-medium">Filter Tim</h4>
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
                                            <Label htmlFor="status">Status Tim</Label>
                                            <Select
                                                value={filters.status}
                                                onValueChange={(value) => setFilters({...filters, status: value})}
                                            >
                                                <SelectTrigger id="status">
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Semua Status</SelectItem>
                                                    {statusOptions.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status === "pending" ? "Menunggu" : 
                                                             status === "verified" ? "Terverifikasi" : 
                                                             status === "rejected" ? "Ditolak" : status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        {gameType === "mobile-legends" && (
                                            <div className="space-y-2">
                                                <Label htmlFor="slot-type">Jenis Slot</Label>
                                                <Select
                                                    value={filters.slot_type}
                                                    onValueChange={(value) => setFilters({...filters, slot_type: value})}
                                                >
                                                    <SelectTrigger id="slot-type">
                                                        <SelectValue placeholder="Pilih jenis slot" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">Semua Jenis Slot</SelectItem>
                                                        {slotTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type === "single" ? "Single Slot" : "Double Slot"}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        
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
                                    <TableHead>Tim</TableHead>
                                    <TableHead>Game</TableHead>
                                    {gameType === "mobile-legends" && <TableHead>Jenis Slot</TableHead>}
                                    <TableHead>Jumlah Pemain</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Terdaftar Pada</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={gameType === "mobile-legends" ? 7 : 6} className="text-center py-6">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-3"></div>
                                                <span className="text-gray-500">Memuat data tim...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTeams.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={gameType === "mobile-legends" ? 7 : 6} className="text-center py-6">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-gray-500">Tidak ada tim yang ditemukan</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTeams.map((team) => (
                                        <TableRow key={team.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarImage src={team.logo || "/placeholder.svg"} alt={team.name} />
                                                        <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{team.name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={
                                                    team.game === "Free Fire" 
                                                        ? "bg-orange-100 text-orange-800 hover:bg-orange-200" 
                                                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                }>
                                                    {team.game}
                                                </Badge>
                                            </TableCell>
                                            {gameType === "mobile-legends" && (
                                                <TableCell>
                                                    <span className="text-sm">{team.slot_type === "single" ? "Single Slot" : "Double Slot"}</span>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-sm">{team.playerCount}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${getStatusColor(team.status)}`} />
                                                    <span className="capitalize text-sm">
                                                        {team.status === "pending" ? "Menunggu" : 
                                                         team.status === "verified" ? "Terverifikasi" : 
                                                         team.status === "rejected" ? "Ditolak" : team.status}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {team.created_at}
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
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/secure-admin-essega/teams/${team.game === "Free Fire" ? "ff" : "ml"}/${team.id}`}
                                                                className="flex gap-2 cursor-pointer"
                                                            >
                                                                <Edit className="h-4 w-4" /> Detail & Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="flex gap-2 text-red-600 cursor-pointer"
                                                            onClick={() => {
                                                                setTeamToDelete(team);
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
                        <DialogTitle className="text-center">Hapus Tim</DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus tim ini?<br />
                            <span className="font-semibold">{teamToDelete?.name}</span> ({teamToDelete?.game})
                            <div className="text-red-500 mt-2 text-sm">Semua pemain yang terkait dengan tim ini juga akan dihapus.</div>
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
                            onClick={handleDeleteTeam}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 