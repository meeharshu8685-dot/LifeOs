'use client';

import { motion } from 'framer-motion';
import {
    Heart,
    Briefcase,
    BookOpen,
    Users,
    Sparkles,
    Brain,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';

const icons = {
    'Health': Heart,
    'Career': Briefcase,
    'Learning': BookOpen,
    'Relationships': Users,
    'Personal Growth': Sparkles,
    'Mental Health': Brain
};

const colors = {
    'Health': 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20',
    'Career': 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
    'Learning': 'text-violet-500 bg-violet-100 dark:bg-violet-900/20',
    'Relationships': 'text-pink-500 bg-pink-100 dark:bg-pink-900/20',
    'Personal Growth': 'text-amber-500 bg-amber-100 dark:bg-amber-900/20',
    'Mental Health': 'text-teal-500 bg-teal-100 dark:bg-teal-900/20'
};

export default function LifeAreasBreakdown({ areas }) {
    if (!areas) return null;

    return (
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-white/20 dark:border-slate-700/50 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Users className="text-indigo-500" />
                <span>Life Areas Breakdown</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map((area, index) => {
                    const Icon = icons[area.name] || Sparkles;
                    const colorStyle = colors[area.name] || colors['Personal Growth'];

                    return (
                        <motion.div
                            key={area.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${colorStyle}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{area.name}</span>
                                </div>
                                {area.trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
                                {area.trend === 'down' && <TrendingDown size={16} className="text-rose-500" />}
                                {area.trend === 'neutral' && <Minus size={16} className="text-slate-400" />}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{area.score}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${colorStyle.replace('bg-', 'bg-opacity-100 bg-')}`}
                                        style={{ width: `${area.score}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-slate-400 mt-2">
                                    {area.items} active items
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
