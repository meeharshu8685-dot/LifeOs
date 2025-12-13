'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSkillHistory(userId, days = 7) {
    const supabase = createClient();
    try {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - days);
        const pastDateString = pastDate.toISOString();

        const { data, error } = await supabase
            .from('skill_logs')
            .select(`
                id,
                xp_gained,
                created_at,
                skills (
                    id,
                    name
                )
            `)
            .eq('user_id', userId)
            .gte('created_at', pastDateString)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching skill history:', error);
        return { success: false, error: error.message };
    }
}
