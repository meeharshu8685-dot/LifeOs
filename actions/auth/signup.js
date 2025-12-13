'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { hashPin, isValidPin, isValidUsername } from '@/lib/auth-utils';

export async function signup(username, pin) {
    try {
        if (!isValidUsername(username)) {
            return { success: false, error: 'Invalid username. Use 3-20 alphanumeric characters.' };
        }
        if (!isValidPin(pin)) {
            return { success: false, error: 'PIN must be 4-6 digits.' };
        }

        const supabaseAdmin = createAdminClient();

        // 1. Check if username exists
        const { data: existing, error: checkError } = await supabaseAdmin
            .from('app_users')
            .select('id')
            .eq('username', username)
            .single();

        if (existing) {
            return { success: false, error: 'Username already taken' };
        }

        // 2. Hash PIN
        const pinHash = await hashPin(pin);

        // 3. Create Auth User (Shadow Record)
        // We use a dummy email based on username to satisfy Supabase requirements
        const dummyEmail = `${username}@lifeos.local`;
        const dummyPassword = `P${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}!`; // Random strong password

        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: dummyEmail,
            password: dummyPassword,
            email_confirm: true,
            user_metadata: { username }
        });

        if (authError) {
            console.error('Auth user creation failed:', authError);
            return { success: false, error: 'Could not create account' };
        }

        // 4. Create App User
        const { error: appUserError } = await supabaseAdmin
            .from('app_users')
            .insert({
                id: authUser.user.id,
                username: username,
                pin_hash: pinHash
            });

        if (appUserError) {
            console.error('App user creation failed:', appUserError);
            // Rollback auth user? 
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            return { success: false, error: 'Could not initialize profile' };
        }

        // 4b. Ensure public profile exists (in case trigger is missing/fails)
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authUser.user.id,
                name: username,
                xp: 0,
                level: 1
            })
            .select();

        if (profileError) {
            console.warn('Profile creation warning (likely trigger handled it):', profileError.message);
        }

        // 5. Create Session (Auto login)
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
            user_id: authUser.user.id
        });

        if (sessionError) {
            return { success: true, message: 'Account created. Please log in.' };
        }

        // 6. Set Cookies via SSR client
        const supabaseSSR = createClient();
        await supabaseSSR.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
        });

        return { success: true };

    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: 'Internal server error' };
    }
}
