'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import { createChapter, deleteChapter } from '@/actions/profile/chapters';

export default function LifeChaptersList({ chapters = [], userId, onUpdate }) {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await createChapter({ ...formData, userId });
        if (res.success) {
            setIsAdding(false);
            setFormData({ name: '', startDate: '', endDate: '', description: '' });
            onUpdate();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this chapter?')) {
            await deleteChapter(id);
            onUpdate();
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="text-indigo-500" />
                    Life Chapters
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    {isAdding ? <X size={20} /> : <Plus size={20} />}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Chapter Name (e.g. College Years)"
                                required
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Start</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">End (Optional)</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <textarea
                                placeholder="Description of this era..."
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 h-20"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                            <button type="submit" className="w-full btn-primary py-2 text-sm">Add Chapter</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/50 ml-3 space-y-8 pl-6 py-2">
                {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <div key={chapter.id} className="relative group">
                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-slate-900"></div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{chapter.name}</h4>
                                    <span className="text-xs font-bold text-indigo-500 uppercase">
                                        {chapter.start_date} — {chapter.end_date || 'Present'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(chapter.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {chapter.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                    {chapter.description}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-slate-500 italic">No chapters defined. Start your timeline!</div>
                )}
            </div>
        </div>
    );
}
