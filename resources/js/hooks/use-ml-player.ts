import { MLPlayer } from "@/types/register"
import * as react from "react"

export function useMLPlayers(
    data: { ml_players: MLPlayer[] },
    setData: (key: "ml_players", value: MLPlayer[]) => void,
    teamId?: number | null
) {
    const resolvedTeamId = teamId ?? 0

    const updatePlayer = react.useCallback(
        (index: number, field: keyof MLPlayer, value: string) => {
            const updated = [...data.ml_players]
            updated[index] = { ...updated[index], [field]: value }
            setData("ml_players", updated)
        },
        [data.ml_players, setData]
    )

    const addPlayer = react.useCallback(() => {
        const newPlayer: MLPlayer = {
            name: "",
            nickname: "",
            id: "",
            foto: null,
            id_server: "",
            no_hp: "",
            email: "",
            alamat: "",
            tanda_tangan: null,
            ml_team_id: resolvedTeamId,
            role: "anggota",
        }
        setData("ml_players", [...data.ml_players, newPlayer])
    }, [data.ml_players, setData, resolvedTeamId])

    const deletePlayer = react.useCallback(
        (index: number) => {
            const updated = data.ml_players.filter((_, i) => i !== index)
            setData("ml_players", updated)
            localStorage.setItem("ml_players_data", JSON.stringify(updated))
        },
        [data.ml_players, setData]
    )

    return { updatePlayer, addPlayer, deletePlayer }
}