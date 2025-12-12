import { motion } from 'framer-motion';
import { calculateSkillLevel } from '@/lib/xpEngine';
import { TrendingUp, Zap } from 'lucide-react';

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
            className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                        {skill.skill_name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Level {level} • {skill.xp.toLocaleString()} XP
                    </p>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl">
                    <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{xpInLevel.toLocaleString()} XP</span>
                    <span>{xpNeeded.toLocaleString()} XP</span>
                </div>

                <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    />
                </div>

                <div className="text-xs text-center text-slate-400 dark:text-slate-500 font-medium">
                    {progress.toFixed(0)}% to Level {level + 1}
                </div>
            </div>
        </motion.div>
    );
}
