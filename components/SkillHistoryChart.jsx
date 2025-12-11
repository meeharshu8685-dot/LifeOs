'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SkillHistoryChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No recent activity
            </div>
        );
    }

    // Process data to group by date
    const chartDataMap = {};
    const today = new Date();

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        chartDataMap[dateStr] = 0;
    }

    data.forEach(log => {
        const dateStr = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (chartDataMap[dateStr] !== undefined) {
            chartDataMap[dateStr] += log.xp_gained;
        }
    });

    const chartData = Object.keys(chartDataMap).map(key => ({
        date: key,
        xp: chartDataMap[key]
    }));

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f3f4f6' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Bar
                        dataKey="xp"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        name="XP Gained"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
