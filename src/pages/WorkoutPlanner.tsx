import { useState, useEffect } from 'react';
import { Play, Clock, Activity, CheckCircle, Flame, Dumbbell, X, Video, Pause, ChevronRight, Trophy, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type Exercise = {
    id: string;
    name: string;
    duration: number; // minutes
    caloriesBurned: number;
    category: 'Yoga' | 'Cardio' | 'Strength';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    gifUrl: string; // URL for the demo
    description: string;
};

// --- EXPANDED DATABASE (25+ Exercises) ---
const EXERCISE_DATABASE: Exercise[] = [
    // YOGA
    { id: 'y1', name: 'Surya Namaskar', duration: 10, caloriesBurned: 100, category: 'Yoga', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/Lopx9eUIqBZHb07Yqq/giphy.gif', description: 'Sun Salutation sequence. Flow through 12 poses gracefully.' },
    { id: 'y2', name: 'Kapalbhati', duration: 5, caloriesBurned: 30, category: 'Yoga', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/l41lRXW6JtOqQ/giphy.gif', description: 'Rapid breathing technique for detoxification.' },
    { id: 'y3', name: 'Downward Dog', duration: 3, caloriesBurned: 15, category: 'Yoga', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/3o7qD1aMJ7aC/giphy.gif', description: 'Inverted V-shape pose to stretch hamstrings and shoulders.' },
    { id: 'y4', name: 'Warrior I', duration: 4, caloriesBurned: 20, category: 'Yoga', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/3o7qDQ4b8vY7q/giphy.gif', description: 'Powerful standing pose building focus and balance.' },
    { id: 'y5', name: 'Warrior II', duration: 4, caloriesBurned: 20, category: 'Yoga', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/3o7qE1aC1/giphy.gif', description: 'Deep hip opening standing pose.' },
    { id: 'y6', name: 'Tree Pose', duration: 3, caloriesBurned: 10, category: 'Yoga', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/13HgwgsXDDwdnI9L92/giphy.gif', description: 'Balancing pose on one leg. Focus on a point.' },
    { id: 'y7', name: 'Cobra Pose', duration: 3, caloriesBurned: 15, category: 'Yoga', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/3o7qD1aMJ7aC/giphy.gif', description: 'Backbend to strengthen the spine.' }, // Reusing downward dog flow gif if specific not found
    { id: 'y8', name: 'Child Pose', duration: 5, caloriesBurned: 5, category: 'Yoga', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/4bjIKBOWUnVPIOzpOY/giphy.gif', description: 'Resting pose to calm the mind and stretch the back.' },

    // CARDIO
    { id: 'c1', name: 'Jump Rope', duration: 10, caloriesBurned: 120, category: 'Cardio', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/Tk8l8zYiyrSqp21K52/giphy.gif', description: 'High intensity skipping.' },
    { id: 'c2', name: 'Burpees', duration: 5, caloriesBurned: 80, category: 'Cardio', difficulty: 'Advanced', gifUrl: 'https://media.giphy.com/media/23hPPmr8Pzqkj5Pi/giphy.gif', description: 'Full body strength and aerobic exercise.' },
    { id: 'c3', name: 'Jumping Jacks', duration: 5, caloriesBurned: 50, category: 'Cardio', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/5t9Ic9h22K7i/giphy.gif', description: 'Classic cardio warmup exercise.' },
    { id: 'c4', name: 'High Knees', duration: 5, caloriesBurned: 60, category: 'Cardio', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/Superb/giphy.gif', description: 'Run in place lifting knees high.' }, // Generic run
    { id: 'c5', name: 'Mountain Climbers', duration: 5, caloriesBurned: 70, category: 'Cardio', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/l41lRXW6JtOqQ/giphy.gif', description: 'Plank position running motion.' },
    { id: 'c6', name: 'Butt Kicks', duration: 5, caloriesBurned: 55, category: 'Cardio', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/3o7qE1aC1/giphy.gif', description: 'Jogging in place kicking heels to glutes.' },
    { id: 'c7', name: 'Brisk Walk', duration: 20, caloriesBurned: 100, category: 'Cardio', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif', description: 'Steady pace walking.' },

    // STRENGTH
    { id: 's1', name: 'Push-ups', duration: 5, caloriesBurned: 50, category: 'Strength', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/3o7qD1aMJ7aC/giphy.gif', description: 'Chest and tricep builder.' },
    { id: 's2', name: 'Squats', duration: 5, caloriesBurned: 40, category: 'Strength', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/13HgwgsXDDwdnI9L92/giphy.gif', description: 'King of leg exercises.' },
    { id: 's3', name: 'Plank', duration: 3, caloriesBurned: 30, category: 'Strength', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/xT9IgFgZ4Nq4xPjN6M/giphy.gif', description: 'Core stability hold.' },
    { id: 's4', name: 'Lunges', duration: 5, caloriesBurned: 45, category: 'Strength', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/l3q2Q5/giphy.gif', description: 'Unilateral leg strengthening.' },
    { id: 's5', name: 'Russian Twist', duration: 4, caloriesBurned: 35, category: 'Strength', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/3o7qDQ4b8vY7q/giphy.gif', description: 'Rotational core work.' },
    { id: 's6', name: 'Bicep Curls', duration: 5, caloriesBurned: 25, category: 'Strength', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/3o7qE1aC1/giphy.gif', description: 'Arm isolation. Use water bottles if no weights.' },
    { id: 's7', name: 'Tricep Dips', duration: 5, caloriesBurned: 30, category: 'Strength', difficulty: 'Intermediate', gifUrl: 'https://media.giphy.com/media/3o7qD1aMJ7aC/giphy.gif', description: 'Use a chair or bench.' },
    { id: 's8', name: 'Wall Sit', duration: 3, caloriesBurned: 20, category: 'Strength', difficulty: 'Beginner', gifUrl: 'https://media.giphy.com/media/3o7qDQ4b8vY7q/giphy.gif', description: 'Isometric leg hold against a wall.' },
];

export default function WorkoutPlanner() {
    const [activeTab, setActiveTab] = useState<'All' | 'Yoga' | 'Cardio' | 'Strength'>('All');
    const [schedule, setSchedule] = useState<Exercise[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Exercise | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Added Search State

    // Player Mode State
    const [isPlayerMode, setIsPlayerMode] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

    // Filter Logic: Tab + Search
    const filteredExercises = EXERCISE_DATABASE.filter(ex => {
        const matchesTab = activeTab === 'All' || ex.category === activeTab;
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // --- PLAYER LOGIC ---
    useEffect(() => {
        let interval: any;
        if (isPlayerMode && isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false); // Pause when timer hits 0
        }
        return () => clearInterval(interval);
    }, [isPlayerMode, isPlaying, timeLeft]);

    const startWorkout = () => {
        if (schedule.length === 0) return;
        setIsPlayerMode(true);
        setCurrentExerciseIndex(0);
        startExercise(0);
        setIsWorkoutComplete(false);
    };

    const startExercise = (index: number) => {
        const ex = schedule[index];
        setTimeLeft(ex.duration * 60); // Convert mins to seconds
        setIsPlaying(true);
    };

    const nextExercise = () => {
        if (currentExerciseIndex < schedule.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            startExercise(currentExerciseIndex + 1);
        } else {
            finishWorkout();
        }
    };

    const prevExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
            startExercise(currentExerciseIndex - 1);
        }
    };

    const finishWorkout = () => {
        setIsPlayerMode(false);
        setIsWorkoutComplete(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#14b8a6', '#8b5cf6']
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- PLANNER LOGIC ---
    const addToSchedule = (exercise: Exercise) => {
        setSchedule([...schedule, exercise]);
    };

    const removeFromSchedule = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule.splice(index, 1);
        setSchedule(newSchedule);
    };

    const totalDuration = schedule.reduce((sum, ex) => sum + ex.duration, 0);
    const totalBurn = schedule.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

    // --- RENDER ---

    // 1. WORKOUT COMPLETE SCREEN
    if (isWorkoutComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mb-6 shadow-xl"
                >
                    <Trophy size={64} fill="currentColor" />
                </motion.div>
                <h2 className="text-4xl font-black text-slate-800 mb-2">Workout Crushed!</h2>
                <p className="text-xl text-slate-500 mb-8">You burned approx <span className="text-orange-500 font-bold">{totalBurn} kcal</span> today.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setIsWorkoutComplete(false); setSchedule([]); }}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                    >
                        Plan Next Workout
                    </button>
                    <button
                        onClick={() => { setIsWorkoutComplete(false); }} // Keep schedule
                        className="px-8 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition"
                    >
                        Back to Planner
                    </button>
                </div>
            </div>
        );
    }

    // 2. PLAYER MODE
    if (isPlayerMode) {
        const currentExercise = schedule[currentExerciseIndex];
        return (
            <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
                {/* Header */}
                <div className="p-4 flex items-center justify-between text-white/80">
                    <div className="flex items-center gap-2">
                        <Activity className="text-teal-400" />
                        <span className="font-bold tracking-wider text-sm">ACTIVE WORKOUT</span>
                    </div>
                    <button onClick={() => setIsPlayerMode(false)} className="hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
                    <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative mb-8 border border-white/10">
                        <img
                            key={currentExercise.id}
                            src={currentExercise.gifUrl}
                            alt={currentExercise.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.style.backgroundImage = 'url(https://placehold.co/600x400?text=No+Video+Available)';
                                (e.target as HTMLImageElement).parentElement!.style.backgroundSize = 'cover';
                            }}
                        />
                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-4xl font-black text-white mb-2 shadow-black/50 drop-shadow-md">{currentExercise.name}</h2>
                                <p className="text-white/80 text-lg font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg inline-block">
                                    Next: {schedule[currentExerciseIndex + 1]?.name || 'Finish'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl flex items-center justify-between border border-white/5">
                        <div className="text-center w-1/3">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time Remaining</span>
                            <div className="text-5xl font-black text-white font-mono mt-1 tabula-nums">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={prevExercise}
                                disabled={currentExerciseIndex === 0}
                                className="p-4 rounded-full bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`p-6 rounded-full text-white shadow-xl transform hover:scale-105 transition ${isPlaying ? 'bg-amber-500' : 'bg-teal-500'}`}
                            >
                                {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" />}
                            </button>
                            <button
                                onClick={nextExercise}
                                className="p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>

                        <div className="w-1/3 flex justify-end">
                            <div className="text-right">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Progress</span>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {currentExerciseIndex + 1} <span className="text-slate-500 text-lg">/ {schedule.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. PLANNER MODE (Original UI with upgrades)
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-slate-800">Workout Planner</h1>
                <p className="text-slate-500 text-lg">Curate your perfect routine with expert demos.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Exercise Library */}
                <div className="lg:col-span-2">
                    {/* Search & Tabs Container */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        {/* Tabs */}
                        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto w-full md:w-auto">
                            {['All', 'Yoga', 'Cardio', 'Strength'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Find workout..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode='popLayout'>
                            {filteredExercises.map((exercise) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={exercise.id}
                                    className="glass-panel p-5 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:translate-y-[-4px] transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2.5 rounded-2xl ${exercise.category === 'Yoga' ? 'bg-orange-100 text-orange-600' :
                                            exercise.category === 'Cardio' ? 'bg-rose-100 text-rose-600' : 'bg-teal-100 text-teal-600'
                                            }`}>
                                            {exercise.category === 'Yoga' ? <Activity size={20} /> :
                                                exercise.category === 'Cardio' ? <Flame size={20} /> : <Dumbbell size={20} />}
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                            exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {exercise.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{exercise.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 h-8 mb-4">{exercise.description}</p>

                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-6 bg-slate-50 p-2 rounded-xl">
                                        <span className="flex items-center"><Clock size={12} className="mr-1" /> {exercise.duration} min</span>
                                        <span>•</span>
                                        <span className="flex items-center"><Flame size={12} className="mr-1" /> {exercise.caloriesBurned} kcal</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedVideo(exercise)}
                                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center gap-2"
                                        >
                                            <Video size={16} /> Demo
                                        </button>
                                        <button
                                            onClick={() => addToSchedule(exercise)}
                                            className="flex-[2] py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                                        >
                                            <Play size={16} fill="white" /> Add
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Today's Schedule */}
                <div className="lg:col-span-1">
                    <div className="glass-panel rounded-3xl p-6 border border-white/60 shadow-xl shadow-slate-200/50 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Your Routine</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setSchedule([])} className="text-xs text-rose-500 font-bold hover:underline">Clear</button>
                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Today</span>
                            </div>
                        </div>

                        {schedule.length > 0 ? (
                            <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence>
                                    {schedule.map((ex, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            key={`${ex.id}-${idx}`}
                                            className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl group shadow-sm"
                                        >
                                            <div className="text-teal-500">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-800 text-sm truncate">{ex.name}</h4>
                                                <p className="text-xs text-slate-500">{ex.duration} min • {ex.caloriesBurned} kcal</p>
                                            </div>
                                            <button onClick={() => removeFromSchedule(idx)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mb-6">
                                <Dumbbell className="mx-auto text-slate-300 mb-3" size={32} />
                                <p className="text-slate-400 text-sm font-medium">Your schedule is empty.<br />Add some exercises!</p>
                            </div>
                        )}

                        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Activity size={64} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between mb-3 text-sm">
                                    <span className="text-slate-400">Total Duration</span>
                                    <span className="font-bold">{totalDuration} min</span>
                                </div>
                                <div className="flex justify-between mb-6 text-sm">
                                    <span className="text-slate-400">Est. Burn</span>
                                    <span className="font-bold text-orange-400">{totalBurn} cal</span>
                                </div>
                                <button
                                    onClick={startWorkout}
                                    disabled={schedule.length === 0}
                                    className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Play size={18} fill="currentColor" /> Start Workout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Video Modal (For previewing before adding) */}
            <AnimatePresence>
                {selectedVideo && (
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
                        >
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                                {/* Using Image as GIF for demo - in prod use <video> */}
                                <img
                                    src={selectedVideo.gifUrl}
                                    alt={selectedVideo.name}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                    <h3 className="text-2xl font-bold">{selectedVideo.name}</h3>
                                    <p className="opacity-80 text-sm">{selectedVideo.category} • {selectedVideo.difficulty}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition backdrop-blur-md"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">How to perform</h4>
                                        <p className="text-slate-600 leading-relaxed">{selectedVideo.description}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => {
                                            addToSchedule(selectedVideo);
                                            setSelectedVideo(null);
                                        }}
                                        className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition"
                                    >
                                        Add to Routine
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
