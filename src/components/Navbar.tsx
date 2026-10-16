import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Globe2, 
  Menu, 
  X, 
  MessageSquare, 
  Calendar, 
  ChevronDown,
  Sparkles,
  User,
  GraduationCap,
  LogOut,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiChat: () => void;
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenFreeSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiChat,
  onOpenBooking,
  onOpenWhatsApp,
  onOpenAuth,
  onOpenFreeSession,
}) => {
  const { user, profile, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'destinations', label: 'Destinations' },
    { id: 'careers', label: 'Top Careers' },
    { id: 'services', label: 'Services' },
    { id: 'success', label: 'Success Stories' },
    { id: 'blogs', label: 'Blog & Guides' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
                    Upbeat
                  </span>
                  <span className="text-xs uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                    Abroad
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                  Education Advisory
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === 'home'
                    ? 'text-blue-600 bg-blue-50/70 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'text-blue-600 bg-blue-50/70 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-2">
              {/* WhatsApp Quick Connect */}
              <button
                onClick={onOpenWhatsApp}
                title="Direct WhatsApp with Senior Counselor"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>WhatsApp</span>
              </button>

              {/* AI Chat Counselor */}
              <button
                onClick={onOpenAiChat}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Counselor</span>
              </button>

              {/* Book Counselling CTA */}
              <button
                onClick={onOpenBooking}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Session</span>
              </button>

              {/* User Auth Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                      {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">
                      {profile?.displayName || 'My Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {profile?.displayName || 'Student'}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {user.email}
                        </span>
                        {isAdmin && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase mt-1">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('admin');
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 rounded-xl transition-colors flex items-center gap-2 mt-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Admin Dashboard (Registrations)</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('portal');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Course Report & Process</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuth('signin')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/90 rounded-lg transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>Student Sign In</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {user ? (
                <button
                  onClick={() => handleNavClick('portal')}
                  className="p-1.5 text-blue-600 bg-blue-50 rounded-lg"
                  title="My Portal"
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top duration-200">
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  activeTab === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                Home
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Show Portal links only if user is logged in */}
              {user && (
                <button
                  onClick={() => {
                    handleNavClick('portal');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
                    activeTab === 'portal' ? 'bg-indigo-50 text-indigo-700' : 'text-indigo-600'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Portal (Course Report & Process)</span>
                </button>
              )}

              {user && isAdmin && (
                <button
                  onClick={() => {
                    handleNavClick('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
                    activeTab === 'admin' ? 'bg-amber-100 text-amber-900' : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Dashboard (Registrations)</span>
                </button>
              )}
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                Book Counselling Session
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWhatsApp();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  WhatsApp Us
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAiChat();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Counselor
                </button>
              </div>

              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signin');
                  }}
                  className="w-full py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
