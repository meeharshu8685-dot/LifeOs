'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import AchievementCard from '@/components/AchievementCard';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/xpEngine';

export default function AchievementsPage() {
    const router = useRouter();
    const { user } = useStore();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchAchievements();
    }, [user, router]);

    const fetchAchievements = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', user.id);

        setAchievements(data || []);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    const unlockedIds = achievements.map(a => a.type);
    const allAchievementIds = Object.values(ACHIEVEMENTS).map(a => a.id);
    const unlockedCount = achievements.length;
    const totalCount = allAchievementIds.length;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <Trophy className="inline mr-2 text-yellow-600" />
                    Achievements
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {unlockedCount} of {totalCount} unlocked
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {Math.round((unlockedCount / totalCount) * 100)}%
                    </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allAchievementIds.map((achievementId, index) => {
                    const achievement = achievements.find(a => a.type === achievementId);
                    const isUnlocked = !!achievement;

                    return (
                        <motion.div
                            key={achievementId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <AchievementCard
                                achievementId={achievementId}
                                isUnlocked={isUnlocked}
                                unlockedAt={achievement?.unlocked_at}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
