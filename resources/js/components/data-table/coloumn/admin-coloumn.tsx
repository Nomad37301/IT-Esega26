import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ShieldBan, ShieldCheck, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserType } from "@/types/user"
import { CustomDialog } from "@/components/dialog/custom-dialog"
import { FormattedDate } from "@/utils/formated-date"
import { RoleType } from "@/types/user";

export const Admincolumns = ({
    onUpdate,
    onDelete,
    roles,
}: {
    onUpdate: (id: number, user: UserType) => void
    onDelete: (id: number) => void;
    roles: RoleType[];
}): ColumnDef<UserType>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div>{row.getValue("id") ?? "-"}</div>,
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("name") ?? "-"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email") ?? "-"}</div>,
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => <div>{row.getValue("address") ?? "-"}</div>,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => <div>{row.getValue("phone") ?? "-"}</div>,
        },
        {
            accessorKey: "KTM",
            header: "KTM",
            cell: ({ row }) => <div>{row.getValue("KTM") ?? "-"}</div>,
        },
        {
            accessorKey: "email_verified_at",
            header: "Verified At",
            cell: ({ row }) => <FormattedDate date={row.getValue("email_verified_at") ?? "-"} />,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as UserType["status"];
                return (
                    <span
                        className={`flex flex-row gap-1 items-center justify-center py-[0.11rem] rounded text-xs font-medium ${status === "active"
                            ? "bg-green-100 text-green-800"
                            : status === "inactive"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                    >
                        {status === "active"
                            ? <ShieldCheck className="w-5 h-5" />
                            : status === "inactive"
                                ? <ShieldX className="w-5 h-5" />
                                : <ShieldBan className="w-5 h-5" />
                        }
                        {status ?? "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => <FormattedDate date={row.getValue("created_at") ?? "-"} />,
        },
        {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ row }) => <FormattedDate date={row.getValue("updated_at") ?? "-"} />,
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: ({ row }) => {
                const roles = row.original.roles;
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.length > 0
                            ? roles.map((role) => (
                                <span
                                    key={role.id}
                                    className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs"
                                >
                                    {role.name ?? "-"}
                                </span>
                            ))
                            : "-"}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View</DropdownMenuItem>

                            {/* Edit Dialog Trigger */}
                            <div className="px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm">
                                <CustomDialog
                                    title="Edit User"
                                    description={`Ubah data admin: ${user.name}`}
                                    trigger={<span>Edit</span>}
                                    confirmText="Simpan"
                                    type="form-no-btn"
                                    onConfirm={() => {
                                        const name = (document.getElementById("name-input") as HTMLInputElement)?.value ?? "";
                                        const email = (document.getElementById("email-input") as HTMLInputElement)?.value ?? "";
                                        const password = (document.getElementById("password-input") as HTMLInputElement)?.value ?? "";
                                        const roleId = parseInt((document.getElementById("role-select") as HTMLSelectElement)?.value ?? "");
                                        const selectedRole = roles.find((r) => r.id === roleId);
                                        const status = (document.getElementById("status-select") as HTMLSelectElement)?.value as "active" | "inactive" | "blocked";
                                        const KTM = (document.getElementById("ktm-input") as HTMLInputElement)?.value ?? "";


                                        onUpdate(user.id, {
                                            id: user.id,
                                            name,
                                            email,
                                            password: password || undefined,
                                            roles: selectedRole ? [{ id: selectedRole.id, name: selectedRole.name }] : [],
                                            status,
                                            KTM,
                                        });
                                    }}
                                >
                                    <div className="space-y-4">
                                        <input
                                            id="name-input"
                                            value={user.name}
                                            className="w-full border p-2 rounded"
                                            placeholder="Nama"
                                        />
                                        <input
                                            id="email-input"
                                            value={user.email}
                                            className="w-full border p-2 rounded"
                                            placeholder="Email"
                                        />
                                        <input
                                            id="password-input"
                                            type="password"
                                            className="w-full border p-2 rounded"
                                            placeholder="Password"
                                        />
                                        <select
                                            id="role-select"
                                            defaultValue={user.roles[0]?.id.toString() ?? ""}
                                            className="w-full border p-2 rounded"
                                        >
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>


                                        <select
                                            id="status-select"
                                            value={user.status ?? ""}
                                            className="w-full border p-2 rounded"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="banned">Banned</option>
                                        </select>
                                        <input
                                            id="ktm-input"
                                            value={user.KTM ?? ""}
                                            className="w-full border p-2 rounded"
                                            placeholder="KTM"
                                        />
                                    </div>
                                </CustomDialog>
                            </div>


                            {/* Delete Dialog Trigger */}
                            <div className="px-2 py-1.5 text-red-500 cursor-pointer hover:bg-accent rounded-sm">
                                <CustomDialog
                                    title="Hapus User"
                                    description={`Yakin ingin menghapus user ${user.name}?`}
                                    trigger={<span>Delete</span>}
                                    confirmText="Hapus"
                                    type="delete"
                                    onConfirm={() => onDelete(user.id)}
                                />
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
