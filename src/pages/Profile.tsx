import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [dietPreference, setDietPreference] = useState('Veg');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.user_metadata?.full_name || 'Fitness Enthusiast');
        }
    }, [user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            data: { full_name: name }
        });

        setLoading(false);
        if (error) {
            alert('Error updating profile: ' + error.message);
        } else {
            alert('Profile updated successfully!');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/50"
            >
                {/* Header Banner */}
                <div className="relative h-48 bg-gradient-to-r from-primary-600 to-secondary-600">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-1 shadow-xl">
                                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                                    <User size={48} />
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition transform hover:scale-105">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="mb-4 ml-4 md:mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 shadow-black/10 drop-shadow-md">
                                {name || 'User Profile'}
                            </h1>
                            <p className="text-primary-100 font-medium text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Pro Member
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-12 px-8 md:px-12">
                    <form onSubmit={handleUpdate} className="space-y-8 max-w-2xl">

                        {/* Section: Account */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Shield className="text-primary-500" size={20} /> Account Details
                            </h2>

                            <div className="grid gap-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Authenticated Email</label>
                                    <div className="flex items-center text-slate-700 font-medium">
                                        <Mail className="h-4 w-4 mr-3 text-slate-400" />
                                        {user?.email}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-50 outline-none transition-all font-medium text-slate-800"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Preferences */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="text-2xl">🥗</span> Dietary Preferences
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Veg', 'Non-Veg', 'Jain', 'Vegan'].map((type) => (
                                    <label
                                        key={type}
                                        className={`relative group cursor-pointer`}
                                    >
                                        <input
                                            type="radio"
                                            name="diet"
                                            value={type}
                                            checked={dietPreference === type}
                                            onChange={(e) => setDietPreference(e.target.value)}
                                            className="hidden"
                                        />
                                        <div className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${dietPreference === type
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold shadow-lg shadow-primary-100 scale-105'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                            }`}>
                                            {type}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold shadow-xl shadow-slate-200 hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    'Saving Changes...'
                                ) : (
                                    <>
                                        <Save size={18} /> Save Profile
                                    </>
                                )}
                            </motion.button>
                        </div>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}
