import React, { useState } from 'react';
import { useAuthStore } from './store';
import { Utensils, Mail, Lock, User as UserIcon, ArrowRight, Heart, Shield, Zap, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth({ initialMode, onBack }: { initialMode: 'login' | 'signup', onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Donor'
  });
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        if (isLogin) {
          setUser(data.user);
        } else {
          setIsLogin(true);
          alert('Account created! Please login.');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowRight className="rotate-180" size={24} />
      </button>
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 border border-black/5">
        
        {/* Left Side: Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-emerald-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-bold text-2xl mb-12">
              <Utensils size={32} />
              <span>ZeroWaste</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Join the movement to <br />
              <span className="text-emerald-200">end food waste.</span>
            </h1>
            <p className="text-emerald-50/80 text-lg mb-12 max-w-md">
              Our AI-powered platform helps you predict surplus and redistribute it to those who need it most.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Heart, text: 'Donate surplus food easily' },
                { icon: Shield, text: 'Verified NGO partnerships' },
                { icon: Zap, text: 'Real-time delivery tracking' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <item.icon size={20} />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* <div className="relative z-10 text-sm text-emerald-100/60">
            © 2026 ZeroWaste Platform. All rights reserved.
          </div> */}
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-zinc-900 mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-zinc-500">
                {isLogin ? 'Enter your details to access your dashboard' : 'Fill in the information to get started'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-zinc-700">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    required
                    type="email" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    required
                    type="password" 
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">Role</label>
                  <select 
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Donor">Donor (Individual/Restaurant)</option>
                    <option value="Volunteer">Volunteer (Delivery Partner)</option>
                    <option value="NGO">NGO (Redistribution Center)</option>
                  </select>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-zinc-900 text-white py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-zinc-500 hover:text-emerald-600 font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
