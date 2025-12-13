'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { createClient } from '@/utils/supabase/client';
import { addSkillXP, createSkill } from '@/actions/skills/addXP';
import { getSkillHistory } from '@/actions/skills/getSkillHistory';
import SkillCard from '@/components/SkillCard';
import SkillHistoryChart from '@/components/SkillHistoryChart';
import { motion } from 'framer-motion';
import { Plus, Target, Zap, Clock } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export default function SkillsPage() {
    const supabase = createClient();
    const router = useRouter();
    const { user, userProfile, showLevelUp, updateXP } = useStore();
    const [skills, setSkills] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [skillName, setSkillName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

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

    const startEdit = (skill) => {
        setEditingSkill(skill);
        setSkillName(skill.skill_name);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingSkill(null);
        setSkillName('');
        setShowForm(false);
    };

    const handleCreateOrUpdateSkill = async (e) => {
        e.preventDefault();
        if (!skillName.trim() || creating) return;

        setCreating(true);

        if (editingSkill) {
            // Optimistic Update for Edit
            const updatedSkills = skills.map(s =>
                s.id === editingSkill.id ? { ...s, skill_name: skillName } : s
            );
            setSkills(updatedSkills);
            setShowForm(false); // Close immediately for speed

            // Server Action
            // We need to dynamically import or use the action we created
            const { updateSkill } = require('@/actions/skills/updateSkill');
            const result = await updateSkill(editingSkill.id, { skill_name: skillName });

            if (!result.success) {
                // Revert on failure
                fetchSkills();
                alert('Failed to update skill');
            } else {
                setEditingSkill(null);
                setSkillName('');
            }
        } else {
            // Creation flow
            // Hard to optimistic update creation without ID, so we wait but show loading
            const result = await createSkill(skillName);
            if (result.success) {
                setSkillName('');
                setShowForm(false);
                // fetchSkills will add it to the list
                fetchSkills();
            }
        }
        setCreating(false);
    };

    const handleAddXP = async (skillId) => {
        // Find skill to update optimistically
        const skillIndex = skills.findIndex(s => s.id === skillId);
        if (skillIndex === -1) return;

        const skill = skills[skillIndex];
        // Calculate expected new values locally to show INSTANT feedback
        // We know standard reward is 8 XP usually (from implicit knowledge or we could duplicate constant)
        const XP_AMOUNT = 8;
        const newSkillXP = skill.xp + XP_AMOUNT;
        // Simple approximation or we need `calculateSkillLevel` helper available on client
        // For now, let's just update XP visually and let background refresh handle level up nuances

        const optimisticSkills = [...skills];
        optimisticSkills[skillIndex] = { ...skill, xp: newSkillXP };
        setSkills(optimisticSkills);

        const result = await addSkillXP(skillId);

        if (result.success) {
            if (result.leveledUp) {
                showLevelUp({ level: result.newLevel, xp: result.newXP });
            }
            // Sync final state
            updateXP(result.newXP, result.newLevel);
            // We can skip full refetch if we trust the return data, 
            // but let's do a silent refetch to ensure consistency
            fetchSkills();
        } else {
            // Revert on error
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
                onClick={() => {
                    if (showForm && !editingSkill) setShowForm(false);
                    else {
                        setEditingSkill(null);
                        setSkillName('');
                        setShowForm(true);
                    }
                }}
                className="mb-6 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
            >
                <Plus size={20} />
                <span>Add New Skill</span>
            </motion.button>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateOrUpdateSkill}
                    className="mb-6 card overflow-hidden"
                >
                    <div className="p-1">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">
                                {editingSkill ? 'Edit Skill' : 'New Skill'}
                            </h3>
                        </div>
                        <input
                            type="text"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            placeholder="e.g., Python, Guitar, Public Speaking"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white mb-4 shadow-sm"
                            disabled={creating}
                            autoFocus
                        />
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={creating}
                                className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                {creating ? 'Saving...' : (editingSkill ? 'Update' : 'Create')}
                            </button>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={creating}
                                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
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
                                <div key={skill.id} className="relative group">
                                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEdit(skill)}
                                            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors shadow-sm"
                                            title="Edit Skill"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                    </div>
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
                                                {log.skills?.name || log.skill_name || 'Skill'}
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
