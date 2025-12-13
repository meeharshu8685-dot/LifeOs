'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getStats, getMoodAnalytics } from '@/actions/dashboard/getStats';
import { getCombinedStats } from '@/actions/analytics/getCombinedStats';
import LifeBalanceScore from '@/components/LifeBalanceScore';
import LifeAreasBreakdown from '@/components/LifeAreasBreakdown';
import LifeCountdown from '@/components/LifeCountdown';
import { MoodTrendChart, HabitCompletionChart } from '@/components/AnalyticsCharts';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export default function InsightsPage() {
    const router = useRouter();
    const { user, userProfile } = useStore();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchStats();
    }, [user, router]);

    const fetchStats = async () => {
        if (!user) return;

        const [statsResult, moodResult, combinedResult] = await Promise.all([
            getStats(user.id),
            getMoodAnalytics(user.id, 30), // 30 days for insights
            getCombinedStats(user.id, 30)
        ]);

        if (statsResult.success) {
            setStats({
                ...statsResult.stats,
                moodData: moodResult.success ? moodResult.data.reverse().map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    mood: item.mood,
                })) : [],
                habitData: combinedResult.success ? combinedResult.habitData : []
            });
        }
        setLoading(false);
    };

    if (loading || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                    <BarChart3 className="text-indigo-500" size={32} />
                    <span>Insights & Analysis</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Deep dive into your life's data and balance.
                </p>
            </motion.div>

            {/* Life Balance Score */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <LifeBalanceScore
                    score={stats?.lifeBalance?.score || 0}
                    status={stats?.lifeBalance?.status}
                    components={stats?.lifeBalance?.components}
                />
            </motion.div>

            {/* Life Areas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <LifeAreasBreakdown areas={stats?.lifeAreas} />
            </motion.div>

            {/* Time Awareness */}
            {userProfile.birthdate && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <LifeCountdown birthdate={userProfile.birthdate} />
                </motion.div>
            )}

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Sparkles className="text-purple-500" size={20} />
                        Mood Trends (30 Days)
                    </h3>
                    <MoodTrendChart data={stats?.moodData || []} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" size={20} />
                        Habit Consistency
                    </h3>
                    <HabitCompletionChart data={stats?.habitData || []} />
                </motion.div>
            </div>
        </div>
    );
}
