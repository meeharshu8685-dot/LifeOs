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
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Layer 1 - Slower movement */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{
                    backgroundImage: 'url(/bg-1.jpg)',
                    transform: `translateY(${scrollY * 0.3}px)`,
                    willChange: 'transform',
                }}
            />

            {/* Layer 2 - Faster movement */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: 'url(/bg-2.jpg)',
                    transform: `translateY(${scrollY * 0.5}px)`,
                    willChange: 'transform',
                }}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>
    );
}
