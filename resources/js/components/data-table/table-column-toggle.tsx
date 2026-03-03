import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, SlidersIcon } from "lucide-react"
import { Table } from "@tanstack/react-table"
import * as React from 'react';

type Props<TData> = {
    table: Table<TData>;
    initialColumnVisibility?: Record<string, boolean>;
};

export function TableColumnToggle<TData>({ table, initialColumnVisibility }: Props<TData>) {
    React.useEffect(() => {
        if (initialColumnVisibility) {
            table.setColumnVisibility(initialColumnVisibility);
        }
    }, [initialColumnVisibility, table]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    <SlidersIcon /> Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table.getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
