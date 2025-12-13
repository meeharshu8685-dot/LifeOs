'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { createClient } from '@/utils/supabase/client';
import { completeHabit } from '@/actions/habits/completeHabit';
import HabitCard from '@/components/HabitCard';
import { motion } from 'framer-motion';
import { Plus, CheckCircle } from 'lucide-react';
import { isCompletedToday } from '@/lib/streakUtils';
import { ACHIEVEMENTS } from '@/lib/xpEngine';

export default function HabitsPage() {
    const supabase = createClient();
    const router = useRouter();
    const { user, userProfile, showLevelUp, updateXP } = useStore();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newHabitName, setNewHabitName] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchHabits();
    }, [user, router]);

    const fetchHabits = async () => {
        if (!user) return;

        const { data } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id)
            .order('streak', { ascending: false });

        setHabits(data || []);
        setLoading(false);
    };

    const handleCreateHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        const { data } = await supabase
            .from('habits')
            .insert({
                user_id: user.id,
                name: newHabitName,
                streak: 0,
            })
            .select()
            .single();

        // Check for first habit achievement
        const { data: achievements } = await supabase
            .from('achievements')
            .select('type')
            .eq('user_id', user.id);

        const hasFirstHabit = achievements?.some(a => a.type === ACHIEVEMENTS.FIRST_HABIT.id);

        if (!hasFirstHabit && data) {
            await supabase.from('achievements').insert({
                user_id: user.id,
                type: ACHIEVEMENTS.FIRST_HABIT.id,
            });

            const newXP = userProfile.xp + ACHIEVEMENTS.FIRST_HABIT.xpReward;
            await supabase.from('users').update({ xp: newXP }).eq('id', user.id);
            updateXP(newXP, userProfile.level);
        }

        setNewHabitName('');
        setShowForm(false);
        fetchHabits();
    };

    const handleCompleteHabit = async (habitId) => {
        const result = await completeHabit(habitId);

        if (result.success) {
            if (result.leveledUp) {
                showLevelUp({ level: result.newLevel, xp: result.newXP });
            }
            updateXP(result.newXP, result.newLevel);
            fetchHabits();
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
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                    <CheckCircle className="inline mr-2 text-violet-600" />
                    Habits
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Build streaks, earn XP, level up!
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                className="mb-6 w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-violet-200 dark:shadow-none transition-all"
            >
                <Plus size={20} />
                <span>Add New Habit</span>
            </motion.button>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateHabit}
                    className="mb-6 card overflow-hidden"
                >
                    <div className="p-1">
                        <input
                            type="text"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            placeholder="e.g., Morning Exercise, Read for 30 min"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-800 dark:text-white mb-4 shadow-sm"
                        />
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="flex-1 bg-violet-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-violet-700 transition-colors shadow-md"
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

            <div className="space-y-4">
                {habits.length === 0 ? (
                    <div className="text-center py-12 card border-dashed border-2 border-slate-200 dark:border-slate-700 shadow-none bg-transparent">
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                            No habits yet. Start building good habits today!
                        </p>
                    </div>
                ) : (
                    habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onComplete={handleCompleteHabit}
                            isCompletedToday={isCompletedToday(habit.last_completed)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
