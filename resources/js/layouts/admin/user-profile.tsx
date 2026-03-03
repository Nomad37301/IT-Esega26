import { Settings, Loader2 } from "lucide-react"
import { useForm } from "@inertiajs/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { UserType } from "@/types/user"

type UserProfileProps = {
    user: UserType
}

export function UserProfile({ user }: UserProfileProps) {
    const { post, processing } = useForm()

    const handleLogout = () => {
        post(route('logout.admin'))
    }

    const avatarUrl = user?.name
        ? `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`
        : "/placeholder.svg?height=32&width=32"

    const initials = user?.name
        ? user.name.split(" ").map(part => part[0]).join("").toUpperCase().slice(0, 2)
        : "JD"

    return (
        <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt="Avatar" />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium">{user?.name || "-"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "None"}</p>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
