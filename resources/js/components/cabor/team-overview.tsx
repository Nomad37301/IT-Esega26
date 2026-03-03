'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Download, TrendingUp, Trophy, Users, Edit, Trash2, MoreVertical } from 'lucide-react';
import { TeamPerformanceChart } from './team-performance-chart';
import { TeamRegistrationChart } from './team-registration-chart';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

interface Team {
    id: number;
    name: string;
    game: string;
    playerCount: number;
    achievements: number;
    logo: string;
    color: string;
}

interface TeamOverviewProps {
    totalTeams: number;
    totalPlayers: number;
    achievementsTotal: number;
    winrate: string | number;
    teams: Team[];
}

export function TeamOverview({ totalTeams, totalPlayers, achievementsTotal, winrate, teams = [] }: TeamOverviewProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
    
    // Fungsi untuk menangani penghapusan tim
    const handleDeleteTeam = async () => {
        if (!teamToDelete) return;
        
        try {
            const game = teamToDelete.game === 'Free Fire' ? 'ff' : 'ml';
            const response = await axios.delete(`/api/teams/${game}/${teamToDelete.id}`);
            
            // Cek apakah ada informasi redirect dari backend
            if (response.data.redirect) {
                // Tampilkan pesan sukses
                toast.success(`Tim ${teamToDelete.name} berhasil dihapus beserta semua pemainnya.`);
                
                // Redirect ke halaman yang ditentukan oleh backend
                const redirect = response.data.redirect;
                const url = redirect.path + 
                    (redirect.params ? '?' + new URLSearchParams(redirect.params).toString() : '');
                
                // Delay sedikit untuk memastikan toast message terlihat
                setTimeout(() => {
                    window.location.href = url;
                }, 1000);
            } else {
                // Jika tidak ada redirect, reload halaman seperti biasa
                toast.success(`Tim ${teamToDelete.name} berhasil dihapus beserta semua pemainnya.`);
                window.location.reload();
            }
            
            setIsDeleteDialogOpen(false);
            setTeamToDelete(null);
        } catch (error) {
            console.error("Error deleting team:", error);
            toast.error("Gagal menghapus tim. Silakan coba lagi.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none bg-gradient-to-br from-purple-50 to-purple-100 shadow-md dark:from-purple-950/20 dark:to-purple-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Total Teams</p>
                                <h3 className="mt-1 text-3xl font-bold">{totalTeams}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-pink-50 to-pink-100 shadow-md dark:from-pink-950/20 dark:to-pink-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Total Players</p>
                                <h3 className="mt-1 text-3xl font-bold">{totalPlayers}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                                <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-amber-50 to-amber-100 shadow-md dark:from-amber-950/20 dark:to-amber-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Achievements</p>
                                <h3 className="mt-1 text-3xl font-bold">{achievementsTotal}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md dark:from-emerald-950/20 dark:to-emerald-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Win Rate</p>
                                <h3 className="mt-1 text-3xl font-bold">{winrate}</h3>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Team Registration</CardTitle>
                        <CardDescription>Monthly team registrations over the past year</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TeamRegistrationChart />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Team Performance</CardTitle>
                        <CardDescription>Win rates by game category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TeamPerformanceChart />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Teams</CardTitle>
                            <CardDescription>Manage your esports teams</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.open('/secure-admin-essega/export/teams', '_blank')}>
                                <Download className="h-3.5 w-3.5" />
                                <span>Teams</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.open('/secure-admin-essega/export/all-players', '_blank')}>
                                <Download className="h-3.5 w-3.5" />
                                <span>Players</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.open('/secure-admin-essega/export/all-files-data', '_blank')}>
                                <Download className="h-3.5 w-3.5" />
                                <span>All Data + Files (ZIP)</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        {teams.map((team) => (
                            <Card key={team.id} className="overflow-hidden border-none shadow-md">
                                <div className={`h-2 w-full bg-gradient-to-r ${team.color}`}></div>
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="border-border h-14 w-14 border-2">
                                        <AvatarImage src={team.logo || '/placeholder.svg'} alt={team.name} />
                                        <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{team.name}</CardTitle>
                                        <CardDescription>
                                            <Badge variant="outline" className="mr-1">
                                                {team.game}
                                            </Badge>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="text-muted-foreground h-4 w-4" />
                                            <span className="text-sm">{team.playerCount} Players</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Trophy className="text-muted-foreground h-4 w-4" />
                                            <span className="text-sm">{team.achievements} Achievements</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-white">
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
                                                        className="flex items-center cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Lihat Detail</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-red-600 flex items-center cursor-pointer"
                                                    onClick={() => {
                                                        setTeamToDelete(team);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Hapus Tim</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Konfirmasi Hapus Tim */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Tim</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus tim <span className="font-semibold">{teamToDelete?.name}</span>?
                            <br />
                            <span className="text-red-500">Semua pemain yang terkait dengan tim ini juga akan dihapus.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
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
                            Hapus Tim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
