'use client';

import { motion } from 'framer-motion';
import { Check, ZapOff, Sprout, Flame, Star, Trophy, Crown } from 'lucide-react';
import { formatStreak, getStreakEmoji } from '@/lib/streakUtils';

export default function HabitCard({ habit, onComplete, isCompletedToday }) {
    const streakIconName = getStreakEmoji(habit.streak);

    const getStreakIcon = (iconName) => {
        switch (iconName) {
            case 'ZapOff': return <ZapOff size={20} className="text-slate-400" />;
            case 'Sprout': return <Sprout size={20} className="text-green-500" />;
            case 'Flame': return <Flame size={20} className="text-orange-500" />;
            case 'Star': return <Star size={20} className="text-yellow-500 fill-yellow-500" />;
            case 'Trophy': return <Trophy size={20} className="text-amber-500" />;
            case 'Crown': return <Crown size={20} className="text-violet-600" />;
            default: return <ZapOff size={20} className="text-slate-400" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        {habit.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm">
                        <span>{getStreakIcon(streakIconName)}</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                            {formatStreak(habit.streak)} streak
                        </span>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onComplete(habit.id)}
                    disabled={isCompletedToday}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompletedToday
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-200'
                        }`}
                >
                    {isCompletedToday ? <Check size={24} strokeWidth={3} /> : <Check size={24} />}
                </motion.button>
            </div>

            {habit.streak > 0 && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
