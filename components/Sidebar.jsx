import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    CheckSquare,
    Target,
    BookOpen,
    BarChart3,
    Trophy,
    User,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/habits', icon: CheckSquare, label: 'Habits' },
    { href: '/skills', icon: Target, label: 'Skills' },
    { href: '/journal', icon: BookOpen, label: 'Journal' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/achievements', icon: Trophy, label: 'Awards' },
    { href: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    // Don't show on auth pages
    if (pathname?.startsWith('/auth')) {
        return null;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger Toggle Button - Desktop */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="hidden md:flex fixed top-4 left-4 z-50 w-12 h-12 items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-xl shadow-lg hover:scale-105 transition-transform border border-gray-200 dark:border-white/10"
            >
                <Menu className="text-gray-700 dark:text-gray-300" size={24} />
            </motion.button>

            {/* Backdrop - Desktop */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeSidebar}
                    className="hidden md:block fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                />
            )}

            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: isOpen ? '0%' : '-100%' }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 shadow-2xl"
            >
                <div className="flex items-center justify-between px-6 py-8 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            L
                        </div>
                        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            LifeOS
                        </span>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Menu size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar}
                                className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-md"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    size={20}
                                    className={`relative z-10 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                />
                                <span className="relative z-10 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Settings & Logout separate block */}
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10">
                        <Link
                            href="/settings"
                            onClick={closeSidebar}
                            className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === '/settings'
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {pathname === '/settings' && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Settings size={20} className="relative z-10 mr-3" />
                            <span className="relative z-10 font-medium">Settings</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full relative flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.slice(0, 5).map((item) => { // Limit items on mobile or create a "More" menu?
                        // Let's show Home, Habits, Journal, Stats, Profile.
                        // Wait, user wants ALL features. "More" tab?
                        // For now, let's just pick the top 5 most critical active tabs + Profile is usually key.
                        // Actually, let's stick to the list: Home, Habits, Skills, Journal, Analytics.
                        // Profile/Settings can be accessed via a top header on mobile?
                        // Or just squeeze 5 icons?
                        // Let's refine: Home, Habits, Skills, Analytics, Profile.
                        // Journal is crucial too. 6 items is tight.
                        // Solution: Show 4 + Profile.
                        // Or utilize horizontal scroll if needed, but that's bad UX for bottom nav.
                        // Let's use the layout: Home, Habits, Journal, Analytics, Profile.
                        // Access Skills via Home? No, Skills is core.
                        // Let's keep 5: Home, Habits, Skills, Journal, Profile.
                        // Analytics and Achievements can be accessed via Profile or Home stats.
                        const mobileItems = [
                            { href: '/', icon: Home, label: 'Home' },
                            { href: '/habits', icon: CheckSquare, label: 'Habits' },
                            { href: '/skills', icon: Target, label: 'Skills' },
                            { href: '/journal', icon: BookOpen, label: 'Journal' },
                            { href: '/profile', icon: User, label: 'Profile' },
                        ];

                        const isMobileItem = mobileItems.find(i => i.href === item.href);
                        if (!isMobileItem) return null; // Don't render if not in mobile set

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full h-full p-1 ${isActive
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-500 dark:text-gray-500'
                                    }`}
                            >
                                <div className={`relative p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
