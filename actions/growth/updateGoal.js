'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateGoal(goalId, updates) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', goalId)
            .eq('user_id', user.id);

        if (error) throw error;

        revalidatePath('/growth');
        return { success: true };
    } catch (error) {
        console.error('Error updating goal:', error);
        return { success: false, error: error.message };
    }
}
