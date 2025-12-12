'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Mesh Gradients - Premium Light Theme */}
            <div
                className="absolute inset-0 opacity-70 dark:opacity-20"
                style={{
                    transform: `translateY(${scrollY * 0.1}px)`,
                    willChange: 'transform',
                }}
            >
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-violet-200/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-violet-900/30" />
                <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-indigo-900/30" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-normal dark:bg-blue-900/30" />
            </div>

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]" />
        </div>
    );
}
