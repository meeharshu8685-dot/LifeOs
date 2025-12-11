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
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                        Basic Info
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <User size={16} className="mr-2" /> Display Name
                        </label>
                        <input
                            className="input-field"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <Calendar size={16} className="mr-2" /> Birth Year
                        </label>
                        <input
                            className="input-field"
                            placeholder="e.g. 1995"
                            type="number"
                            value={form.birthyear}
                            onChange={(e) => setForm({ ...form, birthyear: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <User size={16} className="mr-2" /> Gender
                        </label>
                        <select
                            className="input-field"
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Body Metrics */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                        Body Metrics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Ruler size={16} className="mr-2" /> Height (cm)
                            </label>
                            <input
                                className="input-field"
                                placeholder="e.g. 175"
                                type="number"
                                value={form.height_cm}
                                onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Weight size={16} className="mr-2" /> Weight (kg)
                            </label>
                            <input
                                className="input-field"
                                placeholder="e.g. 70"
                                type="number"
                                value={form.weight_kg}
                                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <Activity size={16} className="mr-2" /> Activity Level
                        </label>
                        <select
                            className="input-field"
                            value={form.activity_level}
                            onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                        >
                            <option value="">Select Activity Level</option>
                            <option value="sedentary">Sedentary (Office job)</option>
                            <option value="light">Light Active (1-3 days/week)</option>
                            <option value="moderate">Moderately Active (3-5 days/week)</option>
                            <option value="active">Very Active (6-7 days/week)</option>
                            <option value="very_active">Extra Active (Physical job)</option>
                        </select>
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
