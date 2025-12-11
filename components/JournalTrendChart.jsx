'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function JournalTrendChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No enough data for trend
            </div>
        );
    }

    // Format data for chart (reverse strictly to show oldest to newest left to right)
    const chartData = [...data].reverse().map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.mood
    }));

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[1, 10]}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={20}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ stroke: '#ec4899', strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#ec4899"
                        strokeWidth={3}
                        dot={{ fill: '#ec4899', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
