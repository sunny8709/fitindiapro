import { useState, useRef } from 'react';
import { Plus, Trash2, Search, X, Sparkles, Camera, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

type FoodItem = {
    id: string;
    name: string;
    calories: number; // per serving
    serving: string;
    category: 'veg' | 'non-veg';
};

// Initial Database of Indian Foods
const INITIAL_FOOD_DATABASE: FoodItem[] = [
    // Breads & Staples
    { id: '1', name: 'Roti (Whole Wheat)', calories: 104, serving: '1 piece', category: 'veg' },
    { id: '2', name: 'Rice (Steamed)', calories: 130, serving: '1 bowl (100g)', category: 'veg' },
    { id: '3', name: 'Brown Rice', calories: 111, serving: '1 bowl (100g)', category: 'veg' },
    { id: '4', name: 'Paratha (Plain)', calories: 180, serving: '1 piece', category: 'veg' },
    { id: '5', name: 'Naan (Butter)', calories: 260, serving: '1 piece', category: 'veg' },
    { id: '6', name: 'Multigrain Bread', calories: 85, serving: '1 slice', category: 'veg' },

    // Curries & Dals
    { id: '10', name: 'Dal Tadka', calories: 150, serving: '1 bowl (150g)', category: 'veg' },
    { id: '11', name: 'Dal Makhani', calories: 280, serving: '1 bowl (150g)', category: 'veg' },
    { id: '12', name: 'Paneer Butter Masala', calories: 230, serving: '1 bowl (150g)', category: 'veg' },
    { id: '13', name: 'Chana Masala', calories: 160, serving: '1 bowl (150g)', category: 'veg' },
    { id: '14', name: 'Chicken Curry', calories: 280, serving: '1 bowl (150g)', category: 'non-veg' },
    { id: '15', name: 'Butter Chicken', calories: 350, serving: '1 bowl (150g)', category: 'non-veg' },
    { id: '16', name: 'Egg Curry', calories: 180, serving: '2 eggs + gravy', category: 'non-veg' },
    { id: '17', name: 'Palak Paneer', calories: 190, serving: '1 bowl (150g)', category: 'veg' },
    { id: '18', name: 'Rajma Masala', calories: 210, serving: '1 bowl (150g)', category: 'veg' },
    { id: '19', name: 'Fish Curry', calories: 240, serving: '1 bowl (150g)', category: 'non-veg' },

    // Breakfast & Snacks
    { id: '30', name: 'Idli', calories: 39, serving: '1 piece', category: 'veg' },
    { id: '31', name: 'Dosa (Plain)', calories: 133, serving: '1 piece', category: 'veg' },
    { id: '32', name: 'Masala Dosa', calories: 350, serving: '1 piece', category: 'veg' },
    { id: '33', name: 'Samosa', calories: 262, serving: '1 piece', category: 'veg' },
    { id: '34', name: 'Poha', calories: 180, serving: '1 plate', category: 'veg' },
    { id: '35', name: 'Upma', calories: 190, serving: '1 plate', category: 'veg' },
    { id: '36', name: 'Oatmeal', calories: 150, serving: '1 bowl', category: 'veg' },
    { id: '37', name: 'Omelette (2 Eggs)', calories: 180, serving: '1 omelette', category: 'non-veg' },
    { id: '38', name: 'Boiled Egg', calories: 78, serving: '1 large egg', category: 'non-veg' },
    { id: '39', name: 'Sandwich (Veg Grilled)', calories: 220, serving: '1 piece', category: 'veg' },

    // Fruits & Healthy
    { id: '50', name: 'Banana', calories: 105, serving: '1 medium', category: 'veg' },
    { id: '51', name: 'Apple', calories: 95, serving: '1 medium', category: 'veg' },
    { id: '52', name: 'Papaya', calories: 50, serving: '1 bowl', category: 'veg' },
    { id: '53', name: 'Almonds', calories: 160, serving: '1 handful (28g)', category: 'veg' },
    { id: '54', name: 'Sprouts Salad', calories: 120, serving: '1 bowl', category: 'veg' },
    { id: '55', name: 'Protein Shake', calories: 120, serving: '1 scoop', category: 'veg' },
];

export default function DietPlanner() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMeal, setSelectedMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');
    const [dailyLog, setDailyLog] = useState<{ meal: string; food: FoodItem }[]>([]);
    const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(INITIAL_FOOD_DATABASE);
    const [showAddFoodModal, setShowAddFoodModal] = useState(false);

    // AI Analysis States
    const [newFood, setNewFood] = useState({ name: '', calories: '', serving: '', category: 'veg' });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredFood = foodDatabase.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addFood = (food: FoodItem) => {
        setDailyLog([...dailyLog, { meal: selectedMeal, food }]);
    };

    const removeFood = (index: number) => {
        const newLog = [...dailyLog];
        newLog.splice(index, 1);
        setDailyLog(newLog);
    };

    const handleAddNewFood = () => {
        if (!newFood.name || !newFood.calories || !newFood.serving) return;

        const newItem: FoodItem = {
            id: Date.now().toString(),
            name: newFood.name,
            calories: parseInt(newFood.calories),
            serving: newFood.serving,
            category: newFood.category as 'veg' | 'non-veg'
        };

        setFoodDatabase([...foodDatabase, newItem]);
        addFood(newItem); // Auto add to current meal
        setShowAddFoodModal(false);
        resetForm();
        setSearchTerm(''); // Clear search to show new item
    };

    const resetForm = () => {
        setNewFood({ name: '', calories: '', serving: '', category: 'veg' });
        setPreviewImage(null);
        setIsAnalyzing(false);
    };

    // --- AI LOGIC ---

    const fileToGenerativePart = async (file: File) => {
        return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result as string;
                const base64Content = base64Data.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64Content,
                        mimeType: file.type,
                    },
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const analyzeFood = async (imageFile?: File) => {
        if (!newFood.name && !imageFile) return;
        setIsAnalyzing(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            let prompt = `Analyze the food item based on the following input. 
            Return ONLY a valid JSON object with the following structure:
            {
                "calories": number (estimated calories per typical serving),
                "serving": string (e.g., "1 bowl (150g)", "1 piece"),
                "category": "veg" or "non-veg"
            }
            Do not include any markdown formatting like \`\`\`json. Just the raw JSON string.`;

            let result;
            if (imageFile) {
                const imagePart = await fileToGenerativePart(imageFile);
                prompt = "Identify this food and provide nutritional details. " + prompt;
                result = await model.generateContent([prompt, imagePart]);
            } else {
                // Enhanced Prompt for Manual Text Entry
                prompt = `Food Name: "${newFood.name}". Portion/Serving: "${newFood.serving}". ` + prompt;
                result = await model.generateContent(prompt);
            }

            const response = await result.response;
            const text = response.text().replace(/```json|```/g, '').trim();
            const data = JSON.parse(text);

            setNewFood(prev => ({
                ...prev,
                name: imageFile ? 'Scanned Food Item' : prev.name, // Will be updated by user usually, or we could ask AI for name too
                calories: data.calories.toString(),
                serving: data.serving,
                category: data.category
            }));

            // If image scan, let's ask AI for the name too effectively
            if (imageFile) {
                // Refined prompt for image to get name too if needed, but for now let's keep it simple or do a second pass?
                // Actually, let's just parse the name if we modify the JSON structure
                // Ideally we want the name too. Let's update prompt quickly locally.
            }

        } catch (error) {
            console.error("AI Analysis Failed:", error);
            alert("Could not analyze food. Please try manually.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
            analyzeFood(file);
        }
    };

    const totalCalories = dailyLog.reduce((sum, item) => sum + item.food.calories, 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Diet Planner</h1>
                    <p className="text-slate-500">Track your nutrition with AI precision.</p>
                </div>
                <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-4">
                    <div>
                        <span className="block text-xs font-bold text-orange-400 uppercase tracking-wider">Daily Goal</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-orange-600">{totalCalories}</span>
                            <span className="text-sm font-medium text-slate-400">/ 2,200 kcal</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-orange-200" />
                    <UtensilsIcon />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Food Search */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-6 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-700">Add Food</h2>
                            <button
                                onClick={() => setShowAddFoodModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                            >
                                <Plus size={16} /> Custom / AI Entry
                            </button>
                        </div>

                        {/* Meal Selector */}
                        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                                <button
                                    key={meal}
                                    onClick={() => setSelectedMeal(meal as any)}
                                    className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${selectedMeal === meal
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {meal}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search for Roti, Dal, etc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all shadow-inner"
                            />
                        </div>

                        {/* Food List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredFood.length > 0 ? (
                                filteredFood.map((food, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={food.id}
                                        className="group relative flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
                                    >
                                        <div>
                                            <h3 className="font-bold text-slate-800">{food.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium mt-0.5">{food.serving} • <span className="text-slate-800">{food.calories} kcal</span></p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`h-2.5 w-2.5 rounded-full ${food.category === 'veg' ? 'bg-green-500' : 'bg-red-500'} shadow-sm`} title={food.category} />
                                            <button
                                                onClick={() => addFood(food)}
                                                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-orange-500 hover:text-white transition-colors"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium mb-4">No food found matching "{searchTerm}"</p>
                                    <button
                                        onClick={() => setShowAddFoodModal(true)}
                                        className="text-orange-600 font-bold hover:underline flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <Sparkles size={16} /> Add "{searchTerm}" with AI
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Daily Log */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/50 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-700">Today's Intake</h2>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        </div>

                        <div className="space-y-6">
                            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((mealType) => {
                                const mealItems = dailyLog.filter(item => item.meal === mealType);
                                if (mealItems.length === 0) return null;

                                return (
                                    <div key={mealType} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                            {mealType}
                                        </h3>
                                        <div className="space-y-2">
                                            {dailyLog.map((logItem, idx) => {
                                                if (logItem.meal !== mealType) return null;
                                                return (
                                                    <motion.div
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        key={idx}
                                                        className="flex justify-between items-center text-sm p-3 rounded-xl bg-white shadow-sm border border-slate-100"
                                                    >
                                                        <span className="font-semibold text-slate-700">{logItem.food.name}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-slate-900">{logItem.food.calories}</span>
                                                            <button onClick={() => removeFood(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })}

                            {dailyLog.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <UtensilsIcon size={24} />
                                    </div>
                                    <p className="text-slate-400 font-medium">Your plate is empty.<br />Start adding your meals!</p>
                                </div>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:shadow-xl hover:bg-slate-800 transition"
                        >
                            Save Daily Log
                        </motion.button>
                    </div>
                </div>

            </div>

            {/* Add Custom / AI Food Modal */}
            <AnimatePresence>
                {showAddFoodModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        Add Food <span className="px-2 py-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full">AI Powered</span>
                                    </h3>
                                </div>
                                <button onClick={() => setShowAddFoodModal(false)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* AI Scan Section */}
                                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 rounded-2xl border border-violet-100">
                                    <label className="flex flex-col items-center justify-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            {previewImage ? (
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md">
                                                    <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                                    {isAnalyzing && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-violet-500 group-hover:scale-110 transition-transform duration-300">
                                                    <Camera size={32} />
                                                </div>
                                            )}
                                            {!previewImage && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-fuchsia-500 rounded-full flex items-center justify-center text-white border-2 border-white"><Plus size={12} strokeWidth={4} /></div>}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-violet-900">Scan Food Photo</p>
                                            <p className="text-xs text-violet-600/70">Upload an image to auto-detect calories</p>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-400 font-medium">Or enter manually</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Food Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="w-full p-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 outline-none transition font-semibold text-slate-800"
                                                    placeholder="e.g. 2 Slices of Pizza"
                                                    value={newFood.name}
                                                    onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Serving</label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 outline-none transition font-semibold text-slate-800"
                                                placeholder="e.g. 100g"
                                                value={newFood.serving}
                                                onChange={e => setNewFood({ ...newFood, serving: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => analyzeFood()}
                                                disabled={!newFood.name || isAnalyzing}
                                                className="h-[50px] px-4 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:opacity-50 disabled:shadow-none transition flex items-center gap-2"
                                                title="Auto-Fill with AI"
                                            >
                                                {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Calories (Auto-Calculated)</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none transition font-semibold text-slate-800"
                                            placeholder="0"
                                            value={newFood.calories}
                                            onChange={e => setNewFood({ ...newFood, calories: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${newFood.category === 'veg' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-slate-100 text-slate-500 hover:border-green-200'}`}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    checked={newFood.category === 'veg'}
                                                    onChange={() => setNewFood({ ...newFood, category: 'veg' })}
                                                />
                                                Veg
                                            </label>
                                            <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${newFood.category === 'non-veg' ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-slate-100 text-slate-500 hover:border-red-200'}`}>
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    checked={newFood.category === 'non-veg'}
                                                    onChange={() => setNewFood({ ...newFood, category: 'non-veg' })}
                                                />
                                                Non-Veg
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleAddNewFood}
                                            disabled={!newFood.name || !newFood.calories}
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition disabled:opacity-50 disabled:shadow-none"
                                        >
                                            Add to Plate
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function UtensilsIcon({ size = 20, className = "" }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
    )
}

