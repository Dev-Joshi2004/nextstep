"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PieChartData {
    name: string
    value: number
    color: string
}

interface CustomPieChartProps {
    data: PieChartData[]
    width?: number
    height?: number
}

export function CustomPieChart({ data, width = 400, height = 300 }: CustomPieChartProps) {
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-blue-400">
                        Score: {payload[0].value} ({Math.round((payload[0].value / 20) * 100)}%)
                    </p>
                </div>
            )
        }
        return null
    }

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-300 text-sm">{entry.value}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    )
}
