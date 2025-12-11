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
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <Target className="inline mr-2 text-cyan-600" />
                    Skills
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Master skills, gain XP, become unstoppable!
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                className="mb-6 w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
            >
                <Plus size={20} />
                <span>Add New Skill</span>
            </motion.button>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateSkill}
                    className="mb-6 card"
                >
                    <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g., Python, Guitar, Public Speaking"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-3"
                    />
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skills.length === 0 ? (
                            <div className="col-span-full text-center py-12 card">
                                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
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
                                        className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center"
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
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Target size={20} className="mr-2 text-cyan-600" />
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
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Clock size={20} className="mr-2 text-gray-500" />
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No recent practice.</p>
                            ) : (
                                history.slice(0, 5).map((log) => (
                                    <div key={log.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {log.skills?.name || 'Unknown Skill'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(log.created_at, 'MMM dd, HH:mm')}
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded-full">
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
