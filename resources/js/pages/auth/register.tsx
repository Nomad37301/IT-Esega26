"use client"

import { useState, useEffect } from "react"
import { GameSelectionForm } from "@/components/registration/game-selection-form"
import { TeamRegistrationForm } from "@/components/registration/team-registration-form"
import type { TeamData, GameStats } from "@/types/register"
import { Head, router } from "@inertiajs/react"
import { motion } from "framer-motion"
import * as AOS from "aos"
import "aos/dist/aos.css"
import { ChevronLeft, ArrowLeft, CheckCircle } from "lucide-react"
import axios from "axios"
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [gameType, setGameType] = useState<"ml" | "ff">("ml")
    const [teamData, setTeamData] = useState<TeamData>({
        id: null,
        team_name: "",
        proof_of_payment: null,
        team_logo: null,
    })
    const [gameStats, setGameStats] = useState<GameStats[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [showLastDeletedTeamIdDialog, setShowLastDeletedTeamIdDialog] = useState(false)

    useEffect(() => {
        // Inisialisasi AOS hanya sekali saat komponen di-mount
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
            offset: 100,
            delay: 0,
            mirror: false,
            anchorPlacement: 'top-bottom',
            disable: 'mobile' // Opsional: menonaktifkan pada perangkat mobile jika perlu
        });
        
        // Muat data slot kompetisi saat komponen dimuat
        loadGameStats();
        
        // Cek apakah ada data tim yang dikirim dari halaman player registration
        const urlParams = new URLSearchParams(window.location.search);
        const teamDataParam = urlParams.get('teamData');
        const urlGameType = urlParams.get('game_type');
        
        if (urlGameType) {
            setGameType(urlGameType as "ml" | "ff");
        }
        
        if (urlParams.get('step') === '2') {
            setStep(2);
        }
        
        if (teamDataParam) {
            try {
                const decodedTeamData = JSON.parse(atob(teamDataParam));
                setTeamData(decodedTeamData);
            } catch (error) {
                console.error("Error parsing team data from URL:", error);
            }
        }
        
        // Cek apakah ada ID tim yang sebelumnya dihapus dan tersimpan di localStorage
        const lastDeletedTeamId = localStorage.getItem("last_deleted_team_id");
        const lastDeletedGameType = localStorage.getItem("last_deleted_game_type");
        
        console.log("DEBUG localStorage values:", {
            lastDeletedTeamId,
            lastDeletedGameType,
            currentGameType: urlGameType
        });
        
        if (lastDeletedTeamId && lastDeletedGameType === urlGameType) {
            console.log(`Found deleted team ID: ${lastDeletedTeamId} for game type: ${lastDeletedGameType}`);
            
            // Gunakan ID tim yang dihapus untuk pendaftaran baru
            const parsedId = parseInt(lastDeletedTeamId);
            
            console.log("Parsed team ID:", {
                asString: lastDeletedTeamId,
                asNumber: parsedId,
                isValid: !isNaN(parsedId)
            });
            
            if (!isNaN(parsedId)) {
                setTeamData(prevData => ({
                    ...prevData,
                    teamIdToReuse: parsedId
                }));
                
                // Tampilkan dialog info jika berada di step 2
                if (urlParams.get('step') === '2') {
                    setShowLastDeletedTeamIdDialog(true);
                }
                
                // Hapus data dari localStorage setelah digunakan
                localStorage.removeItem("last_deleted_team_id");
                localStorage.removeItem("last_deleted_game_type");
            } else {
                console.error("Invalid teamIdToReuse value from localStorage");
            }
        }
    }, []);
    
    // Fungsi untuk memuat data slot kompetisi
    const loadGameStats = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/competition-slots');
            
            if (response.data.success) {
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
            console.error('Error loading competition slot data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameSelect = (game: "ml" | "ff") => {
        setGameType(game)
        setStep(2)
    }

    const handleTeamSubmit = (data: TeamData) => {
        setTeamData(data)
        // Muat ulang data slot setelah pendaftaran tim berhasil
        loadGameStats()
        setStep(3)
    }

    const resetStep = () => {
        setStep(1)
        setGameType("ml")
        setTeamData({
            id: null,
            team_name: "",
            proof_of_payment: null,
            team_logo: null,
        })
        // Muat ulang data slot saat memulai pendaftaran baru
        loadGameStats()
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        } else {
            router.visit('/')
        }
    }

    // Fungsi untuk truncate database (fungsi admin)
    const adminTruncateTeams = async (gameType = 'all') => {
        try {
            if (process.env.NODE_ENV !== 'production') {
                const response = await axios.post(route('admin.truncate-teams'), {
                    game_type: gameType,
                    reset_slots: true
                });
                
                if (response.data.success) {
                    console.log('🧹 Database truncated successfully!');
                    window.location.reload();
                } else {
                    console.error('Error truncating database:', response.data.message);
                }
            }
        } catch (error) {
            console.error('Error executing admin command:', error);
        }
    };

    // Tambahkan event listener untuk shortcut Ctrl+Shift+T untuk truncate database
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Shortcut: Ctrl+Shift+T untuk truncate all
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                adminTruncateTeams('all');
            }
            
            // Shortcut: Ctrl+Shift+M untuk truncate ML
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                adminTruncateTeams('ml');
            }
            
            // Shortcut: Ctrl+Shift+F untuk truncate FF
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                adminTruncateTeams('ff');
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Tambahkan useEffect baru untuk membersihkan tim yang tidak selesai didaftarkan
    useEffect(() => {
        // Variabel untuk melacak tim yang sedang didaftar
        let teamToCleanup: { id: number | null; gameType: string } | null = null;
        let timeoutRef: number | null = null;

        // Handler untuk event beforeunload - ketika user menutup tab/browser
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Jika user sedang dalam proses pendaftaran dan sudah ada ID tim
            if (step === 2 && teamData.id) {
                // Simpan ID tim untuk digunakan kembali di sesi berikutnya
                localStorage.setItem("last_deleted_team_id", teamData.id.toString());
                localStorage.setItem("last_deleted_game_type", gameType);
                
                // Hapus tim yang tidak selesai didaftarkan
                axios.post('/delete-incomplete-team', {
                    team_id: teamData.id,
                    game_type: gameType
                }).catch(err => console.error("Error deleting incomplete team:", err));
                
                // Tampilkan pesan konfirmasi
                e.preventDefault();
                e.returnValue = "Pendaftaran anda belum selesai. Apakah anda yakin ingin keluar?";
                return e.returnValue;
            }
        };

        // Jika user sampai di step 2 dan memiliki ID tim, set timer untuk membersihkan tim
        if (step === 2 && teamData.id) {
            teamToCleanup = { id: teamData.id, gameType };
            
            // Buat timeout 30 menit - jika user tidak menyelesaikan pendaftaran
            timeoutRef = window.setTimeout(() => {
                if (teamToCleanup?.id) {
                    // Hapus tim yang tidak selesai didaftarkan setelah 30 menit
                    axios.post('/delete-incomplete-team', {
                        team_id: teamToCleanup.id,
                        game_type: teamToCleanup.gameType
                    }).catch(err => console.error("Error deleting inactive team:", err));
                    
                    // Simpan ID untuk digunakan kembali
                    localStorage.setItem("last_deleted_team_id", teamToCleanup.id.toString());
                    localStorage.setItem("last_deleted_game_type", teamToCleanup.gameType);
                    
                    // Redirect ke homepage dengan pesan
                    alert("Sesi pendaftaran Anda telah kedaluwarsa. Silakan daftar ulang.");
                    window.location.href = "/";
                }
            }, 30 * 60 * 1000); // 30 menit
        }

        // Daftarkan event listener untuk beforeunload
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup saat komponen unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            // Bersihkan timeout jika ada
            if (timeoutRef) {
                window.clearTimeout(timeoutRef);
            }
        };
    }, [step, teamData.id, gameType]);

    return (
        <>
            <Head title="IT-ESEGA 2025 Official Website | Register Team" />
            
            {/* Dialog informasi ID tim yang akan digunakan kembali */}
            <Dialog open={showLastDeletedTeamIdDialog} onOpenChange={setShowLastDeletedTeamIdDialog}>
                <DialogContent className="w-[95%] max-w-md p-0 rounded-md border-0 shadow-md mx-auto">
                    <div className="bg-white px-4 sm:px-5 pt-4 sm:pt-5 pb-4">
                        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
                            <DialogTitle className="text-sm sm:text-base font-semibold text-gray-900">
                                Konfirmasi Pendaftaran
                            </DialogTitle>
                        </div>
                        
                        <div className="py-4 sm:py-5">
                            <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-700">
                                Anda memiliki data tim yang baru saja dihapus.
                            </p>
                            <div className="flex items-start gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md mb-4 sm:mb-5">
                                <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs sm:text-sm text-red-700">
                                    Silahkan isi ulang data tim Anda untuk melanjutkan pendaftaran.
                                </p>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button 
                                    onClick={() => setShowLastDeletedTeamIdDialog(false)} 
                                    className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white font-normal px-3 sm:px-4 py-1 sm:py-2 h-auto transition-all duration-200"
                                >
                                    Saya Mengerti
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto">
                {/* Navigation Container */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm">
                    <div className="max-w-[1350px] mx-auto px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Back Button */}
                            <motion.button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 rounded-lg transition-colors duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {step > 1 ? (
                                    <>
                                        <ChevronLeft className="w-4 h-4" />
                                        <span className="hidden sm:inline">Langkah Sebelumnya</span>
                                        <span className="sm:hidden">Kembali</span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="hidden sm:inline">Kembali ke Beranda</span>
                                        <span className="sm:hidden">Beranda</span>
                                    </>
                                )}
                            </motion.button>

                            {/* Progress Indicator */}
                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="flex items-center">
                                    {[1, 2, 3].map((s, index) => (
                                        <div key={s} className="flex items-center">
                                            <div
                                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                                    s <= step 
                                                        ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md shadow-red-100' 
                                                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                                                    }`}
                                            >
                                                <span className="text-xs font-semibold">{s}</span>
                                            </div>
                                            {index < 2 && (
                                                <div className={`w-5 sm:w-8 h-0.5 ${s < step ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-700">Step</span>
                                        <span className="text-xs font-semibold text-red-600">{step}</span>
                                        <span className="text-xs font-medium text-gray-700">dari</span>
                                        <span className="text-xs font-semibold text-red-600">3</span>
                                        <span className="text-xs text-gray-500">
                                            {step === 1 ? '(Pilih Game)' : step === 2 ? '(Data Tim)' : '(Konfirmasi)'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    <div className="pt-16">
                        <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
                            {/* Background Layer */}
                            <div className="absolute inset-0 bg-white"></div>
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/40 to-red-100/30"></div>

                            {/* Cross Blob - Top Left */}
                            <div className="absolute -left-12 top-24 w-28 h-28 opacity-5 pointer-events-none">
                                <motion.div
                                    animate={{
                                        rotate: [0, -360],
                                    }}
                                    transition={{
                                        duration: 28,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="w-full h-full"
                                >
                                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                                        <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z"/>
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Cross Blob - Bottom Right */}
                            <div className="absolute right-8 bottom-16 w-20 h-20 opacity-5 pointer-events-none">
                                <motion.div
                                    animate={{
                                        rotate: [360, 0],
                                    }}
                                    transition={{
                                        duration: 22,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="w-full h-full"
                                >
                                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-red-500">
                                        <path d="M85,40 h30 v45 h45 v30 h-45 v45 h-30 v-45 h-45 v-30 h45 z"/>
                                    </svg>
                                </motion.div>
                            </div>
                            
                            {/* Content Container */}
                            <div className="relative z-10 max-w-[1350px] mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-3" data-aos="fade-down">
                                        Pilih <span className="text-red-600">Game</span>
                                    </h2>
                                    <div className="w-16 sm:w-20 h-1 bg-red-600 mx-auto rounded-full mb-3" data-aos="fade-down" data-aos-delay="50"></div>
                                    <p className="text-gray-500 font-medium tracking-wide text-sm sm:text-base" data-aos="fade-down" data-aos-delay="100">
                                        ― Pilih game untuk melanjutkan ke langkah berikutnya ―
                                    </p>
                                    
                                    {isLoading && (
                                        <div className="mt-4 text-sm text-gray-500 animate-pulse">
                                            Sedang memuat data kompetisi...
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 flex items-center justify-center">
                                    <GameSelectionForm onGameSelect={handleGameSelect} gameStats={gameStats} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : step === 2 ? (
                    <TeamRegistrationForm
                        teamData={teamData}
                        gameType={gameType}
                        onSubmit={handleTeamSubmit}
                        resetStep={resetStep}
                    />
                ) : (
                    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 pt-20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-4 border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pendaftaran Berhasil!</h2>
                            <p className="text-gray-600 text-sm sm:text-base">Tim Anda telah berhasil terdaftar. Pendaftaran pemain akan segera tersedia.</p>
                            <div className="pt-2">
                                <button
                                    onClick={resetStep}
                                    className="mt-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-colors duration-300 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    Daftarkan Tim Lain
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </>
    )
}
