'use client';

import { motion } from 'framer-motion';
import { calculateLifeProgress, getAge } from '@/lib/dateUtils';

export default function LifeProgressRing({ birthdate, lifeExpectancy = 80 }) {
    const progress = calculateLifeProgress(birthdate, lifeExpectancy);
    const age = getAge(birthdate);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-full h-full">
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                    />

                    {/* Progress circle */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="url(#lifeGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="lifeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="text-center"
                    >
                        <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {progress.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Age {age}
                        </div>
                    </motion.div>
                </div>
            </div>

            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Life Progress
            </p>
        </div>
    );
}
