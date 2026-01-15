import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Menu, X, User, Activity, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navLinkClass = (path: string) => `
        relative px-3 py-2 text-sm font-medium transition-colors
        ${location.pathname === path ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}
    `;

    return (
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-gradient">FitIndia</span>
                        <span className="text-slate-800">Pro</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className={navLinkClass('/')}>Home</Link>
                        <Link to="/bmi-calculator" className={navLinkClass('/bmi-calculator')}>
                            <span className="flex items-center gap-1"><Activity size={16} /> BMI</span>
                        </Link>
                        <Link to="/one-on-one" className={navLinkClass('/one-on-one')}>
                            <span className="flex items-center gap-1 text-amber-500"><Crown size={16} /> 1:1 Coach</span>
                        </Link>

                        {user ? (
                            <>
                                <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
                                <Link to="/diet-planner" className={navLinkClass('/diet-planner')}>Diet</Link>
                                <Link to="/workout-planner" className={navLinkClass('/workout-planner')}>Workout</Link>

                                <div className="h-6 w-px bg-slate-200 mx-2" />

                                <Link to="/profile" className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                                    <User className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={navLinkClass('/login')}>Login</Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-600 hover:text-primary-600 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-slate-100"
                        >
                            <div className="flex flex-col p-4 space-y-4">
                                <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium">Home</Link>
                                <Link to="/bmi-calculator" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium flex items-center gap-2">
                                    <Activity size={18} /> BMI Calculator
                                </Link>
                                <Link to="/one-on-one" onClick={() => setIsOpen(false)} className="text-amber-600 font-medium flex items-center gap-2">
                                    <Crown size={18} /> 1:1 Premium Coach
                                </Link>

                                {user ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium">Dashboard</Link>
                                        <Link to="/diet-planner" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium">Diet Planner</Link>
                                        <Link to="/workout-planner" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium">Workout Planner</Link>
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium">Profile</Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full py-3 rounded-xl font-semibold bg-slate-900 text-white"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="text-slate-600 font-medium">Login</Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 text-center"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
