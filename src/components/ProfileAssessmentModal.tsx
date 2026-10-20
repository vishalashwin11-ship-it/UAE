import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Globe2, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Download, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  Building2,
  Award,
  ChevronLeft
} from 'lucide-react';
import { pushRegistrationToFirestore } from '../services/registrationService';

interface ProfileAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
  preselectedCountry?: string;
  preselectedDegree?: string;
}

export const ProfileAssessmentModal: React.FC<ProfileAssessmentModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenWhatsApp,
  preselectedCountry = 'United States',
  preselectedDegree = "Master's (MS/MSc)",
}) => {
  const [step, setStep] = useState<number>(1);
  
  // Step 1: Academic details
  const [degree, setDegree] = useState(preselectedDegree);
  const [fieldOfStudy, setFieldOfStudy] = useState('Computer Science & AI');
  const [gpa, setGpa] = useState('8.0 - 8.9 CGPA (3.5 - 3.8 GPA)');
  const [testStatus, setTestStatus] = useState('IELTS / TOEFL Done (7.0+)');

  // Step 2: Target preferences & budget
  const [targetCountry, setTargetCountry] = useState(preselectedCountry);
  const [budgetRange, setBudgetRange] = useState('$15,000 - $30,000 / year');
  const [intake, setIntake] = useState('Fall 2026');
  const [priorities, setPriorities] = useState<string[]>(['High Starting Salary', 'STEM Visa Extension']);

  // Step 3: Contact & Delivery
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  if (!isOpen) return null;

  const togglePriority = (item: string) => {
    if (priorities.includes(item)) {
      setPriorities(priorities.filter((p) => p !== item));
    } else {
      setPriorities([...priorities, item]);
    }
  };

  const calculateAssessmentScore = () => {
    let score = 75;
    if (gpa.includes('9.0+') || gpa.includes('3.8+')) score += 15;
    else if (gpa.includes('8.0')) score += 10;
    else if (gpa.includes('7.0')) score += 5;

    if (testStatus.includes('7.0+') || testStatus.includes('GRE 320+')) score += 8;

    return Math.min(score, 98);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setLoading(true);
    const score = calculateAssessmentScore();
    const assessmentId = `EVAL-${Date.now().toString().slice(-6)}`;

    const resultData = {
      assessmentId,
      fullName,
      email,
      phone,
      degree,
      fieldOfStudy,
      gpa,
      targetCountry,
      budgetRange,
      intake,
      score,
      scholarshipPotential: score >= 85 ? '$15,000 - $45,000 / yr' : '$8,000 - $20,000 / yr',
      recommendedTier: score >= 85 ? 'Top 30 Global Dream & Elite Target' : 'High ROI Top 100 Target & Safe',
      dreamPicks: targetCountry === 'Germany' 
        ? ['TU Munich (TUM)', 'RWTH Aachen', 'Heidelberg University'] 
        : targetCountry === 'United Kingdom' 
        ? ['Imperial College London', 'University of Manchester', 'University of Edinburgh'] 
        : ['Carnegie Mellon (CMU)', 'Georgia Tech', 'UT Austin'],
      targetPicks: targetCountry === 'Germany' 
        ? ['TU Berlin', 'Karlsruhe Institute of Tech', 'University of Stuttgart'] 
        : targetCountry === 'United Kingdom' 
        ? ['University of Bristol', 'University of Glasgow', 'University of Leeds'] 
        : ['Northeastern University', 'Purdue University', 'Texas A&M'],
      safePicks: targetCountry === 'Germany' 
        ? ['FAU Erlangen-Nuremberg', 'University of Freiburg'] 
        : targetCountry === 'United Kingdom' 
        ? ['University of Sheffield', 'Queen Mary University London'] 
        : ['Arizona State University', 'University of Texas at Dallas'],
    };

    try {
      // Push lead to Firestore registrations
      await pushRegistrationToFirestore({
        id: assessmentId,
        fullName,
        email,
        phone,
        source: 'free_session_booking',
        sourceLabel: 'Instant Profile Assessment',
        destination: targetCountry,
        intake,
        counselor: 'AI Admissions Directorate & Senior Mentors',
        notes: `Degree: ${degree} in ${fieldOfStudy} | GPA: ${gpa} | Budget: ${budgetRange} | Readiness Score: ${score}/100`,
        status: 'New',
        createdAt: new Date().toISOString(),
      });

      // Push to backend endpoint
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          destination: targetCountry,
          intake,
          service: 'Profile Assessment & University Shortlist',
          source: 'profile_assessment_tool',
          notes: `GPA: ${gpa}, Budget: ${budgetRange}, Field: ${fieldOfStudy}, Score: ${score}/100`,
        }),
      });

      setAssessmentResult(resultData);
    } catch {
      // Fallback display
      setAssessmentResult(resultData);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setAssessmentResult(null);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close Profile Assessment Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-blue-500/30 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Instant Comprehensive Evaluation
            </span>
          </div>

          <h2 className="text-2xl font-extrabold font-display leading-tight">
            Get My Profile Assessment & Custom Shortlist
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Data-backed admissions odds, budget matching, scholarship forecast, and tailored Dream/Target/Safe recommendations.
          </p>

          {/* Stepper progress (hidden on result) */}
          {!assessmentResult && (
            <div className="mt-5 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`h-1.5 w-full rounded-full transition-all ${
                    step >= s ? 'bg-amber-400' : 'bg-white/20'
                  }`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {assessmentResult ? (
            /* Result Screen */
            <div className="space-y-6">
              {/* Top Score Banner */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Profile Assessment Complete
                </span>

                <div className="mt-3 flex items-center justify-center gap-3">
                  <div className="text-5xl font-black text-slate-900 font-display">
                    {assessmentResult.score}
                    <span className="text-2xl text-slate-400 font-normal">/100</span>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-800 mt-2">
                  Admissions Readiness: <span className="text-emerald-700">{assessmentResult.recommendedTier}</span>
                </p>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Calculated based on your target degree ({assessmentResult.degree}), {assessmentResult.gpa}, and {assessmentResult.targetCountry} budget parameters.
                </p>
              </div>

              {/* Forecast Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Scholarship Potential</span>
                  <div className="text-lg font-extrabold text-emerald-700 mt-0.5">
                    {assessmentResult.scholarshipPotential}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Eligible for merit fellowships & teaching assistantships</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated 2-Year Budget</span>
                  <div className="text-lg font-extrabold text-blue-700 mt-0.5">
                    {assessmentResult.budgetRange}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tuition + living, offset by 20 hr/wk part-time work</p>
                </div>
              </div>

              {/* Matched Universities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your Recommended University Shortlist Preview ({assessmentResult.targetCountry}):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                    <span className="text-[10px] font-extrabold text-purple-700 uppercase block mb-1">
                      Dream Matches
                    </span>
                    <ul className="space-y-1 font-semibold text-slate-800">
                      {assessmentResult.dreamPicks.map((u: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate">{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <span className="text-[10px] font-extrabold text-blue-700 uppercase block mb-1">
                      Target Matches
                    </span>
                    <ul className="space-y-1 font-semibold text-slate-800">
                      {assessmentResult.targetPicks.map((u: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase block mb-1">
                      Safe Matches
                    </span>
                    <ul className="space-y-1 font-semibold text-slate-800">
                      {assessmentResult.safePicks.map((u: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    resetAndClose();
                    onOpenBooking();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book 1-on-1 Strategy Session with Mentor</span>
                </button>

                <button
                  onClick={() => {
                    resetAndClose();
                    onOpenWhatsApp();
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* STEP 1: Academic Background */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 1 of 3: Your Academic Foundation
                    </h3>
                    <p className="text-xs text-slate-500">
                      We match your credentials against global admission minimums and historical cohort admits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Target Degree Level
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="Master's (MS/MSc)">Master’s (MS / MSc / MA)</option>
                        <option value="Bachelor's (BS/BA)">Bachelor’s (Undergraduate)</option>
                        <option value="MBA / Executive">MBA & Executive Management</option>
                        <option value="PhD / Doctorate">PhD & Doctoral Research</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Discipline / Field of Study
                      </label>
                      <select
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="Computer Science & AI">Computer Science, AI & ML</option>
                        <option value="Data Science & Analytics">Data Science & Business Analytics</option>
                        <option value="Finance & FinTech">Finance, Quantitative Finance & FinTech</option>
                        <option value="Mechanical & Automotive">Mechanical & Automotive Engineering</option>
                        <option value="Biotechnology & Healthcare">Biotechnology & Healthcare Management</option>
                        <option value="Business & International Mgmt">Management, Marketing & Supply Chain</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current CGPA / Academic Percentage
                    </label>
                    <select
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="9.0+ CGPA / 85%+ (First Class Distinction)">9.0+ CGPA / 85%+ (First Class Distinction • Top 5%)</option>
                      <option value="8.0 - 8.9 CGPA (3.5 - 3.8 GPA)">8.0 - 8.9 CGPA / 75 - 84% (First Class)</option>
                      <option value="7.0 - 7.9 CGPA (3.0 - 3.4 GPA)">7.0 - 7.9 CGPA / 65 - 74% (Second Class Upper)</option>
                      <option value="6.0 - 6.9 CGPA (2.5 - 2.9 GPA)">6.0 - 6.9 CGPA / 55 - 64%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      English & Standardized Test Status
                    </label>
                    <select
                      value={testStatus}
                      onChange={(e) => setTestStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="IELTS / TOEFL Done (7.0+)">IELTS (7.0+) or TOEFL (95+) Cleared</option>
                      <option value="GRE 320+ / GMAT 680+">GRE (320+) or GMAT (680+) Ready</option>
                      <option value="Planning to take in 1-2 months">Planning to take exam in next 30-60 days</option>
                      <option value="Looking for Test-Waived Universities">Looking for Test-Waived (No GRE/GMAT) Universities</option>
                    </select>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Next: Destination & Budget</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Target & Budget */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 2 of 3: Preferred Destination & Annual Budget
                    </h3>
                    <p className="text-xs text-slate-500">
                      We filter universities that match your investment capacity and post-study work authorization goals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Primary Target Destination
                      </label>
                      <select
                        value={targetCountry}
                        onChange={(e) => setTargetCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="United States">United States 🇺🇸 (STEM 3-Year OPT)</option>
                        <option value="Germany">Germany 🇩🇪 (Zero / Low Tuition)</option>
                        <option value="United Kingdom">United Kingdom 🇬🇧 (1-Year Masters)</option>
                        <option value="Canada">Canada 🇨🇦 (PGWP & PR Pathway)</option>
                        <option value="Australia">Australia 🇦🇺 (High Wages & Go8)</option>
                        <option value="Ireland">Ireland 🇮🇪 (Tech Silicon Docks)</option>
                        <option value="United Arab Emirates">UAE 🇦🇪 (10-Yr Golden Visa)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Annual Tuition Budget
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="Zero / Low (< $10,000 / yr)">Low / Zero Tuition (&lt; $10,000/yr • e.g. Germany)</option>
                        <option value="$10,000 - $25,000 / year">$10,000 - $25,000 / yr (Moderate)</option>
                        <option value="$25,000 - $45,000 / year">$25,000 - $45,000 / yr (Standard International)</option>
                        <option value="$45,000+ / year">$45,000+ / yr (Elite Tier & Private Institutions)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Admissions Intake
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Fall 2026', 'Spring 2027', 'Fall 2027'].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setIntake(i)}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            intake === i
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Key Priorities for You:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Max Scholarship Chance',
                        'High Starting Salary',
                        'STEM Visa Extension',
                        'Top 50 Global Rank',
                        'Low Living Cost',
                        'Permanent Residency (PR) Pathway'
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => togglePriority(item)}
                          className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                            priorities.includes(item)
                              ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Next: Get My Evaluation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact Details */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">
                      Step 3 of 3: Where Should We Send Your Detailed Evaluation?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enter your details to generate your profile scorecard and receive a 1-on-1 counselor audit.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        WhatsApp / Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      Includes: Dream/Target/Safe university breakdown, admission odds analysis, and direct WhatsApp review with our senior counselor.
                    </span>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Analyzing Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate My Free Assessment</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
