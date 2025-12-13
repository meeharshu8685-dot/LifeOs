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
    Menu,
    Gamepad2,
    Sun,
    Moon,
    Eye,
    EyeOff
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/habits', icon: CheckSquare, label: 'Habits' },
    { href: '/growth', icon: Target, label: 'Growth' },
    { href: '/insights', icon: BarChart3, label: 'Insights' },
    { href: '/journal', icon: BookOpen, label: 'Journal' },
    { href: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
    const supabase = createClient();
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme, isMonochrome, toggleMonochrome } = useTheme();

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
                className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/20"
            >
                <div className="flex items-center justify-between px-6 py-8 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                            <Gamepad2 size={24} />
                        </div>
                        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 tracking-tight">
                            LifeOS
                        </span>
                    </div>
                    <button
                        onClick={closeSidebar}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
                    >
                        <Menu size={20} />
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
                                    ? 'text-white shadow-lg shadow-violet-200 dark:shadow-none'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    size={20}
                                    className={`relative z-10 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                />
                                <span className="relative z-10 font-bold">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Settings & Logout separate block */}
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        {/* Theme Toggles */}
                        <div className="flex gap-2 px-4">
                            <button
                                onClick={toggleTheme}
                                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                <span className="text-xs font-bold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                            </button>
                            <button
                                onClick={toggleMonochrome}
                                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl transition-colors ${isMonochrome
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                title="Toggle Grayscale"
                            >
                                {isMonochrome ? <EyeOff size={18} /> : <Eye size={18} />}
                                <span className="text-xs font-bold">B&W</span>
                            </button>
                        </div>

                        <Link
                            href="/settings"
                            onClick={closeSidebar}
                            className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === '/settings'
                                ? 'text-white shadow-lg shadow-violet-200 dark:shadow-none'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {pathname === '/settings' && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Settings size={20} className="relative z-10 mr-3" />
                            <span className="relative z-10 font-bold">Settings</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full relative flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 font-bold"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 safe-area-bottom shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                <div className="flex items-center justify-around h-16 px-2">
                    {(() => {
                        const mobileItems = [
                            { href: '/', icon: Home, label: 'Home' },
                            { href: '/habits', icon: CheckSquare, label: 'Habits' },
                            { href: '/growth', icon: Target, label: 'Growth' },
                            { href: '/journal', icon: BookOpen, label: 'Journal' },
                            { href: '/profile', icon: User, label: 'Profile' },
                        ];

                        return mobileItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center w-full h-full p-1 ${isActive
                                        ? 'text-violet-600 dark:text-violet-400'
                                        : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-violet-100 dark:bg-violet-900/30' : ''}`}>
                                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-violet-600 dark:text-violet-400' : ''}`}>{item.label}</span>
                                </Link>
                            );
                        });
                    })()}
                </div>
            </nav>
        </>
    );
}
