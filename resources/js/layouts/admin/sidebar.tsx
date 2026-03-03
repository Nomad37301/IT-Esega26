'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { UserType } from '@/types/user';
import { CalendarClock, Home, Layers, Settings, Users } from 'lucide-react';

import { Link } from '@inertiajs/react';
import { UserProfile } from './user-profile';

type SidebarNavProps = {
    activeItem: string;
    setActiveItem: (item: string) => void;
    user: UserType;
};

const hasRole = (user: UserType, roleName: string): boolean => {
    return user.roles.some((role) => role.name === roleName);
};

export default function SidebarNav({ activeItem, setActiveItem, user }: SidebarNavProps) {
    const rawMenuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            link: route('admin.dashboard'),
        },
        {
            id: 'admins',
            label: 'Admin Management',
            icon: Users,
            link: route('admins.index'),
            roles: ['super_admin'],
        },
        {
            id: 'timeline',
            label: 'Timeline Management',
            icon: CalendarClock,
            link: route('timeline.index'),
        },
        {
            id: 'players',
            label: 'Team & Player Management',
            icon: Layers,
            link: route('players.index'),
        },
    ];

    const menuItems = rawMenuItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.some((role) => hasRole(user, role));
    });

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4">
                    <img src="/Images/LogoEsega25.png" alt="Logo Essega" className="w-20" />
                    <span className="text-lg font-semibold">IT Esega</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <Link href={item.link}>
                                        <SidebarMenuButton isActive={activeItem === item.id} onClick={() => setActiveItem(item.id)}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={activeItem === 'settings'} onClick={() => setActiveItem('settings')}>
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <UserProfile user={user || {}} />
            </SidebarFooter>
        </Sidebar>
    );
}
