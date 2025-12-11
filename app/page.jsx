'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getStats, getMoodAnalytics } from '@/actions/dashboard/getStats';
import { getCombinedStats } from '@/actions/analytics/getCombinedStats';
import XPBar from '@/components/XPBar';
import LifeProgressRing from '@/components/LifeProgressRing';
import YearProgressRing from '@/components/YearProgressRing';
import HabitCard from '@/components/HabitCard';
import SkillCard from '@/components/SkillCard';
import HealthStatsCards from '@/components/HealthStatsCards';
import { MoodTrendChart, HabitCompletionChart } from '@/components/AnalyticsCharts';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Zap, BookOpen, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const { user, userProfile, showLevelUp } = useStore();
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
            getMoodAnalytics(user.id, 7), // Last 7 days for mini chart
            getCombinedStats(user.id, 7)
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
                <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    Welcome back, <span className="gradient-text">{userProfile.name}</span>!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Let's make today count 🎮
                </p>
            </motion.div>

            {/* XP Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8 card"
            >
                <XPBar xp={userProfile.xp} level={userProfile.level} />
            </motion.div>

            {/* Progress Rings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card flex items-center justify-center"
                >
                    <LifeProgressRing birthdate={userProfile.birthdate} birthyear={userProfile.birthyear} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <YearProgressRing />
                </motion.div>
            </div>

            {/* Health & Vitality Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
            >
                <HealthStatsCards userData={userProfile} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <Link href="/journal" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition-transform">
                    <div>
                        <div className="font-bold text-lg">Log Journal</div>
                        <div className="text-pink-100 text-sm">How was your day?</div>
                    </div>
                    <BookOpen size={24} className="text-white/80" />
                </Link>
                <Link href="/skills" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition-transform">
                    <div>
                        <div className="font-bold text-lg">Practice Skill</div>
                        <div className="text-cyan-100 text-sm">Level up +8 XP</div>
                    </div>
                    <Zap size={24} className="text-white/80" />
                </Link>
                <Link href="/habits" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition-transform">
                    <div>
                        <div className="font-bold text-lg">New Habit</div>
                        <div className="text-violet-100 text-sm">Start a streak</div>
                    </div>
                    <Plus size={24} className="text-white/80" />
                </Link>
            </motion.div>

            {/* Quick Stats & Mini Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div className="card text-center flex flex-col justify-center">
                        <div className="text-3xl mb-2">🔥</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.analytics?.activeStreaks || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Active Streaks</div>
                    </div>
                    <div className="card text-center flex flex-col justify-center">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.skills?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Skills</div>
                    </div>
                    <div className="card text-center flex flex-col justify-center">
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.achievements?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Achievements</div>
                    </div>
                    <div className="card text-center flex flex-col justify-center">
                        <div className="text-3xl mb-2">✨</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {userProfile.level}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Level</div>
                    </div>
                </motion.div>

                {/* Mini Mood Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="card"
                >
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Mood (Last 7 Days)</h3>
                    <div className="-ml-4">
                        <MoodTrendChart data={stats?.moodData || []} />
                    </div>
                </motion.div>

                {/* Mini Habit Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                >
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Habits (Last 7 Days)</h3>
                    <div className="-ml-4">
                        <HabitCompletionChart data={stats?.habitData || []} />
                    </div>
                </motion.div>
            </div>

            {/* Today's Habits */}
            {stats?.habits && stats.habits.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Sparkles className="text-purple-600" />
                        <span>Today's Habits</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stats.habits.slice(0, 4).map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onComplete={() => { }}
                                isCompletedToday={false}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Top Skills */}
            {stats?.skills && stats.skills.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <TrendingUp className="text-cyan-600" />
                        <span>Your Skills</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.skills.slice(0, 3).map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Recent Achievements */}
            {stats?.achievements && stats.achievements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Award className="text-yellow-600" />
                        <span>Recent Achievements</span>
                    </h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {stats.achievements.slice(0, 5).map((achievement) => (
                            <div
                                key={achievement.id}
                                className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl flex items-center justify-center text-4xl border-2 border-yellow-400"
                            >
                                🏆
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
