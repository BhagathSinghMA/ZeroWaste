import React from 'react';
import { Utensils, ArrowRight, Heart, Globe, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing({ onLogin, onSignup }: { onLogin: () => void, onSignup: () => void }) {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-emerald-600">
            <Utensils size={28} />
            <span>ZeroWaste</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onSignup}
              className="px-6 py-2.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-all text-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                <Globe size={16} />
                <span>AI-Powered Food Redistribution</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight">
                Reduce Waste. <br />
                <span className="text-emerald-600">Feed the World.</span>
              </h1>
              <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
                ZeroWaste uses advanced AI to predict food surplus and connects donors with volunteers and NGOs to ensure no meal goes to waste.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onSignup}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-emerald-200"
                >
                  Start Donating
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onLogin}
                  className="px-8 py-4 rounded-2xl border border-zinc-200 text-zinc-900 font-bold text-lg hover:bg-zinc-50 transition-all"
                >
                  Login to Dashboard
                </button>
              </div>
              {/* <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      className="w-10 h-10 rounded-full border-2 border-white"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-sm text-zinc-500">
                  <span className="font-bold text-zinc-900">500+</span> active donors this week
                </div>
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">Built for Impact</h2>
            <p className="text-lg text-zinc-500">Our platform bridges the gap between surplus and scarcity with technology.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Smart Prediction',
                desc: 'Our AI analyzes historical data to predict food waste before it happens, helping businesses optimize preparation.'
              },
              {
                icon: Users,
                title: 'Community Network',
                desc: 'Connect with a vast network of volunteers and NGOs ready to pick up and deliver surplus food instantly.'
              },
              {
                icon: ShieldCheck,
                title: 'Safe & Verified',
                desc: 'Every donor and recipient is verified to ensure food safety standards and accountability throughout the process.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <Utensils size={24} />
            <span>ZeroWaste</span>
          </div>
          {/* <div className="flex gap-8 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600">Contact Us</a>
          </div> */}
          {/* <div className="text-sm text-zinc-400">
            © 2026 ZeroWaste Platform
          </div> */}
        </div>
      </footer>
    </div>
  );
}
