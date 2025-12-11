'use client';

import { motion } from 'framer-motion';
import { Lock, Award } from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/xpEngine';

// Convert ACHIEVEMENTS object to array
const achievementsList = Object.values(ACHIEVEMENTS);

export default function AchievementGrid({ unlockedAchievements = [] }) {
    const unlockedIds = unlockedAchievements.map(a => a.type || a.id); // Handle both formats if needed

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievementsList.map((achievement, index) => {
                const isUnlocked = unlockedIds.includes(achievement.id);

                return (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`card relative overflow-hidden group p-4 flex flex-col items-center text-center ${isUnlocked
                                ? 'border-2 border-yellow-400/50 dark:border-yellow-600/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10'
                                : 'opacity-70 grayscale'
                            }`}
                    >
                        <div className={`
                            w-16 h-16 mb-3 rounded-full flex items-center justify-center text-3xl
                            ${isUnlocked ? 'bg-white dark:bg-gray-800 shadow-md' : 'bg-gray-200 dark:bg-gray-700'}
                        `}>
                            {isUnlocked ? achievement.icon : <Lock size={24} className="text-gray-400" />}
                        </div>

                        <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                            {achievement.name}
                        </h3>

                        <p className="text-xs text-gray-500 line-clamp-2">
                            {achievement.description}
                        </p>

                        {!isUnlocked && (
                            <div className="absolute inset-0 bg-gray-100/10 dark:bg-gray-900/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs font-bold bg-gray-900 text-white px-2 py-1 rounded">
                                    Locked
                                </span>
                            </div>
                        )}

                        {isUnlocked && (
                            <div className="mt-2 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                                +{achievement.xpReward} XP
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
