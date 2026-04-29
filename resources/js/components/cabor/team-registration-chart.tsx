"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

const data = [
    { month: "Jan", "PUBG": 2, "Mobile Legends": 1 },
    { month: "Feb", "PUBG": 3, "Mobile Legends": 2 },
    { month: "Mar", "PUBG": 5, "Mobile Legends": 3 },
    { month: "Apr", "PUBG": 4, "Mobile Legends": 4 },
    { month: "May", "PUBG": 6, "Mobile Legends": 5 },
    { month: "Jun", "PUBG": 8, "Mobile Legends": 6 },
    { month: "Jul", "PUBG": 7, "Mobile Legends": 7 },
    { month: "Aug", "PUBG": 9, "Mobile Legends": 8 },
    { month: "Sep", "PUBG": 11, "Mobile Legends": 9 },
    { month: "Oct", "PUBG": 10, "Mobile Legends": 10 },
    { month: "Nov", "PUBG": 12, "Mobile Legends": 11 },
    { month: "Dec", "PUBG": 14, "Mobile Legends": 12 },
]

export function TeamRegistrationChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="PUBG"
                        stroke="#ef4444"
                        fill="#fee2e2"
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="Mobile Legends"
                        stroke="#6366f1"
                        fill="#e0e7ff"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
