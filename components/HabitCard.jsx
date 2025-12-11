'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { formatStreak, getStreakEmoji } from '@/lib/streakUtils';

export default function HabitCard({ habit, onComplete, isCompletedToday }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {habit.name}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-2xl">{getStreakEmoji(habit.streak)}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                            {formatStreak(habit.streak)} streak
                        </span>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onComplete(habit.id)}
                    disabled={isCompletedToday}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isCompletedToday
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-purple-500 hover:text-white'
                        }`}
                >
                    {isCompletedToday && <Check size={24} />}
                </motion.button>
            </div>

            {habit.streak > 0 && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
