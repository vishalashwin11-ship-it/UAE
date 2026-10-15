import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Globe2, 
  Star,
  DollarSign
} from 'lucide-react';

interface HeroSectionProps {
  onExploreDestinations: (destId?: string) => void;
  onExploreCareers: (domain?: string) => void;
  onOpenBooking: () => void;
  onOpenAiChat: () => void;
  onOpenFreeSession?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDestinations,
  onExploreCareers,
  onOpenBooking,
  onOpenAiChat,
  onOpenFreeSession,
}) => {
  const [selectedDegree, setSelectedDegree] = useState('masters');
  const [selectedField, setSelectedField] = useState('Tech & AI');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const handleQuickMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry !== 'all') {
      onExploreDestinations(selectedCountry);
    } else {
      onExploreCareers(selectedField);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl overflow-hidden -z-10">
        <div className="absolute -top-24 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -top-20 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-20 left-1/3 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-xs mb-6 text-xs sm:text-sm font-semibold text-slate-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-blue-700 font-bold">Fall 2026 Admissions Open</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">98.6% Visa Success Rate</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-emerald-700 font-bold">$24M+ Scholarships Secured</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-display">
            Navigate Your Journey to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Top Global Universities
            </span>{' '}
            & High-ROI Careers
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Inspired by world-class counseling standards. Upbeat Abroad Education merges bespoke senior mentorship, data-driven university shortlisting, and high-demand career pathways across 10+ countries.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenFreeSession || onOpenBooking}
              className="px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Book Free 1-on-1 Counselling</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAiChat}
              className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
              <span>Ask Upbeat AI Advisor</span>
            </button>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Service Fee for Select Partner Hubs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ivy League & Russell Group Alumni Mentors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>End-to-End Visa & Financial Support</span>
            </div>
          </div>
        </div>

        {/* Interactive Quick Degree & Country Explorer Card */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-5 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Search className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Find Your Best-Fit Destination & Career Blueprint
              </h2>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Instant Profile Matcher
            </span>
          </div>

          <form onSubmit={handleQuickMatch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target Degree
              </label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium cursor-pointer"
              >
                <option value="masters">Master’s / MS / MSc Degree</option>
                <option value="bachelors">Bachelor’s / Undergraduate</option>
                <option value="mba">MBA & Executive Management</option>
                <option value="phd">PhD / Research Doctorate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Field of Interest
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium cursor-pointer"
              >
                <option value="Tech & AI">Tech, AI & Computer Science</option>
                <option value="Finance & Business">Finance, Fintech & Analytics</option>
                <option value="Engineering & Clean Tech">Engineering & Clean Tech</option>
                <option value="Healthcare & Life Sciences">Healthcare & Biotechnology</option>
                <option value="Supply Chain & Analytics">Supply Chain & Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Preferred Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium cursor-pointer"
              >
                <option value="all">Compare All Top Destinations</option>
                <option value="usa">United States (STEM OPT 3 Yrs)</option>
                <option value="germany">Germany (Zero/Low Tuition)</option>
                <option value="uk">United Kingdom (1-Yr Fast Track)</option>
                <option value="canada">Canada (PGWP & PR Pathway)</option>
                <option value="australia">Australia (High Wages & Go8)</option>
                <option value="ireland">Ireland (Silicon Valley of Europe)</option>
                <option value="uae">United Arab Emirates (Tax-Free & Global Hub)</option>
              </select>
            </div>

            <div className="sm:col-span-3 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Matches filtered by verified 2026 intake deadlines, visa policies, and average post-grad salaries.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>View Recommended Pathways</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Global Impact Numbers (Inspired by Cialfo's Metrics) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-display">
              12,000+
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
              Students Placed Globally
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Across 10+ top study destinations</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">
              $24.8M+
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
              Scholarships Secured
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Merit fellowships & assistantships</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-display">
              98.6%
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
              Visa Approval Rate
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Flawless consular documentation</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">
              850+
            </div>
            <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
              Partner Universities
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Ivy League, Russell Group & Go8</p>
          </div>
        </div>

        {/* University Logo Strip */}
        <div className="mt-12 text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4">
            Our Students Secure Admits at World-Renowned Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-500 font-bold text-sm tracking-wide opacity-80">
            <span className="hover:text-slate-900 transition-colors">Carnegie Mellon</span>
            <span>•</span>
            <span className="hover:text-slate-900 transition-colors">Imperial College London</span>
            <span>•</span>
            <span className="hover:text-slate-900 transition-colors">TU Munich</span>
            <span>•</span>
            <span className="hover:text-slate-900 transition-colors">University of Toronto</span>
            <span>•</span>
            <span className="hover:text-slate-900 transition-colors">University of Melbourne</span>
            <span>•</span>
            <span className="hover:text-slate-900 transition-colors">Trinity College Dublin</span>
          </div>
        </div>
      </div>
    </section>
  );
};
