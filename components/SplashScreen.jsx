'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 blur-3xl opacity-50 animate-pulse-slow"></div>
                            <h1 className="relative text-7xl md:text-8xl font-black text-white">
                                LifeOS
                            </h1>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-purple-200 font-light tracking-wide"
                    >
                        Turn your life into a game
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 flex space-x-2"
                    >
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
