"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

const data = [
    { name: "Jan", "Free Fire": 65, "Mobile Legends": 58 },
    { name: "Feb", "Free Fire": 72, "Mobile Legends": 63 },
    { name: "Mar", "Free Fire": 68, "Mobile Legends": 70 },
    { name: "Apr", "Free Fire": 75, "Mobile Legends": 65 },
    { name: "May", "Free Fire": 70, "Mobile Legends": 68 },
    { name: "Jun", "Free Fire": 78, "Mobile Legends": 72 },
]

export function TeamPerformanceChart() {
    return (
        <ChartContainer
            className="h-[300px]"
            config={{
                id: {
                    label: "Team Performance",
                    color: "hsl(245, 58%, 60%)",
                },
                type: {
                    label: "Bar Chart",
                    color: "hsl(346, 77%, 60%)",
                },
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="name"
                        className="text-xs text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        className="text-xs text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="Free Fire"
                        fill="hsl(346, 77%, 60%)"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                    />
                    <Bar
                        dataKey="Mobile Legends"
                        fill="hsl(245, 58%, 60%)"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
