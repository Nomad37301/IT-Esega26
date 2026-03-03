import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Event } from '@/types/event';
import { useForm } from '@inertiajs/react';
import { Loader } from 'lucide-react';

const CATEGORIES = [
    { value: 'mobile_legend', label: 'Mobile Legend' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'free_fire', label: 'Free Fire' },
    { value: 'opening', label: 'Opening' },
    { value: 'closing', label: 'Closing' },
];

interface EventFormProps {
    onCancel: () => void;
    initialData?: Event | null;
    processing: boolean;
    onSubmit: (updatedEvent: Event) => void;
}

export function EventForm({ onCancel, initialData, processing, onSubmit }: EventFormProps) {
    const { data, setData, errors } = useForm({
        title: initialData?.title || '',
        due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '',
        end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
        description: initialData?.description || '',
        category: initialData?.category || 'main',
        location: initialData?.location || '',
        status: initialData?.status ?? true,
    });

    const onSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const formData: Omit<Event, 'id'> & { id: number } = {
            title: data.title,
            due_date: data.due_date ? new Date(data.due_date) : new Date(),
            end_date: data.end_date ? new Date(data.end_date) : undefined,
            description: data.description,
            category: data.category,
            location: data.location,
            status: data.status,
            id: initialData?.id as number,
        };

        onSubmit(formData);
    };

    return (
        <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Enter event title" required />
                {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} required />
                {errors.due_date && <span className="text-sm text-red-500">{errors.due_date}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} required />
                {errors.end_date && <span className="text-sm text-red-500">{errors.end_date}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    placeholder="Enter event location, eg:yotube link or maps"
                />
                {errors.location && <span className="text-sm text-red-500">{errors.location}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Enter event description"
                    rows={3}
                    required
                />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={processing}>
                    {processing ? (
                        <div className="flex items-center space-x-2">
                            <Loader className="animate-spin text-white" size={20} />
                            <span className="text-white">Processing...</span>
                        </div>
                    ) : initialData ? (
                        'Update Event'
                    ) : (
                        'Add Event'
                    )}
                </Button>
            </div>
        </form>
    );
}
