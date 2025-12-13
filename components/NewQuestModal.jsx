'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sword } from 'lucide-react';
import { createQuest } from '@/actions/growth/quests';

export default function NewQuestModal({ isOpen, onClose, userId, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        difficulty: 'Medium',
        category: 'Personal Growth'
    });

    if (!isOpen) return null;

    const getXPReward = (diff) => {
        if (diff === 'Easy') return 10;
        if (diff === 'Medium') return 25;
        return 50;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await createQuest({ ...formData, userId });
        setLoading(false);
        if (res.success) {
            onSuccess();
            onClose();
            setFormData({ title: '', difficulty: 'Medium', category: 'Personal Growth' });
        } else {
            alert('Failed to create quest');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sword className="text-amber-500" />
                                New Daily Quest
                            </h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Quest Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Read 50 pages"
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Easy', 'Medium', 'Hard'].map((diff) => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, difficulty: diff })}
                                            className={`p-2 rounded-xl text-sm font-bold border transition-all ${formData.difficulty === diff
                                                    ? 'bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/30 dark:border-slate-700 dark:text-slate-400'
                                                }`}
                                        >
                                            {diff}
                                            <div className="text-xs font-normal opacity-70">
                                                +{getXPReward(diff)} XP
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-200 dark:shadow-none disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Quest'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
