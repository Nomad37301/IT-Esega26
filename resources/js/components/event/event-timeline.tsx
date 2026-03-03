'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Event } from '@/types/event';
import { Calendar, CheckCircle2, Clock, Filter } from 'lucide-react';
import { useState } from 'react';
import { EventCard } from './event-card';

interface EventTimelineProps {
    events: Event[];
    onEdit: (event: Event) => void;
    onDelete: (id: number) => void;
}

export function EventTimeline({ events, onEdit, onDelete }: EventTimelineProps) {
    const [filter, setFilter] = useState<string | null>(null);

    // Ensure all dates are properly converted
    const formattedEvents = events.map((event) => ({
        ...event,
        due_date: new Date(event.due_date),
    }));

    const categories = Array.from(new Set(formattedEvents.map((event) => event.category)));

    const filteredEvents = filter ? formattedEvents.filter((event) => event.category === filter) : formattedEvents;

    const sortedEvents = [...filteredEvents].sort((a, b) => {
        const dateA = a.due_date;
        const dateB = b.due_date;

        // Validate date conversion
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Invalid date detected:', a.due_date, b.due_date);
            return 0; // Prevent sorting errors due to invalid dates
        }

        return dateA.getTime() - dateB.getTime();
    });

    const isEventPassed = (date: Date) => date < new Date();

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-white">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                        {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            {filter ? `Filter: ${filter}` : 'Filter'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setFilter(null)}>All Categories</DropdownMenuItem>
                            {categories.map((category) => (
                                <DropdownMenuItem key={category} onClick={() => setFilter(category)}>
                                    {category}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="relative">
                <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                    {sortedEvents.length > 0 ? (
                        sortedEvents.map((event) => (
                            <div key={event.id} className="relative pl-12">
                                <div
                                    className={`absolute top-6 left-5 flex h-6 w-6 -translate-x-3 -translate-y-1.5 transform items-center justify-center rounded-full bg-white ring-4 ring-white`}
                                >
                                    {isEventPassed(event.due_date) ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-blue-500" />
                                    )}
                                </div>
                                <EventCard event={event} onEdit={() => onEdit(event)} onDelete={() => onDelete(event.id)} />
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-white">No events found. Add your first event to get started.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
