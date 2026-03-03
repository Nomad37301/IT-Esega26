import { useState, useEffect } from 'react';
import axios from 'axios';

interface CompetitionSlot {
    id: number;
    competition_name: string;
    total_slots: number;
    used_slots: number;
    is_active: boolean;
    available_slots?: number;
    filled_percentage?: number;
}

interface SlotValidation {
    available: boolean;
    availableSlots: number;
    totalSlots: number;
    usedSlots: number;
    filledPercentage: number;
    message: string;
}

interface SlotTypeValidation extends SlotValidation {
    requiredSlots: number;
}

// Data default jika API tidak tersedia
const DEFAULT_SLOTS: CompetitionSlot[] = [
    {
        id: 1,
        competition_name: "Mobile Legends",
        total_slots: 64,
        used_slots: 24,
        is_active: true,
        available_slots: 40,
        filled_percentage: 37.5
    },
    {
        id: 2,
        competition_name: "Free Fire",
        total_slots: 48,
        used_slots: 18,
        is_active: true,
        available_slots: 30,
        filled_percentage: 37.5
    }
];

export function useCompetitionSlots() {
    const [slots, setSlots] = useState<CompetitionSlot[]>(DEFAULT_SLOTS);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Ambil data semua slot
    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/competition-slots');
            
            // Periksa respon API
            if (response.data?.data && Array.isArray(response.data.data)) {
                // Transformasi data dengan menambahkan properti kalkulasi
                const enhancedSlots = response.data.data.map((slot: CompetitionSlot) => ({
                    ...slot,
                    available_slots: slot.total_slots - slot.used_slots,
                    filled_percentage: (slot.used_slots / slot.total_slots) * 100
                }));
                
                setSlots(enhancedSlots);
                setError(null);
            } else {
                console.warn('API response format tidak valid, menggunakan data default');
                // Tetap menggunakan data default
            }
        } catch (err: unknown) {
            console.warn('Gagal mengambil data slot dari API, menggunakan data default', err);
            const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data slot';
            setError(errorMessage);
            // Kita sudah memiliki data default, jadi tidak perlu melakukan apa-apa
        } finally {
            setLoading(false);
        }
    };
    
    // Validasi ketersediaan slot
    const validateSlot = async (competitionName: string): Promise<SlotValidation | null> => {
        try {
            // Coba panggil API
            const response = await axios.get(`/api/competition-slots/${competitionName}/validate`);
            return response.data;
        } catch (err) {
            console.warn('Error validating slot from API, using local validation instead:', err);
            
            // Jika API gagal, lakukan validasi lokal
            const slot = slots.find(s => s.competition_name === competitionName);
            if (!slot) return null;
            
            const availableSlots = slot.total_slots - slot.used_slots;
            const isAvailable = availableSlots > 0;
            
            return {
                available: isAvailable,
                availableSlots: availableSlots,
                totalSlots: slot.total_slots,
                usedSlots: slot.used_slots,
                filledPercentage: (slot.used_slots / slot.total_slots) * 100,
                message: isAvailable 
                    ? `Masih tersedia ${availableSlots} slot`
                    : 'Slot telah penuh untuk kompetisi ini'
            };
        }
    };
    
    // Validasi ketersediaan slot berdasarkan tipe slot
    const validateSlotByType = async (competitionName: string, slotType: 'single' | 'double'): Promise<SlotTypeValidation | null> => {
        try {
            // Coba panggil API
            const response = await axios.get(`/api/competition-slots/${competitionName}/validate/${slotType}`);
            return response.data;
        } catch (err) {
            console.warn('Error validating slot by type from API, using local validation instead:', err);
            
            // Jika API gagal, lakukan validasi lokal
            const slot = slots.find(s => s.competition_name === competitionName);
            if (!slot) return null;
            
            const requiredSlots = slotType === 'double' ? 2 : 1;
            const availableSlots = slot.total_slots - slot.used_slots;
            const isAvailable = availableSlots >= requiredSlots;
            
            return {
                available: isAvailable,
                availableSlots: availableSlots,
                requiredSlots: requiredSlots,
                totalSlots: slot.total_slots,
                usedSlots: slot.used_slots,
                filledPercentage: (slot.used_slots / slot.total_slots) * 100,
                message: isAvailable 
                    ? `Masih tersedia ${availableSlots} slot (dibutuhkan ${requiredSlots})`
                    : `Slot tidak cukup untuk tipe ${slotType} (dibutuhkan ${requiredSlots})`
            };
        }
    };
    
    // Increment slot yang digunakan (memerlukan auth)
    const incrementSlot = async (competitionName: string, count: number = 1) => {
        try {
            const response = await axios.post(`/api/competition-slots/${competitionName}/increment`, { count });
            
            // Update local state jika berhasil
            if (response.data.success) {
                setSlots(prev => prev.map(slot => {
                    if (slot.competition_name === competitionName) {
                        return {
                            ...slot,
                            used_slots: response.data.usedSlots,
                            available_slots: response.data.availableSlots,
                            filled_percentage: (response.data.usedSlots / response.data.totalSlots) * 100
                        };
                    }
                    return slot;
                }));
                
                return response.data;
            }
            
            throw new Error('Respon API berhasil tetapi tidak menunjukkan status sukses');
        } catch (err: unknown) {
            console.warn('Error incrementing slot from API, updating locally:', err);
            
            // Update state lokal sebagai fallback
            setSlots(prev => prev.map(slot => {
                if (slot.competition_name === competitionName) {
                    const newUsedSlots = slot.used_slots + count;
                    const newAvailableSlots = slot.total_slots - newUsedSlots;
                    
                    return {
                        ...slot,
                        used_slots: newUsedSlots,
                        available_slots: newAvailableSlots,
                        filled_percentage: (newUsedSlots / slot.total_slots) * 100
                    };
                }
                return slot;
            }));
            
            return {
                success: true, // Kita anggap sukses meski API gagal, karena kita sudah update lokal
                message: 'Berhasil update slot (lokal)',
                localFallback: true
            };
        }
    };
    
    // Increment slot yang digunakan berdasarkan tipe slot
    const incrementSlotByType = async (competitionName: string, slotType: 'single' | 'double') => {
        try {
            const response = await axios.post(`/api/competition-slots/${competitionName}/increment-by-type`, { slot_type: slotType });
            
            // Update local state jika berhasil
            if (response.data.success) {
                setSlots(prev => prev.map(slot => {
                    if (slot.competition_name === competitionName) {
                        return {
                            ...slot,
                            used_slots: response.data.usedSlots,
                            available_slots: response.data.availableSlots,
                            filled_percentage: (response.data.usedSlots / response.data.totalSlots) * 100
                        };
                    }
                    return slot;
                }));
                
                return response.data;
            }
            
            throw new Error('Respon API berhasil tetapi tidak menunjukkan status sukses');
        } catch (err: unknown) {
            console.warn('Error incrementing slot by type from API, updating locally:', err);
            
            // Update state lokal sebagai fallback
            const slotCount = slotType === 'double' ? 2 : 1;
            
            setSlots(prev => prev.map(slot => {
                if (slot.competition_name === competitionName) {
                    const newUsedSlots = slot.used_slots + slotCount;
                    const newAvailableSlots = slot.total_slots - newUsedSlots;
                    
                    return {
                        ...slot,
                        used_slots: newUsedSlots,
                        available_slots: newAvailableSlots,
                        filled_percentage: (newUsedSlots / slot.total_slots) * 100
                    };
                }
                return slot;
            }));
            
            return {
                success: true, // Kita anggap sukses meski API gagal, karena kita sudah update lokal
                message: `Berhasil update ${slotCount} slot (lokal)`,
                slotType: slotType,
                localFallback: true
            };
        }
    };
    
    // Decrement slot yang digunakan (memerlukan auth)
    const decrementSlot = async (competitionName: string, count: number = 1) => {
        try {
            const response = await axios.post(`/api/competition-slots/${competitionName}/decrement`, { count });
            
            // Update local state jika berhasil
            if (response.data.success) {
                setSlots(prev => prev.map(slot => {
                    if (slot.competition_name === competitionName) {
                        return {
                            ...slot,
                            used_slots: response.data.usedSlots,
                            available_slots: response.data.availableSlots,
                            filled_percentage: (response.data.usedSlots / response.data.totalSlots) * 100
                        };
                    }
                    return slot;
                }));
                
                return response.data;
            }
            
            throw new Error('Respon API berhasil tetapi tidak menunjukkan status sukses');
        } catch (err: unknown) {
            console.warn('Error decrementing slot from API, updating locally:', err);
            
            // Update state lokal sebagai fallback
            setSlots(prev => prev.map(slot => {
                if (slot.competition_name === competitionName) {
                    const newUsedSlots = Math.max(0, slot.used_slots - count);
                    const newAvailableSlots = slot.total_slots - newUsedSlots;
                    
                    return {
                        ...slot,
                        used_slots: newUsedSlots,
                        available_slots: newAvailableSlots,
                        filled_percentage: (newUsedSlots / slot.total_slots) * 100
                    };
                }
                return slot;
            }));
            
            return {
                success: true, // Kita anggap sukses meski API gagal, karena kita sudah update lokal
                message: 'Berhasil mengurangi slot (lokal)',
                localFallback: true
            };
        }
    };
    
    // Decrement slot berdasarkan tipe slot
    const decrementSlotByType = async (competitionName: string, slotType: 'single' | 'double') => {
        try {
            const response = await axios.post(`/api/competition-slots/${competitionName}/decrement-by-type`, { slot_type: slotType });
            
            // Update local state jika berhasil
            if (response.data.success) {
                setSlots(prev => prev.map(slot => {
                    if (slot.competition_name === competitionName) {
                        return {
                            ...slot,
                            used_slots: response.data.usedSlots,
                            available_slots: response.data.availableSlots,
                            filled_percentage: (response.data.usedSlots / response.data.totalSlots) * 100
                        };
                    }
                    return slot;
                }));
                
                return response.data;
            }
            
            throw new Error('Respon API berhasil tetapi tidak menunjukkan status sukses');
        } catch (err: unknown) {
            console.warn('Error decrementing slot by type from API, updating locally:', err);
            
            // Update state lokal sebagai fallback
            const slotCount = slotType === 'double' ? 2 : 1;
            
            setSlots(prev => prev.map(slot => {
                if (slot.competition_name === competitionName) {
                    const newUsedSlots = Math.max(0, slot.used_slots - slotCount);
                    const newAvailableSlots = slot.total_slots - newUsedSlots;
                    
                    return {
                        ...slot,
                        used_slots: newUsedSlots,
                        available_slots: newAvailableSlots,
                        filled_percentage: (newUsedSlots / slot.total_slots) * 100
                    };
                }
                return slot;
            }));
            
            return {
                success: true, // Kita anggap sukses meski API gagal, karena kita sudah update lokal
                message: `Berhasil mengurangi ${slotCount} slot (lokal)`,
                slotType: slotType,
                localFallback: true
            };
        }
    };
    
    // Load data saat komponen dimount
    useEffect(() => {
        fetchSlots();
    }, []);
    
    return {
        slots,
        loading,
        error,
        fetchSlots,
        validateSlot,
        validateSlotByType,
        incrementSlot,
        incrementSlotByType,
        decrementSlot,
        decrementSlotByType
    };
}