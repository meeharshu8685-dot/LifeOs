'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateSkill(skillId, updates) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error('Unauthorized');
        }

        const { error } = await supabase
            .from('skills')
            .update(updates)
            .eq('id', skillId)
            .eq('user_id', user.id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error updating skill:', error);
        return { success: false, error: error.message };
    }
}
