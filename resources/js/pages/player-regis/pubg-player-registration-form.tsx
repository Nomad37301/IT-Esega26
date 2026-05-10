"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { router, Head } from "@inertiajs/react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
// import { PUBGPlayerForm } from "@/components/registration/ml-player-form"
import { AlertCircle, PlusCircle, X, Users, Trophy, HelpCircle, ChevronLeft, CheckCircle2 } from "lucide-react"
import { useProgressPUBG } from "@/hooks/use-progress-pubg"
import { usePUBGPlayers } from "@/hooks/use-pubg-player"
import type { PUBGPlayer, PlayerRegistrationFormProps } from "@/types/register"
import { PUBGPlayerForm } from "@/components/registration/pubg-player-form"
import LoadingScreen from "@/components/ui/loading-screen"
import SuccessDialog from "@/components/ui/success-dialog"
import axios from "axios"
import imageCompression from "browser-image-compression"

// Opsi kompresi: maksimal 300KB per file agar aman dari limit 8MB cPanel
const compressionOptions = {
    maxSizeMB: 0.3,          // Maksimal 300 KB per file
    maxWidthOrHeight: 1280,  // Resolusi max 1280px
    useWebWorker: true,      // Proses di background agar UI tidak freeze
    fileType: 'image/jpeg',  // Output selalu JPEG agar ukuran lebih kecil
}

const compressImage = async (file: File): Promise<File> => {
    try {
        const compressed = await imageCompression(file, compressionOptions)
        return compressed
    } catch (err) {
        console.warn('Kompresi gambar gagal, menggunakan file asli:', err)
        return file // Fallback ke file asli jika kompresi gagal
    }
}

