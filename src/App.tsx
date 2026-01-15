import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import DietPlanner from '@/pages/DietPlanner';
import WorkoutPlanner from '@/pages/WorkoutPlanner';
import Profile from '@/pages/Profile';
import Pricing from '@/pages/Pricing';
import PaymentSuccess from '@/pages/PaymentSuccess';
import BmiCalculator from '@/pages/BmiCalculator';
import OneOnOne from '@/pages/OneOnOne';
import AiAssistant from '@/components/AiAssistant';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white pt-24">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diet-planner" element={<DietPlanner />} />
            <Route path="/workout-planner" element={<WorkoutPlanner />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/one-on-one" element={<OneOnOne />} />
          </Routes>
          <AiAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
