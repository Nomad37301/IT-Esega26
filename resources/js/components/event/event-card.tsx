'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Event } from '@/types/event';
import { formatDate } from '@/utils/formated-date';
import { Calendar, CheckCircle2, Clock, Edit, Trash2 } from 'lucide-react';

interface EventCardProps {
    event: Event;
    onEdit: () => void;
    onDelete: () => void;
    compact?: boolean;
}

export function EventCard({ event, onEdit, onDelete, compact = false }: EventCardProps) {
    // Ensure `due_date` and `end_date` are valid Date objects
    const formattedDueDate = new Date(event.due_date);
    const formattedEndDate = event.end_date ? new Date(event.end_date) : null;

    const isEventPassed = !isNaN(formattedDueDate.getTime()) && formattedDueDate < new Date();
    const statusColor = isEventPassed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
    const borderColor = isEventPassed ? 'border-green-500' : 'border-blue-500';

    return (
        <Card className={`overflow-hidden ${compact ? 'border-l-4' : 'border-t-4'} ${borderColor}`}>
            <CardContent className={compact ? 'p-3' : 'p-5'}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-lg'}`}>{event.title}</h3>

                        {!compact && <p className="mt-2 text-sm text-white">{event.description}</p>}

                        <div className={`flex flex-wrap gap-2 ${compact ? 'mt-1' : 'mt-3'}`}>
                            {/* Due Date */}
                            <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>{!isNaN(formattedDueDate.getTime()) ? formatDate(formattedDueDate) : 'Invalid Date'}</span>
                            </div>



                            {/* End Date */}
                            {formattedEndDate && !isNaN(formattedEndDate.getTime()) && (
                                <>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        <span>{formatDate(formattedEndDate)}</span>
                                    </div>

                                </>
                            )}

                            <Badge variant="outline" className="text-xs capitalize">
                                {event.category}
                            </Badge>

                            <Badge className={`text-xs ${statusColor}`}>
                                {isEventPassed ? (
                                    <span className="flex items-center">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Completed
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3" />
                                        On Progress
                                    </span>
                                )}
                            </Badge>
                        </div>
                    </div>

                    {!compact && (
                        <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onDelete}
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>

            {compact && (
                <CardFooter className="flex justify-end p-2 pt-0">
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={onEdit} className="h-7 w-7">
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
