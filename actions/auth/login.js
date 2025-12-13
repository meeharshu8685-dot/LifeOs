'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { verifyPin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; // Should be used by createClient internally but ensuring we have context

export async function login(username, pin) {
    try {
        const supabaseAdmin = createAdminClient();

        // 1. Fetch user from app_users
        const { data: appUser, error: fetchError } = await supabaseAdmin
            .from('app_users')
            .select('*')
            .eq('username', username)
            .single();

        if (fetchError || !appUser) {
            // Use generic error to avoid enumeration, or specific if desired. 
            // Return specific for now to help debug migration
            return { success: false, error: 'User not found' };
        }

        // 2. Check lock status
        if (appUser.locked_until && new Date(appUser.locked_until) > new Date()) {
            return { success: false, error: 'Account locked. Try again later.' };
        }

        // 3. Verify PIN
        const isValid = await verifyPin(pin, appUser.pin_hash);

        if (!isValid) {
            // Handle failed attempts
            const newFailedAttempts = (appUser.failed_attempts || 0) + 1;
            let updates = { failed_attempts: newFailedAttempts };

            if (newFailedAttempts >= 5) {
                const lockTime = new Date();
                lockTime.setMinutes(lockTime.getMinutes() + 15); // Lock for 15 mins
                updates.locked_until = lockTime.toISOString();
            }

            await supabaseAdmin
                .from('app_users')
                .update(updates)
                .eq('id', appUser.id);

            return { success: false, error: 'Invalid PIN' };
        }

        // 4. Success - Reset failed attempts
        if (appUser.failed_attempts > 0 || appUser.locked_until) {
            await supabaseAdmin
                .from('app_users')
                .update({ failed_attempts: 0, locked_until: null })
                .eq('id', appUser.id);
        }

        // 5. Create Session
        // We use admin.auth.createSession to mint a session for this specific User ID
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
            user_id: appUser.id
        });

        if (sessionError) {
            console.error('Session creation failed:', sessionError);
            return { success: false, error: 'Authentication failed' };
        }

        // 6. Set Cookies via SSR client
        // strategies: 
        // A. Use supabase-ssr's setSession (cleanest)
        // B. Manually set cookies (harder to maintain)

        const supabaseSSR = createClient();
        const { error: setSessionError } = await supabaseSSR.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
        });

        if (setSessionError) {
            console.error('Set Session failed:', setSessionError);
            return { success: false, error: 'Failed to establish session' };
        }

        return { success: true };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Internal server error' };
    }
}
