'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getStats } from '@/actions/dashboard/getStats';
import { getGoals, updateGoalProgress } from '@/actions/growth/goals';
import { getDailyQuests, completeQuest } from '@/actions/growth/quests';
import SkillCard from '@/components/SkillCard';
import NewGoalModal from '@/components/NewGoalModal';
import NewQuestModal from '@/components/NewQuestModal';
import { motion } from 'framer-motion';
import { Target, Zap, Sword, Crown, Plus, CheckCircle, Circle } from 'lucide-react';
import Link from 'next/link';

export default function GrowthPage() {
    const router = useRouter();
    const { user, userProfile } = useStore();
    const [stats, setStats] = useState(null);
    const [goals, setGoals] = useState([]);
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'goals', 'quests'

    // Modals
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);

    // Edit state
    const [editingGoal, setEditingGoal] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchAllData();
    }, [user, router]);

    const fetchAllData = async () => {
        const [statsRes, goalsRes, questsRes] = await Promise.all([
            getStats(user.id), // existing one still takes ID? need to check
            getGoals(),
            getDailyQuests()
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (goalsRes.success) setGoals(goalsRes.goals);
        if (questsRes.success) setQuests(questsRes.quests);

        setLoading(false);
    };

    const openNewGoalModal = () => {
        setEditingGoal(null);
        setIsGoalModalOpen(true);
    };

    const openEditGoalModal = (goal) => {
        setEditingGoal(goal);
        setIsGoalModalOpen(true);
    };

    const handleQuestComplete = async (questId) => {
        const res = await completeQuest(questId);
        if (res.success) {
            // Optimistic update or refetch
            fetchAllData();
            // Could add confetti effect here later
        }
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Quests</h2>
                            <button
                                onClick={() => setIsQuestModalOpen(true)}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-amber-200 dark:shadow-none"
                            >
                                <Plus size={18} /> New Quest
                            </button>
                        </div>

                        {quests.length > 0 ? (
                            <div className="space-y-4">
                                {quests.map((quest) => (
                                    <div key={quest.id} className={`p-4 rounded-xl border transition-all flex items-center justify-between ${quest.is_completed
                                        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                                        : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                                        }`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${quest.is_completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <Sword size={24} />
                                            </div>
                                            <div>
                                                <div className={`font-bold text-lg ${quest.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {quest.title}
                                                </div>
                                                <div className="text-xs text-slate-500 font-bold uppercase flex gap-2">
                                                    <span className="text-amber-600">+{quest.xp_reward} XP</span>
                                                    <span>•</span>
                                                    <span>{quest.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {!quest.is_completed ? (
                                            <button
                                                onClick={() => handleQuestComplete(quest.id)}
                                                className="group flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-500 transition-all font-bold text-slate-400"
                                            >
                                                <Circle size={20} className="group-hover:hidden" />
                                                <CheckCircle size={20} className="hidden group-hover:block" />
                                                Complete
                                            </button>
                                        ) : (
                                            <div className="text-emerald-500 font-bold flex items-center gap-2">
                                                <CheckCircle size={20} />
                                                Done
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <Sword className="mx-auto text-slate-400 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Quest Board Empty</h3>
                                <p className="text-slate-500 mb-4">Add a quest to challenge yourself today.</p>
                                <button onClick={() => setIsQuestModalOpen(true)} className="btn-primary">Create Quest</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'goals' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Long-term Goals</h2>
                            <button
                                onClick={openNewGoalModal}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                            >
                                <Plus size={18} /> New Goal
                            </button>
                        </div>

                        {goals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {goals.map((goal) => (
                                    <div key={goal.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                                        <button
                                            onClick={() => openEditGoalModal(goal)}
                                            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Edit Goal"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                        <div className="flex justify-between items-start mb-2 pr-8">
                                            <div className="font-bold text-lg text-slate-900 dark:text-white">{goal.title}</div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${goal.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {goal.priority}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{goal.description}</p>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${goal.progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 font-bold">
                                            <span>{goal.category}</span>
                                            <span>{goal.progress}% Completed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <Target className="mx-auto text-slate-400 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Long-term Goals</h3>
                                <p className="text-slate-500 mb-4">Set your sights on the future.</p>
                                <button onClick={openNewGoalModal} className="btn-primary">Create Goal</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <NewGoalModal
                isOpen={isGoalModalOpen}
                onClose={() => {
                    setIsGoalModalOpen(false);
                    setEditingGoal(null);
                }}
                userId={user.id}
                onSuccess={fetchAllData}
                initialData={editingGoal}
            />

            <NewQuestModal
                isOpen={isQuestModalOpen}
                onClose={() => setIsQuestModalOpen(false)}
                userId={user.id}
                onSuccess={fetchAllData}
            />
        </div>
    );
}
