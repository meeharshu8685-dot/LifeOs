'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { addSkillXP, createSkill } from '@/actions/skills/addXP';
import { getSkillHistory } from '@/actions/skills/getSkillHistory';
import SkillCard from '@/components/SkillCard';
import SkillHistoryChart from '@/components/SkillHistoryChart';
import { motion } from 'framer-motion';
import { Plus, Target, Zap, Clock } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export default function SkillsPage() {
    const router = useRouter();
    const { user, userProfile, showLevelUp, updateXP } = useStore();
    const [skills, setSkills] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSkillName, setNewSkillName] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchSkills();
    }, [user, router]);

    const fetchSkills = async () => {
        if (!user) return;

        const [skillsData, historyResult] = await Promise.all([
            supabase
                .from('skills')
                .select('*')
                .eq('user_id', user.id)
                .order('level', { ascending: false }),
            getSkillHistory(user.id)
        ]);

        setSkills(skillsData.data || []);
        if (historyResult.success) {
            setHistory(historyResult.data);
        }
        setLoading(false);
    };

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        if (!newSkillName.trim()) return;

        const result = await createSkill(user.id, newSkillName);

        if (result.success) {
            setNewSkillName('');
            setShowForm(false);
            fetchSkills();
        }
    };

    const handleAddXP = async (skillId) => {
        const result = await addSkillXP(skillId, user.id);

        if (result.success) {
            if (result.leveledUp) {
                showLevelUp({ level: result.newLevel, xp: result.newXP });
            }
            updateXP(result.newXP, result.newLevel);
            fetchSkills();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                    <Target className="inline mr-2 text-indigo-600" />
                    Skills
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Master skills, gain XP, become unstoppable!
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                className="mb-6 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
            >
                <Plus size={20} />
                <span>Add New Skill</span>
            </motion.button>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateSkill}
                    className="mb-6 card overflow-hidden"
                >
                    <div className="p-1">
                        <input
                            type="text"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="e.g., Python, Guitar, Public Speaking"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white mb-4 shadow-sm"
                        />
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skills.length === 0 ? (
                            <div className="col-span-full text-center py-12 card border-dashed border-2 border-slate-200 dark:border-slate-700 shadow-none bg-transparent">
                                <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                                    No skills tracked yet. Start your learning journey!
                                </p>
                            </div>
                        ) : (
                            skills.map((skill) => (
                                <div key={skill.id} className="relative">
                                    <SkillCard skill={skill} />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAddXP(skill.id)}
                                        className="mt-2 w-full bg-slate-50 hover:bg-white border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center hover:shadow-md transition-all dark:bg-slate-800"
                                    >
                                        <Zap size={16} className="mr-1 fill-current" />
                                        Practice (+8 XP)
                                    </motion.button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card"
                    >
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                            <Target size={20} className="mr-2 text-indigo-600" />
                            Weekly Progress
                        </h2>
                        <SkillHistoryChart data={history} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                            <Clock size={20} className="mr-2 text-slate-400" />
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">No recent practice.</p>
                            ) : (
                                history.slice(0, 5).map((log) => (
                                    <div key={log.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {log.skills?.name || 'Unknown Skill'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {formatDate(log.created_at, 'MMM dd, HH:mm')}
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
                                            +{log.xp_gained} XP
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
