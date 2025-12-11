'use client';

import { motion } from 'framer-motion';
import { formatDate } from '@/lib/dateUtils';
import { Smile, Meh, Frown } from 'lucide-react';

function getMoodIcon(mood) {
    if (mood >= 7) return <Smile className="text-green-500" size={24} />;
    if (mood >= 4) return <Meh className="text-yellow-500" size={24} />;
    return <Frown className="text-red-500" size={24} />;
}

function getMoodColor(mood) {
    if (mood >= 7) return 'from-green-400 to-emerald-500';
    if (mood >= 4) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
}

export default function JournalEntryCard({ entry }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${getMoodColor(entry.mood)}`}>
                        {getMoodIcon(entry.mood)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(entry.date, 'EEEE, MMM dd')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Mood: {entry.mood}/10
                        </p>
                    </div>
                </div>
            </div>

            {entry.wins && (
                <div className="mb-3">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        🎉 Wins
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {entry.wins}
                    </p>
                </div>
            )}

            {entry.lessons && (
                <div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                        💡 Lessons
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {entry.lessons}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
