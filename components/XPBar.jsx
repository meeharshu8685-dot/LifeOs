'use client';

import { motion } from 'framer-motion';
import { calculateLevelProgress, getXPForNextLevel, getXPForCurrentLevel } from '@/lib/xpEngine';

export default function XPBar({ xp = 0, level = 1 }) {
    const currentLevelXP = getXPForCurrentLevel(level);
    const nextLevelXP = getXPForNextLevel(level);
    const progress = calculateLevelProgress(xp, level);
    const xpInLevel = xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Lv. {level}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                        {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
                    </span>
                </div>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {progress}%
                </span>
            </div>

            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 relative overflow-hidden"
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                </motion.div>

                {/* Level text overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                        {xpInLevel.toLocaleString()} XP
                    </span>
                </div>
            </div>
        </div>
    );
}
