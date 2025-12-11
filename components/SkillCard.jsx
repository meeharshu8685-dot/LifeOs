'use client';

import { motion } from 'framer-motion';
import { calculateSkillLevel } from '@/lib/xpEngine';
import { TrendingUp } from 'lucide-react';

export default function SkillCard({ skill }) {
    const level = calculateSkillLevel(skill.xp);
    const skillLevels = [0, 50, 120, 250, 450, 750, 1200, 1800, 2500, 3500, 5000];

    let currentLevelXP = 0;
    let nextLevelXP = 50;

    if (level <= skillLevels.length) {
        currentLevelXP = skillLevels[level - 1] || 0;
        nextLevelXP = skillLevels[level] || (skillLevels[skillLevels.length - 1] + 1000);
    }

    const xpInLevel = skill.xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    const progress = Math.min((xpInLevel / xpNeeded) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {skill.skill_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Level {level} • {skill.xp.toLocaleString()} XP
                    </p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-lg">
                    <TrendingUp size={20} className="text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{xpInLevel.toLocaleString()} XP</span>
                    <span>{xpNeeded.toLocaleString()} XP</span>
                </div>

                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                </div>

                <div className="text-xs text-center text-gray-600 dark:text-gray-400">
                    {progress.toFixed(0)}% to Level {level + 1}
                </div>
            </div>
        </motion.div>
    );
}
