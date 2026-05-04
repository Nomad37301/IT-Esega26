import { PUBGPlayer } from "@/types/register"
import * as react from "react"

export function usePUBGPlayers(
    data: { pubg_players: PUBGPlayer[] },
    setData: (key: "pubg_players", value: PUBGPlayer[]) => void,
    teamId?: number | null
) {
    const resolvedTeamId = teamId ?? 0

    const updatePlayer = react.useCallback(
        (index: number, field: keyof PUBGPlayer, value: string) => {
            const updated = [...data.pubg_players]
            updated[index] = { ...updated[index], [field]: value }
            setData("pubg_players", updated)
        },
        [data.pubg_players, setData]
    )

    const addPlayer = react.useCallback(() => {
        const newPlayer: PUBGPlayer = {
            name: "",
            nickname: "",
            id: "",
            foto: null,
            id_server: "",
            no_hp: "",
            email: "",
            alamat: "",
            tanda_tangan: null,
            pubg_team_id: resolvedTeamId,
            role: "anggota",
        }
        setData("pubg_players", [...data.pubg_players, newPlayer])
    }, [data.pubg_players, setData, resolvedTeamId])

    const deletePlayer = react.useCallback(
        (index: number) => {
            const updated = data.pubg_players.filter((_, i) => i !== index)
            setData("pubg_players", updated)
            localStorage.setItem("pubg_players_data", JSON.stringify(updated))
        },
        [data.pubg_players, setData]
    )

    return { updatePlayer, addPlayer, deletePlayer }
}