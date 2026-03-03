import { ListChecks, CreditCard, DollarSign, Building, ChevronDown, X } from "lucide-react"
import type { QRCodeSectionProps } from "@/types/register"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function QRCodeSection({ 
    title, 
    description, 
    instructions, 
    gameType, 
    slotType = "single", // Tambahkan slotType dengan default "single"
    resetStep 
}: QRCodeSectionProps) {
    // Logging resetStep parameter to prevent "unused" linter error
    console.log("QR code section has reset step function:", !!resetStep);
    
    // State untuk dropdown instruksi
    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
    
    // State untuk QR code modal
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    
    // State untuk biaya pendaftaran berdasarkan slotType
    const [fee, setFee] = useState("Rp 100.000");
    
    // Toggle instruksi dropdown
    const toggleInstructions = () => {
        setIsInstructionsOpen(!isInstructionsOpen);
    };
    
    // Update biaya berdasarkan slotType
    useEffect(() => {
        if (gameType === "ml" && slotType === "double") {
            setFee("Rp 200.000");
        } else {
            setFee("Rp 100.000");
        }
    }, [gameType, slotType]);

    return (
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center 
            bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100/90
            min-h-[calc(100vh-4rem)] relative overflow-hidden p-8 lg:p-10">
            
            {/* Background Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-gray-200/40 to-gray-300/20 blur-3xl -z-10 transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-to-tr from-red-200/20 to-gray-100/40 blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/4"></div>
            <div className="absolute bottom-1/2 right-1/4 w-48 h-48 rounded-full bg-white/50 blur-2xl -z-10"></div>
            
            {/* Content Container */}
            <div className="w-full max-w-md mx-auto">
                {/* Title Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-5 p-3 bg-gradient-to-br from-gray-100 to-white rounded-full shadow-sm shadow-gray-200/50">
                        <CreditCard className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-red-700 bg-clip-text text-transparent mb-3">
                        {title}
                    </h2>
                    <p className="text-gray-600 text-sm max-w-sm mx-auto">{description}</p>
                </div>

                {/* Payment Info Card */}
                <div className="bg-white shadow-xl border border-gray-100 rounded-2xl overflow-hidden mb-8">
                    {/* QR Code Section */}
                    <div className="p-6 flex justify-center items-center bg-gradient-to-b from-gray-50 to-white">
                        <div 
                            className="bg-white rounded-xl overflow-hidden
                                transition-all duration-300 hover:scale-[1.02] group 
                                w-full max-w-[400px] shadow-sm border border-gray-100 cursor-pointer relative"
                            onClick={() => setIsQRModalOpen(true)}
                        >
                            <div className="p-3">
                                <img
                                    src="/Images/qrcode-2.png"
                                    alt={`${gameType.toUpperCase()} Payment QR Code`}
                                    className="w-full aspect-square object-contain rounded-lg"
                                />
                            </div>
                            
                            {/* Overlay Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            {/* Klik untuk memperbesar */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <span className="bg-white/90 backdrop-blur-sm text-red-600 px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                                    Klik untuk memperbesar
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Payment Info Section */}
                    <div className="bg-gradient-to-b from-gray-50 to-gray-100/50 p-5 border-t border-gray-100">
                        {/* Payment Amount */}
                        <div className="bg-white rounded-lg p-3 mb-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-center gap-2">
                                <DollarSign className="h-5 w-5 text-red-600" />
                                <h3 className="font-semibold text-gray-800">Biaya Pendaftaran</h3>
                            </div>
                            <div className="text-center mt-2">
                                <span className="font-bold text-lg text-red-700">{fee}</span>
                            </div>
                        </div>
                        
                        {/* Bank Account Info */}
                        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Building className="h-5 w-5 text-red-600" />
                                <h3 className="font-semibold text-gray-800">Informasi Rekening</h3>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Bank:</span>
                                    <span className="px-3 py-1 bg-gray-50 rounded-md text-sm font-medium text-red-700">BNI</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Nomor Rekening:</span>
                                    <span className="px-3 py-1 bg-gray-50 rounded-md text-sm font-mono font-medium text-red-700">1868712673</span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                                    <span className="text-sm text-gray-600">Atas Nama:</span>
                                    <span className="px-3 py-1 bg-gray-50 rounded-md text-sm font-medium text-red-700">Najwa Zhafir Hanysa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions - Now as a dropdown */}
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md w-full">
                    <button 
                        onClick={toggleInstructions}
                        className="w-full p-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-200/30 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <ListChecks className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-gray-800">Instruksi Pembayaran</h3>
                        </div>
                        <ChevronDown 
                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isInstructionsOpen ? 'transform rotate-180' : ''}`} 
                        />
                    </button>
                    
                    {/* Instructions content - Collapsible */}
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isInstructionsOpen ? 'max-h-96 opacity-100 p-5' : 'max-h-0 opacity-0 p-0'
                        }`}
                    >
                        <ol className="text-sm text-gray-600 space-y-3">
                            {instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-gray-100 text-red-600 rounded-full font-semibold text-xs mt-0.5">
                                        {index + 1}
                                    </div>
                                    <span className="flex-1">{instruction}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
            
            {/* QR Code Modal/Dialog untuk menampilkan QR code lebih besar */}
            <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
                <DialogContent className="sm:max-w-lg md:max-w-xl p-0 overflow-hidden bg-white">
                        <div className="relative">
                        {/* Header dengan tombol close */}
                        <div className="absolute top-2 right-2 z-10">
                            <button 
                                onClick={() => setIsQRModalOpen(false)}
                                className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-colors duration-200 text-gray-700 hover:text-red-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {/* QR Code yang lebih besar */}
                        <div className="p-3 sm:p-4">
                            <img
                                src="/Images/qrcode-2.png"
                                alt={`${gameType.toUpperCase()} Payment QR Code`}
                                className="w-full aspect-square object-contain rounded-lg max-w-full max-h-[85vh]"
                            />
                        </div>
                        
                        {/* Footer dengan informasi */}
                        <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">Pindai QR code ini menggunakan aplikasi mobile banking atau e-wallet Anda</p>
                            <p className="text-sm font-semibold text-red-600 mt-1">Biaya pendaftaran: {fee}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

