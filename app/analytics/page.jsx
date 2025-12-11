'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getMoodAnalytics } from '@/actions/dashboard/getStats';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsPage() {
    const router = useRouter();
    const { user } = useStore();
    const [moodData, setMoodData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchAnalytics();
    }, [user, router]);

    const fetchAnalytics = async () => {
        if (!user) return;

        const result = await getMoodAnalytics(user.id, 30);
        if (result.success) {
            const formattedData = result.data.reverse().map(item => ({
                date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                mood: item.mood,
            }));
            setMoodData(formattedData);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    const averageMood = moodData.length > 0
        ? (moodData.reduce((sum, item) => sum + item.mood, 0) / moodData.length).toFixed(1)
        : 0;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <BarChart3 className="inline mr-2 text-blue-600" />
                    Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Track your progress over time
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <div className="card text-center">
                    <TrendingUp className="mx-auto mb-2 text-green-600" size={32} />
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {averageMood}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Average Mood (30 days)
                    </div>
                </div>

                <div className="card text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {moodData.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Days Tracked
                    </div>
                </div>

                <div className="card text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {moodData.filter(d => d.mood >= 7).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Great Days
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card mb-8"
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Mood Trend (Last 30 Days)
                </h2>

                {moodData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={moodData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                domain={[0, 10]}
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="mood"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                        No mood data yet. Start journaling to see analytics!
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Mood Distribution
                </h2>

                {moodData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={moodData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                style={{ fontSize: '11px' }}
                            />
                            <YAxis
                                domain={[0, 10]}
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar
                                dataKey="mood"
                                fill="#ec4899"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                        No data to display
                    </div>
                )}
            </motion.div>
        </div>
    );
}
