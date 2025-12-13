'use server';

import { createClient } from '@/utils/supabase/server';
// import { updateXP } from '@/lib/xpEngine'; // Function doesn't exist

import { revalidatePath } from 'next/cache';

export async function createQuest(data) {
    try {
        const { title, difficulty, category } = data;

        // Calculate XP based on difficulty
        const xpReward = difficulty === 'Hard' ? 50 : difficulty === 'Medium' ? 25 : 10;

        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }

        const { data: quest, error } = await supabase
            .from('quests')
            .insert([
                {
                    user_id: user.id,
                    title,
                    difficulty,
                    category,
                    xp_reward: xpReward,
                    is_completed: false,
                    date: new Date().toISOString().split('T')[0] // Active for today
                }
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/growth');
        return { success: true, quest };
    } catch (error) {
        console.error('Error creating quest:', error);
        return { success: false, error: error.message };
    }
}

export async function getDailyQuests() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }
        const userId = user.id;

        const { data: quests, error } = await supabase
            .from('quests')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .order('is_completed', { ascending: true }); // Incomplete first

        if (error) throw error;

        return { success: true, quests: quests || [] };
    } catch (error) {
        console.error('Error fetching quests:', error);
        return { success: false, error: error.message, quests: [] };
    }
}

export async function completeQuest(questId) {
    try {
        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }
        const userId = user.id;

        // 1. Get quest details specifically for XP reward
        const { data: quest, error: fetchError } = await supabase
            .from('quests')
            .select('xp_reward, is_completed, user_id')
            .eq('id', questId)
            .single();

        if (fetchError || !quest) throw fetchError || new Error('Quest not found');

        // Verify ownership
        if (quest.user_id !== userId) {
            throw new Error('Unauthorized: Quest does not belong to user');
        }

        if (quest.is_completed) return { success: true, message: 'Already completed' };

        // 2. Mark as completed
        const { error: updateError } = await supabase
            .from('quests')
            .update({ is_completed: true })
            .eq('id', questId);

        if (updateError) throw updateError;

        // 3. Award XP manually since updateXP helper doesn't exist
        const { data: userProfile } = await supabase
            .from('users')
            .select('xp')
            .eq('id', userId)
            .single();

        if (userProfile) {
            // Import dynamically to avoid circular dependency issues if any, though here it's fine
            const { calculateLevel } = require('@/lib/xpEngine');
            const newXP = userProfile.xp + quest.xp_reward;
            const newLevel = calculateLevel(newXP);

            await supabase
                .from('users')
                .update({ xp: newXP, level: newLevel })
                .eq('id', userId);
        }

        revalidatePath('/growth');
        revalidatePath('/'); // Update Dashboard XP too

        return { success: true, xpEarned: quest.xp_reward };
    } catch (error) {
        console.error('Error completing quest:', error);
        return { success: false, error: error.message };
    }
}
