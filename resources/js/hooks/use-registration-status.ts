import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Event } from '@/types/event';

export function useRegistrationStatus() {
    const { event } = usePage<{ event?: { data: Event[] } }>().props;
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

    useEffect(() => {
        // Find the registration event from the timeline
        // Usually it's named "Pendaftaran" or "Registration"
        const registrationEvent = event?.data?.find(
            (e) => e.title.toLowerCase().includes('pendaftaran') || e.title.toLowerCase().includes('registration')
        );

        let deadline: dayjs.Dayjs;
        
        if (registrationEvent) {
            // Use end_date if available, otherwise due_date
            deadline = registrationEvent.end_date 
                ? dayjs(registrationEvent.end_date) 
                : dayjs(registrationEvent.due_date);
        } else {
            // Fallback deadline if not found in admin
            deadline = dayjs('2025-07-02T00:00:00');
        }

        const checkStatus = () => {
            setIsRegistrationClosed(dayjs().isAfter(deadline));
        };

        checkStatus(); // Initial check

        const interval = setInterval(checkStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [event]);

    return isRegistrationClosed;
}
