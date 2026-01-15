import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Info, Target, TrendingDown, TrendingUp, CheckCircle } from 'lucide-react';

export default function BmiCalculator() {
    const [weight, setWeight] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    // Results
    const [bmi, setBmi] = useState<number | null>(null);
    const [idealRange, setIdealRange] = useState<{ min: number, max: number } | null>(null);
    const [weightDifference, setWeightDifference] = useState<{ amount: number, type: 'lose' | 'gain' | 'maintain' } | null>(null);

    const calculateBmi = () => {
        if (weight && height) {
            const heightInMeters = Number(height) / 100;
            const bmiValue = Number(weight) / (heightInMeters * heightInMeters);
            const roundedBmi = Math.round(bmiValue * 10) / 10;
            setBmi(roundedBmi);

            // 1. Calculate Ideal Weight Range (BMI 18.5 - 24.9)
            const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
            const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);
            setIdealRange({
                min: Math.round(minIdealWeight * 10) / 10,
                max: Math.round(maxIdealWeight * 10) / 10
            });

            // 2. Calculate Weight Difference
            const currentWeight = Number(weight);
            if (roundedBmi < 18.5) {
                // Underweight -> Needs to gain to reach minIdeal
                setWeightDifference({ amount: Math.round((minIdealWeight - currentWeight) * 10) / 10, type: 'gain' });
            } else if (roundedBmi > 24.9) {
                // Overweight -> Needs to lose to reach maxIdeal
                setWeightDifference({ amount: Math.round((currentWeight - maxIdealWeight) * 10) / 10, type: 'lose' });
            } else {
                setWeightDifference({ amount: 0, type: 'maintain' });
            }
        }
    };

    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-200', bgSoft: 'bg-blue-50' };
        if (bmi < 25) return { label: 'Normal Weight', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-200', bgSoft: 'bg-green-50' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-200', bgSoft: 'bg-yellow-50' };
        return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-200', bgSoft: 'bg-red-50' };
    };

    const category = bmi ? getBmiCategory(bmi) : null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Advanced Body Analysis</span>
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Get precision insights into your ideal weight and health goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-panel p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <Activity className="text-primary-600" />
                            Your Details
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setGender('male')}
                                    className={`p-4 rounded-xl border-2 transition-all ${gender === 'male'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => setGender('female')}
                                    className={`p-4 rounded-xl border-2 transition-all ${gender === 'female'
                                        ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                                        : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                >
                                    Female
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-100 outline-none"
                                    placeholder="25"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-100 outline-none"
                                        placeholder="175"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
                                        className="w-full p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-100 outline-none"
                                        placeholder="70"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={calculateBmi}
                                className="w-full py-4 mt-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all active:scale-95"
                            >
                                Analyze Now
                            </button>
                        </div>
                    </motion.div>

                    {/* Result Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                        {bmi ? (
                            <div className="w-full">
                                <div className="mb-8">
                                    <h3 className="text-slate-500 font-medium mb-2 uppercase tracking-widest text-xs">Your Health Score</h3>
                                    <div className="text-7xl font-black text-slate-800 tracking-tighter">
                                        {bmi}
                                    </div>
                                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mt-2 ${category?.bgSoft} ${category?.color}`}>
                                        {category?.label}
                                    </div>
                                </div>

                                {/* Ideal Weight Range Card */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex items-center justify-center gap-2 mb-1 text-slate-500 text-xs font-bold uppercase">
                                            <Target size={14} /> Ideal Range
                                        </div>
                                        <div className="text-xl font-bold text-slate-800">
                                            {idealRange?.min} - {idealRange?.max} <span className="text-sm font-normal text-slate-500">kg</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-2xl border ${category?.border} ${category?.bgSoft}`}>
                                        <div className={`flex items-center justify-center gap-2 mb-1 text-xs font-bold uppercase ${category?.color}`}>
                                            {weightDifference?.type === 'lose' ? <TrendingDown size={14} /> :
                                                weightDifference?.type === 'gain' ? <TrendingUp size={14} /> : <CheckCircle size={14} />}
                                            {weightDifference?.type === 'maintain' ? 'Status' : 'Goal'}
                                        </div>
                                        <div className={`text-xl font-bold ${category?.color}`}>
                                            {weightDifference?.type === 'maintain'
                                                ? 'Perfect!'
                                                : <span>{weightDifference?.amount} <span className="text-sm font-normal opacity-80">kg to {weightDifference?.type}</span></span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Gauge Bar */}
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full ${category?.bg}`}
                                    />
                                    {/* Markers */}
                                    <div className="absolute top-0 bottom-0 left-[46%] w-0.5 bg-white mix-blend-overlay opacity-50"></div>
                                    <div className="absolute top-0 bottom-0 left-[62%] w-0.5 bg-white mix-blend-overlay opacity-50"></div>
                                </div>
                                <div className="flex justify-between w-full text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-8">
                                    <span>Under</span>
                                    <span>Normal</span>
                                    <span>Over</span>
                                    <span>Obese</span>
                                </div>

                                {/* AI Recommendation Box */}
                                <div className="p-5 bg-gradient-to-br from-indigo-50 to-white rounded-2xl text-left border border-indigo-100 shadow-sm relative">
                                    <div className="absolute top-0 right-0 p-3 opacity-5">
                                        <Info size={48} />
                                    </div>
                                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                        <Info size={16} className="text-indigo-500" />
                                        Health Insight
                                    </h4>
                                    <p className="text-sm text-indigo-800/80 leading-relaxed">
                                        {weightDifference?.type === 'lose'
                                            ? `To reach a healthy weight of ${idealRange?.max}kg, consider a calorie deficit and increasing cardio activity from our Workout Planner.`
                                            : weightDifference?.type === 'gain'
                                                ? `To reach a healthy weight of ${idealRange?.min}kg, focus on protein-rich foods and strength training exercises.`
                                                : "You are in the optimal weight range! Focus on maintenance and holistic fitness."
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-400 py-12">
                                <Activity size={64} className="mx-auto mb-6 opacity-20" />
                                <h3 className="text-lg font-bold text-slate-500 mb-2">Ready to Analyze?</h3>
                                <p className="text-sm opacity-70 max-w-[200px] mx-auto">Enter your height and weight to get a comprehensive health report.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
