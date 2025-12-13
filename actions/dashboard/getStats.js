'use server';

import { createClient } from '@/utils/supabase/server';
import { calculateJournalStreak } from '@/lib/streakUtils';
import { calculateLifeBalanceScore, getLifeAreasBreakdown } from '@/lib/lifeBalance';

export async function getStats() {
    const supabase = createClient();
    try {
        // Get authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            throw new Error('Unauthorized: No user found');
        }
        const userId = authUser.id;

        // Get user profile
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        // Get habits
        const { data: habits, error: habitsError } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)
            .order('streak', { ascending: false });

        if (habitsError) throw habitsError;

        // Get skills
        const { data: skills, error: skillsError } = await supabase
            .from('skills')
            .select('*')
            .eq('user_id', userId)
            .order('level', { ascending: false });

        if (skillsError) throw skillsError;

        // Get recent journal entries
        const { data: journalEntries, error: journalError } = await supabase
            .from('journal')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(7);

        if (journalError) throw journalError;

        // Get achievements
        const { data: achievements, error: achievementsError } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', userId)
            .order('unlocked_at', { ascending: false });

        if (achievementsError) throw achievementsError;

        // Calculate mood trends
        const moodTrend = journalEntries?.length > 0
            ? (journalEntries.reduce((sum, entry) => sum + entry.mood, 0) / journalEntries.length).toFixed(1)
            : 0;

        // Calculate journal streak
        const journalStreak = calculateJournalStreak(journalEntries);

        // Calculate max habit streak
        const maxHabitStreak = habits?.length > 0
            ? Math.max(...habits.map(h => h.streak))
            : 0;

        // Calculate total active streaks
        const activeStreaks = habits?.filter(h => h.streak > 0).length || 0;

        // Calculate Life Balance metrics
        const tempStats = {
            habitData: [{ completionRate: activeStreaks * 10 }], // simplified for now, ideally pass real trend
            moodData: journalEntries?.map(j => ({ mood: j.mood })) || [],
            skills: skills,
            habits: habits
        };

        const lifeBalance = calculateLifeBalanceScore(tempStats);
        const lifeAreas = getLifeAreasBreakdown(tempStats);

        return {
            success: true,
            stats: {
                user,
                habits: habits || [],
                skills: skills || [],
                journal: journalEntries || [],
                achievements: achievements || [],
                analytics: {
                    moodTrend,
                    journalStreak,
                    maxHabitStreak,
                    activeStreaks,
                    totalHabits: habits?.length || 0,
                    totalSkills: skills?.length || 0,
                    totalJournalEntries: journalEntries?.length || 0,
                    totalAchievements: achievements?.length || 0,
                },
                lifeBalance,
                lifeAreas,
            },
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { success: false, error: error.message };
    }
}

export async function getMoodAnalytics(days = 30) {
    const supabase = createClient();
    try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }
        const userId = user.id;

        const { data, error } = await supabase
            .from('journal')
            .select('date, mood')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(days);

        if (error) throw error;

        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching mood analytics:', error);
        return { success: false, error: error.message };
    }
}
