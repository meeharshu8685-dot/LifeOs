'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addPrinciple(data) {
    try {
        const { principle, description, type, userId } = data;

        const supabase = createClient();
        const { data: result, error } = await supabase
            .from('personal_philosophy')
            .insert([
                {
                    user_id: userId,
                    principle,
                    description,
                    type: type || 'principle'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/profile');
        return { success: true, principle: result };
    } catch (error) {
        console.error('Error adding principle:', error);
        return { success: false, error: error.message };
    }
}

export async function getPhilosophy(userId) {
    try {
        const supabase = createClient();
        const { data: philosophy, error } = await supabase
            .from('personal_philosophy')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return { success: true, philosophy: philosophy || [] };
    } catch (error) {
        console.error('Error fetching philosophy:', error);
        return { success: false, error: error.message, philosophy: [] };
    }
}

export async function deletePrinciple(id) {
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('personal_philosophy')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error deleting principle:', error);
        return { success: false, error: error.message };
    }
}
