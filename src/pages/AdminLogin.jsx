import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Shield, AlertCircle } from 'lucide-react';

// Shared animation styles
const customStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

const InputField = ({ label, icon: Icon, type = "text", placeholder, isPassword = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 group mb-6">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-[#0b1f3b] transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#facc15] transition-colors duration-300">
          <Icon size={20} strokeWidth={2} />
        </div>
        <input
          type={inputType}
          className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0b1f3b] transition-all duration-300 hover:border-blue-300"
          placeholder={placeholder}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0b1f3b] transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const BASE_URL = import.meta.env.VITE_API_BASE;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
      navigate('/');

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans">
      <style>{customStyles}</style>

      <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[600px] opacity-0 animate-fade-in-up">

        {/* LEFT SIDE: Brand Panel 
            UPDATED: Added 'hidden md:flex' 
            - 'hidden': Hides this block by default (mobile)
            - 'md:flex': Shows it as a flex container on medium screens and larger (desktop)
        */}
        <div className="hidden md:flex md:w-1/2 bg-[#0b1f3b] relative overflow-hidden flex-col justify-between p-12 text-white">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#facc15]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Shield size={24} className="text-[#facc15]" />
              </div>
              <span className="font-bold tracking-wider text-sm opacity-80">SECURE ACCESS</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mt-6 leading-tight">
              GoPass <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-amber-200">Admin Portal</span>
            </h1>
            <p className="mt-6 text-blue-100/80 text-lg leading-relaxed max-w-sm">
              Manage campus security, track visitor logs, and oversee event ticketing from one central command center.
            </p>
          </div>

          <div className="relative z-10 mt-12 animate-float">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">System Status</p>
                  <p className="text-xs text-emerald-400">All Systems Operational</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-blue-200/50 mt-8">
            © 2024 GoPass Security Systems. v1.0.2
          </div>
        </div>

        {/* RIGHT SIDE: Login Form 
            UPDATED: Added 'w-full'
            - 'w-full': Takes 100% width on mobile (since left side is hidden)
            - 'md:w-1/2': Returns to 50% width on desktop
        */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[#0b1f3b]">Welcome Back</h2>
              <p className="text-slate-500 mt-2">Please enter your credentials to access the dashboard.</p>
            </div>

            <form onSubmit={handleLogin}>

              {/* Error Message Display */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-fade-in-up">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <InputField
                label="Email Address"
                icon={Mail}
                placeholder="admin@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <InputField
                label="Password"
                icon={Lock}
                isPassword={true}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0b1f3b] focus:ring-[#0b1f3b] cursor-pointer" />
                  <span className="ml-2 text-sm text-slate-500 font-medium group-hover:text-[#0b1f3b] transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-[#0b1f3b] hover:text-blue-600 transition-colors">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative px-6 py-4 bg-[#0b1f3b] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}

                {/* Shine Effect */}
                {!isLoading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm">
                Need help accessing your account? <br />
                <a href="#" className="font-bold text-[#0b1f3b] hover:underline">Contact IT Support</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;