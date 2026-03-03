"use client"

import type React from "react"
import { Upload, File, X, AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { FileUploadFieldProps } from "@/types/register"
import { motion } from "framer-motion"
import { useState, useRef } from "react"

export function FileUploadField({
    id,
    label,
    accept,
    value,
    onChange,
    helpText = "PNG, JPG, GIF up to 10MB",
}: FileUploadFieldProps) {
    const [showRemoveDialog, setShowRemoveDialog] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0])
        }
        // Reset input value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const files = e.dataTransfer.files
        if (files && files[0]) {
            onChange(files[0])
        }
        // Reset input value after drag and drop
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowRemoveDialog(true)
    }

    const handleConfirmRemove = () => {
        setShowRemoveDialog(false)
        onChange(null)
        // Reset input value after removal
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-gray-700 block">
                {label}
            </Label>
            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`relative group cursor-pointer transition-all duration-300
                    ${value ? 'bg-red-50/50 border-red-200' : 'bg-gray-50/80 hover:bg-gray-50 border-gray-200 hover:border-red-200'}
                    border-2 border-dashed rounded-xl overflow-hidden`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    id={id}
                    name={id}
                    type="file"
                    className="sr-only"
                    accept={accept}
                    required={!value}
                    onChange={handleFileChange}
                />
                
                <div className="px-6 py-8 text-center">
                    {!value ? (
                        <div className="space-y-3">
                            <label
                                htmlFor={id}
                                className="group cursor-pointer flex flex-col items-center gap-3"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                    <Upload className="h-10 w-10 text-red-500 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-semibold text-red-600 group-hover:text-red-700">
                                        Klik untuk upload
                                    </span>
                                    <span className="text-sm text-gray-500">atau drag and drop</span>
                                    <span className="text-xs text-gray-400">{helpText}</span>
                                </div>
                            </label>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <File className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                        {value.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {(value.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveClick}
                                className="p-1.5 hover:bg-red-100 rounded-full transition-colors duration-200"
                            >
                                <X className="h-5 w-5 text-red-500" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Remove File Confirmation Dialog */}
            <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-red-500/20 shadow-2xl p-0 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-red-500/10 bg-gradient-to-r from-red-500/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <DialogTitle className="text-lg font-semibold text-white m-0">
                                Hapus File
                            </DialogTitle>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-[#1a1a1a]">
                        <DialogDescription className="text-base text-gray-400">
                            Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan.
                            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-red-500/10">
                                <ul className="text-sm text-gray-300 space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        File yang dihapus tidak dapat dikembalikan
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        Anda perlu mengupload ulang jika diperlukan
                                    </li>
                                </ul>
                            </div>
                        </DialogDescription>

                        <div className="mt-6 flex justify-end gap-3">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-black/40 
                                    hover:bg-black/60 border border-red-500/10 rounded-lg transition-all duration-200"
                                >
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                onClick={handleConfirmRemove}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white 
                                hover:from-red-600 hover:to-red-700 px-6 py-2.5 rounded-lg 
                                text-sm font-medium transition-all duration-300 
                                shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                            >
                                Hapus File
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

