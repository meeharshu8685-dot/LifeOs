'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2200); // Slightly longer for the animation to complete

        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        },
        exit: {
            y: '-100%',
            transition: {
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1] // Custom bezier for smooth "curtain" lift
            }
        }
    };

    const letterVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Background Elements */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    </div>

                    {/* Logo & Text */}
                    <div className="z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.8, ease: "backOut" }}
                            className="mb-6 p-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-2xl shadow-indigo-500/30"
                        >
                            <Gamepad2 size={48} className="text-white" />
                        </motion.div>

                        <div className="flex overflow-hidden mb-2">
                            {['L', 'i', 'f', 'e', 'O', 'S'].map((letter, index) => (
                                <motion.span
                                    key={index}
                                    variants={letterVariants}
                                    className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter"
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium tracking-wide"
                        >
                            Gamify Your Existence
                        </motion.p>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden z-10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
