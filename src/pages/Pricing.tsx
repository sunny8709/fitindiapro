import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
    const navigate = useNavigate();

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-orange-600 font-semibold tracking-wide uppercase text-sm">Monetization Ready</h2>
                    <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Choose Your Fitness Journey</h1>
                    <p className="text-xl text-gray-600">
                        Start for free, upgrade for advanced Indian diet analytics and AI-powered workout plans.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                        <p className="text-gray-500 mt-2">Essential tools for beginners.</p>
                        <div className="my-6">
                            <span className="text-5xl font-bold text-gray-900">₹0</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="Basic Diet Logging" />
                            <FeatureItem text="Standard Workout Library" />
                            <FeatureItem text="Community Access" />
                        </ul>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full py-3 px-6 rounded-xl border-2 border-orange-100 text-orange-600 font-bold hover:bg-orange-50 transition"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            POPULAR
                        </div>
                        <h3 className="text-2xl font-bold">Pro</h3>
                        <p className="text-gray-400 mt-2">For serious fitness enthusiasts.</p>
                        <div className="my-6">
                            <span className="text-5xl font-bold">₹499</span>
                            <span className="text-gray-400">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <FeatureItem text="AI Diet Recommendations" light />
                            <FeatureItem text="Advanced Progress Analytics" light />
                            <FeatureItem text="Custom Workout Plans" light />
                            <FeatureItem text="Priority Support" light />
                        </ul>
                        <button
                            onClick={() => {
                                const confirm = window.confirm("Proceeding to Checkout...\n(Real integration would happen here)");
                                if (confirm) {
                                    navigate('/payment-success');
                                }
                            }}
                            className="w-full py-3 px-6 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-900/50"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text, light = false }: { text: string; light?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${light ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                <Check className="h-4 w-4" />
            </div>
            <span className={light ? 'text-gray-300' : 'text-gray-600'}>{text}</span>
        </div>
    );
}
