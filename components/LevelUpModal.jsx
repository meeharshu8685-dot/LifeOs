'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

export default function LevelUpModal({ isOpen, onClose, level, xp }) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        if (isOpen) {
            setShowConfetti(true);
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {showConfetti && (
                        <Confetti
                            width={windowSize.width}
                            height={windowSize.height}
                            recycle={false}
                            numberOfPieces={500}
                            gravity={0.3}
                            colors={['#8b5cf6', '#6366f1', '#f59e0b', '#10b981']}
                        />
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white dark:bg-slate-900 rounded-3xl p-1 max-w-sm w-full shadow-2xl shadow-violet-500/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl opacity-10 dark:opacity-20 pointer-events-none" />

                            <div className="relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[22px] p-8 border border-white/60 dark:border-slate-700">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className="text-center">
                                    <motion.div
                                        animate={{
                                            rotate: [0, -10, 10, -10, 10, 0],
                                            scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
                                        }}
                                        transition={{ duration: 0.8, loop: Infinity, repeatDelay: 2 }}
                                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full mb-6 shadow-lg shadow-amber-200 dark:shadow-amber-900/30 ring-4 ring-white dark:ring-slate-800"
                                    >
                                        <Trophy size={48} className="text-white drop-shadow-md" />
                                    </motion.div>

                                    <motion.h2
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 mb-2"
                                    >
                                        LEVEL UP!
                                    </motion.h2>

                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: 'spring' }}
                                        className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-100 dark:border-slate-700"
                                    >
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Current Level</p>
                                        <p className="text-6xl font-black text-slate-900 dark:text-white mb-2 leading-none">
                                            {level}
                                        </p>
                                        <div className="h-1 w-16 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto rounded-full mb-3" />
                                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                                            {xp?.toLocaleString()} <span className="text-slate-400 text-sm font-normal">Total XP</span>
                                        </p>
                                    </motion.div>

                                    <motion.button
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Continue Journey
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
