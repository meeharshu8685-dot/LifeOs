'use client';

import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '@/lib/xpEngine';
import { Lock } from 'lucide-react';

export default function AchievementCard({ achievementId, isUnlocked, unlockedAt }) {
    const achievement = ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(
        key => ACHIEVEMENTS[key].id === achievementId
    )];

    if (!achievement) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={isUnlocked ? { scale: 1.05, rotate: [0, -2, 2, 0] } : {}}
            className={`relative rounded-xl p-5 shadow-md border-2 transition-all ${isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 dark:border-yellow-600'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60'
                }`}
        >
            {!isUnlocked && (
                <div className="absolute top-3 right-3">
                    <Lock size={16} className="text-gray-400" />
                </div>
            )}

            <div className="text-center">
                <motion.div
                    animate={isUnlocked ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-5xl mb-3"
                >
                    {achievement.icon}
                </motion.div>

                <h4 className={`font-bold mb-1 ${isUnlocked
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    {achievement.name}
                </h4>

                <p className={`text-sm mb-3 ${isUnlocked
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                    {achievement.description}
                </p>

                {isUnlocked && unlockedAt && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        Unlocked {new Date(unlockedAt).toLocaleDateString()}
                    </div>
                )}

                <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isUnlocked
                        ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                    +{achievement.xpReward} XP
                </div>
            </div>
        </motion.div>
    );
}
