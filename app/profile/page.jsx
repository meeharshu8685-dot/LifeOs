import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { User, LogOut, Calendar, Award, Edit2, Save, X } from 'lucide-react';
import XPBar from '@/components/XPBar';
import AchievementGrid from '@/components/AchievementGrid';
import LifeChaptersList from '@/components/LifeChaptersList';
import PhilosophySection from '@/components/PhilosophySection';
import { formatDate, getAge } from '@/lib/dateUtils';
import { supabase } from '@/lib/supabaseClient';
import { getChapters } from '@/actions/profile/chapters';
import { getPhilosophy } from '@/actions/profile/philosophy';

export default function ProfilePage() {
    const router = useRouter();
    const { user, userProfile, signOut } = useStore();
    const [achievements, setAchievements] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [philosophy, setPhilosophy] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        fetchData();
        if (userProfile) {
            setEditName(userProfile.name);
        }
    }, [user, router, userProfile]);

    const fetchData = async () => {
        const [achRes, chapRes, philRes] = await Promise.all([
            supabase.from('achievements').select('*').eq('user_id', user.id),
            getChapters(user.id),
            getPhilosophy(user.id)
        ]);

        setAchievements(achRes.data || []);
        if (chapRes.success) setChapters(chapRes.chapters);
        if (philRes.success) setPhilosophy(philRes.philosophy);
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/auth/login');
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) return;

        const { error } = await supabase
            .from('users')
            .update({ name: editName })
            .eq('id', user.id);

        if (!error) {
            window.location.reload();
        }
        setIsEditing(false);
    };

    if (!userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots"><div></div><div></div><div></div></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center">
                    <User className="mr-3 text-violet-600" size={32} />
                    Profile & Legacy
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Define who you are and where you've been.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left Column: Stats & Info */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card relative"
                    >
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-violet-600 transition-colors p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
                        >
                            {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-violet-200 dark:shadow-none">
                                {userProfile.name.charAt(0).toUpperCase()}
                            </div>

                            {isEditing ? (
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 text-center font-bold text-slate-900 dark:text-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                    />
                                    <button onClick={handleSaveProfile} className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                                        <Save size={20} />
                                    </button>
                                </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                    {userProfile.name}
                                </h2>
                            )}

                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                {userProfile.email}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Level</span>
                                <span className="font-bold text-violet-600">
                                    {userProfile.level}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400 font-medium">Total XP</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {userProfile.xp.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center">
                                    <Calendar className="mr-2 text-slate-400" size={16} />
                                    Age
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {getAge(userProfile.birthdate)} years
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="card flex items-center justify-center py-8">
                        {/* LifeProgressRing removed */}
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">My Journey</h3>
                            <p className="text-slate-600 dark:text-slate-400">Keep growing!</p>
                        </div>
                    </div>
                </div>

                {/* Middle/Right Column: Chapters, Philosophy, Awards */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                    >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            Current Level Progress
                        </h3>
                        <XPBar xp={userProfile.xp} level={userProfile.level} />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <LifeChaptersList chapters={chapters} userId={user.id} onUpdate={fetchData} />
                        <PhilosophySection philosophy={philosophy} userId={user.id} onUpdate={fetchData} />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Award className="mr-2 text-yellow-500" />
                            Achievements Gallery
                        </h2>
                        <AchievementGrid unlockedAchievements={achievements} />
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-200 dark:shadow-none transition-all"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </motion.button>
            </motion.div>
        </div>
    );
}
