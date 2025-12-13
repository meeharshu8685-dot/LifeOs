'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setupUserPin } from '@/actions/auth/setupPin';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, User, AlertCircle, ShieldAlert } from 'lucide-react';

export default function SetupPinPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (pin !== confirmPin) {
            setError('PINs do not match');
            setLoading(false);
            return;
        }

        if (pin.length < 4 || pin.length > 6) {
            setError('PIN must be 4-6 digits');
            setLoading(false);
            return;
        }

        const result = await setupUserPin(username, pin);

        if (result.success) {
            router.push('/');
            router.refresh();
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-t-4 border-amber-500"
            >
                <div className="text-center mb-8">
                    <ShieldAlert size={48} className="mx-auto text-amber-500 mb-4" />
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Security Update</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        LifeOS is upgrading to a secure Username & PIN system. Please set up your new credentials to continue.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Choose Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                placeholder="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                New PIN
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full pl-9 pr-2 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all tracking-widest text-center"
                                    placeholder="••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Confirm
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-400" />
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full pl-9 pr-2 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all tracking-widest text-center"
                                    placeholder="••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-200 dark:shadow-none flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Save Credentials</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
