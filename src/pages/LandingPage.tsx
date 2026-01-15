import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Utensils, Heart, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <header className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 -z-10" />
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-300/20 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary-300/20 blur-[100px] rounded-full" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/50 backdrop-blur border border-white/40 text-primary-700 font-semibold text-sm mb-6 shadow-sm">
                            <Sparkles className="inline w-4 h-4 mr-1" />
                            Revolutionizing India's Fitness
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-tight">
                            Fitness for <span className="text-gradient">Bharat</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Achieve your health goals with diet plans and workouts tailored for the Indian lifestyle.
                            Desi food, Yoga, and strength training combined.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Start Your Journey <ArrowRight className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:border-primary-200 hover:bg-primary-50 transition-all"
                            >
                                Login
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Why Choose <span className="text-gradient">FitIndia Pro</span>?
                        </h2>
                        <p className="text-slate-500 text-lg">Designed for your lifestyle, food, and culture.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Utensils className="h-8 w-8 text-primary-600" />}
                            title="Indian Diet Plans"
                            description="Calorie tracking for Roti, Dal, Sabzi, and regional cuisines. No more guessing with western databases."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Activity className="h-8 w-8 text-secondary-600" />}
                            title="Culturally Relevant"
                            description="From Surya Namaskar to gym routines, find workouts that fit your lifestyle and preference."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Users className="h-8 w-8 text-amber-500" />}
                            title="Community Support"
                            description="Join a community of like-minded individuals on the same path to wellness."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Cultural Resonance Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Rooted in Tradition, Backed by Science</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-16 leading-relaxed">
                        We understand that health isn't just about calories. It's about nourishment, family, and balance.
                        Our holistic approach respects your food culture while helping you stay fit.
                    </p>
                    <div className="flex justify-center gap-12 sm:gap-24 text-primary-200">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                <Heart className="h-8 w-8" />
                            </div>
                            <span className="font-semibold text-lg">Holistic Health</span>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                <LeafIcon />
                            </div>
                            <span className="font-semibold text-lg">Pure Ingredients</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-slate-900">
                <div className="container mx-auto px-4 text-center">
                    <p className="flex items-center justify-center gap-2 text-sm">
                        &copy; {new Date().getFullYear()} FitIndia Pro. Made with <Heart size={14} className="text-red-500 fill-red-500" /> for India.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-300 border border-slate-100 group"
        >
            <div className="mb-6 bg-white p-4 rounded-2xl inline-block shadow-sm group-hover:scale-110 transition-transform duration-300 border border-slate-100">{icon}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </motion.div>
    );
}

function LeafIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
    )
}
