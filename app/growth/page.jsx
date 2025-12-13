'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getStats } from '@/actions/dashboard/getStats';
import SkillCard from '@/components/SkillCard';
import { motion } from 'framer-motion';
import { Target, Zap, Sword, Crown } from 'lucide-react';
import Link from 'next/link';

export default function GrowthPage() {
    const router = useRouter();
    const { user, userProfile } = useStore();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'goals', 'quests'

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchStats();
    }, [user, router]);

    const fetchStats = async () => {
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

    const tabs = [
        { id: 'skills', label: 'Skills', icon: Zap },
        { id: 'quests', label: 'Quests', icon: Sword },
        { id: 'goals', label: 'Long-term Goals', icon: Target },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                    <Crown className="text-amber-500" size={32} />
                    <span>Growth & Expansion</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Level up your character, complete quests, and achieve mastery.
                </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'skills' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Skills</h2>
                            <Link href="/skills" className="text-sm font-bold text-indigo-500 hover:underline">
                                View Full Tree
                            </Link>
                        </div>

                        {stats?.skills && stats.skills.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {stats.skills.map((skill) => (
                                    <SkillCard key={skill.id} skill={skill} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <Zap className="mx-auto text-slate-400 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No skills unlocking yet</h3>
                                <p className="text-slate-500 mb-4">Start practicing to unlock your first skill!</p>
                                <button className="btn-primary">Discover Skills</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'quests' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Sword className="mx-auto text-slate-400 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Quest Board Empty</h3>
                            <p className="text-slate-500 mb-4">Daily quests will appear here soon.</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'goals' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Target className="mx-auto text-slate-400 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Long-term Goals</h3>
                            <p className="text-slate-500 mb-4">Set your sights on the future.</p>
                            <button className="btn-primary">Create Goal</button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
