'use client';

import { motion } from 'framer-motion';
import { Activity, Droplets, Flame } from 'lucide-react';

export default function HealthStatsCards({ userData }) {
    if (!userData?.height_cm || !userData?.weight_kg || !userData?.birthyear) {
        return null;
    }

    const { height_cm, weight_kg, birthyear, gender, activity_level } = userData;
    const age = new Date().getFullYear() - birthyear;

    // 1. Calculate BMI
    const heightInMeters = height_cm / 100;
    const bmi = (weight_kg / (heightInMeters * heightInMeters)).toFixed(1);

    let bmiCategory = 'Normal';
    let bmiColor = 'text-green-500';
    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        bmiColor = 'text-blue-500';
    } else if (bmi >= 25 && bmi < 29.9) {
        bmiCategory = 'Overweight';
        bmiColor = 'text-yellow-500';
    } else if (bmi >= 30) {
        bmiCategory = 'Obese';
        bmiColor = 'text-red-500';
    }

    // 2. Calculate Water Goal
    const waterGoal = weight_kg * 35; // ml

    // 3. Calculate Calories (Mifflin-St Jeor)
    let bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age;
    bmr += gender === 'female' ? -161 : 5;

    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    };

    // Default to moderate if not set or invalid
    const multiplier = activityMultipliers[activity_level] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    const stats = [
        {
            icon: <Activity className={bmiColor} size={24} />,
            label: "BMI",
            value: bmi,
            subValue: bmiCategory,
            color: "border-l-4 border-green-500" // Dynamic based on category would be cool too
        },
        {
            icon: <Droplets className="text-blue-500" size={24} />,
            label: "Water Goal",
            value: `${(waterGoal / 1000).toFixed(1)}L`,
            subValue: `${waterGoal}ml / day`,
            color: "border-l-4 border-blue-500"
        },
        {
            icon: <Flame className="text-orange-500" size={24} />,
            label: "Calories",
            value: tdee,
            subValue: "Daily Maintenance",
            color: "border-l-4 border-orange-500"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`card flex items-center p-4 ${stat.color} bg-opacity-50`}
                >
                    <div className="mr-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {stat.icon}
                    </div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                            {stat.label}
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white leading-none my-1">
                            {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                            {stat.subValue}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
