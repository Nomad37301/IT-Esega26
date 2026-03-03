import { useState, useEffect } from "react"
import type { MLPlayer } from "@/types/register"

export function useProgress(
    players: MLPlayer[],
    minPlayers: number
): number {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const value = Math.min((players.length / minPlayers) * 100, 100)
        setProgress(value)
    }, [players.length, minPlayers])

    return progress
}