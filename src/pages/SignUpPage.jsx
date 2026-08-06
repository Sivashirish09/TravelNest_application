import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Database,
  Loader2
} from 'lucide-react';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, register, currentUser } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [travelStyle, setTravelStyle] = useState('Moderate & Balanced');
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  // AUTOMATIC REDIRECT: If user is already logged in, skip signup and open Home directly
  useEffect(() => {
    if (currentUser) {
      navigate('/home', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // 1. Strict Validation
    if (!trimmedName) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!trimmedEmail) {
      showToast('Please enter your email address', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email address format', 'error');
      return;
    }
    if (!password) {
      showToast('Please create a password', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please re-enter confirm password', 'error');
      return;
    }
    if (!terms) {
      showToast('Please accept the Terms of Service & Privacy Policy', 'error');
      return;
    }

    try {
      setLoading(true);
      const doRegister = signup || register;
      await doRegister(trimmedEmail, password, trimmedName, phone.trim(), travelStyle);
      showToast('✓ Account created successfully! Welcome to TravelNest.', 'success');
      navigate('/home', { replace: true });
    } catch (err) {
      showToast(err.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden glass-card border border-slate-200 bg-white shadow-2xl">
        {/* Left Column: High-Res Travel Photograph & Branding Banner */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 text-white overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"
            alt="Andaman Beach Travel"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold font-heading tracking-tight text-white">Travel<span className="text-blue-400">Nest</span></span>
              <span className="block text-[10px] text-slate-300 font-medium">Smart AI Trip Platform</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-4">
            <span className="badge badge-purple bg-white/20 backdrop-blur-md text-white border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              Join Verified Explorer Community
            </span>

            <h2 className="text-2xl font-bold font-heading leading-snug">
              "Create your account to save custom itineraries, manage hotel bookings, and earn Gold Explorer rewards."
            </h2>

            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Access to 80+ India & International Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Firebase Booking Sync & E-Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Connected to Live Firestore Collections (`users`, `loginHistory`)</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/20 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secured with Supabase Authentication</span>
            </div>
            <span className="text-emerald-300 font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
              ● Database Active
            </span>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center space-y-4">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 lg:hidden mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold font-heading text-slate-900">TravelNest</span>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Create Account</h1>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Database Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">Sign up to unlock personalized AI trip schedules and real-time sync</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold mb-1.5 block">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="form-control text-xs pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-0">
              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1.5 block">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="form-control text-xs pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1.5 block">Phone (Optional)</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="form-control text-xs pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-0">
              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1.5 block">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control text-xs pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1.5 block">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-control text-xs pl-10"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="text-slate-700 font-semibold mb-1.5 block">Preferred Travel Style</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="form-control text-xs"
                disabled={loading}
              >
                <option value="Moderate & Balanced">Moderate & Balanced</option>
                <option value="Luxury & Relaxation">Luxury & Relaxation</option>
                <option value="Budget Explorer">Budget Explorer</option>
                <option value="Fast-Paced Adventure">Fast-Paced Adventure</option>
                <option value="Heritage & Spiritual">Heritage & Spiritual</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-[11px] pt-1">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="accent-blue-600 w-3.5 h-3.5"
                required
              />
              <span>I agree to TravelNest Terms of Service & Privacy Policy</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-2.5 text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Start Exploring</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
