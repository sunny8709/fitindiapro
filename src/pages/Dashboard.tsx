import { useAuth } from '../contexts/AuthContext';
import { Activity, Flame, Utensils, ArrowRight, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { user } = useAuth();
    const userName = user?.email?.split('@')[0] || 'User';

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Namaste, <span className="text-gradient">{userName}</span>!
                </h1>
                <p className="text-slate-500 text-lg">Let's crush your goals today.</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10"
            >
                <StatCard
                    title="Calories Consumed"
                    value="1,240"
                    target="/ 2,200"
                    icon={<Utensils className="h-6 w-6 text-white" />}
                    gradient="from-orange-400 to-red-500"
                    subtext="Dal Makhani was your heaviest meal."
                />
                <StatCard
                    title="Workouts Completed"
                    value="3"
                    target="Days"
                    icon={<Activity className="h-6 w-6 text-white" />}
                    gradient="from-teal-400 to-emerald-500"
                    subtext="Streak: 2 days 🔥"
                />
                <StatCard
                    title="Calories Burned"
                    value="450"
                    target="Kcal"
                    icon={<Flame className="h-6 w-6 text-white" />}
                    gradient="from-rose-400 to-pink-500"
                    subtext="Yoga session contributed 150 kcal."
                />
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10 transition-all group-hover:bg-orange-200" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <Utensils size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Your Diet Plan</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-white/40 shadow-sm">
                            <div className="w-1.5 h-12 bg-orange-400 rounded-full flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-orange-600 uppercase mb-1">Lunch</p>
                                <p className="text-slate-700 font-medium text-sm">Bhindi Masala + 2 Rotis + Curd</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white/50 rounded-2xl border border-white/40 shadow-sm opacity-70">
                            <div className="w-1.5 h-12 bg-slate-300 rounded-full flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Upcoming Snack</p>
                                <p className="text-slate-600 font-medium text-sm">Masala Chai (No Sugar) + Roasted Chana</p>
                            </div>
                        </div>
                    </div>

                    <Link to="/diet-planner" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group-hover:translate-x-1 duration-300">
                        Manage Diet <ArrowRight size={18} />
                    </Link>
                </motion.div>

                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl -z-10 transition-all group-hover:bg-teal-200" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Today's Workout</h3>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white mb-8 shadow-lg shadow-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp size={48} />
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-slate-300 text-xs font-medium uppercase tracking-wider">
                            <Calendar size={12} /> Evening Session
                        </div>
                        <h4 className="text-lg font-bold mb-1">Yoga & Cardio</h4>
                        <p className="text-slate-300 text-sm">20 mins Surya Namaskar + 15 mins Cardio</p>
                    </div>

                    <Link to="/workout-planner" className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-colors group-hover:translate-x-1 duration-300">
                        Start Workout <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ title, value, target, icon, gradient, subtext }: { title: string; value: string; target: string; icon: React.ReactNode; gradient: string; subtext: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ y: -5 }}
            className="glass-panel p-6 rounded-3xl border border-white/40 shadow-xl shadow-slate-200/50"
        >
            <div className="flex items-center justify-between mb-6">
                <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-lg shadow-orange-500/20 text-white`}>
                    {icon}
                </div>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">Today</span>
            </div>
            <h3 className="text-slate-500 text-sm font-semibold mb-1">{title}</h3>
            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-black text-slate-800">{value}</span>
                <span className="text-sm font-medium text-slate-400">{target}</span>
            </div>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                {subtext}
            </p>
        </motion.div>
    );
}
