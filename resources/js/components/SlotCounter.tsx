import React from 'react';

interface SlotCounterProps {
    totalSlots: number;
    usedSlots: number;
    competitionName: string;
}

export function SlotCounter({ totalSlots, usedSlots, competitionName }: SlotCounterProps) {
    // Hitung sisa slot yang tersedia
    const availableSlots = totalSlots - usedSlots;
    
    // Menentukan warna berdasarkan ketersediaan slot
    let statusColor = '';
    let statusMessage = '';
    
    if (availableSlots <= 0) {
        statusColor = 'bg-red-500';
        statusMessage = 'Pendaftaran Ditutup';
    } else if (availableSlots <= 5) {
        statusColor = 'bg-yellow-500';
        statusMessage = 'Hampir Penuh!';
    } else {
        statusColor = 'bg-green-500';
        statusMessage = 'Slot Tersedia';
    }
    
    // Persentase slot terisi
    const fillPercentage = (usedSlots / totalSlots) * 100;
    
    return (
        <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">{competitionName}</h3>
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600">
                        {availableSlots > 0 ? `${availableSlots} slot tersisa` : 'Slot Penuh'}
                    </span>
                    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white ${statusColor}`}>
                        {statusMessage}
                    </span>
                </div>
            </div>
            
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div 
                    className={`h-full rounded-full ${availableSlots <= 0 ? 'bg-red-500' : availableSlots <= 5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${fillPercentage}%`, transition: 'width 0.5s ease-in-out' }}
                />
            </div>
            
            <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{totalSlots} Slots</span>
            </div>
            
            {availableSlots <= 0 && (
                <div className="mt-2 text-sm text-red-600 font-medium">
                    Pendaftaran untuk kompetisi ini telah ditutup karena slot sudah penuh
                </div>
            )}
        </div>
    );
}