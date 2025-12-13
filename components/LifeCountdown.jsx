'use client';

import { motion } from 'framer-motion';
import { differenceInDays, differenceInWeeks, endOfYear, getYear } from 'date-fns';
import { Clock, Calendar, Battery } from 'lucide-react';

export default function LifeCountdown({ birthdate }) {
    const today = new Date();
    const currentYear = getYear(today);
    const birthYear = birthdate ? new Date(birthdate).getFullYear() : currentYear - 25; // Default approx

    // Days left in year calculation
    const daysLeftInYear = differenceInDays(endOfYear(today), today);
    const totalDaysInYear = 365;
    const yearProgress = ((totalDaysInYear - daysLeftInYear) / totalDaysInYear) * 100;

    // Weeks in 20s/30s calculation
    // Assuming 20s start at 20 and end at 30
    const age = currentYear - birthYear;
    let periodName = '20s';
    let periodStartAge = 20;
    let periodEndAge = 30;

    if (age >= 30 && age < 40) {
        periodName = '30s';
        periodStartAge = 30;
        periodEndAge = 40;
    } else if (age >= 40) {
        periodName = '40s';
        periodStartAge = 40;
        periodEndAge = 50;
    } else if (age < 20) {
        periodName = 'Teenage Years';
        periodStartAge = 13;
        periodEndAge = 20;
    }

    const birthDateObj = birthdate ? new Date(birthdate) : new Date(currentYear - 25, 0, 1);
    const periodStartDate = new Date(birthDateObj.getFullYear() + periodStartAge, birthDateObj.getMonth(), birthDateObj.getDate());
    const periodEndDate = new Date(birthDateObj.getFullYear() + periodEndAge, birthDateObj.getMonth(), birthDateObj.getDate());

    const totalWeeksInPeriod = differenceInWeeks(periodEndDate, periodStartDate);
    const weeksPassedInPeriod = differenceInWeeks(today, periodStartDate);
    const weeksLeft = Math.max(totalWeeksInPeriod - weeksPassedInPeriod, 0);
    const periodProgress = Math.min((weeksPassedInPeriod / totalWeeksInPeriod) * 100, 100);

    // Grid visualization items (dots)
    // Show 52 weeks * 10 years = 520 dots (too many for mobile?)
    // Let's do a simplified visualization: 10 rows of 52 dots (years)
    // Or just a progress bar for now to keep it clean.

    return (
        <div className="card mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="text-rose-500" />
                <span>Time Awareness</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Year Countdown */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Year {currentYear}</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                {daysLeftInYear} <span className="text-lg font-medium text-slate-400">days left</span>
                            </div>
                        </div>
                        <Calendar className="text-slate-300 dark:text-slate-600 mb-2" size={32} />
                    </div>

                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-slate-600 dark:text-slate-400">
                                    {Math.round(yearProgress)}% Gone
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100 dark:bg-slate-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${yearProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-800 dark:bg-slate-200"
                            ></motion.div>
                        </div>
                    </div>
                </div>

                {/* Decade/Period Countdown */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your {periodName}</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">
                                {weeksLeft} <span className="text-lg font-medium text-slate-400">weeks left</span>
                            </div>
                        </div>
                        <Battery className={`mb-2 ${periodProgress > 75 ? 'text-rose-500' : 'text-emerald-500'}`} size={32} />
                    </div>

                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-slate-600 dark:text-slate-400">
                                    {Math.round(periodProgress)}% Gone
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100 dark:bg-slate-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${periodProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${periodProgress > 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            ></motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 italic">
                    "We have two lives, and the second begins when we realize we only have one."
                </p>
            </div>
        </div>
    );
}
