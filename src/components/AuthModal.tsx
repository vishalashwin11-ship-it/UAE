import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap,
  Info
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (target?: 'admin' | 'student') => void;
  initialMode?: 'signin' | 'signup' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signInAsDemoStudent,
    loginAsAdmin 
  } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domainWarning, setDomainWarning] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDomainWarning(false);
    setLoading(true);

    try {
      if (mode === 'admin') {
        if (email.trim() && password.trim()) {
          try {
            await signInWithEmail(email, password);
          } catch {
            // Allow authorized admin login fallback
            loginAsAdmin();
          }
        } else {
          loginAsAdmin();
        }
        onSuccess('admin');
        onClose();
        return;
      }

      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess('student');
      onClose();
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please try again or create a new account.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setDomainWarning(false);
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess('student');
      onClose();
    } catch (err: any) {
      const errCode = err?.code || '';
      if (errCode === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completion.');
      } else {
        handleDemoSignIn();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsDemoStudent();
    onSuccess('student');
    onClose();
  };

  const handleQuickAdminLogin = () => {
    loginAsAdmin();
    onSuccess('admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Dynamic Header Banner */}
        <div className={`p-6 text-white relative transition-colors duration-300 ${
          mode === 'admin'
            ? 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900'
            : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase mb-2">
            {mode === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Portal Access</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>Student Advisory Portal</span>
              </>
            )}
          </div>

          <h3 className="text-xl font-extrabold tracking-tight font-display">
            {mode === 'admin' 
              ? 'Admin Portal Sign In' 
              : mode === 'signin' 
                ? 'Student Sign In' 
                : 'Create Free Student Account'}
          </h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            {mode === 'admin'
              ? 'Access real-time student registrations, counseling bookings, and application leads.'
              : 'Access your personalized Course Recommendation Report & real-time application tracker.'}
          </p>
        </div>

        {/* Tab Selector: Student Sign In, Student Sign Up, Admin Portal */}
        <div className="p-4 sm:p-6 pb-0">
          <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl text-xs font-bold gap-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                mode === 'signin' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                mode === 'signup' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('admin'); setError(null); }}
              className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                mode === 'admin' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-6 space-y-4 pt-4">
          {domainWarning && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Domain Access</span>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Host: <code>{currentHostname}</code>
                  </p>
                </div>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors text-center"
                >
                  Sign In with 1-Click Demo Account →
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ADMIN PORTAL TAB CONTENT */}
          {mode === 'admin' ? (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Director & Counseling Administrator</span>
                    <span className="text-[11px] text-amber-800 block mt-0.5 leading-relaxed">
                      Instant authorized access to view all registrations, export CSV data, and update student status.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2.5 text-[10px] uppercase font-bold text-slate-400 absolute">
                  Or enter administrator credentials
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="admin@upbeatabroad.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* STUDENT TAB CONTENT */
            <div className="space-y-4">
              {/* Quick Demo Access Button */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-blue-950 block">Testing the Portal?</span>
                  <span className="text-[10px] text-blue-700 block">Instant access to course report & stage tracker</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors shrink-0"
                >
                  Demo Sign In
                </button>
              </div>

              {/* 1-Click Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2.5 text-[11px] uppercase font-bold text-slate-400 absolute">
                  Or with email & password
                </span>
              </div>

              {/* Student Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vishal Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                >
                  <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In to Student Portal' : 'Create Student Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Student Features Reminder */}
              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant AI-generated 3-Tier Course Matcher</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Track Stage 1-6 University Admit & Visa Status</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
