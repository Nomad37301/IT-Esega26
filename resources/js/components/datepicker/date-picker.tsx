'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerWithRangeProps {
    className?: string;
    onChange: (dateRange: { from: Date; to: Date }) => void;
}

export function DatePickerWithRange({ className, onChange }: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange>({
        from: new Date(),
        to: new Date(),
    });

    const handleDateChange = (range: DateRange | undefined) => {
        if (range?.from) {
            const newRange = {
                from: range.from,
                to: range.to ?? range.from,
            };

            setDate(newRange);
            onChange(newRange);
        } else {
            setDate({ from: new Date(), to: new Date() });
        }
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                    >
                        <CalendarIcon />
                        {date.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" defaultMonth={date.from} selected={date} onSelect={handleDateChange} numberOfMonths={2} />
                </PopoverContent>
            </Popover>
        </div>
    );
}
