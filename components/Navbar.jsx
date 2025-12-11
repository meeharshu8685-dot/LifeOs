'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    CheckSquare,
    Target,
    BookOpen,
    BarChart3,
    Trophy,
    User
} from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/habits', icon: CheckSquare, label: 'Habits' },
    { href: '/skills', icon: Target, label: 'Skills' },
    { href: '/journal', icon: BookOpen, label: 'Journal' },
    { href: '/analytics', icon: BarChart3, label: 'Stats' },
    { href: '/achievements', icon: Trophy, label: 'Awards' },
    { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
    const pathname = usePathname();

    // Don't show navbar on auth pages
    if (pathname?.startsWith('/auth')) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 md:hidden">
            <div className="flex items-center justify-around h-16">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-500'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'animate-bounce-slow' : ''} />
                            <span className="text-xs mt-1">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>


    );
}
