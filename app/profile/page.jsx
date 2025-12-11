'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { User, LogOut, Calendar, Award } from 'lucide-react';
import XPBar from '@/components/XPBar';
import LifeProgressRing from '@/components/LifeProgressRing';
import { formatDate, getAge } from '@/lib/dateUtils';

export default function ProfilePage() {
    const router = useRouter();
    const { user, userProfile, signOut } = useStore();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/auth/login');
    };

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <User className="inline mr-2 text-purple-600" />
                    Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Your stats and information
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-4xl font-black">
                            {userProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {userProfile.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {userProfile.email}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Level</span>
                            <span className="font-bold text-purple-600">
                                {userProfile.level}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Total XP</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {userProfile.xp.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                <Calendar className="mr-2" size={16} />
                                Age
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {getAge(userProfile.birthdate)} years
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600 dark:text-gray-400">Joined</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatDate(userProfile.created_at)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="card flex items-center justify-center">
                        <LifeProgressRing birthdate={userProfile.birthdate} />
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Current Level Progress
                        </h3>
                        <XPBar xp={userProfile.xp} level={userProfile.level} />
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </motion.button>
            </motion.div>
        </div>
    );
}
