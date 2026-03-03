"use client"

import { Gamepad2, Smartphone, Calendar, DollarSign, Users, ShieldCheck, Trophy, Zap } from "lucide-react"
import type { GameSelectionFormProps, GameStats } from "@/types/register"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"

export function GameSelectionForm({ onGameSelect, gameStats: initialGameStats }: GameSelectionFormProps) {
    const [gameStats, setGameStats] = useState<GameStats[] | undefined>(initialGameStats);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Fungsi untuk memuat data slot terbaru dari server
    const loadSlotData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/competition-slots');
            
            if (response.data.success) {
                // Transform data dari API ke format GameStats
                const formattedStats = response.data.data.map((slot: {
                    competition_name: string;
                    total_slots: number;
                    used_slots: number;
                }) => ({
                    game_type: slot.competition_name === 'Mobile Legends' ? 'ml' : 'ff',
                    total_slots: slot.total_slots,
                    used_slots: slot.used_slots,
                    registered_teams: `${slot.used_slots} Teams`
                }));
                
                setGameStats(formattedStats);
            }
        } catch (error) {
            console.error('Error loading slot data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Muat data slot saat komponen dimuat
    useEffect(() => {
        loadSlotData();
    }, []);
    
    // Fungsi helper untuk menghitung persentase slot terpakai
    const getSlotPercentage = (gameId: string) => {
        if (!gameStats) return gameId === 'ml' ? 0 : 0;
        
        const game = gameStats.find((g: GameStats) => g.game_type === gameId);
        if (!game) return 0;
        
        const totalSlots = game.total_slots;
        const usedSlots = game.used_slots;
        
        return totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;
    };
    
    const getSlotRemaining = (gameId: string) => {
        if (!gameStats) return gameId === 'ml' ? 64 : 48;
        
        const game = gameStats.find((g: GameStats) => g.game_type === gameId);
        if (!game) return gameId === 'ml' ? 64 : 48;
        
        return game.total_slots - game.used_slots;
    };
    
    const games = [
        {
            id: "ml",
            title: "Mobile Legends",
            slots: "64 SLOT",
            type: "SINGLE & DOUBLE SLOT",
            scope: "NATIONAL COMPETITION",
            date: "12th, 18th, 19th JULI 2025",
            mode: "ONLINE",
            image: "/Images/ML-logo.png",
            bgImage: "/Images/ML-bg-high.jpeg",
            icon: Smartphone,
            color: "from-purple-500 to-indigo-600",
            textColor: "text-purple-600",
            bgColor: "bg-purple-100",
            fee: "Rp 100.000",
            status: getSlotRemaining('ml') > 0 ? "Available" : "Closed",
            statusColor: getSlotRemaining('ml') > 0 ? "bg-green-500" : "bg-red-500",
            totalSlots: gameStats?.find((g: GameStats) => g.game_type === 'ml')?.total_slots || 64,
            teams: gameStats?.find((g: GameStats) => g.game_type === 'ml')?.registered_teams || "0 Teams",
            isDisabled: getSlotRemaining('ml') <= 0
        },
        {
            id: "ff",
            title: "Free Fire",
            slots: "48 SLOT",
            type: "SINGLE SLOT ONLY",
            scope: "NATIONAL COMPETITION",
            date: "5th JULI 2025",
            mode: "ONLINE",
            image: "/Images/FF-logo.png",
            bgImage: "/Images/FF-bg-high.jpeg",
            icon: Gamepad2,
            color: "from-orange-500 to-red-600",
            textColor: "text-orange-600",
            bgColor: "bg-orange-100",
            fee: "Rp 100.000",
            status: getSlotRemaining('ff') > 0 ? "Available" : "Closed",
            statusColor: getSlotRemaining('ff') > 0 ? "bg-green-500" : "bg-red-500",
            totalSlots: gameStats?.find((g: GameStats) => g.game_type === 'ff')?.total_slots || 48,
            teams: gameStats?.find((g: GameStats) => g.game_type === 'ff')?.registered_teams || "0 Teams",
            isDisabled: getSlotRemaining('ff') <= 0
        }
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {isLoading && (
                    <div className="text-center mb-4 text-sm text-gray-500">
                        <p>Memperbarui data slot...</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {games.map((game) => (
                        <motion.div
                            key={game.id}
                            className={`relative rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 group
                                ${game.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}
                            whileHover={!game.isDisabled ? { scale: 1.02, y: -4 } : {}}
                            onClick={() => !game.isDisabled && onGameSelect(game.id as "ml" | "ff")}
                        >
                            {game.isDisabled && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                                    <div className="text-center px-6 py-4 bg-white/10 rounded-lg border border-white/20">
                                        <div className="mb-2">
                                            <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <span className="text-white font-bold text-xl block mb-2">Registrasi Ditutup</span>
                                        <span className="text-white/90 text-sm block max-w-[200px] mx-auto">Slot sudah penuh</span>
                                    </div>
                                </div>
                            )}
                            {/* Game Header */}
                            <div className="h-55 bg-gradient-to-r relative overflow-hidden" 
                                 style={{backgroundImage: `url(${game.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '210px'}}>
                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
                                
                                {/* Game Logo */}
                                <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                                    <img src={game.image} alt={game.title} className="h-20 object-contain filter drop-shadow-lg" />
                                </div>
                                
                                {/* Game Title */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-2xl font-bold text-white mb-1.5">{game.title}</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                                            <Trophy className="w-3.5 h-3.5" />
                                            {game.scope}
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5" />
                                            {game.type}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className={`px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5 ${game.statusColor}`}>
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        {game.status}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Game Info Section */}
                            <div className="p-6">                            
                                {/* Slot Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-red-500 mr-1.5" />
                                            <span className="text-sm font-semibold text-gray-700">Slot Tersedia</span>
                                        </div>
                                        <span className="text-xs font-medium px-3 py-1 bg-red-50 text-red-600 rounded-full">
                                            {getSlotRemaining(game.id)} dari {game.totalSlots}
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                                            style={{width: `${getSlotPercentage(game.id)}%`}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span className="text-gray-500">
                                            {getSlotPercentage(game.id)}% terisi
                                        </span>
                                        <span className="text-gray-500 font-medium">
                                            {game.id === 'ml' ? 'Single & Double Slot' : 'Single Slot Only'}
                                        </span>
                                    </div>
                                </div>

                                {/* Fee Section */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-5">
                                    <div className="flex items-center mb-1.5">
                                        <DollarSign className="w-5 h-5 text-red-600 mr-2" />
                                        <h4 className="text-base font-semibold text-gray-800">Biaya Pendaftaran</h4>
                                    </div>
                                    
                                    {game.id === 'ml' ? (
                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                                <div className="text-xs text-gray-500 mb-1">Single Slot</div>
                                                <div className="text-red-600 font-bold">{game.fee}</div>
                                                <div className="text-xs text-gray-500 mt-1">1 Tim, 1 Slot</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                                                <div className="text-xs text-gray-500 mb-1">Double Slot</div>
                                                <div className="text-red-600 font-bold">Rp 200.000</div>
                                                <div className="text-xs text-gray-500 mt-1">1 Tim, 2 Slot</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white p-3 rounded-lg border border-red-200 text-center mt-3">
                                            <div className="text-xs text-gray-500 mb-1">Single Slot Only</div>
                                            <div className="text-red-600 font-bold">{game.fee}</div>
                                            <div className="text-xs text-gray-500 mt-1">Free Fire hanya tersedia dalam format Single Slot</div>
                                        </div>
                                    )}
                                </div>

                                {/* Date Highlight */}
                                <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4">
                                    <div className="flex items-center mb-1">
                                        <Calendar className="w-5 h-5 text-red-500 mr-2" />
                                        <h4 className="text-base font-semibold text-gray-800">Tanggal Turnamen</h4>
                                    </div>
                                    <div className="pl-7 text-sm font-medium text-red-600 mt-1.5">{game.date}</div>
                                </div>
                                
                                <div className="mt-5">
                                    <button 
                                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl 
                                        font-medium hover:from-red-700 hover:to-red-600 transition-all duration-300 
                                        flex items-center justify-center shadow-md hover:shadow-lg group"
                                    >
                                        <Gamepad2 className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                        <span className="group-hover:tracking-wider transition-all duration-300">Pilih Game Ini</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
