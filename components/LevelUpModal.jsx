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
                        />
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 100 }}
                            transition={{ type: 'spring', damping: 15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center">
                                <motion.div
                                    animate={{
                                        rotate: [0, -10, 10, -10, 10, 0],
                                        scale: [1, 1.2, 1.2, 1.2, 1.2, 1],
                                    }}
                                    transition={{ duration: 0.6 }}
                                    className="inline-block mb-6"
                                >
                                    <Trophy size={80} className="text-yellow-300" />
                                </motion.div>

                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-5xl font-black text-white mb-4"
                                >
                                    LEVEL UP!
                                </motion.h2>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring' }}
                                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6"
                                >
                                    <p className="text-white/80 text-sm mb-2">You've reached</p>
                                    <p className="text-7xl font-black text-white mb-2">
                                        {level}
                                    </p>
                                    <p className="text-white/80 text-lg">
                                        {xp?.toLocaleString()} Total XP
                                    </p>
                                </motion.div>

                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    Continue Your Journey
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
