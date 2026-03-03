import { FFPlayer } from "@/types/register"
import * as react from "react"

export function useFFPlayers(
    data: { ff_players: FFPlayer[] },
    setData: (key: "ff_players", value: FFPlayer[]) => void,
    teamId?: number | null
) {
    const resolvedTeamId = teamId ?? 0

    const updatePlayer = react.useCallback(
        (index: number, field: keyof FFPlayer, value: string) => {
            const updated = [...data.ff_players]
            updated[index] = { ...updated[index], [field]: value }
            setData("ff_players", updated)
        },
        [data.ff_players, setData]
    )

    const addPlayer = react.useCallback(() => {
        const newPlayer: FFPlayer = {
            name: "",
            nickname: "",
            id: "",
            foto: null,
            id_server: "",
            no_hp: "",
            email: "",
            alamat: "",
            tanda_tangan: null,
            ff_team_id: resolvedTeamId,
            role: "anggota",
        }
        setData("ff_players", [...data.ff_players, newPlayer])
    }, [data.ff_players, setData, resolvedTeamId])

    const deletePlayer = react.useCallback(
        (index: number) => {
            const updated = data.ff_players.filter((_, i) => i !== index)
            setData("ff_players", updated)
            localStorage.setItem("ff_players_data", JSON.stringify(updated))
        },
        [data.ff_players, setData]
    )

    return { updatePlayer, addPlayer, deletePlayer }
}