'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function createGoal(data) {
    try {
        const { title, description, category, priority, targetDate, userId } = data;

        const { data: goal, error } = await supabase
            .from('goals')
            .insert([
                {
                    user_id: userId,
                    title,
                    description,
                    category,
                    priority,
                    target_date: targetDate,
                    status: 'active',
                    progress: 0
                }
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/growth');
        return { success: true, goal };
    } catch (error) {
        console.error('Error creating goal:', error);
        return { success: false, error: error.message };
    }
}

export async function getGoals(userId) {
    try {
        const { data: goals, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, goals: goals || [] };
    } catch (error) {
        console.error('Error fetching goals:', error);
        return { success: false, error: error.message, goals: [] };
    }
}

export async function updateGoalProgress(goalId, progress) {
    try {
        const status = progress >= 100 ? 'completed' : 'active';

        const { error } = await supabase
            .from('goals')
            .update({ progress, status })
            .eq('id', goalId);

        if (error) throw error;

        revalidatePath('/growth');
        return { success: true };
    } catch (error) {
        console.error('Error updating goal progress:', error);
        return { success: false, error: error.message };
    }
}
