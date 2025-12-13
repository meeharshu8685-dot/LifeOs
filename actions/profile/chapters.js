'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createChapter(data) {
    try {
        const { name, startDate, endDate, description, userId } = data;

        const supabase = createClient();
        const { data: chapter, error } = await supabase
            .from('life_chapters')
            .insert([
                {
                    user_id: userId,
                    name,
                    start_date: startDate,
                    end_date: endDate || null,
                    description
                }
            ])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/profile');
        return { success: true, chapter };
    } catch (error) {
        console.error('Error creating chapter:', error);
        return { success: false, error: error.message };
    }
}

export async function getChapters(userId) {
    try {
        const supabase = createClient();
        const { data: chapters, error } = await supabase
            .from('life_chapters')
            .select('*')
            .eq('user_id', userId)
            .order('start_date', { ascending: false });

        if (error) throw error;

        return { success: true, chapters: chapters || [] };
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return { success: false, error: error.message, chapters: [] };
    }
}

export async function deleteChapter(chapterId) {
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('life_chapters')
            .delete()
            .eq('id', chapterId);

        if (error) throw error;

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error deleting chapter:', error);
        return { success: false, error: error.message };
    }
}
