import { supabase } from '@/lib/supabaseClient';

export async function updateProfile(userId, formData) {
    try {
        const { error } = await supabase
            .from('users')
            .update({
                name: formData.name,
                birthyear: parseInt(formData.birthyear) || null,
                height_cm: parseInt(formData.height_cm) || null,
                weight_kg: parseInt(formData.weight_kg) || null,
                gender: formData.gender,
                activity_level: formData.activity_level,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
}
