import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Star } from "lucide-react"

interface PlayerCardProps {
    id: number
    name: string
    nickname: string
    role: string
    avatar: string
    status: "active" | "inactive" | "reserve"
    isIGL?: boolean
    gameType: "free-fire" | "mobile-legends"
}

export function PlayerCard({ id, name, nickname, role, avatar, status, isIGL = false, gameType }: PlayerCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500"
            case "inactive":
                return "bg-red-500"
            case "reserve":
                return "bg-yellow-500"
            default:
                return "bg-gray-500"
        }
    }

    const getBadgeColor = () => {
        return gameType === "free-fire"
            ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-400"
            : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
    }

    return (
        <Card className="overflow-hidden border-none shadow-md">
            <div className={`h-1 w-full ${getStatusColor(status)}`} />
            <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                            <AvatarFallback>{nickname.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">{nickname}</h3>
                                {isIGL && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Star className="h-3 w-3" /> IGL
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{name}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p className="text-xs text-muted-foreground">Role</p>
                        <Badge variant="outline" className={getBadgeColor()}>
                            {role}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}></div>
                            <p className="font-medium capitalize">{status}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full">
                    View Profile
                </Button>
            </CardFooter>
        </Card>
    )
}
