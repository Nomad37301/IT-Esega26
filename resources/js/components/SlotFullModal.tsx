import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

interface SlotFullModalProps {
    isOpen: boolean;
    onClose: () => void;
    competitionName: string;
    slotType?: 'single' | 'double' | null;
}

const SlotFullModal = ({ isOpen, onClose, competitionName, slotType }: SlotFullModalProps) => {
    const slotLabel = slotType ? (slotType === 'double' ? 'Double Slot' : 'Single Slot') : '';
    const slotInfo = slotType ? ` (${slotLabel})` : '';
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
                    
                    <motion.div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pt-4 pb-2 flex justify-between items-center border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Slot Pendaftaran Penuh</h3>
                            <button 
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <div className="px-6 py-4">
                            <p className="mb-4 text-gray-700">
                                Mohon maaf, slot pendaftaran untuk lomba <span className="font-semibold">{competitionName}{slotInfo}</span> sudah penuh.
                            </p>
                            <p className="mb-4 text-gray-700">
                                {competitionName === 'Mobile Legends' && slotType === null ? (
                                    <>
                                        Semua slot untuk Mobile Legends (baik Single maupun Double) sudah terisi penuh. 
                                        Silakan coba mendaftar untuk kompetisi lain atau hubungi panitia untuk informasi lebih lanjut.
                                    </>
                                ) : competitionName === 'Mobile Legends' && slotType === 'double' ? (
                                    <>
                                        Anda dapat mencoba mendaftar dengan <span className="font-semibold">Single Slot</span> jika masih tersedia, atau hubungi panitia untuk informasi lebih lanjut.
                                    </>
                                ) : (
                                    <>
                                        Silakan coba mendaftar untuk kompetisi lain atau hubungi panitia untuk informasi lebih lanjut.
                                    </>
                                )}
                            </p>
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
                                >
                                    Kembali
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SlotFullModal;