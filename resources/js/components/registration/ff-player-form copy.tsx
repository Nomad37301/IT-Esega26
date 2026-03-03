"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { FFPlayer, PlayerFormProps } from "@/types/register"

export function FFPlayerForm({ player, index, onChange }: PlayerFormProps) {
    const ffPlayer = player as FFPlayer

    return (
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Player {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor={`ff-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </Label>
                    <Input
                        id={`ff-name-${index}`}
                        value={ffPlayer.name}
                        onChange={(e) => onChange(index, "name", e.target.value)}
                        required
                        placeholder="Player's full name"
                        className="bg-white text-slate-900 border-gray-200 rounded-lg"
                    />
                </div>

                <div>
                    <Label htmlFor={`ff-id-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Free Fire ID
                    </Label>
                    <Input
                        id={`ff-id-${index}`}
                        value={ffPlayer.id}
                        onChange={(e) => onChange(index, "id", e.target.value)}
                        required
                        placeholder="Free Fire ID"
                        className="bg-white text-slate-900 border-gray-200 rounded-lg"
                    />
                </div>

                <div>
                    <Label htmlFor={`ff-nickname-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        In-Game Nickname
                    </Label>
                    <Input
                        id={`ff-nickname-${index}`}
                        value={ffPlayer.nickname}
                        onChange={(e) => onChange(index, "nickname", e.target.value)}
                        required
                        placeholder="In-game nickname"
                        className="bg-white text-slate-900 border-gray-200 rounded-lg"
                    />
                </div>

                <div>
                    <Label htmlFor={`ff-phone-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </Label>
                    <Input
                        id={`ff-phone-${index}`}
                        value={ffPlayer.phone}
                        onChange={(e) => onChange(index, "phone", e.target.value)}
                        required
                        placeholder="Phone number"
                        className="bg-white text-slate-900 border-gray-200 rounded-lg"
                    />
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor={`ff-email-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </Label>
                    <Input
                        id={`ff-email-${index}`}
                        type="email"
                        value={ffPlayer.email}
                        onChange={(e) => onChange(index, "email", e.target.value)}
                        required
                        placeholder="Email address"
                        className="bg-white text-slate-900 border-gray-200 rounded-lg"
                    />
                </div>
            </div>
        </div>
    )
}
