'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";
import { useStore } from '@/lib/store';
import { updateProfile } from '@/actions/profile/updateProfile';
import { motion } from 'framer-motion';
import { Save, User, Ruler, Weight, Calendar, Activity } from 'lucide-react';

export default function Settings() {
    const router = useRouter();
    const { user, userProfile, fetchUserProfile } = useStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [form, setForm] = useState({
        name: "",
        birthyear: "",
        height_cm: "",
        weight_kg: "",
        gender: "",
        activity_level: ""
    });

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        // If we have userProfile in store, use it to seed initial state
        // then fetch fresh data to be sure
        if (userProfile) {
            setForm({
                name: userProfile.name || "",
                birthyear: userProfile.birthyear || "",
                height_cm: userProfile.height_cm || "",
                weight_kg: userProfile.weight_kg || "",
                gender: userProfile.gender || "",
                activity_level: userProfile.activity_level || ""
            });
            setLoading(false);
        } else {
            loadProfile();
        }
    }, [user, userProfile, router]);


    async function loadProfile() {
        if (!user) return;

        // Ensure we have the latest
        await fetchUserProfile(user.id);
        setLoading(false);
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setSaving(true);

        const result = await updateProfile(user.id, form);

        if (result.success) {
            // Refresh global store
            await fetchUserProfile(user.id);
            alert("Profile updated successfully! ✨");
            // Optional: Redirect to dashboard to see changes?
            // router.push('/');
        } else {
            alert("Error updating profile: " + result.error);
        }
        setSaving(false);
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="loading-dots"><div></div><div></div><div></div></div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center">
                    Settings ⚙️
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Update your stats to unlock health insights
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleUpdateProfile}
                className="card space-y-6"
            >
                {/* Basic Info */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <User className="text-purple-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Personal Identity
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Display Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="How should we call you?"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Birth Year
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="YYYY"
                                    type="number"
                                    value={form.birthyear}
                                    onChange={(e) => setForm({ ...form, birthyear: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Gender
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none"
                                    value={form.gender}
                                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                >
                                    <option value="" className="bg-white dark:bg-gray-900">Select Gender</option>
                                    <option value="male" className="bg-white dark:bg-gray-900">Male</option>
                                    <option value="female" className="bg-white dark:bg-gray-900">Female</option>
                                    <option value="other" className="bg-white dark:bg-gray-900">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    ▼
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Metrics */}
                <div className="space-y-6 pt-6">
                    <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <Activity className="text-blue-500" size={24} />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Physical Stats
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Height (cm)
                            </label>
                            <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. 175"
                                    type="number"
                                    value={form.height_cm}
                                    onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Weight (kg)
                            </label>
                            <div className="relative">
                                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. 70"
                                    type="number"
                                    value={form.weight_kg}
                                    onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Activity Level
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                                    value={form.activity_level}
                                    onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                                >
                                    <option value="" className="bg-white dark:bg-gray-900">Select Activity Level</option>
                                    <option value="sedentary" className="bg-white dark:bg-gray-900">Sedentary (Office job)</option>
                                    <option value="light" className="bg-white dark:bg-gray-900">Light Active (1-3 days/week)</option>
                                    <option value="moderate" className="bg-white dark:bg-gray-900">Moderately Active (3-5 days/week)</option>
                                    <option value="active" className="bg-white dark:bg-gray-900">Very Active (6-7 days/week)</option>
                                    <option value="very_active" className="bg-white dark:bg-gray-900">Extra Active (Physical job)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    ▼
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                    type="submit"
                    disabled={saving}
                >
                    <Save size={20} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
            </motion.form>
        </div>
    );
}
