'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { hashPin, isValidPin, isValidUsername } from '@/lib/auth-utils';

export async function setupUserPin(username, pin) {
    try {
        if (!isValidUsername(username)) {
            return { success: false, error: 'Invalid username.' };
        }
        if (!isValidPin(pin)) {
            return { success: false, error: 'PIN must be 4-6 digits.' };
        }

        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Unauthorized' };
        }

        const supabaseAdmin = createAdminClient();

        // Check availability
        const { data: existing } = await supabaseAdmin
            .from('app_users')
            .select('id')
            .eq('username', username)
            .single();

        if (existing) {
            return { success: false, error: 'Username taken.' };
        }

        // Check if user already setup (id check)
        const { data: alreadySetup } = await supabaseAdmin
            .from('app_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (alreadySetup) {
            return { success: true }; // Already done
        }

        const pinHash = await hashPin(pin);

        const { error: insertError } = await supabaseAdmin
            .from('app_users')
            .insert({
                id: user.id,
                username,
                pin_hash: pinHash
            });

        if (insertError) {
            console.error('Setup PIN error:', insertError);
            return { success: false, error: 'Failed to save profile.' };
        }

        // Mark as migrated in metadata for middleware checks
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
            user_metadata: { is_migrated: true, username: username }
        });

        return { success: true };

    } catch (error) {
        console.error('Setup PIN exception:', error);
        return { success: false, error: 'Internal server error' };
    }
}
