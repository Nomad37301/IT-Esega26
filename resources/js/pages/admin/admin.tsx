import { Admincolumns } from "@/components/data-table/coloumn/admin-coloumn";
import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthenticatedAdminLayout from "@/layouts/admin/layout";
import { UserType } from "@/types/user";
import { usePage, useForm, Head } from "@inertiajs/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Eye, EyeOff } from "lucide-react";
import * as React from 'react'
import { initialColumnVisibility } from "@/components/data-table/coloumn/admin/visible-coloumn";
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AdminUser() {
    const { user, admin, flash } = usePage<{
        user: { data: UserType },
        admin: { data: UserType[] },
        flash: { success?: string, error?: string }
    }>().props;

    const auth = user.data;
    const data = admin.data;

    console.log(data);
    console.log(auth);
    const [showPassword, setShowPassword] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);

    const {
        data: formData,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors
    } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        KTM: '',
        status: 'active',
        role: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            put(route('admins.update', editId), {
                onSuccess: () => resetForm(),
            });
        } else {
            post(route('admins.store'), {
                onSuccess: () => resetForm(),
            });
        }
    };

    const handleEdit = (user: UserType) => {
        setEditId(user.id);
        setData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            phone: user.phone || '',
            address: user.address || '',
            KTM: user.KTM || '',
            status: user.status || 'active',
            role: String(user.roles?.[0] || ''),
        });
    };




    const handleDelete = (id: number) => {
        console.log('id user', id)
        destroy(route('admins.destroy', id));
    };

    // const handleRestore = (id: number) => {
    //     post(route('admin.users.restore', id));
    // };

    const resetForm = () => {
        reset();
        setEditId(null);
        setShowPassword(false);
    };

    const renderForm = (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={editId ? "Leave blank to keep current password" : "Enter password"}
                            value={formData.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setData('role', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {editId ? 'Update Admin' : 'Add Admin'}
                </Button>
            </div>
        </form>
    );


    return (
        <AuthenticatedAdminLayout title="Admin Management" headerTitle="Admin Management" user={auth}>
            <Head title="IT-ESEGA 2025 Official Website | Admin Management" />
            <DataTable
                isButtonAdd
                isButtonRestore
                initialColumnVisibility={initialColumnVisibility}
                data={data ?? []}
                addDialogContent={renderForm}
                restoreDialogContent={<p>Apakah Anda yakin ingin mengembalikan data yang dipilih?</p>}
                onEdit={handleEdit}
                onDelete={handleDelete}
                columns={Admincolumns({ onUpdate: (_id, user) => handleEdit(user), onDelete: handleDelete, roles: user.data.roles ?? [] })}
                filterColumn="email"
            />

            {flash.success && (
                <Alert variant="default" className="mt-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Berhasil!</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}
        </AuthenticatedAdminLayout>
    );
}