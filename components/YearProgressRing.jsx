'use client';

import { motion } from 'framer-motion';
import {
    calculateYearProgress,
    calculateMonthProgress,
    calculateWeekProgress,
    getDaysRemainingInYear,
    getDaysRemainingInMonth
} from '@/lib/dateUtils';

function ProgressRing({ progress, label, color, size = 'md' }) {
    const dimensions = {
        sm: { width: 80, radius: 30, stroke: 8 },
        md: { width: 100, radius: 38, stroke: 10 },
        lg: { width: 120, radius: 46, stroke: 12 },
    };

    const { width, radius, stroke } = dimensions[size];
    const center = width / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width, height: width }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                    />

                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={color}
                        strokeWidth={stroke}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="text-xl font-black"
                        style={{ color }}
                    >
                        {progress}%
                    </motion.span>
                </div>
            </div>

            <p className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                {label}
            </p>
        </div>
    );
}

export default function YearProgressRing() {
    const yearProgress = calculateYearProgress();
    const monthProgress = calculateMonthProgress();
    const weekProgress = calculateWeekProgress();
    const daysLeftYear = getDaysRemainingInYear();
    const daysLeftMonth = getDaysRemainingInMonth();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Time Progress
            </h3>

            <div className="flex items-center justify-around gap-4">
                <ProgressRing
                    progress={yearProgress}
                    label="Year"
                    color="#8b5cf6"
                    size="md"
                />
                <ProgressRing
                    progress={monthProgress}
                    label="Month"
                    color="#ec4899"
                    size="md"
                />
                <ProgressRing
                    progress={weekProgress}
                    label="Week"
                    color="#06b6d4"
                    size="md"
                />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <p className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                        {daysLeftYear}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                        Days left in year
                    </p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3">
                    <p className="text-pink-600 dark:text-pink-400 font-bold text-lg">
                        {daysLeftMonth}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                        Days left in month
                    </p>
                </div>
            </div>
        </div>
    );
}
