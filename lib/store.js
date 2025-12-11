import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useStore = create((set, get) => ({
    // User state
    user: null,
    userProfile: null,

    // UI state
    showSplash: true,
    showLevelUpModal: false,
    levelUpData: null,

    // Actions
    setUser: (user) => set({ user }),

    setUserProfile: (profile) => set({ userProfile: profile }),

    updateXP: (xp, level) => set((state) => ({
        userProfile: {
            ...state.userProfile,
            xp,
            level
        }
    })),

    hideSplash: () => set({ showSplash: false }),

    showLevelUp: (data) => set({
        showLevelUpModal: true,
        levelUpData: data
    }),

    hideLevelUp: () => set({
        showLevelUpModal: false,
        levelUpData: null
    }),

    // Fetch user profile from Supabase
    fetchUserProfile: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            set({ userProfile: data });
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    },

    // Sign out
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, userProfile: null });
    },
}));
