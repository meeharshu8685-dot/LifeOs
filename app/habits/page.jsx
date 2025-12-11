'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { completeHabit } from '@/actions/habits/completeHabit';
import HabitCard from '@/components/HabitCard';
import { motion } from 'framer-motion';
import { Plus, CheckCircle } from 'lucide-react';
import { isCompletedToday } from '@/lib/streakUtils';
import { ACHIEVEMENTS } from '@/lib/xpEngine';

export default function HabitsPage() {
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
        const result = await completeHabit(habitId, user.id);

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
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <CheckCircle className="inline mr-2 text-purple-600" />
                    Habits
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Build streaks, earn XP, level up!
                </p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                className="mb-6 w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg"
            >
                <Plus size={20} />
                <span>Add New Habit</span>
            </motion.button>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateHabit}
                    className="mb-6 card"
                >
                    <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="e.g., Morning Exercise, Read for 30 min"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-3"
                    />
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"
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

            <div className="space-y-4">
                {habits.length === 0 ? (
                    <div className="text-center py-12 card">
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
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
