'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { UserType } from '@/types/user';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

type DashboardHeaderProps = {
    user: UserType;
    headerTitle: string;
};

export default function DashboardHeader({ user, headerTitle }: DashboardHeaderProps) {
    const { theme, setTheme } = useTheme();

    const avatarUrl = user?.name
        ? `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`
        : '/placeholder.svg?height=32&width=32';

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'JD';

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-[#252525] px-4 lg:h-16 lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
                <h1 className="text-lg font-semibold text-white">{headerTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" className="" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Avatar className="h-12 w-12">
                    <AvatarImage src={avatarUrl} alt={user?.name || 'Avatar'} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
