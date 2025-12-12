'use client';

import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '@/lib/xpEngine';
import { Lock, Flame, Trophy, Star, Crown, Target, BookOpen, Clapperboard, LibraryBig } from 'lucide-react';

export default function AchievementCard({ achievementId, isUnlocked, unlockedAt }) {
    const achievement = ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(
        key => ACHIEVEMENTS[key].id === achievementId
    )];

    if (!achievement) return null;

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Flame': return <Flame size={32} className={isUnlocked ? "text-orange-500" : "text-slate-400"} />;
            case 'Trophy': return <Trophy size={32} className={isUnlocked ? "text-yellow-500" : "text-slate-400"} />;
            case 'Star': return <Star size={32} className={isUnlocked ? "text-yellow-400" : "text-slate-400"} />;
            case 'Crown': return <Crown size={32} className={isUnlocked ? "text-violet-600" : "text-slate-400"} />;
            case 'Target': return <Target size={32} className={isUnlocked ? "text-red-500" : "text-slate-400"} />;
            case 'BookOpen': return <BookOpen size={32} className={isUnlocked ? "text-blue-500" : "text-slate-400"} />;
            case 'Clapperboard': return <Clapperboard size={32} className={isUnlocked ? "text-pink-500" : "text-slate-400"} />;
            case 'LibraryBig': return <LibraryBig size={32} className={isUnlocked ? "text-indigo-500" : "text-slate-400"} />;
            default: return <Trophy size={32} className="text-slate-400" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={isUnlocked ? { scale: 1.05, rotate: [0, -1, 1, 0] } : {}}
            className={`relative rounded-2xl p-6 shadow-sm border transition-all ${isUnlocked
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-900/30'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70 grayscale'
                }`}
        >
            {!isUnlocked && (
                <div className="absolute top-3 right-3">
                    <Lock size={16} className="text-slate-400" />
                </div>
            )}

            <div className="text-center">
                <motion.div
                    animate={isUnlocked ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-4"
                >
                    {getIcon(achievement.icon)}
                </motion.div>

                <h4 className={`font-bold mb-1 ${isUnlocked
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                    }`}>
                    {achievement.name}
                </h4>

                <p className={`text-sm mb-4 ${isUnlocked
                    ? 'text-slate-600 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-500'
                    }`}>
                    {achievement.description}
                </p>

                {isUnlocked && unlockedAt && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-2">
                        Unlocked {new Date(unlockedAt).toLocaleDateString()}
                    </div>
                )}

                <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${isUnlocked
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                    +{achievement.xpReward} XP
                </div>
            </div>
        </motion.div>
    );
}
