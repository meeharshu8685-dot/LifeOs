'use client';

import { motion } from 'framer-motion';
import { formatDate } from '@/lib/dateUtils';
import { Smile, Meh, Frown, Sparkles, PartyPopper, Lightbulb } from 'lucide-react';

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
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${getMoodColor(entry.mood)} shadow-sm`}>
                        <div className="text-white">
                            {getMoodIcon(entry.mood)}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatDate(entry.date, 'EEEE, MMM dd')}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Mood: {entry.mood}/10
                        </p>
                    </div>
                </div>
            </div>

            {entry.wins && (
                <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                        <PartyPopper size={12} /> Wins
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {entry.wins}
                    </p>
                </div>
            )}

            {entry.lessons && (
                <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                        <Lightbulb size={12} /> Lessons
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {entry.lessons}
                    </p>
                </div>
            )}

            {entry.improvements && (
                <div>
                    <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1 flex items-center">
                        <Sparkles size={12} className="mr-1" />
                        To Improve
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {entry.improvements}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
