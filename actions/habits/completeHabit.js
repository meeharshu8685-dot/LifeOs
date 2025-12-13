'use server';

import { createClient } from '@/utils/supabase/server';
import { XP_REWARDS, didLevelUp, calculateLevel, checkAchievements, ACHIEVEMENTS } from '@/lib/xpEngine';
import { calculateStreak, isCompletedToday as checkIsCompletedToday } from '@/lib/streakUtils';
import { getTodayString } from '@/lib/dateUtils';

export async function completeHabit(habitId, userId) {
    try {
        const supabase = createClient();
        const today = getTodayString();

        // Check if already completed today
        const { data: existingLog } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', habitId)
            .eq('date', today)
            .single();

        if (existingLog) {
            return { success: false, error: 'Habit already completed today' };
        }

        // Get habit details
        const { data: habit } = await supabase
            .from('habits')
            .select('*')
            .eq('id', habitId)
            .single();

        if (!habit) {
            return { success: false, error: 'Habit not found' };
        }

        // Create habit log
        await supabase
            .from('habit_logs')
            .insert({
                habit_id: habitId,
                user_id: userId,
                date: today,
                completed: true,
            });

        // Get all logs for streak calculation
        const { data: allLogs } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', habitId)
            .order('date', { ascending: false });

        // Calculate new streak
        const newStreak = calculateStreak(allLogs, today);

        // Update habit
        await supabase
            .from('habits')
            .update({
                streak: newStreak,
                last_completed: today,
            })
            .eq('id', habitId);

        // Get user profile
        const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const oldXP = userProfile.xp;
        const newXP = oldXP + XP_REWARDS.HABIT_COMPLETED;

        // Check for level up
        const leveledUp = didLevelUp(oldXP, newXP);
        const newLevel = calculateLevel(newXP);

        // Update user XP and level
        await supabase
            .from('users')
            .update({
                xp: newXP,
                level: newLevel,
            })
            .eq('id', userId);

        // Check for achievements
        const { data: unlockedAchievements } = await supabase
            .from('achievements')
            .select('type')
            .eq('user_id', userId);

        const unlockedIds = unlockedAchievements?.map(a => a.type) || [];
        const newAchievements = checkAchievements({
            level: newLevel,
            maxHabitStreak: newStreak,
            maxSkillLevel: 0,
            journalStreak: 0,
        }, unlockedIds);

        // Unlock new achievements
        for (const achievementId of newAchievements) {
            await supabase
                .from('achievements')
                .insert({
                    user_id: userId,
                    type: achievementId,
                });
        }

        return {
            success: true,
            newStreak,
            xpGained: XP_REWARDS.HABIT_COMPLETED,
            newXP,
            newLevel,
            leveledUp,
            achievements: newAchievements,
        };
    } catch (error) {
        console.error('Error completing habit:', error);
        return { success: false, error: error.message };
    }
}
