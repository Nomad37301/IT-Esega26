"use client"

import { useForm } from "@inertiajs/react"
import { ChevronRight, Users, HelpCircle, FileWarning, ZoomIn, X, Image, Ticket, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { QRCodeSection } from "@/components/registration/qr-code-section"
import { FileUploadField } from "@/components/registration/file-upload-field"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { TeamRegistrationFormProps } from "@/types/register"
import { useState } from "react"
import LoadingScreen from "@/components/ui/loading-screen"

export function TeamRegistrationForm({ teamData, gameType, onSubmit, resetStep }: TeamRegistrationFormProps) {
    const isML = gameType === "ml"
    const gameTitle = isML ? "Mobile Legends" : "Free Fire"
    const registrationFee = "Rp 100.000"

    const [formErrors, setFormErrors] = useState<{
        team_name?: string;
        team_logo?: string;
        proof_of_payment?: string;
        slot_type?: string;
        email?: string;
        [key: string]: string | undefined;
    }>({})

    const { data, setData, post, processing } = useForm({
        team_name: teamData.team_name || "",
        team_logo: teamData.team_logo || null,
        proof_of_payment: teamData.proof_of_payment || null,
        email: teamData.email || "",
        game_type: gameType,
        slot_type: isML ? (teamData.slot_type || "single") : "single",
        teamIdToReuse: teamData.teamIdToReuse || null,
    })

    console.log('game type', gameType);
    console.log('team id to reuse', data.teamIdToReuse);

    const [teamLogoPreview, setTeamLogoPreview] = useState<string | null>(null)
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    // State untuk image zoom
    const [imageZoomOpen, setImageZoomOpen] = useState(false)
    const [zoomedImage, setZoomedImage] = useState<{ src: string | null, alt: string } | null>(null)

    const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes

    // State untuk loading screen
    const [showLoadingScreen, setShowLoadingScreen] = useState(false)

    // Function untuk mensimulasikan progres upload
    const simulateFileUploadProgress = () => {
        // Return dummy interval untuk backward compatibility
        return setInterval(() => { }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormErrors({})

        console.log("Submitting form with team ID to reuse:", data.teamIdToReuse);

        // Basic validations
        if (!data.team_name.trim() || !data.team_logo || !data.proof_of_payment || !data.email) {
            if (!data.team_name.trim()) {
                setFormErrors(prev => ({ ...prev, team_name: "Team name is required" }))
            }
            if (!data.email.trim()) {
                setFormErrors(prev => ({ ...prev, email: "Email is Required" }))
            }
            if (!data.team_logo) {
                setFormErrors(prev => ({ ...prev, team_logo: "Team logo is required" }))
            }
            if (!data.proof_of_payment) {
                setFormErrors(prev => ({ ...prev, proof_of_payment: "Payment proof is required" }))
            }
            return
        }

        // Pastikan slot type adalah 'single' untuk Free Fire
        if (!isML) {
            setData("slot_type", "single")
        }

        // Show loading screen
        setShowLoadingScreen(true)

        // Start progress simulation
        const progressInterval = simulateFileUploadProgress();

        try {
            // Buat URL dengan query parameter untuk team_id_to_reuse jika ada
            let url = route("team-registration.store");
            if (data.teamIdToReuse) {
                url = `${url}?team_id_to_reuse=${data.teamIdToReuse}`;
                console.log("Submitting to URL with query param:", url);
            }

            // Gunakan URL dengan query parameter
            post(url, {
                onSuccess: (response) => {
                    clearInterval(progressInterval);

                    // Di sini kita tidak menampilkan success dialog dulu karena user harus 
                    // langsung dialihkan ke registration form player
                    const responseData = response.props as unknown as { id: number | null }
                    console.log("Response data:", responseData);

                    // Make sure we're passing the complete data
                    const submittedData = {
                        ...data,
                        id: responseData.id || null,
                    };

                    // Setelah 1 detik, alihkan ke player registration
                    setTimeout(() => {
                        setShowLoadingScreen(false);
                        onSubmit(submittedData);
                    }, 1000);
                },
                onError: (errors) => {
                    clearInterval(progressInterval);
                    setShowLoadingScreen(false);

                    console.error('Validation errors:', errors);

                    // Menambahkan visual feedback untuk semua jenis error
                    if (errors.team_name && errors.team_name.includes('unique')) {
                        setFormErrors({
                            ...errors,
                            team_name: `Tim dengan nama "${data.team_name}" sudah terdaftar. Silakan gunakan nama tim yang lain.`
                        });
                    } else {
                        // Tampilkan semua error yang ada
                        setFormErrors(errors);

                        // Tambahkan debugging helper
                        console.log('Errors set in state:', errors);

                        // Log semua error ke konsol untuk debugging
                        Object.keys(errors).forEach(key => {
                            console.log(`Error in field ${key}:`, errors[key]);
                        });
                    }

                    // Untuk semua jenis error, beri fokus pada field pertama yang error
                    const fieldWithError = Object.keys(errors)[0];
                    if (fieldWithError) {
                        const errorField = document.getElementById(fieldWithError);
                        if (errorField) {
                            errorField.focus();
                            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }

                    // Scroll ke bagian form dengan error
                    const firstError = document.querySelector('.text-red-500');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });

        } catch (error) {
            clearInterval(progressInterval);
            setShowLoadingScreen(false);
            console.error('Error submitting form:', error)
            setFormErrors({ general: "An error occurred while submitting the form" })
        }
    }

    // Menambahkan kembali fungsi handleBackClick
    const handleBackClick = () => {
        if (resetStep) {
            resetStep();
        }
    }

    // Add logging for props and state changes
    console.log('Current game type:', gameType)
    console.log('Team data:', teamData)
    console.log('Form errors:', formErrors)

    const handleFileChange = (file: File | null, type: "team_logo" | "proof_of_payment") => {
        if (!file) {
            if (type === "team_logo") {
                setData("team_logo", null)
                setTeamLogoPreview(null)
            } else if (type === "proof_of_payment") {
                setData("proof_of_payment", null)
                setPaymentProofPreview(null)
            }
            return
        }

        if (file.size <= MAX_FILE_SIZE) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (type === "team_logo") {
                    setTeamLogoPreview(reader.result as string)
                    setData("team_logo", file)
                } else if (type === "proof_of_payment") {
                    setPaymentProofPreview(reader.result as string)
                    setData("proof_of_payment", file)
                }
            }
            reader.readAsDataURL(file)
        } else {
            setOpenDialog(true)
            if (type === "team_logo") {
                setData("team_logo", null)
                setTeamLogoPreview(null)
            } else if (type === "proof_of_payment") {
                setData("proof_of_payment", null)
                setPaymentProofPreview(null)
            }
        }
    }

    // Untuk Emergency Contact hubungin panitia
    const handleEmergencyContact = () => {
        // Ganti nomor WhatsApp sesuai dengan nomor panitia yang diperlukan
        const phoneNumber = "6287861081640" // Format: kode negara tanpa + diikuti nomor HP
        const message = `Halo, saya butuh bantuan terkait pendaftaran tim ${gameTitle}.`
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
    }

    const openImageZoom = (src: string, alt: string) => {
        setZoomedImage({ src, alt })
        setImageZoomOpen(true)
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)] pt-16 relative">
                <QRCodeSection
                    resetStep={handleBackClick}
                    title={`${gameTitle} Payment`}
                    description="Scan the QR code below to complete your payment"
                    instructions={[
                        "Buka aplikasi bank atau e-wallet Anda",
                        "Pindai kode QR di atas",
                        "Masukkan jumlah biaya pendaftaran",
                        "Selesaikan pembayaran",
                        "Ambil tangkapan layar bukti pembayaran Anda",
                    ]}
                    amount={`Biaya pendaftaran: ${registrationFee}`}
                    gameType={gameType}
                    slotType={data.slot_type}
                />

                <div className="w-full lg:w-3/5 p-4 sm:p-6 lg:p-10 flex items-center justify-center bg-gradient-to-br from-white to-red-50/40 backdrop-blur-sm overflow-y-auto min-h-[calc(100vh-4rem)]">
                    <div className="max-w-2xl w-full my-4 sm:my-6">
                        <div className="mb-4 sm:mb-8 text-center space-y-1 sm:space-y-2">
                            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-800 bg-clip-text text-transparent">
                                {gameTitle} Team Registration
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">Lengkapi detail tim Anda untuk melanjutkan pendaftaran</p>
                        </div>

                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
                            <CardContent className="p-4 sm:p-7">
                                <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="md:grid gap-4 sm:gap-6 flex flex-col">
                                        <div className="relative space-y-1 sm:space-y-2">
                                            <Label htmlFor="team_name" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Users className="h-4 w-4 text-red-500" />
                                                <span>Nama Tim</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="team_name"
                                                    type="text"
                                                    required
                                                    value={data.team_name}
                                                    onChange={(e) => setData("team_name", e.target.value)}
                                                    placeholder="Masukkan nama tim esports Anda"
                                                    className={`py-4 sm:py-5 bg-white border-gray-200 text-gray-900 text-sm rounded-xl 
                                                    focus:border-red-500 focus:ring focus:ring-red-500/20 focus:ring-opacity-50
                                                    [&::placeholder]:text-gray-500 [&::placeholder]:text-xs sm:[&::placeholder]:text-sm [&::placeholder]:font-normal
                                                ${formErrors.team_name ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {formErrors.team_name && (
                                                <div className={`flex items-start gap-1 sm:gap-2 ${formErrors.team_name.includes('sudah terdaftar') ? 'bg-red-50 border border-red-200 rounded-lg p-3 mt-2' : 'mt-1'}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`${formErrors.team_name.includes('sudah terdaftar') ? 'h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5' : 'h-3 w-3 sm:h-4 sm:w-4 text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <div>
                                                        {formErrors.team_name.includes('sudah terdaftar') ? (
                                                            <>
                                                                <p className="font-semibold text-red-700 text-xs sm:text-sm">Nama Tim Sudah Digunakan</p>
                                                                <p className="text-red-600 text-xs sm:text-sm">{formErrors.team_name}</p>
                                                            </>
                                                        ) : (
                                                            <p className="text-red-500 text-xs sm:text-sm">{formErrors.team_name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative space-y-1 sm:space-y-2">
                                            <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <MailCheck className="h-4 w-4 text-red-500" />
                                                <span>Email</span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData("email", e.target.value)}
                                                    placeholder="Masukkan alamat email anda untuk menerima konfirmasi pendaftaran"
                                                    className={`py-4 sm:py-5 bg-white border-gray-200 text-gray-900 text-sm rounded-xl 
                                                    focus:border-red-500 focus:ring focus:ring-red-500/20 focus:ring-opacity-50
                                                    [&::placeholder]:text-gray-500 [&::placeholder]:text-xs sm:[&::placeholder]:text-sm [&::placeholder]:font-normal
                                                    ${formErrors.email ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {formErrors.email && (
                                                <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                                            )}
                                        </div>


                                        {isML && (
                                            <div className="mb-6">
                                                <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <Ticket className="h-4 w-4 text-red-500" />
                                                    <span>Tipe Slot</span>
                                                </Label>

                                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div
                                                        className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 
                                                ${data.slot_type === 'single'
                                                                ? 'border-red-600 bg-red-50/50'
                                                                : 'border-gray-200 hover:border-red-200 hover:bg-red-50/30'}`}
                                                        onClick={() => setData('slot_type', 'single')}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                                                        ${data.slot_type === 'single'
                                                                    ? 'border-red-600'
                                                                    : 'border-gray-300'}`}
                                                            >
                                                                {data.slot_type === 'single' && (
                                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-600"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                                                    <span>Single Slot</span>
                                                                </Label>
                                                                <p className="text-xs text-gray-600 mt-1">1 Tim, 1 Slot Kompetisi</p>
                                                                <div className="mt-2 bg-red-50 px-3 py-1.5 rounded-md inline-block">
                                                                    <p className="text-sm font-medium text-red-600">Rp 100.000</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 
                                                ${data.slot_type === 'double'
                                                                ? 'border-red-600 bg-red-50/50'
                                                                : 'border-gray-200 hover:border-red-200 hover:bg-red-50/30'}`}
                                                        onClick={() => setData('slot_type', 'double')}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                                                        ${data.slot_type === 'double'
                                                                    ? 'border-red-600'
                                                                    : 'border-gray-300'}`}
                                                            >
                                                                {data.slot_type === 'double' && (
                                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-600"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                                                    <span>Double Slot</span>
                                                                </Label>
                                                                <p className="text-xs text-gray-600 mt-1">1 Tim, 2 Slot Kompetisi</p>
                                                                <div className="mt-2 bg-red-50 px-3 py-1.5 rounded-md inline-block">
                                                                    <p className="text-sm font-medium text-red-600">Rp 200.000</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {formErrors.slot_type && (
                                                    <p className="text-xs text-red-500 mt-2">{formErrors.slot_type}</p>
                                                )}
                                            </div>
                                        )}

                                        {!isML && (
                                            <div className="mb-6">
                                                <Label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <Ticket className="h-4 w-4 text-red-500" />
                                                    <span>Informasi Biaya</span>
                                                </Label>

                                                <div className="mt-3">
                                                    <div className="relative rounded-lg border border-red-600 bg-red-50/50 p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="h-5 w-5 rounded-full border-2 border-red-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                                <div className="h-2.5 w-2.5 rounded-full bg-red-600"></div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                                                    <span>Single Slot</span>
                                                                </Label>
                                                                <p className="text-xs text-gray-600 mt-1">Free Fire hanya tersedia dalam format Single Slot</p>
                                                                <div className="mt-2 bg-red-50 px-3 py-1.5 rounded-md inline-block">
                                                                    <p className="text-sm font-medium text-red-600">Rp 100.000</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Garis Pembatas */}
                                        <div className="relative py-4 md:py-0">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                            </div>
                                            <div className="relative flex justify-center">
                                                <div className="bg-white px-4 text-xs text-gray-500 shadow-sm rounded-full">Unggah Dokumen</div>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="space-y-3">
                                                <Label htmlFor="proof_of_payment" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                                    <Image className="h-4 w-4 text-red-500" />
                                                    <span>Bukti Pembayaran</span>
                                                </Label>
                                                <FileUploadField
                                                    id="proof_of_payment"
                                                    label=""
                                                    helpText="PNG, JPG, JPEG Maksimal 2MB"
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    value={data.proof_of_payment}
                                                    onChange={(file) => handleFileChange(file, "proof_of_payment")}
                                                />
                                                {paymentProofPreview && (
                                                    <div className="mt-2 flex justify-center">
                                                        <div className="relative group">
                                                            <img
                                                                src={paymentProofPreview}
                                                                alt="Payment Proof Preview"
                                                                className="w-40 h-auto rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                                                                onClick={() => openImageZoom(paymentProofPreview, "Payment Proof Preview")}
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openImageZoom(paymentProofPreview, "Payment Proof Preview")}
                                                                    className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                                                                >
                                                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {formErrors.proof_of_payment && (
                                                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <div>
                                                            <p className="font-semibold text-red-700 text-xs sm:text-sm">Bukti Pembayaran Diperlukan</p>
                                                            <p className="text-red-600 text-xs sm:text-sm">{formErrors.proof_of_payment}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="team_logo" className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                                    <Image className="h-4 w-4 text-red-500" />
                                                    <span>Logo Tim</span>
                                                </Label>
                                                <FileUploadField
                                                    id="team_logo"
                                                    label=""
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    helpText="PNG, JPG, JPEG Maksimal 2MB"
                                                    value={data.team_logo}
                                                    onChange={(file) => handleFileChange(file, "team_logo")}
                                                />
                                                {teamLogoPreview && (
                                                    <div className="mt-2 flex justify-center">
                                                        <div className="relative group">
                                                            <img
                                                                src={teamLogoPreview}
                                                                alt="Preview Logo Tim"
                                                                className="w-40 h-auto rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                                                                onClick={() => openImageZoom(teamLogoPreview, "Preview Logo Tim")}
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openImageZoom(teamLogoPreview, "Preview Logo Tim")}
                                                                    className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                                                                >
                                                                    <ZoomIn className="w-5 h-5 text-gray-700" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {formErrors.team_logo && (
                                                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <div>
                                                            <p className="font-semibold text-red-700 text-xs sm:text-sm">Logo Tim Diperlukan</p>
                                                            <p className="text-red-600 text-xs sm:text-sm">{formErrors.team_logo}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2 sm:pt-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={`w-full py-4 sm:py-5 md:py-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600
                                        text-white rounded-xl font-medium text-sm sm:text-base md:text-lg transition-all duration-300 
                                            shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]
                                        flex items-center justify-center gap-1 sm:gap-2 relative overflow-hidden group`}
                                            >
                                                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                                    {processing ? "Memproses..." : "Lanjut ke Pendaftaran Pemain"}
                                                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Emergency Contact Button */}
                <button
                    onClick={handleEmergencyContact}
                    className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white hover:bg-red-50 text-red-600 p-2 sm:p-3 md:p-4 rounded-full
                shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(220,38,38,0.3)]
                transform hover:scale-110 transition-all duration-300 group z-50 border border-red-200"
                    title="Butuh bantuan? Hubungi panitia"
                >
                    <div className="relative">
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                    <span className="sr-only">Hubungi Panitia</span>
                </button>

                {/* File Size Limit Dialog */}
                <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
                    <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-red-500/20 shadow-2xl p-0 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-red-500/10 bg-gradient-to-r from-red-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 rounded-full">
                                    <FileWarning className="h-5 w-5 text-red-500" />
                                </div>
                                <DialogTitle className="text-lg font-semibold text-white m-0">
                                    File Terlalu Besar
                                </DialogTitle>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-[#1a1a1a]">
                            <DialogDescription className="text-base text-gray-400">
                                File yang Anda pilih melebihi batas maksimum yang diizinkan (2MB).
                                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-red-500/10">
                                    <ul className="text-sm text-gray-300 space-y-3">
                                        <li className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            Pastikan ukuran file tidak lebih dari 2MB
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            Format yang didukung: PNG, JPG, JPEG
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            Kompres file jika diperlukan
                                        </li>
                                    </ul>
                                </div>
                            </DialogDescription>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setOpenDialog(false)}
                                    className="bg-red-600 hover:bg-red-700 text-white 
                                px-6 py-2.5 rounded-lg 
                            text-sm font-medium transition-all duration-300 
                                shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                                >
                                    Mengerti
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Image Zoom Dialog */}
                <Dialog open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
                    <DialogContent className="max-w-[95vw] sm:max-w-[80vw] max-h-[90vh] overflow-hidden p-0 bg-white/5 backdrop-blur-xl border border-white/20" hasCloseButton={false}>
                        <div className="relative h-full w-full flex items-center justify-center pt-10 sm:pt-12 pb-4 px-2 sm:px-4">
                            {zoomedImage?.src && (
                                <img
                                    src={zoomedImage.src}
                                    alt={zoomedImage.alt}
                                    className="max-w-full max-h-[80vh] object-contain"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setImageZoomOpen(false)}
                                className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors z-10"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <LoadingScreen isOpen={showLoadingScreen} />
        </>
    )
}
