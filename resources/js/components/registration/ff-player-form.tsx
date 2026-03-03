"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ZoomIn, X } from "lucide-react"
import { FFPlayer, PlayerFFFormProps } from "@/types/register"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function FFPlayerForm({ player, index, onChange, onDelete, allPlayers, errorsBE }: PlayerFFFormProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Partial<Record<keyof FFPlayer, string>>>({})
    const [fileNames, setFileNames] = useState<{ foto: string; tanda_tangan: string }>({ foto: '', tanda_tangan: '' })
    const [imageZoomOpen, setImageZoomOpen] = useState(false)
    const [zoomedImage, setZoomedImage] = useState<{src: string | null, alt: string} | null>(null)

    const validateField = (field: keyof FFPlayer, value: string) => {
        if (!value) return undefined; // Don't show error for empty fields initially

        switch (field) {
            case 'nickname':
                return undefined // Terima semua karakter
            case 'id_server':
                return undefined // Terima semua karakter
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Format email tidak valid.'
            case 'alamat':
                return value.trim().length >= 10 ? undefined : 'Alamat harus minimal 10 karakter.'
            case 'no_hp':
                if (!/^\d+$/.test(value)) {
                    return 'No HP hanya boleh berisi angka';
                }
                return undefined;
            default:
                return undefined
        }
    }

    useEffect(() => {
        // Handle initial preview for existing files
        if (player.foto) {
            if (typeof player.foto === 'string') {
                setPhotoPreview(`/storage/${player.foto}`)
            } else if (player.foto instanceof File) {
                const reader = new FileReader()
                reader.onload = () => {
                    setPhotoPreview(reader.result as string)
                }
                reader.readAsDataURL(player.foto)
            }
        }

        if (player.tanda_tangan) {
            if (typeof player.tanda_tangan === 'string') {
                setSignaturePreview(`/storage/${player.tanda_tangan}`)
            } else if (player.tanda_tangan instanceof File) {
                const reader = new FileReader()
                reader.onload = () => {
                    setSignaturePreview(reader.result as string)
                }
                reader.readAsDataURL(player.tanda_tangan)
            }
        }
    }, [player.foto, player.tanda_tangan])

    useEffect(() => {
        if (errorsBE) {
            setErrors(prev => {
                const newErrors = { ...prev }
                Object.keys(errorsBE).forEach(key => {
                    newErrors[key as keyof FFPlayer] = errorsBE[key]
                })
                return newErrors
            })
        }
    }, [errorsBE])


    const handleInputChange = <K extends keyof FFPlayer>(field: K) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        const err = validateField(field, val)
        setErrors(prev => ({ ...prev, [field]: err }))
        onChange(index, field, val as FFPlayer[K])
    }

    const handleFileChange = (field: "foto" | "tanda_tangan") => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, [field]: "File harus berupa gambar (JPG atau PNG)." }))
            return
        }

        // Validate file size (1MB)
        const maxSize = 1 * 1024 * 1024
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, [field]: "Ukuran file maksimal 1MB." }))
            return
        }

        // Clear error if exists
        setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })

        // Update file name
        setFileNames(prev => ({ ...prev, [field]: file.name }))

        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
            if (field === "foto") {
                setPhotoPreview(reader.result as string)
            } else if (field === "tanda_tangan") {
                setSignaturePreview(reader.result as string)
            }
        }
        reader.readAsDataURL(file)

        // Send the actual File object to parent
        onChange(index, field, file)
    }

    const handleDeleteFile = (field: "foto" | "tanda_tangan") => {
        if (field === "foto") {
            setPhotoPreview(null)
        } else {
            setSignaturePreview(null)
        }
        setFileNames(prev => ({ ...prev, [field]: '' }))
        onChange(index, field, null)

        // Clear error if exists
        setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })
    }

    const handleRoleChange = (value: FFPlayer["role"]) => {
        const ketuaCount = allPlayers.filter((p: FFPlayer) => p.role === "ketua").length
        const cadanganCount = allPlayers.filter((p: FFPlayer) => p.role === "cadangan").length

        if (value === "ketua" && ketuaCount >= 1) {
            setErrors(prev => ({ ...prev, role: "Only one Ketua is allowed." }))
        } else if (value === "cadangan" && cadanganCount >= 2) {
            setErrors(prev => ({ ...prev, role: "Only two Cadangan are allowed." }))
        } else {
            setErrors(prev => ({ ...prev, role: undefined }))
        }

        onChange(index, "role", value)
    }

    const renderError = (field: keyof FFPlayer) => {
        const beKey = `ml_players.${index}.ml_players.${index}.${field}`;
        const backendError = errorsBE?.[beKey];
        const frontendError = errors[field];
        const errorMessage = frontendError ?? backendError;

        if (typeof errorMessage === "string" && errorMessage.trim() !== "") {
            return (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            );
        }
        return null;
    };

    const openImageZoom = (src: string, alt: string) => {
        setZoomedImage({ src, alt })
        setImageZoomOpen(true)
    }

    return (
        <div className="border border-red-100 rounded-xl p-5 sm:p-6 w-full bg-white">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <span className="text-red-700 font-bold text-base sm:text-lg">{index + 1}</span>
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Player {index + 1}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Data Pemain</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={onDelete}
                    className="w-8 h-8 sm:w-9 sm:h-9 text-red-700 hover:text-red-200 bg-red-50 hover:bg-red-500 border-red-200 transition-all duration-200"
                >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5">
                {/* Personal Information Section */}
                <div className="space-y-4 sm:space-y-5 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor={`ml-name-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`ml-name-${index}`}
                                value={player.name}
                                onChange={handleInputChange("name")}
                                placeholder="Nama lengkap pemain"
                                className="py-2.5 sm:py-3.5 bg-white border-gray-200 rounded-lg text-gray-900 
                                           px-4 sm:px-5 text-sm sm:text-base placeholder:text-gray-400 focus:border-red-400 focus:ring-red-200 shadow-sm"
                                required
                            />
                            {renderError("name")}
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor={`ml-nickname-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                Nickname <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`ml-nickname-${index}`}
                                value={player.nickname}
                                onChange={handleInputChange("nickname")}
                                placeholder="Nickname in-game"
                                className="py-2.5 sm:py-3.5 bg-white border-gray-200 rounded-lg text-gray-900 
                                           px-4 sm:px-5 text-sm sm:text-base placeholder:text-gray-400 focus:border-red-400 focus:ring-red-200 shadow-sm"
                                required
                            />
                            {renderError("nickname")}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor={`ml-id_server-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                Server ID <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`ml-id_server-${index}`}
                                value={player.id_server}
                                onChange={handleInputChange("id_server")}
                                placeholder="Server ID"
                                className="py-2.5 sm:py-3.5 bg-white border-gray-200 rounded-lg text-gray-900 
                                           px-4 sm:px-5 text-sm sm:text-base placeholder:text-gray-400 focus:border-red-400 focus:ring-red-200 shadow-sm"
                                required
                            />
                            {renderError("id_server")}
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor={`ml-role-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                Role <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={player.role}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger className={`py-1.5 sm:py-2.5 px-3 sm:px-4 bg-white border-gray-200 rounded-lg text-gray-900 
                                                text-xs sm:text-sm h-[34px] sm:h-[42px] ${errors.role ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Pilih role pemain" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ketua">Ketua</SelectItem>
                                    <SelectItem value="anggota">Anggota</SelectItem>
                                    <SelectItem value="cadangan">Cadangan</SelectItem>
                                </SelectContent>
                            </Select>
                            {renderError("role")}
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4 sm:space-y-5 md:col-span-2 mt-1 sm:mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor={`ml-email-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`ml-email-${index}`}
                                value={player.email}
                                onChange={handleInputChange("email")}
                                placeholder="Email address"
                                type="email"
                                className="py-2.5 sm:py-3.5 bg-white border-gray-200 rounded-lg text-gray-900 
                                           px-4 sm:px-5 text-sm sm:text-base placeholder:text-gray-400 focus:border-red-400 focus:ring-red-200 shadow-sm"
                                required
                            />
                            {renderError("email")}
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor={`ml-no_hp-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                No. HP <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`ml-no_hp-${index}`}
                                value={player.no_hp}
                                onChange={handleInputChange("no_hp")}
                                placeholder="Nomor handphone"
                                className="py-2.5 sm:py-3.5 bg-white border-gray-200 rounded-lg text-gray-900 
                                           px-4 sm:px-5 text-sm sm:text-base placeholder:text-gray-400 focus:border-red-400 focus:ring-red-200 shadow-sm"
                                required
                            />
                            {renderError("no_hp")}
                        </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor={`ml-alamat-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                            Alamat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id={`ml-alamat-${index}`}
                            value={player.alamat}
                            onChange={handleInputChange("alamat")}
                            placeholder="Alamat lengkap"
                            className="py-2.5 sm:py-3.5 bg-white border-gray-200 rounded-lg text-gray-900 
                                       px-4 sm:px-5 text-sm sm:text-base placeholder:text-gray-400 focus:border-red-400 focus:ring-red-200 shadow-sm"
                            required
                        />
                        {renderError("alamat")}
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4 sm:space-y-5 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {[
                            ["foto", "Foto Selfie", photoPreview, true, "Wajib terlihat wajah peserta, bukan gambar acak"] as const,
                            ["tanda_tangan", "Tanda Tangan", signaturePreview, true, "Tanda tangan harus jelas dan mudah dibaca"] as const,
                        ].map(([field, label, preview, required, guidance]) => (
                            <div key={field} className="space-y-2 sm:space-y-3">
                                <div className="flex flex-col space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <Label htmlFor={`ml-${field}-${index}`} className="text-sm sm:text-base font-medium text-gray-700">
                                                {label}
                                                {required && <span className="text-red-500">*</span>}
                                            </Label>
                                        </div>
                                        {preview && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteFile(field as "foto" | "tanda_tangan")}
                                                className="text-red-500 hover:text-red-600 text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1 transition-colors duration-200"
                                            >
                                                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                <span>Hapus</span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[9px] sm:text-[11px] text-gray-500 -mt-0.5">{guidance}</p>
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id={`ml-${field}-${index}`}
                                            onChange={handleFileChange(field as "foto" | "tanda_tangan")}
                                            accept="image/png,image/jpeg,image/jpg"
                                            className="hidden"
                                            required={required}
                                        />
                                        <label
                                            htmlFor={`ml-${field}-${index}`}
                                            className={`w-full py-1.5 sm:py-2.5 px-2 sm:px-3 bg-red-50/80 hover:bg-red-50 text-red-700 rounded-md border ${errors[field as keyof FFPlayer] ? 'border-red-500' : 'border-gray-200'
                                                } cursor-pointer transition-colors duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm min-h-[32px] sm:min-h-[40px]`}
                                        >
                                            <div className="flex items-center gap-1 sm:gap-2 w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                                </svg>
                                                <span className="truncate flex-1">
                                                    {fileNames[field as "foto" | "tanda_tangan"]
                                                        ? (
                                                            <span className="flex items-center gap-1">
                                                                <span className="truncate max-w-[80px] sm:max-w-[150px]">{fileNames[field as "foto" | "tanda_tangan"]}</span>
                                                                <span className="text-red-400 shrink-0">•</span>
                                                                <span className="text-[9px] sm:text-xs text-red-400 shrink-0">Klik untuk mengganti</span>
                                                            </span>
                                                        )
                                                        : 'Pilih File'
                                                    }
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="text-[9px] sm:text-[11px] text-gray-500">
                                        Format: JPG, PNG (Max: 1MB)
                                    </div>
                                    {errors[field as keyof FFPlayer] && (
                                        <div className="flex items-center gap-1 text-red-500 text-[9px] sm:text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{errors[field as keyof FFPlayer]}</span>
                                        </div>
                                    )}
                                    {preview && (
                                        <div className="relative mt-1">
                                            <div className="relative rounded-md overflow-hidden border border-gray-200 bg-gray-50/30 group">
                                                <img
                                                    src={preview}
                                                    alt={`${label} Preview`}
                                                    className="w-full h-[90px] sm:h-[120px] object-contain cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                                    onClick={() => openImageZoom(preview, `${label} Preview`)}
                                                    onError={() => {
                                                        console.error(`Error loading ${field} preview`)
                                                        if (field === "foto") {
                                                            setPhotoPreview(null)
                                                        } else {
                                                            setSignaturePreview(null)
                                                        }
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/30 transition-opacity duration-200">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => openImageZoom(preview, `${label} Preview`)}
                                                        className="p-1.5 sm:p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                                                    >
                                                        <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
    )
}
