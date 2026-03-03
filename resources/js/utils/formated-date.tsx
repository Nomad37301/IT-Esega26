import React from 'react';

interface FormattedDateProps {
    date: Date | string;
}

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    const dayName = dayNames[parsedDate.getDay()];
    const day = parsedDate.getDate();
    const month = monthNames[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();

    const hours = parsedDate.getHours().toString().padStart(2, '0');
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
    const seconds = parsedDate.getSeconds().toString().padStart(2, '0');

    const formatted = `${dayName}, ${day} ${month} ${year} Jam ${hours}:${minutes}:${seconds}`;

    return <span>{formatted}</span>;
};


export const FormattedDateWithOutTime: React.FC<FormattedDateProps> = ({ date }) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    const dayName = dayNames[parsedDate.getDay()];
    const day = parsedDate.getDate();
    const month = monthNames[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();


    const formatted = `${dayName}, ${day} ${month} ${year}`;

    return <span>{formatted}</span>;
};

export function formatDate(date: Date | string | undefined): string {
    if (!date) {
        return 'Invalid Date';
    }

    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(parsedDate);
}

export function formatTime(date: Date | string | undefined): string {
    if (!date) {
        return 'Invalid Time';
    }

    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
        return 'Invalid Time';
    }

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(parsedDate);
}

export function formatDateTime(date: Date): string {
    return `${formatDate(date)}, ${formatTime(date)}`;
}
