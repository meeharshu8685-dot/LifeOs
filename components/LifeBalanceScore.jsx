'use client';

import { motion } from 'framer-motion';
import { Activity, Heart, TrendingUp } from 'lucide-react';

export default function LifeBalanceScore({ score, status, components }) {
    // Color based on score
    const getColor = (s) => {
        if (s >= 80) return 'text-emerald-500 from-emerald-500 to-teal-500';
        if (s >= 60) return 'text-blue-500 from-blue-500 to-cyan-500';
        if (s >= 40) return 'text-yellow-500 from-yellow-500 to-orange-500';
        return 'text-rose-500 from-rose-500 to-red-500';
    };

    const colorClass = getColor(score);
    const borderColor = score >= 80 ? 'border-emerald-500' :
        score >= 60 ? 'border-blue-500' :
            score >= 40 ? 'border-yellow-500' : 'border-rose-500';

    return (
        <div className="card w-full mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={100} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Life Balance Score
                    </h2>
                    <h3 className={`text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent ${colorClass}`}>
                        {status}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-sm">
                        Based on your habits consistency, mood stability, and skill growth over the last 7 days.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    {/* Main Score Gauge */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-200 dark:text-slate-700"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={351.86} // 2 * PI * 56
                                strokeDashoffset={351.86 - (351.86 * score) / 100}
                                className={colorClass.split(' ')[0]} // Get just the text color class
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center">
                            <span className={`text-4xl font-black ${colorClass.split(' ')[0]}`}>
                                {score}
                            </span>
                        </div>
                    </div>

                    {/* Breakdown Mini-Stats */}
                    <div className="hidden sm:flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                <Activity size={16} className="text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Health</div>
                                <div className="font-bold text-slate-800 dark:text-slate-200">{components?.habits || 0}%</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Heart size={16} className="text-blue-500" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Mood</div>
                                <div className="font-bold text-slate-800 dark:text-slate-200">{components?.mood || 0}%</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <TrendingUp size={16} className="text-purple-500" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-bold">Growth</div>
                                <div className="font-bold text-slate-800 dark:text-slate-200">{components?.growth || 0}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
