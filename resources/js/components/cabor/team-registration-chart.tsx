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
    { month: "Jan", "PUBG Mobile": 2, "Mobile Legends": 1 },
    { month: "Feb", "PUBG Mobile": 3, "Mobile Legends": 2 },
    { month: "Mar", "PUBG Mobile": 5, "Mobile Legends": 3 },
    { month: "Apr", "PUBG Mobile": 4, "Mobile Legends": 4 },
    { month: "May", "PUBG Mobile": 6, "Mobile Legends": 5 },
    { month: "Jun", "PUBG Mobile": 8, "Mobile Legends": 6 },
    { month: "Jul", "PUBG Mobile": 7, "Mobile Legends": 7 },
    { month: "Aug", "PUBG Mobile": 9, "Mobile Legends": 8 },
    { month: "Sep", "PUBG Mobile": 11, "Mobile Legends": 9 },
    { month: "Oct", "PUBG Mobile": 10, "Mobile Legends": 10 },
    { month: "Nov", "PUBG Mobile": 12, "Mobile Legends": 11 },
    { month: "Dec", "PUBG Mobile": 14, "Mobile Legends": 12 },
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
                        dataKey="PUBG Mobile"
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
