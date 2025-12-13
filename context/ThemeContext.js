'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    isMonochrome: false,
    toggleTheme: () => { },
    toggleMonochrome: () => { },
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [isMonochrome, setIsMonochrome] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load from local storage
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedMono = localStorage.getItem('monochrome') === 'true';

        setTheme(savedTheme);
        setIsMonochrome(savedMono);
        setMounted(true);

        // Apply classes
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(savedTheme);

        if (savedMono) {
            document.documentElement.classList.add('monochrome');
        } else {
            document.documentElement.classList.remove('monochrome');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Theme logic
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);

        // Monochrome logic
        if (isMonochrome) {
            document.documentElement.classList.add('monochrome');
        } else {
            document.documentElement.classList.remove('monochrome');
        }
        localStorage.setItem('monochrome', isMonochrome);

    }, [theme, isMonochrome, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleMonochrome = () => {
        setIsMonochrome(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, isMonochrome, toggleTheme, toggleMonochrome }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
