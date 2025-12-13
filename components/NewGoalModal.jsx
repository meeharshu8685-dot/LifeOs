'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';
import { LIFE_AREAS } from '@/lib/lifeBalance';
import { createGoal } from '@/actions/growth/goals';
import { updateGoal } from '@/actions/growth/updateGoal';

export default function NewGoalModal({ isOpen, onClose, userId, onSuccess, initialData = null }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Personal Growth',
        priority: 'Medium',
        targetDate: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                category: initialData.category || 'Personal Growth',
                priority: initialData.priority || 'Medium',
                targetDate: initialData.target_date ? initialData.target_date.split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: 'Personal Growth',
                priority: 'Medium',
                targetDate: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let res;
        if (initialData) {
            res = await updateGoal(initialData.id, {
                ...formData,
                target_date: formData.targetDate || null
            });
        } else {
            res = await createGoal(formData);
        }

        setLoading(false);
        if (res.success) {
            onSuccess();
            onClose();
            if (!initialData) {
                setFormData({
                    title: '',
                    description: '',
                    category: 'Personal Growth',
                    priority: 'Medium',
                    targetDate: ''
                });
            }
        } else {
            console.error('Operation failed:', res.error);
            alert(`Failed to ${initialData ? 'update' : 'create'} goal: ${res.error}`);
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
                                <Target className="text-indigo-500" />
                                {initialData ? 'Edit Goal' : 'New Long-term Goal'}
                            </h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Goal Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Run a Marathon"
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {LIFE_AREAS.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                    <select
                                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.targetDate}
                                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (initialData ? 'Update Goal' : 'Create Goal')}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
