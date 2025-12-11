'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { addJournalEntry, getJournalEntries } from '@/actions/journal/addEntry';
import JournalEntryCard from '@/components/JournalEntryCard';
import MoodSlider from '@/components/MoodSlider';
import JournalTrendChart from '@/components/JournalTrendChart';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Save, Search, TrendingUp, Sparkles } from 'lucide-react';

export default function JournalPage() {
    const router = useRouter();
    const { user, userProfile, showLevelUp, updateXP } = useStore();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mood, setMood] = useState(5);
    const [wins, setWins] = useState('');
    const [lessons, setLessons] = useState('');
    const [improvements, setImprovements] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        fetchEntries();
    }, [user, router]);

    const fetchEntries = async () => {
        if (!user) return;

        const result = await getJournalEntries(user.id, 30);
        if (result.success) {
            setEntries(result.entries);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const result = await addJournalEntry(user.id, mood, wins, lessons, improvements);

        if (result.success) {
            if (!result.isUpdate && result.leveledUp) {
                showLevelUp({ level: result.newLevel, xp: result.newXP });
            }
            if (!result.isUpdate) {
                updateXP(result.newXP, result.newLevel);
            }

            setWins('');
            setLessons('');
            setImprovements('');
            setMood(5);
            fetchEntries();
        }

        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    <BookOpen className="inline mr-2 text-pink-600" />
                    Journal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Reflect on your day, track your mood, earn XP!
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card lg:col-span-2"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Today's Entry
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                How are you feeling today?
                            </label>
                            <MoodSlider value={mood} onChange={setMood} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    🎉 Today's Wins
                                </label>
                                <textarea
                                    value={wins}
                                    onChange={(e) => setWins(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="What went well today?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    💡 Lessons Learned
                                </label>
                                <textarea
                                    value={lessons}
                                    onChange={(e) => setLessons(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="What did you learn?"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Sparkles size={16} className="mr-1 text-yellow-500" />
                                What I want to improve
                            </label>
                            <textarea
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                placeholder="One thing to do better tomorrow..."
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                        >
                            <Save size={20} />
                            <span>{submitting ? 'Saving...' : 'Save Entry (+4 XP)'}</span>
                        </motion.button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card h-fit"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-pink-600" />
                        Weekly Mood
                    </h2>
                    <JournalTrendChart data={entries.slice(0, 7)} />
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Your mood over the last 7 entries
                    </div>
                </motion.div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Past Entries ({entries.length})
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search entries..."
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm w-full md:w-64"
                        />
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                    {entries.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-12 card"
                        >
                            <p className="text-gray-600 dark:text-gray-400">
                                No entries yet. Start journaling today!
                            </p>
                        </motion.div>
                    ) : (
                        entries
                            .filter(entry =>
                                (entry.wins?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                (entry.lessons?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                (entry.improvements?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                            )
                            .map((entry) => (
                                <JournalEntryCard key={entry.id} entry={entry} />
                            ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
