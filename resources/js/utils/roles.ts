import { usePage } from "@inertiajs/react";
import { authProps } from "@/types/auth";

export function UseRoles() {
    const { auth } = usePage<authProps>().props;

    const hasRole = (name: string) =>
        auth?.user?.roles?.includes(name) ?? false;

    const hasAnyRole = (roles: string[]) => roles.some(role => auth?.user?.roles?.includes(role)) ?? false;

    return { hasRole, hasAnyRole };
}