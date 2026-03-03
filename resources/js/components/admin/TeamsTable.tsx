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
import { Search, MoreVertical, Edit, Trash2, UserRound, Filter, Download, X } from "lucide-react"
import axios from "axios"
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
import { toast } from "react-hot-toast"

// Model untuk tim Mobile Legends
type MLTeam = {
    id: number
    team_name: string
    team_logo: string
    proof_of_payment: string
    status: string
    slot_type: string
    slot_count: number
    created_at: string
    participant_count?: number
}

// Model untuk tim Free Fire
type FFTeam = {
    id: number
    team_name: string
    team_logo: string
    proof_of_payment: string
    status: string
    created_at: string
    participant_count?: number
}

// Gabungan tipe untuk tim
type Team = MLTeam | FFTeam

export function TeamsTable({ gameType }: { gameType: "free-fire" | "mobile-legends" }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [teams, setTeams] = useState<Team[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [teamToEdit, setTeamToEdit] = useState<Team | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        status: "",
        slot_type: "",
    })
    const [teamForm, setTeamForm] = useState({
        team_name: "",
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
            const game = gameType === "free-fire" ? 'ff' : 'ml'
            
            // Jika ada filter yang diaplikasikan
            if (Object.keys(filterParams).length > 0) {
                const params = new URLSearchParams()
                
                // Tambahkan parameter filter ke URL
                Object.entries(filterParams).forEach(([key, value]) => {
                    if (value) params.append(key, value as string)
                })
                
                if (searchQuery) params.append('search', searchQuery)
                
                const response = await axios.get(`/api/teams/${game}/filter?${params.toString()}`)
                setTeams(response.data)
            } else {
                // Jika tidak ada filter, ambil semua tim
                const response = await axios.get(`/api/teams/${game}`)
                setTeams(response.data)
            }
        } catch (error) {
            console.error("Error fetching teams:", error)
            toast.error("Gagal memuat data tim. Silakan coba lagi.")
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
            const game = gameType === "free-fire" ? 'ff' : 'ml'
            const response = await axios.delete(`/api/teams/${game}/${teamToDelete.id}`)
            
            toast.success(`Tim ${teamToDelete.team_name} berhasil dihapus beserta semua pemainnya.`)
            
            // Cek apakah ada informasi redirect dari backend
            if (response.data.redirect) {
                // Redirect ke halaman yang ditentukan oleh backend
                const redirect = response.data.redirect
                const url = redirect.path + 
                    (redirect.params ? '?' + new URLSearchParams(redirect.params).toString() : '')
                
                // Delay sedikit untuk memastikan toast message terlihat
                setTimeout(() => {
                    window.location.href = url
                }, 1000)
            } else {
                // Jika tidak ada redirect, refresh daftar tim seperti biasa
                await fetchTeams()
            }
            
            setIsDeleteDialogOpen(false)
            setTeamToDelete(null)
        } catch (error) {
            console.error("Error deleting team:", error)
            toast.error("Gagal menghapus tim. Silakan coba lagi.")
        } finally {
            setLoading(false)
        }
    }
    
    // Fungsi untuk membuka dialog edit
    const handleEditClick = (team: Team) => {
        setTeamToEdit(team)
        setTeamForm({
            team_name: team.team_name,
            status: team.status,
            slot_type: 'slot_type' in team ? team.slot_type : 'single',
        })
        setIsEditDialogOpen(true)
    }
    
    // Fungsi untuk menyimpan perubahan edit
    const handleSaveEdit = async () => {
        if (!teamToEdit) return
        
        try {
            setLoading(true)
            const game = gameType === "free-fire" ? 'ff' : 'ml'
            
            await axios.put(`/api/teams/${game}/${teamToEdit.id}`, teamForm)
            
            toast.success(`Tim ${teamToEdit.team_name} berhasil diperbarui.`)
            
            // Refresh daftar tim
            await fetchTeams()
            
            setIsEditDialogOpen(false)
            setTeamToEdit(null)
        } catch (error) {
            console.error("Error updating team:", error)
            toast.error("Gagal memperbarui tim. Silakan coba lagi.")
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
        (team) => team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
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
    
    // Format tanggal ke format yang lebih mudah dibaca
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date)
    }
    
    // Handle export teams
    const handleExportCSV = () => {
        const game = gameType === "free-fire" ? 'ff' : 'ml'
        window.location.href = `/secure-admin-essega/export/teams/${game}`
    }

    return (
        <>
            <Card className="border-none shadow-md">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Daftar Tim {gameType === "free-fire" ? "Free Fire" : "Mobile Legends"}</CardTitle>
                            <CardDescription>
                                Kelola tim peserta turnamen {gameType === "free-fire" ? "Free Fire" : "Mobile Legends"}
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
                                <span>Export Data</span>
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
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
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
                                            <Button size="sm" onClick={handleApplyFilters} className="bg-red-600 hover:bg-red-700">
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
                                        <TableCell colSpan={gameType === "mobile-legends" ? 6 : 5} className="text-center py-6">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-3"></div>
                                                <span className="text-gray-500">Memuat data tim...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTeams.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={gameType === "mobile-legends" ? 6 : 5} className="text-center py-6">
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
                                                        <AvatarImage src={team.team_logo || "/placeholder.svg"} alt={team.team_name} />
                                                        <AvatarFallback>{team.team_name.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">{team.team_name}</div>
                                                </div>
                                            </TableCell>
                                            {gameType === "mobile-legends" && (
                                                <TableCell>
                                                    <Badge variant="secondary" className={
                                                        'slot_type' in team && team.slot_type === "double" 
                                                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200" 
                                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                    }>
                                                        {'slot_type' in team && team.slot_type === "double"
                                                            ? "Double Slot" 
                                                            : "Single Slot"}
                                                    </Badge>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-sm">{team.participant_count || 0}</span>
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
                                                    {formatDate(team.created_at)}
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
                                                            onClick={() => handleEditClick(team)}
                                                        >
                                                            <Edit className="h-4 w-4" /> Edit
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
                <DialogContent className="border-red-500">
                    <DialogHeader>
                        <DialogTitle className="text-center">Hapus Tim</DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus tim ini?<br />
                            <span className="font-semibold">{teamToDelete?.team_name}</span>
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
            
            {/* Dialog Edit Tim */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">Edit Tim</DialogTitle>
                        <DialogDescription className="text-center">
                            Perbarui informasi tim {teamToEdit?.team_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="team-name">Nama Tim</Label>
                            <Input
                                id="team-name"
                                placeholder="Nama Tim"
                                value={teamForm.team_name}
                                onChange={(e) => setTeamForm({ ...teamForm, team_name: e.target.value })}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="team-status">Status</Label>
                            <Select
                                value={teamForm.status}
                                onValueChange={(value) => setTeamForm({ ...teamForm, status: value })}
                            >
                                <SelectTrigger id="team-status">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
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
                                    value={teamForm.slot_type}
                                    onValueChange={(value) => setTeamForm({ ...teamForm, slot_type: value })}
                                >
                                    <SelectTrigger id="slot-type">
                                        <SelectValue placeholder="Pilih jenis slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {slotTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type === "single" ? "Single Slot" : "Double Slot"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700">
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
} 