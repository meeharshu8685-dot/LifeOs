'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import SplashScreen from '@/components/SplashScreen';
import Sidebar from '@/components/Sidebar';
import ParallaxBackground from '@/components/ParallaxBackground';
import LevelUpModal from '@/components/LevelUpModal';

export default function RootLayout({ children }) {
    const [showSplash, setShowSplash] = useState(true);
    const { user, setUser, fetchUserProfile, showLevelUpModal, hideLevelUp, levelUpData } = useStore();

    useEffect(() => {
        // Check for user session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
        });

        // Hide splash screen after delay
        const splashTimer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(splashTimer);
        };
    }, [setUser, fetchUserProfile]);

    return (
        <html lang="en">
            <head>
                <title>LifeOS - Turn Your Life Into A Game</title>
                <meta name="description" content="Gamify your life with XP, levels, habits, skills, and achievements" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                {showSplash && <SplashScreen />}

                <ParallaxBackground />

                <Sidebar />

                <div className="transition-all duration-300">
                    <div className="min-h-screen pb-20 md:pb-8">
                        {children}
                    </div>
                </div>

                <LevelUpModal
                    isOpen={showLevelUpModal}
                    onClose={hideLevelUp}
                    level={levelUpData?.level}
                    xp={levelUpData?.xp}
                />
            </body>
        </html>
    );
}
