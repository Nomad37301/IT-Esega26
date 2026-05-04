import { useState, useEffect } from "react"
import type { PUBGPlayer } from "@/types/register"

export function useProgressPUBG(
    players: PUBGPlayer[],
    minPlayers: number
): number {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const value = Math.min((players.length / minPlayers) * 100, 100)
        setProgress(value)
    }, [players.length, minPlayers])

    return progress
}