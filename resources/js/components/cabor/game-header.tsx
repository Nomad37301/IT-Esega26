import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Users, Trophy } from "lucide-react"

interface GameHeaderProps {
    title: string
    logo: string
    description: string
    color: string
}

export function GameHeader({ title, logo, description, color }: GameHeaderProps) {
    return (
        <Card className="border-none shadow-md overflow-hidden">
            <div className={`h-2 w-full bg-gradient-to-r ${color}`}></div>
            <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-lg blur-sm bg-gradient-to-r ${color} opacity-20`}></div>
                            <img
                                src={logo || "/placeholder.svg"}
                                alt={`${title} logo`}
                                className="relative w-24 p-1 rounded-lg object-cover border-2 border-white dark:border-gray-800"
                            />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{title}</h2>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                            <Users className="h-4 w-4" />
                            Team Roster
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Trophy className="h-4 w-4" />
                            Achievements
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