export default function PlayerRegistrationForm({ teamData, gameType }: PlayerRegistrationFormProps) {
    const isPUBG = gameType === "pubg"
    const gameTitle = isPUBG ? "PUBG Mobile" : "Mobile Legends"
    const minPlayers = 4
    const maxPlayers = 5

    const themeColors = {
        primary: "bg-secondary hover:opacity-90 text-white",
        secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
        badge: "bg-secondary/10 text-secondary",
        progress: "bg-secondary",
        progressBg: "bg-secondary/20",
        border: "border-secondary/20",
        text: "text-secondary",
        gradient: "bg-secondary",
        alert: "bg-red-600/90 border-red-200",
        success: "bg-green-600 border-green-200 shadow-md",
        card: "bg-white shadow-lg rounded-xl border border-gray-100",
        section: "bg-white rounded-xl p-5 sm:p-6 border border-gray-100"
    }

    const [formData, setFormData] = useState<{
        pubg_players: PUBGPlayer[];
        team_id: number;
    }>({
        pubg_players: [],
        team_id: teamData.id ?? 0,
    })

    const [alertMessage, setAlertMessage] = useState("")
    const [showValidationError, setShowValidationError] = useState(false)
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [playerToDelete, setPlayerToDelete] = useState<number | null>(null)
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    
    // Tambahkan state baru untuk dialog konfirmasi kembali
    const [isBackDialogOpen, setBackDialogOpen] = useState(false)
    // Perbarui state untuk alert sukses yang digunakan dalam penambahan pemain
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [isBackButtonLoading, setIsBackButtonLoading] = useState(false)

    const progress = useProgressPUBG(formData.pubg_players, minPlayers)

    const hasLoadedPlayersFromStorage = useRef(false)

    useEffect(() => {
        if (!hasLoadedPlayersFromStorage.current) {
            const saved = localStorage.getItem("pubg_players_data")
            if (saved && formData.pubg_players.length === 0) {
                try {
                    const parsed = JSON.parse(saved)
                    if (Array.isArray(parsed)) {
                        // Sanitasi: pastikan data dari localStorage tidak melebihi batas max
                        const sanitized = parsed.slice(0, maxPlayers)
                        setFormData(prev => ({ ...prev, pubg_players: sanitized }))
                    }
                } catch (e) {
                    console.error("Failed to parse saved players", e)
                }
            }
            hasLoadedPlayersFromStorage.current = true
        }
    }, [formData.pubg_players])

    useEffect(() => {
        localStorage.setItem("pubg_players_data", JSON.stringify(formData.pubg_players))
    }, [formData.pubg_players])

    const { addPlayer, deletePlayer } = usePUBGPlayers(
        { pubg_players: formData.pubg_players },
        (key: "pubg_players", value: PUBGPlayer[]) => setFormData(prev => ({ ...prev, [key]: value })),
        teamData.id
    )

    const validatePhoneNumber = (phone: string) => {
        if (!phone) return true
        const cleanPhone = phone.replace(/\D/g, '')
        return cleanPhone.length >= 10 && cleanPhone.length <= 15
    }
    
    const handlePlayerChange = (
        index: number,
        field: keyof PUBGPlayer,
        value: string | number | File | null | undefined
    ) => {
        const newValue = value !== null && value !== undefined ? value : ""
        
        // Update the form data first
        const updatedPlayers = formData.pubg_players.map((player, i) =>
            i === index ? { ...player, [field]: newValue } : player
        )
        
        setFormData(prev => ({
            ...prev,
            pubg_players: updatedPlayers
        }))
        
        if (field === 'no_hp' && typeof newValue === 'string' && newValue.trim() !== '') {
            if (!validatePhoneNumber(newValue)) {
                setShowValidationError(true)
                setAlertMessage("Nomor HP harus terdiri dari 10 hingga 15 digit angka.")
                setTimeout(() => {
                    setShowValidationError(false)
                }, 10000)
            }
        }
    }
    
    const simulateFileUploadProgress = () => {
        // Dummy function untuk backward compatibility
        return setInterval(() => {}, 1000);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (!teamData?.id) {
            setShowValidationError(true)
            setAlertMessage("Data tim tidak valid. Silakan coba lagi.")
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        }
    
        const teamId = teamData.id
    
        // Validasi jumlah pemain
        if (formData.pubg_players.length < minPlayers) {
            setShowValidationError(true)
            setAlertMessage(`Minimal harus ada ${minPlayers} pemain.`)
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        }

        // Validasi ketua tim
        const ketuaCount = formData.pubg_players.filter(player => player.role === 'ketua').length;
        if (ketuaCount === 0) {
            setShowValidationError(true)
            setAlertMessage("Tim harus memiliki satu Ketua. Silakan pilih salah satu pemain sebagai Ketua.")
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        } else if (ketuaCount > 1) {
            setShowValidationError(true)
            setAlertMessage("Tim hanya boleh memiliki satu Ketua. Silakan periksa kembali peran pemain.")
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        }

        // Validasi jumlah cadangan
        const cadanganCount = formData.pubg_players.filter(player => player.role === 'cadangan').length;
        if (cadanganCount > 2) {
            setShowValidationError(true)
            setAlertMessage("Tim hanya boleh memiliki maksimal 2 pemain Cadangan. Silakan periksa kembali peran pemain.")
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        }

        // Validasi field wajib untuk semua pemain
        const invalidPlayers = formData.pubg_players.map((player, index) => {
            const errors = [];
            
            // Cek field wajib
            if (!player.name || player.name.trim() === '') errors.push('nama');
            if (!player.nickname || player.nickname.trim() === '') errors.push('nickname');
            if (!player.id_server || player.id_server.trim() === '') errors.push('ID server');
            if (!player.no_hp || player.no_hp.trim() === '') errors.push('nomor HP');
            if (!player.email || player.email.trim() === '') errors.push('email');
            
            return errors.length > 0 ? { index, errors } : null;
        }).filter(Boolean);

        if (invalidPlayers.length > 0) {
            const firstInvalid = invalidPlayers[0] as { index: number, errors: string[] };
            const playerNumber = firstInvalid.index + 1;
            const fields = firstInvalid.errors.join(', ');
            
            setShowValidationError(true);
            setAlertMessage(`Pemain #${playerNumber} memiliki field yang belum diisi: ${fields}. Silakan lengkapi semua field wajib.`);
            setTimeout(() => {
                setShowValidationError(false);
            }, 10000);
            return;
        }

        // Validasi format email
        const invalidEmailPlayers = formData.pubg_players.map((player, index) => {
            if (!player.email) return null;
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(player.email) ? index : null;
        }).filter(item => item !== null);

        if (invalidEmailPlayers.length > 0) {
            const playerNumber = invalidEmailPlayers[0] + 1;
            
            setShowValidationError(true);
            setAlertMessage(`Format email pemain #${playerNumber} tidak valid. Gunakan format email yang benar (contoh: nama@domain.com).`);
            setTimeout(() => {
                setShowValidationError(false);
            }, 10000);
            return;
        }
        
        // Validasi foto dan tanda tangan
        const playersWithoutFoto = formData.pubg_players.filter(player => !player.foto);
        const playersWithoutTandaTangan = formData.pubg_players.filter(player => !player.tanda_tangan);

        if (playersWithoutFoto.length > 0) {
            setShowValidationError(true)
            setAlertMessage(`Foto pemain belum dilengkapi untuk ${playersWithoutFoto.length} pemain. Silakan upload foto untuk semua pemain.`)
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        }

        if (playersWithoutTandaTangan.length > 0) {
            setShowValidationError(true)
            setAlertMessage(`Tanda tangan pemain belum dilengkapi untuk ${playersWithoutTandaTangan.length} pemain. Silakan upload tanda tangan untuk semua pemain.`)
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
            return
        }

        setShowLoadingScreen(true)
        
        const progressInterval = simulateFileUploadProgress();

        try {
            const submitData = new FormData()
            submitData.append('team_id', teamId.toString())
            submitData.append('pubg_team_id', teamId.toString())

            // Kompres semua gambar secara paralel sebelum dikirim ke server
            // Ini mencegah PostTooLargeException karena limit 8MB di cPanel
            const compressedPlayers = await Promise.all(
                formData.pubg_players.map(async (player: PUBGPlayer) => ({
                    ...player,
                    foto: player.foto instanceof File ? await compressImage(player.foto) : player.foto,
                    tanda_tangan: player.tanda_tangan instanceof File ? await compressImage(player.tanda_tangan) : player.tanda_tangan,
                }))
            )

            compressedPlayers.forEach((player: PUBGPlayer, index: number) => {
                submitData.append(`pubg_players[${index}][name]`, player.name || '')
                submitData.append(`pubg_players[${index}][nickname]`, player.nickname || '')
                submitData.append(`pubg_players[${index}][id_server]`, player.id_server || '')
                submitData.append(`pubg_players[${index}][no_hp]`, player.no_hp || '')
                submitData.append(`pubg_players[${index}][email]`, player.email || '')
                submitData.append(`pubg_players[${index}][alamat]`, player.alamat || '')
                submitData.append(`pubg_players[${index}][pubg_team_id]`, teamId.toString())
                submitData.append(`pubg_players[${index}][role]`, player.role || 'anggota')

                // Format key konsisten dengan bracket notation agar terbaca oleh controller
                if (player.foto instanceof File) {
                    submitData.append(`pubg_players[${index}][foto]`, player.foto)
                }
                if (player.tanda_tangan instanceof File) {
                    submitData.append(`pubg_players[${index}][tanda_tangan]`, player.tanda_tangan)
                }
            })

            submitData.append('game_type', gameType)

            router.post(route("player-registration-pubg.store"), submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    clearInterval(progressInterval);
                    
                    setTimeout(() => {
                        setFormData(prev => ({ ...prev, pubg_players: [] }))
                        localStorage.removeItem("pubg_players_data")
                        setShowLoadingScreen(false)
                        setShowSuccessDialog(true)
                    }, 3000);
                },
                onError: (errors) => {
                    clearInterval(progressInterval);
                    setShowLoadingScreen(false);
                    console.error('Validation errors:', errors)
                    setShowValidationError(true)
                    setAlertMessage("Terjadi kesalahan validasi. Silakan periksa kembali data yang diinput.")
                    setTimeout(() => {
                        setShowValidationError(false)
                    }, 10000)
                },
                onFinish: () => {
                    // Selalu dieksekusi, termasuk saat PostTooLargeException atau error HTTP lainnya
                    clearInterval(progressInterval);
                    setShowLoadingScreen(false);
                }
            })
        } catch (error) {
            clearInterval(progressInterval);
            setShowLoadingScreen(false);
            console.error('Error submitting form:', error)
            setShowValidationError(true)
            setAlertMessage("Terjadi kesalahan saat mengirim form. Silakan coba lagi.")
            setTimeout(() => {
                setShowValidationError(false)
            }, 10000)
        }
    }

    const addNewPlayer = () => {
        if (formData.pubg_players.length < maxPlayers) {
            const playerNumber = formData.pubg_players.length + 1;
            addPlayer()
            // Tambahkan alert sukses saat menambahkan pemain
            setSuccessMessage(`Pemain #${playerNumber} berhasil ditambahkan!`)
            setShowSuccessAlert(true)
            setTimeout(() => {
                setShowSuccessAlert(false)
            }, 3000)
        }
    }

    const openDeleteDialog = (index: number) => {
        setPlayerToDelete(index)
        setDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setPlayerToDelete(null)
    }

    const deletePlayerHandler = () => {
        if (playerToDelete !== null) {
            deletePlayer(playerToDelete)
            closeDeleteDialog()
        }
    }

    const handleBack = () => {
        // Tampilkan dialog konfirmasi sebelum kembali
        setBackDialogOpen(true)
    }

    // Update fungsi untuk handle konfirmasi kembali
    const handleConfirmBack = () => {
        // Aktifkan loading state
        setIsBackButtonLoading(true)
        
        // Hapus data tim dari database
        if (teamData.id) {
            setShowLoadingScreen(true)
            
            // Simpan ID tim yang akan dihapus ke localStorage agar dapat digunakan kembali
            const teamIdToSave = teamData.id?.toString() || "";
            console.log("Saving FF team ID to localStorage:", {
                id: teamIdToSave,
                gameType: gameType,
                idType: typeof teamData.id
            });
            
            if (teamIdToSave) {
                localStorage.setItem("last_deleted_team_id", teamIdToSave);
                localStorage.setItem("last_deleted_game_type", gameType);
                
                // Log localStorage setelah disimpan untuk memastikan
                console.log("localStorage after saving:", {
                    saved_id: localStorage.getItem("last_deleted_team_id"),
                    saved_type: localStorage.getItem("last_deleted_game_type")
                });
            }
            
            axios.post(route('delete-incomplete-team'), {
                team_id: teamData.id,
                game_type: gameType
            })
            .then(() => {
// Hapus data pemain dari localStorage
                localStorage.removeItem("pubg_players_data")
                
                // Arahkan ke halaman registrasi tim dengan parameter game_type 
                window.location.href = route('register') + '?step=2&game_type=' + gameType;
            })
            .catch((error) => {
                console.error("Error deleting team data:", error)
                // Hapus data pemain dari localStorage
                localStorage.removeItem("pubg_players_data")
                
                // Tetap arahkan ke halaman registrasi tim
                window.location.href = route('register') + '?step=2&game_type=' + gameType;
            })
            .finally(() => {
                setShowLoadingScreen(false)
                setIsBackButtonLoading(false)
            })
        } else {
            // Jika tidak ada team_id, hanya hapus data dari localStorage
            localStorage.removeItem("pubg_players_data")
            
            // Arahkan ke halaman registrasi tim
            window.location.href = route('register') + '?step=2&game_type=' + gameType;
        }
    }

    const handleEmergencyContact = () => {
        // Ganti nomor WhatsApp sesuai dengan nomor panitia yang diperlukan
        const phoneNumber = "6287861081640" // Format: kode negara tanpa + diikuti nomor HP
        const message = `Halo, saya butuh bantuan terkait pendaftaran pemain ${gameTitle}.`
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
    }

    const handleSuccessDialogClose = () => {
        router.visit(route('register'))
    }

    useEffect(() => {
        // Menambahkan beberapa state history untuk mencegah navigasi back langsung
        // Tambahkan state untuk halaman saat ini
        window.history.pushState({ page: 'ff-player-registration' }, "", window.location.href);
        // Tambahkan lagi satu state yang sama untuk membuat back button lebih handal
        window.history.pushState({ page: 'ff-player-registration' }, "", window.location.href);
        
        // Menangani tombol back di browser
        const handlePopState = (e: PopStateEvent) => {
            // Cek state history saat ini
            const state = e.state;
            
            // Jika state tidak ada atau bukan dari halaman kita, tampilkan dialog
            if (!state || state.page === 'ff-player-registration') {
                // Tampilkan dialog konfirmasi
                setBackDialogOpen(true);
                
                // Tambahkan kembali state untuk mencegah navigasi langsung jika user cancel
                window.history.pushState({ page: 'ff-player-registration' }, "", window.location.href);
            }
        };
        
        // Tambahkan event listener
        window.addEventListener("popstate", handlePopState);
        
        // Tambahkan event beforeunload untuk mencegah refresh atau menutup tab secara tidak sengaja
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Hanya jika form belum di-submit
            if (formData.pubg_players.length > 0 && !showSuccessDialog) {
                const message = "Data pemain Anda akan hilang jika Anda meninggalkan halaman ini.";
                e.returnValue = message;
                return message;
            }
        };
        
        window.addEventListener("beforeunload", handleBeforeUnload);
        
        return () => {
            // Bersihkan semua event listener saat komponen unmount
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [formData.pubg_players.length, showSuccessDialog]);

    return (
        <>
            <Head title={`${gameTitle} Player Registration`} />

            <div className="min-h-screen bg-white py-6 sm:py-12 px-3 sm:px-4">
                <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
                    <div className="max-w-[1350px] mx-auto px-3 md:px-8 lg:px-12">
                        <div className="flex items-center justify-between h-14 sm:h-16">
                            <motion.button
                                onClick={handleBack}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg transition-colors duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Back to Team Registration</span>
                            </motion.button>

                            <div className="flex items-center gap-3 sm:gap-6">
                                <div className="flex items-center">
                                    {[1, 2, 3].map((s, index) => (
                                        <div key={s} className="flex items-center">
                                            <div
                                                className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                                    s < 3 
                                                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200' 
                                                        : s === 3
                                                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200'
                                                        : 'bg-blue-100 text-blue-400'
                                                }`}
                                            >
                                                <span className="text-xs sm:text-sm font-semibold">{s}</span>
                                            </div>
                                            {index < 2 && (
                                                <div className="w-4 sm:w-8 h-0.5 bg-blue-200"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Step</span>
                                        <span className="text-sm font-semibold text-blue-600">3</span>
                                        <span className="text-sm font-medium text-gray-700">of</span>
                                        <span className="text-sm font-semibold text-blue-600">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 sm:pt-4">
                    <div className="fixed top-16 sm:top-20 right-3 sm:right-4 z-50 w-auto max-w-[90%] sm:max-w-[800px] space-y-2">
                        <AnimatePresence>
                            {showValidationError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Alert variant="destructive" className={`${themeColors.alert} p-2 sm:p-3 text-xs sm:text-sm`}>
                                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <AlertTitle className="text-xs sm:text-sm">Error</AlertTitle>
                                        <AlertDescription className="text-slate-900 text-xs">{alertMessage}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                            {showSuccessAlert && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 500, 
                                        damping: 30,
                                        duration: 0.4 
                                    }}
                                >
                                    <Alert className={`${themeColors.success} p-2 sm:p-3 text-xs sm:text-sm rounded-md`}>
                                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                        <AlertTitle className="text-xs sm:text-sm font-semibold text-white">Success</AlertTitle>
                                        <AlertDescription className="text-white font-medium text-xs sm:text-sm">{successMessage}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-8rem)] relative">
                        <div className="w-full lg:w-[95%] p-3 sm:p-5 lg:p-8 flex items-center justify-center bg-white overflow-y-auto mx-auto">
                            <div className="w-full max-w-7xl my-2 sm:my-4">
                                {/* Header Section */}
                                <Card className={`${themeColors.card} border-0 shadow-xl`}>
                                    <CardHeader className={`p-4 sm:p-8 ${themeColors.gradient} text-white rounded-t-xl`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className="bg-white/10 p-2 sm:p-4 rounded-xl">
                                                    <img
                                                        src={
                                                            teamData.team_logo
                                                                ? typeof teamData.team_logo === 'string'
                                                                    ? `/storage/${teamData.team_logo}`
                                                                    : teamData.team_logo instanceof File
                                                                        ? URL.createObjectURL(teamData.team_logo)
                                                                        : '/Images/default-team-logo.png'
                                                                : '/Images/default-team-logo.png'
                                                        }
                                                        alt={`Team ${teamData.team_name} Logo`}
                                                        className="w-12 h-12 sm:w-20 sm:h-20 object-contain rounded-lg"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/Images/default-team-logo.png'
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2">{gameTitle} Registration</CardTitle>
                                                    <CardDescription className="text-white/90 text-sm sm:text-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span>Team:</span> 
                                                            <span className="font-medium">{teamData.team_name}</span>
                                                        </div>
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
                                                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base">
                                                    <Users className="w-3 h-3 sm:w-5 sm:h-5" />
                                                    <span className="font-medium">{formData.pubg_players.length}/{maxPlayers}</span>
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base">
                                                    <Trophy className="w-3 h-3 sm:w-5 sm:h-5" />
                                                    <span className="font-medium">Min. {minPlayers}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <div className="p-4 sm:p-6">
                                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">Registration Progress</span>
                                                <Badge className={themeColors.badge}>
                                                    {formData.pubg_players.length}/{minPlayers}
                                                </Badge>
                                            </div>
                                            <span className="text-xs sm:text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} className={`h-1.5 sm:h-2 ${themeColors.progressBg}`}>
                                            <div className={`h-full ${themeColors.progress} rounded-full`} style={{ width: `${progress}%` }} />
                                        </Progress>
                                    </div>
                                </Card>

                                
                                <Card className={`${themeColors.card} mt-3 sm:mt-4`}>
                                    <CardContent className="p-4 sm:p-6">
                                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                                            <div className="space-y-4 sm:space-y-8">
                                                <AnimatePresence>
                                                    {formData.pubg_players.map((player, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.3 }}
                                                            data-player-form
                                                            className="mb-6"
                                                        >
                                                            <div className={themeColors.section}>
                                                                <PUBGPlayerForm
                                                                    player={player}
                                                                    index={index}
                                                                    errorsBE={{}}
                                                                    allPlayers={formData.pubg_players}
                                                                    onChange={(idx, field, val) => handlePlayerChange(idx, field, val)}
                                                                    onDelete={() => openDeleteDialog(index)}
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>

                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center pt-4 sm:pt-6 border-t border-gray-200">
                                                    <Button
                                                        type="button"
                                                        onClick={addNewPlayer}
                                                        disabled={formData.pubg_players.length >= maxPlayers}
                                                        className={`${themeColors.secondary} w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2`}
                                                    >
                                                        <PlusCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                                        Add Player {formData.pubg_players.length < maxPlayers && `(${formData.pubg_players.length}/${maxPlayers})`}
                                                    </Button>

                                                    <Button
                                                        type="submit"
                                                        disabled={formData.pubg_players.length < minPlayers}
                                                        className={`w-full sm:w-auto ${themeColors.primary} relative text-xs sm:text-sm py-1.5 sm:py-2`}
                                                    >
                                                        Submit Team Registration
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogContent className="w-[95%] max-w-md p-0 rounded-md border-0 shadow-md mx-auto">
                            <div className="bg-white px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
                                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
                                    <DialogTitle className="text-sm sm:text-base font-semibold text-gray-900">
                                        Konfirmasi Hapus Pemain
                                    </DialogTitle>
                                    <button 
                                        onClick={() => setDeleteDialogOpen(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100 p-1"
                                    >
                                        <X className="h-4 sm:h-5 w-4 sm:w-5" />
                                    </button>
                                </div>
                                
                                <div className="py-4 sm:py-5">
                                    <p className="mb-4 sm:mb-5 text-xs sm:text-sm text-gray-700">
                                        Apakah Anda yakin ingin menghapus pemain ini dari tim Anda? Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                    
                                    <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pb-3">
                                        <Button 
                                            onClick={closeDeleteDialog} 
                                            variant="outline" 
                                            className="text-xs sm:text-sm bg-gray-900 text-white hover:bg-gray-800 border-0 font-normal px-3 sm:px-4 py-1 sm:py-2 h-auto transition-all duration-200"
                                        >
                                            Batal
                                        </Button>
                                        <Button 
                                            onClick={deletePlayerHandler} 
                                            className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white font-normal px-3 sm:px-4 py-1 sm:py-2 h-auto transition-all duration-200"
                                        >
                                            Hapus Pemain
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Dialog for Back Confirmation */}
                    <Dialog open={isBackDialogOpen} onOpenChange={setBackDialogOpen}>
                        <DialogContent className="w-[95%] max-w-md p-0 rounded-md border-0 shadow-md mx-auto">
                            <div className="bg-white px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
                                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
                                    <DialogTitle className="text-sm sm:text-base font-semibold text-gray-900">
                                        Konfirmasi Kembali
                                    </DialogTitle>
                                    <button 
                                        onClick={() => setBackDialogOpen(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-gray-100 p-1"
                                    >
                                        <X className="h-4 sm:h-5 w-4 sm:w-5" />
                                    </button>
                                </div>
                                
                                <div className="py-4 sm:py-5">
                                    <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-700">
                                        Apakah Anda yakin ingin kembali ke halaman registrasi tim?
                                    </p>
                                    <div className="flex items-start gap-2 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-md mb-4 sm:mb-5">
                                        <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs sm:text-sm text-amber-700">
                                            Data tim dan pemain yang belum selesai didaftarkan akan dihapus!
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pb-3">
                                        <Button 
                                            onClick={() => setBackDialogOpen(false)} 
                                            variant="outline" 
                                            className="text-xs sm:text-sm bg-gray-900 text-white hover:bg-gray-800 border-0 font-normal px-3 sm:px-4 py-1 sm:py-2 h-auto transition-all duration-200"
                                            disabled={isBackButtonLoading}
                                        >
                                            Batal
                                        </Button>
                                        <Button 
                                            onClick={handleConfirmBack} 
                                            className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white font-normal px-3 sm:px-4 py-1 sm:py-2 h-auto transition-all duration-200"
                                            disabled={isBackButtonLoading}
                                        >
                                            {isBackButtonLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span className="text-xs sm:text-sm">Memproses...</span>
                                                </>
                                            ) : (
                                                "Ya, Kembali"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <button
                    onClick={handleEmergencyContact}
                    className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white hover:bg-blue-50 text-blue-600 p-3 sm:p-4 rounded-full
                    shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(37,99,235,0.3)]
                    transform hover:scale-110 transition-all duration-300 group z-50 border border-blue-200"
                    title="Need help? Contact committee"
                >
                    <div className="relative">
                        <HelpCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                    <span className="sr-only">Contact Committee</span>
                </button>
            </div>

            <LoadingScreen isOpen={showLoadingScreen} />
            
            <SuccessDialog
                isOpen={showSuccessDialog}
                message="Selamat! Pendaftaran tim dan pemain PUBG Mobile telah berhasil. Tim Anda telah terdaftar dalam kompetisi IT-ESEGA 2025. Silahkan tunggu informasi selanjutnya dari panitia."
                title="Pendaftaran Berhasil!"
                buttonText="Kembali ke Beranda"
                onClose={handleSuccessDialogClose}
            />
        </>
    )
}

