'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Trash2, X, Quote } from 'lucide-react';
import { addPrinciple, deletePrinciple } from '@/actions/profile/philosophy';

export default function PhilosophySection({ philosophy = [], userId, onUpdate }) {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        principle: '',
        description: '',
        type: 'principle'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await addPrinciple({ ...formData, userId });
        if (res.success) {
            setIsAdding(false);
            setFormData({ principle: '', description: '', type: 'principle' });
            onUpdate();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Remove this principle?')) {
            await deletePrinciple(id);
            onUpdate();
        }
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Book className="text-emerald-500" />
                    Personal Philosophy
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
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
                                placeholder="Principle (e.g. Memento Mori)"
                                required
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 font-bold"
                                value={formData.principle}
                                onChange={e => setFormData({ ...formData, principle: e.target.value })}
                            />
                            <textarea
                                placeholder="What does this mean to you?"
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 h-20"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                            <button type="submit" className="w-full btn-primary py-2 text-sm bg-emerald-600 hover:bg-emerald-700">Add Principle</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {philosophy.length > 0 ? (
                    philosophy.map((item) => (
                        <div key={item.id} className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 relative hover:shadow-md transition-shadow">
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-2"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex gap-4">
                                <Quote className="text-emerald-300 dark:text-emerald-900 shrink-0" size={32} />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{item.principle}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                                        "{item.description}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        Define your code. Add your first principle.
                    </div>
                )}
            </div>
        </div>
    );
}
