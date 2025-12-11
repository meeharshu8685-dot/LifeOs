'use server';

import { supabase } from '@/lib/supabaseClient';
import { XP_REWARDS, didLevelUp, calculateLevel } from '@/lib/xpEngine';
import { calculateJournalStreak } from '@/lib/streakUtils';
import { getTodayString } from '@/lib/dateUtils';

export async function addJournalEntry(userId, mood, wins, lessons) {
    try {
        const today = getTodayString();

        // Check if entry already exists for today
        const { data: existing } = await supabase
            .from('journal')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .single();

        let entry;

        if (existing) {
            // Update existing entry
            const { data, error } = await supabase
                .from('journal')
                .update({
                    mood,
                    wins,
                    lessons,
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            entry = data;

            return {
                success: true,
                entry,
                xpGained: 0, // No XP for updates
                isUpdate: true,
            };
        }

        // Create new entry
        const { data, error } = await supabase
            .from('journal')
            .insert({
                user_id: userId,
                mood,
                wins,
                lessons,
                date: today,
            })
            .select()
            .single();

        if (error) throw error;
        entry = data;

        // Get user profile
        const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        const oldXP = userProfile.xp;
        const newXP = oldXP + XP_REWARDS.JOURNAL_ENTRY;

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

        // Calculate journal streak
        const { data: allEntries } = await supabase
            .from('journal')
            .select('date')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        const journalStreak = calculateJournalStreak(allEntries);

        return {
            success: true,
            entry,
            xpGained: XP_REWARDS.JOURNAL_ENTRY,
            newXP,
            newLevel,
            leveledUp,
            journalStreak,
            isUpdate: false,
        };
    } catch (error) {
        console.error('Error adding journal entry:', error);
        return { success: false, error: error.message };
    }
}

export async function getJournalEntries(userId, limit = 10) {
    try {
        const { data, error } = await supabase
            .from('journal')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return { success: true, entries: data };
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        return { success: false, error: error.message };
    }
}
