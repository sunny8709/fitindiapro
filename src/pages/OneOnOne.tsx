import { motion } from 'framer-motion';
import { Star, CheckCircle, Lock } from 'lucide-react';

const EXPERTS = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Elite Neural Trainer",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
        specialty: "HIIT & Mental Resilience"
    },
    {
        id: 2,
        name: "Mike Chen",
        role: "Nutrition Strategist",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
        specialty: "Macro Planning"
    },
    {
        id: 3,
        name: "Emma Davis",
        role: "Yoga Expert",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        specialty: "Flexibility & Posture"
    }
];

export default function OneOnOne() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-4 tracking-wider">PREMIUM FEATURE</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        1:1 Expert <span className="text-gradient">Coaching</span>
                    </h1>
                    <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                        Get personalized guidance from world-class trainers via video call.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {EXPERTS.map((expert, index) => (
                        <motion.div
                            key={expert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel rounded-3xl overflow-hidden relative group"
                        >
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={expert.image}
                                    alt={expert.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-sm">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    {expert.rating}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{expert.name}</h3>
                                <p className="text-primary-600 font-medium text-sm mb-4">{expert.role}</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>Personalized Diet Plan</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>Weekly Video Check-ins</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>24/7 Chat Access</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    {/* Mock Paywall Button */}
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                                        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                                            <Lock size={18} />
                                            Unlock Premium
                                        </button>
                                    </div>

                                    <button className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                                        Book Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
