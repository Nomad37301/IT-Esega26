import { useState, useEffect } from "react"
import type { FFPlayer } from "@/types/register"

export function useProgressFF(
    players: FFPlayer[],
    minPlayers: number
): number {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const value = Math.min((players.length / minPlayers) * 100, 100)
        setProgress(value)
    }, [players.length, minPlayers])

    return progress
}