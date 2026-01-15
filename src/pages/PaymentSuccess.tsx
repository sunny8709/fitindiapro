import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const { user } = useAuth(); // In a real app, we would verify the session/upgrade here.

    useEffect(() => {
        // Simulate upgrading the user in the background
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-6">
                    Welcome to FitIndia Pro, {user?.user_metadata?.full_name || 'Champion'}!
                </p>
                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-orange-800 font-medium">
                        Your "Pro" features have been unlocked.
                    </p>
                </div>
                <p className="text-sm text-gray-400">Redirecting you to dashboard...</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-6 w-full py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Go to Dashboard Now
                </button>
            </div>
        </div>
    );
}
