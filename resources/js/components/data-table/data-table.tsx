"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TableColumnToggle } from "./table-column-toggle"
import { ArchiveRestore, PlusIcon } from "lucide-react"
import { CustomDialog } from "../dialog/custom-dialog"

type Props<TData> = {
    data: TData[];
    columns: ColumnDef<TData>[];
    filterColumn?: keyof TData;
    isButtonAdd: boolean;
    isButtonRestore: boolean;
    addDialogContent?: React.ReactNode;
    restoreDialogContent?: React.ReactNode;
    onAddConfirm?: () => void;
    onRestoreConfirm?: () => void;
    onEdit?: (data: TData) => void;
    onDelete?: (id: number) => void;
    onRestore?: (id: number) => void;
    initialColumnVisibility?: Record<string, boolean>;
};


export function DataTable<TData>({ data, columns, filterColumn, isButtonRestore, isButtonAdd, addDialogContent, restoreDialogContent, onAddConfirm, onRestoreConfirm, initialColumnVisibility }: Props<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    React.useEffect(() => {
        if (initialColumnVisibility) {
            table.setColumnVisibility(initialColumnVisibility);
        }
    }, [initialColumnVisibility, table]);

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex flex-row justify-between gap-1 items-center w-full">
                    <div>
                        {filterColumn && (
                            <Input
                                placeholder={`Filter ${String(filterColumn)}...`}
                                value={(table.getColumn(filterColumn as string)?.getFilterValue() as string) ?? ""}
                                onChange={(e) =>
                                    table.getColumn(filterColumn as string)?.setFilterValue(e.target.value)
                                }
                                className="max-w-sm"
                            />
                        )}
                    </div>
                    <div className="flex flex-row items-center gap-3">
                        {isButtonAdd && (
                            <CustomDialog
                                title="Tambah Data"
                                description="Isi data baru di bawah ini."
                                trigger={<Button variant="default"><PlusIcon /> Add New</Button>}
                                confirmText="Simpan"
                                onConfirm={onAddConfirm}
                                type="form-no-btn"
                            >
                                {addDialogContent}
                            </CustomDialog>
                        )}

                        {isButtonRestore && (
                            <CustomDialog
                                title="Pulihkan Data"
                                description="Konfirmasi untuk memulihkan data."
                                trigger={<Button variant="secondary"><ArchiveRestore /> Restore</Button>}
                                confirmText="Pulihkan"
                                onConfirm={onRestoreConfirm}
                                type="form"
                            >
                                {restoreDialogContent}
                            </CustomDialog>
                        )}
                        <TableColumnToggle table={table} initialColumnVisibility={initialColumnVisibility} />
                    </div>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4 text-sm text-muted-foreground">
                <div>
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
