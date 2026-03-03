import { EventCard } from '@/components/event/event-card';
import { EventForm } from '@/components/event/event-form';
import { EventTimeline } from '@/components/event/event-timeline';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AuthenticatedAdminLayout from '@/layouts/admin/layout';
import { Event } from '@/types/event';
import { UserType } from '@/types/user';
import { useForm, usePage } from '@inertiajs/react';
import { PlusCircle, Terminal } from 'lucide-react';
import * as React from 'react';
import { route } from 'ziggy-js';

export default function AdminTimelinePage() {
    const { user, timelines, flash } = usePage<{
        user: { data: UserType };
        timelines: { data: Event[] };
        flash: { success?: string; error?: string };
    }>().props;

    const auth = user.data;
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);

    const events = timelines.data;

    console.log(events)

    const { setData, post, put, delete: destroy, processing, reset } = useForm<Omit<Event, "id">>({
        title: '',
        description: '',
        due_date: new Date(),
        end_date: undefined,
        category: '',
        location: '',
        status: true,
    });

    const handleAddEvent = (event: Omit<Event, "id">) => {
        setData(event);
        post(route('timeline.store'), {
            onSuccess: () => {
                setIsFormOpen(false);
                reset();
            },
        });
    };

    const handleEditEvent = (updatedEvent: Event) => {
        setData({
            title: updatedEvent.title,
            description: updatedEvent.description,
            due_date: updatedEvent.due_date,
            end_date: updatedEvent.end_date,
            location: updatedEvent.location || '',
            category: updatedEvent.category,
            status: updatedEvent.status,
        });
        put(route('timeline.update', updatedEvent.id), {
            onSuccess: () => {
                setEditingEvent(null);
                setIsFormOpen(false);
                reset();
            },
        });
    };

    const handleDeleteEvent = (id: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            destroy(route('timeline.destroy', id));
        }
    };

    const openEditForm = (event: Event) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    return (
        <AuthenticatedAdminLayout title="Timeline Management" headerTitle="Timeline Management" user={auth}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Event Timeline Management</h1>
                    <p className="text-white">Organize and manage IT-essega event schedule with ease.</p>
                </header>

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Event List */}
                    <div className="lg:w-2/3">
                        <div className="mb-6 rounded-xl p-6 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Event Timeline</h2>
                                <Button
                                    onClick={() => {
                                        setEditingEvent(null);
                                        setIsFormOpen(true);
                                    }}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Event
                                </Button>
                            </div>

                            <EventTimeline events={events} onEdit={openEditForm} onDelete={(id) => handleDeleteEvent(id)} />
                        </div>
                    </div>

                    {/* Form / Details */}
                    <div className="lg:w-1/3">
                        {isFormOpen ? (
                            <div className="sticky top-8 rounded-xl p-6 shadow-md">
                                <h2 className="mb-4 text-xl font-semibold">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                                <EventForm
                                    processing={processing}
                                    onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
                                    onCancel={() => {
                                        setIsFormOpen(false);
                                        setEditingEvent(null);
                                    }}
                                    initialData={editingEvent}
                                />
                            </div>
                        ) : (
                            <div className="rounded-xl p-6 shadow-md">
                                <h2 className="mb-4 text-xl font-semibold">Event Details</h2>
                                <p className="mb-4 text-white">Select an event from the timeline or add a new one to see details here.</p>

                                <div className="space-y-4">
                                    {events.slice(0, 3).map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onEdit={() => openEditForm(event)}
                                            onDelete={() => handleDeleteEvent(event.id)}
                                            compact
                                        />
                                    ))}
                                    {events.length > 3 && <p className="text-center text-sm text-white">+{events.length - 3} more events</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {flash.success && (
                    <div className="mt-6">
                        <Alert variant="default" className="mb-4">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </AuthenticatedAdminLayout>
    );
}



