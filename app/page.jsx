'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getStats } from '@/actions/dashboard/getStats';
import XPBar from '@/components/XPBar';
import HabitCard from '@/components/HabitCard';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Flame, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
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
        // We only need basic stats for the dashboard now
        const result = await getStats(user.id);
        if (result.success) {
            setStats(result.stats);
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

    // Get today's stats specifically
    const activeStreaks = stats?.analytics?.activeStreaks || 0;
    const moodToday = stats?.journal?.[0]?.date === new Date().toISOString().split('T')[0] ? stats?.journal[0]?.mood : null;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                    How are you doing, <span className="gradient-text">{userProfile.name}</span>?
                </h1>
                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    Focus on today. <Gamepad2 size={20} className="text-violet-500" />
                </p>
            </motion.div>

            {/* Top Section: XP & Vitality */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* XP Bar (Prominent) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-2 card flex flex-col justify-center"
                >
                    <XPBar xp={userProfile.xp} level={userProfile.level} />
                </motion.div>

                {/* Life Ring (Today/Week context) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card flex items-center justify-center py-4"
                >
                    <div className="scale-90">
                        {/* LifeProgressRing removed */}
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h3>
                            <p className="text-slate-600 dark:text-slate-400">Ready to conquer the day?</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Middle Section: Today's Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Sparkles className="text-purple-600" />
                    <span>Today's Habits</span>
                </h2>

                {stats?.habits && stats.habits.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {stats.habits.slice(0, 5).map((habit, index) => (
                            <motion.div
                                key={habit.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                            >
                                <HabitCard
                                    habit={habit}
                                    onComplete={() => { }} // Would trigger re-fetch in real app
                                    isCompletedToday={false} // Needs real check logic
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-8">
                        <p className="text-slate-500 mb-4">No habits set for today.</p>
                        <Link href="/habits" className="btn-primary inline-flex">Add Habits</Link>
                    </div>
                )}
            </div>

            {/* Bottom: Quick Stats / Continue */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-center"
                >
                    <Flame className="mx-auto text-orange-500 mb-1" size={24} />
                    <div className="font-black text-2xl text-slate-800 dark:text-slate-200">{activeStreaks}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Streak</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center"
                >
                    <Zap className="mx-auto text-blue-500 mb-1" size={24} />
                    <div className="font-black text-2xl text-slate-800 dark:text-slate-200">{stats?.skills?.length || 0}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Skills</div>
                </motion.div>

                <Link href="/journal" className="block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 text-center hover:bg-pink-100 transition-colors cursor-pointer h-full flex flex-col justify-center"
                    >
                        {moodToday ? (
                            <>
                                <div className="font-black text-2xl text-pink-500">{moodToday}/10</div>
                                <div className="text-xs font-bold text-slate-500 uppercase">Mood Logged</div>
                            </>
                        ) : (
                            <>
                                <BookOpen className="mx-auto text-pink-500 mb-1" size={24} />
                                <div className="text-xs font-bold text-pink-600 uppercase">Log Mood</div>
                            </>
                        )}
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
