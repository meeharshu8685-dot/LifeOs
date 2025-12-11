'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const moodEmojis = ['😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😃', '😁', '🤩'];
const moodLabels = ['Terrible', 'Bad', 'Poor', 'Okay', 'Fine', 'Good', 'Great', 'Amazing', 'Excellent', 'Perfect'];

export default function MoodSlider({ value = 5, onChange }) {
    const [hover, setHover] = useState(null);
    const displayValue = hover !== null ? hover : value;

    return (
        <div className="space-y-4">
            <div className="text-center">
                <motion.div
                    key={displayValue}
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-6xl mb-2"
                >
                    {moodEmojis[displayValue - 1]}
                </motion.div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {moodLabels[displayValue - 1]}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {displayValue}/10
                </p>
            </div>

            <div className="relative">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    onMouseMove={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        const percentage = (e.clientX - rect.left) / rect.width;
                        const hoverValue = Math.max(1, Math.min(10, Math.ceil(percentage * 10)));
                        setHover(hoverValue);
                    }}
                    onMouseLeave={() => setHover(null)}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-gradient-to-r
            [&::-webkit-slider-thumb]:from-purple-500
            [&::-webkit-slider-thumb]:to-pink-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gradient-to-r
            [&::-moz-range-thumb]:from-purple-500
            [&::-moz-range-thumb]:to-pink-500
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-lg"
                    style={{
                        background: `linear-gradient(to right, 
              #ef4444 0%, 
              #f59e0b ${((value - 1) / 9) * 50}%, 
              #22c55e ${((value - 1) / 9) * 100}%)`
                    }}
                />

                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                </div>
            </div>
        </div>
    );
}
