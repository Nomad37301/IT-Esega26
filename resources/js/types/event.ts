export interface Event {
    id: number;
    title: string;
    due_date: Date;
    end_date?: Date | undefined;
    description: string;
    category: string;
    location?: string;
    status?: boolean;
}
