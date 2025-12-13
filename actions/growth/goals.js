'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGoal(data) {
    try {
        const { title, description, category, priority, targetDate } = data;

        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }

        const { data: goal, error } = await supabase
            .from('goals')
            .insert([{
                user_id: user.id,
                title,
                description,
                category,
                priority,
                target_date: targetDate,
                status: 'active',
                progress: 0
            }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/growth');
        return { success: true, goal };
    } catch (error) {
        console.error('SERVER ACTION ERROR (createGoal):', error);
        return { success: false, error: error.message || JSON.stringify(error) };
    }
}

export async function getGoals() {
    try {
        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }
        const userId = user.id;

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
        const supabase = createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error('Unauthorized: No user found');
        }

        const status = progress >= 100 ? 'completed' : 'active';

        // Check ownership first? - Actually RLS handles this if we have the user.
        // But checking auth ensures we have the session context.

        const { error } = await supabase
            .from('goals')
            .update({ progress, status })
            .eq('id', goalId)
            .eq('user_id', user.id); // Add extra safety

        if (error) throw error;

        revalidatePath('/growth');
        return { success: true };
    } catch (error) {
        console.error('Error updating goal progress:', error);
        return { success: false, error: error.message };
    }
}
