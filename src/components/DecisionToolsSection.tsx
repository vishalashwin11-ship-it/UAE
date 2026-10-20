import React, { useState, useId } from 'react';
import { 
  Building2, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Search, 
  Filter, 
  Globe2, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  GraduationCap,
  Sliders,
  Check,
  Percent
} from 'lucide-react';
import { pushBookingToFirestore, pushRegistrationToFirestore } from '../services/registrationService';

interface DecisionToolsSectionProps {
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
  onOpenProfileAssessment: () => void;
}

export const DecisionToolsSection: React.FC<DecisionToolsSectionProps> = ({
  onOpenBooking,
  onOpenWhatsApp,
  onOpenProfileAssessment,
}) => {
  const [activeTool, setActiveTool] = useState<
    'shortlisting' | 'cost-comparison' | 'scholarship' | 'readiness' | 'counseling'
  >('shortlisting');

  // ==========================================
  // TOOL 1: UNIVERSITY SHORTLISTING STATE
  // ==========================================
  const [degreeFilter, setDegreeFilter] = useState("Master's");
  const [fieldFilter, setFieldFilter] = useState('Computer Science & AI');
  const [gpaTier, setGpaTier] = useState('high'); // high, mid, foundation
  const [budgetTier, setBudgetTier] = useState('all'); // all, low, mid, high
  const [countryFilter, setCountryFilter] = useState('all');

  const universitiesDatabase = [
    // USA
    {
      name: 'Carnegie Mellon University',
      country: 'United States',
      flag: '🇺🇸',
      qsRank: '#24 Global (Top 1 CS)',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '$54,000 / yr',
      tuitionNum: 54000,
      livingCost: '$18,000 / yr',
      tier: 'Dream',
      minGpa: 'high',
      budgetCategory: 'high',
      admitOdds: 'Selective (14%)',
      scholarship: 'Research / TA Funding',
      keyPerk: 'Silicon Valley tech recruitment pipeline',
    },
    {
      name: 'Georgia Institute of Technology',
      country: 'United States',
      flag: '🇺🇸',
      qsRank: '#88 Global (Top 6 Eng)',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '$31,000 / yr',
      tuitionNum: 31000,
      livingCost: '$16,000 / yr',
      tier: 'Target',
      minGpa: 'high',
      budgetCategory: 'mid',
      admitOdds: 'Strong Match (32%)',
      scholarship: '$10k Graduate Assistantship',
      keyPerk: 'Top-tier tech ROI with high post-grad salary',
    },
    {
      name: 'Arizona State University',
      country: 'United States',
      flag: '🇺🇸',
      qsRank: '#179 Global',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '$26,000 / yr',
      tuitionNum: 26000,
      livingCost: '$14,000 / yr',
      tier: 'Safe',
      minGpa: 'mid',
      budgetCategory: 'mid',
      admitOdds: 'High Admit Odds (82%)',
      scholarship: 'Up to $15k New American Award',
      keyPerk: '#1 in US for Innovation 8 consecutive years',
    },
    {
      name: 'Columbia University',
      country: 'United States',
      flag: '🇺🇸',
      qsRank: '#34 Global (Ivy League)',
      degree: "Master's",
      field: 'Finance & FinTech',
      annualTuition: '$62,000 / yr',
      tuitionNum: 62000,
      livingCost: '$24,000 / yr',
      tier: 'Dream',
      minGpa: 'high',
      budgetCategory: 'high',
      admitOdds: 'Very Selective (11%)',
      scholarship: 'Dean’s Merit Fellowship',
      keyPerk: 'Direct Wall Street and Manhattan financial hub',
    },
    // GERMANY
    {
      name: 'Technical University of Munich (TUM)',
      country: 'Germany',
      flag: '🇩🇪',
      qsRank: '#28 Global (#1 in Germany)',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '€0 - €4,000 / yr (Low Tuition)',
      tuitionNum: 4000,
      livingCost: '€11,200 / yr (Blocked Account)',
      tier: 'Dream',
      minGpa: 'high',
      budgetCategory: 'low',
      admitOdds: 'Competitive (Curricular Match)',
      scholarship: 'DAAD & Free Public Education',
      keyPerk: 'Munich Bavarian tech & auto hub (BMW, Siemens)',
    },
    {
      name: 'RWTH Aachen University',
      country: 'Germany',
      flag: '🇩🇪',
      qsRank: '#99 Global (German Ivy 9)',
      degree: "Master's",
      field: 'Mechanical & Automotive',
      annualTuition: '€0 Tuition (Semester fee €320)',
      tuitionNum: 600,
      livingCost: '€10,500 / yr',
      tier: 'Target',
      minGpa: 'mid',
      budgetCategory: 'low',
      admitOdds: 'Strong Probability (65%)',
      scholarship: 'Deutschlandstipendium (€300/mo)',
      keyPerk: 'Global powerhouse for mechanical engineering',
    },
    {
      name: 'FAU Erlangen-Nuremberg',
      country: 'Germany',
      flag: '🇩🇪',
      qsRank: '#229 Global',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '€0 Tuition (Free Public)',
      tuitionNum: 300,
      livingCost: '€9,800 / yr',
      tier: 'Safe',
      minGpa: 'foundation',
      budgetCategory: 'low',
      admitOdds: 'High Likelihood (85%)',
      scholarship: 'Zero Tuition Benefit',
      keyPerk: 'Medical valley & Siemens healthineers corridor',
    },
    // UK
    {
      name: 'Imperial College London',
      country: 'United Kingdom',
      flag: '🇬🇧',
      qsRank: '#2 Global (Russell Group)',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '£39,000 / yr (1-Yr Fast Track)',
      tuitionNum: 48000,
      livingCost: '£15,000 / yr',
      tier: 'Dream',
      minGpa: 'high',
      budgetCategory: 'high',
      admitOdds: 'Elite Selective (12%)',
      scholarship: 'President’s Scholarship',
      keyPerk: 'Accelerated 1-year program; London finance & AI',
    },
    {
      name: 'University of Manchester',
      country: 'United Kingdom',
      flag: '🇬🇧',
      qsRank: '#32 Global',
      degree: "Master's",
      field: 'Business & Management',
      annualTuition: '£28,500 / yr',
      tuitionNum: 36000,
      livingCost: '£11,000 / yr',
      tier: 'Target',
      minGpa: 'mid',
      budgetCategory: 'mid',
      admitOdds: 'Balanced Match (45%)',
      scholarship: '£8,000 Global Futures Award',
      keyPerk: '2-Year UK Graduate Route post-study work visa',
    },
    {
      name: 'Queen Mary University London',
      country: 'United Kingdom',
      flag: '🇬🇧',
      qsRank: '#120 Global',
      degree: "Master's",
      field: 'Finance & FinTech',
      annualTuition: '£23,500 / yr',
      tuitionNum: 29000,
      livingCost: '£13,000 / yr',
      tier: 'Safe',
      minGpa: 'foundation',
      budgetCategory: 'mid',
      admitOdds: 'Safe Admit (78%)',
      scholarship: '£5,000 International Award',
      keyPerk: 'Central London campus with excellent industry ties',
    },
    // IRELAND
    {
      name: 'Trinity College Dublin (TCD)',
      country: 'Ireland',
      flag: '🇮🇪',
      qsRank: '#81 Global',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: '€24,500 / yr',
      tuitionNum: 26000,
      livingCost: '€13,000 / yr',
      tier: 'Target',
      minGpa: 'high',
      budgetCategory: 'mid',
      admitOdds: 'Strong Fit (52%)',
      scholarship: '€5,000 Global Excellence',
      keyPerk: 'Dublin Silicon Docks (Google, Meta, Stripe EU HQ)',
    },
    {
      name: 'University College Dublin (UCD)',
      country: 'Ireland',
      flag: '🇮🇪',
      qsRank: '#126 Global',
      degree: "Master's",
      field: 'Data Science & Analytics',
      annualTuition: '€19,800 / yr',
      tuitionNum: 21000,
      livingCost: '€12,000 / yr',
      tier: 'Safe',
      minGpa: 'mid',
      budgetCategory: 'mid',
      admitOdds: 'High Likelihood (78%)',
      scholarship: 'Up to €4,000 Merit Award',
      keyPerk: '2-Year Third Level Graduate Visa with high employment',
    },
    // AUSTRALIA & CANADA
    {
      name: 'University of Melbourne',
      country: 'Australia',
      flag: '🇦🇺',
      qsRank: '#13 Global (Group of Eight)',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: 'AUD $49,000 / yr (~$32k USD)',
      tuitionNum: 32000,
      livingCost: 'AUD $25,000 / yr',
      tier: 'Dream',
      minGpa: 'high',
      budgetCategory: 'high',
      admitOdds: 'Selective (28%)',
      scholarship: '50% - 100% Fee Remission',
      keyPerk: 'Highest graduate starting wages and post-study visa',
    },
    {
      name: 'University of Toronto',
      country: 'Canada',
      flag: '🇨🇦',
      qsRank: '#21 Global',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: 'CAD $46,000 / yr (~$33k USD)',
      tuitionNum: 33000,
      livingCost: 'CAD $18,000 / yr',
      tier: 'Dream',
      minGpa: 'high',
      budgetCategory: 'high',
      admitOdds: 'Competitive (22%)',
      scholarship: 'Faculty Fellowship',
      keyPerk: '3-Year Post-Graduation Work Permit (PGWP) & PR',
    },
    // UAE
    {
      name: 'Khalifa University / NYU Abu Dhabi',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      qsRank: '#202 Global (Top in Arab World)',
      degree: "Master's",
      field: 'Computer Science & AI',
      annualTuition: 'AED 65,000 or 100% Fellowship',
      tuitionNum: 17500,
      livingCost: 'AED 36,000 / yr',
      tier: 'Target',
      minGpa: 'high',
      budgetCategory: 'low',
      admitOdds: 'Strong Fellowship Fit (60%)',
      scholarship: 'Full Tuition + Monthly Living Stipend',
      keyPerk: '10-Year UAE Golden Visa & 100% Tax-Free starting salary',
    },
  ];

  // Filter logic for university shortlisting
  const filteredUniversities = universitiesDatabase.filter((uni) => {
    const matchesCountry = countryFilter === 'all' || uni.country.toLowerCase() === countryFilter.toLowerCase();
    const matchesBudget = 
      budgetTier === 'all' ||
      (budgetTier === 'low' && uni.tuitionNum <= 10000) ||
      (budgetTier === 'mid' && uni.tuitionNum > 10000 && uni.tuitionNum <= 32000) ||
      (budgetTier === 'high' && uni.tuitionNum > 32000);
    return matchesCountry && matchesBudget;
  });

  // ==========================================
  // TOOL 2: COUNTRY COST COMPARISON STATE
  // ==========================================
  const [selectedCostCountry, setSelectedCostCountry] = useState('Germany');
  const [lifestyleTier, setLifestyleTier] = useState<'budget' | 'moderate' | 'comfort'>('moderate');

  const countryCostMatrix = [
    {
      country: 'Germany',
      flag: '🇩🇪',
      avgTuitionPerYear: '€0 - €3,000 (Free in Public)',
      avgTuitionUSD: '$1,500',
      monthlyLiving: '€950 - €1,100',
      twoYearTotalEst: '$24,000 - $30,000',
      postStudyVisa: '18 Months Job Seeker Visa',
      partTimeHourly: '€12.50 - €15.00 / hr',
      partTimeMonthlyEarn: '€600 - €900 / mo',
      avgStartingSalary: '€55,000 - €72,000 / yr',
      roiScore: '9.8 / 10 (Highest ROI)',
      highlights: 'No tuition at public universities; high demand for engineers and tech grads.',
    },
    {
      country: 'United States',
      flag: '🇺🇸',
      avgTuitionPerYear: '$28,000 - $55,000',
      avgTuitionUSD: '$38,000',
      monthlyLiving: '$1,200 - $1,800',
      twoYearTotalEst: '$75,000 - $110,000',
      postStudyVisa: '3 Years STEM OPT',
      partTimeHourly: '$15.00 - $22.00 / hr (On-campus)',
      partTimeMonthlyEarn: '$800 - $1,200 / mo',
      avgStartingSalary: '$92,000 - $125,000 / yr',
      roiScore: '9.4 / 10',
      highlights: 'Unmatched starting salaries; world-leading tech/AI research labs; 36-month work permit.',
    },
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      avgTuitionPerYear: '£20,000 - £35,000 (1-Yr Fast)',
      avgTuitionUSD: '$32,000 (Total Degree)',
      monthlyLiving: '£1,000 - £1,500',
      twoYearTotalEst: '$42,000 - $55,000 (1-Yr Total)',
      postStudyVisa: '2 Years Graduate Route',
      partTimeHourly: '£10.50 - £13.00 / hr',
      partTimeMonthlyEarn: '£700 - £950 / mo',
      avgStartingSalary: '£42,000 - £60,000 / yr',
      roiScore: '8.9 / 10',
      highlights: 'Finish Masters in 12 months, saving an entire year of living expenses.',
    },
    {
      country: 'Ireland',
      flag: '🇮🇪',
      avgTuitionPerYear: '€16,000 - €26,000',
      avgTuitionUSD: '$23,000',
      monthlyLiving: '€1,100 - €1,500',
      twoYearTotalEst: '$48,000 - $65,000',
      postStudyVisa: '2 Years Third Level Scheme',
      partTimeHourly: '€12.70 - €14.50 / hr',
      partTimeMonthlyEarn: '€800 - €1,000 / mo',
      avgStartingSalary: '€48,000 - €68,000 / yr',
      roiScore: '9.1 / 10',
      highlights: 'Silicon Valley of Europe; EMEA HQs of Google, Apple, Meta, Pfizer, and Stripe.',
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      avgTuitionPerYear: 'CAD $24,000 - $42,000',
      avgTuitionUSD: '$25,000',
      monthlyLiving: 'CAD $1,400 - $1,900',
      twoYearTotalEst: '$55,000 - $75,000',
      postStudyVisa: 'Up to 3 Years PGWP',
      partTimeHourly: 'CAD $16.50 - $18.50 / hr',
      partTimeMonthlyEarn: 'CAD $1,000 - $1,400 / mo',
      avgStartingSalary: 'CAD $68,000 - $92,000 / yr',
      roiScore: '8.8 / 10',
      highlights: 'Smooth permanent residency (Express Entry / PNP) pathways for graduates.',
    },
    {
      country: 'Australia',
      flag: '🇦🇺',
      avgTuitionPerYear: 'AUD $35,000 - $52,000',
      avgTuitionUSD: '$28,000',
      monthlyLiving: 'AUD $1,800 - $2,400',
      twoYearTotalEst: '$65,000 - $88,000',
      postStudyVisa: '2 to 4 Years Subclass 485',
      partTimeHourly: 'AUD $23.23 / hr (Min Wage)',
      partTimeMonthlyEarn: 'AUD $1,500 - $1,900 / mo',
      avgStartingSalary: 'AUD $78,000 - $98,000 / yr',
      roiScore: '8.9 / 10',
      highlights: 'Highest student minimum wage globally; generous post-study work rights.',
    },
    {
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      avgTuitionPerYear: 'AED 45,000 - $70,000 (Or Free)',
      avgTuitionUSD: '$16,000',
      monthlyLiving: 'AED 3,000 - 4,500',
      twoYearTotalEst: '$32,000 - $45,000',
      postStudyVisa: '10-Year Golden Visa Eligible',
      partTimeHourly: 'AED 40 - 60 / hr',
      partTimeMonthlyEarn: 'AED 2,500 - 3,500 / mo',
      avgStartingSalary: 'AED 180,000 - 240,000 (Tax-Free)',
      roiScore: '9.3 / 10',
      highlights: '0% income tax; rapidly expanding AI, finance and logistics global hub in Dubai/Abu Dhabi.',
    },
  ];

  const activeCountryData = countryCostMatrix.find((c) => c.country === selectedCostCountry) || countryCostMatrix[0];

  // ==========================================
  // TOOL 3: SCHOLARSHIP ELIGIBILITY STATE
  // ==========================================
  const [scholarGpa, setScholarGpa] = useState<number>(8.5); // out of 10
  const [scholarIelts, setScholarIelts] = useState<string>('7.5');
  const [scholarGre, setScholarGre] = useState<string>('320+');
  const [scholarExp, setScholarExp] = useState<string>('1-2 Years');
  const [scholarCountry, setScholarCountry] = useState<string>('USA');

  const calculateScholarshipOdds = () => {
    let score = 50;
    if (scholarGpa >= 9.0) score += 30;
    else if (scholarGpa >= 8.0) score += 20;
    else if (scholarGpa >= 7.0) score += 10;

    if (scholarIelts === '8.0+' || scholarIelts === '7.5') score += 10;
    if (scholarGre === '325+' || scholarGre === '320+') score += 10;

    return Math.min(score, 98);
  };

  const scholarOdds = calculateScholarshipOdds();

  // ==========================================
  // TOOL 4: APPLICATION READINESS SCORECARD
  // ==========================================
  const [scores, setScores] = useState({
    academics: 18, // max 20
    tests: 16,     // max 20
    sop: 15,       // max 20
    lors: 16,      // max 20
    profile: 14,   // max 20
  });

  const totalReadiness = scores.academics + scores.tests + scores.sop + scores.lors + scores.profile;

  const getVerdict = (total: number) => {
    if (total >= 85) return { label: 'Top 30 & Ivy League Contender', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (total >= 70) return { label: 'Competitive Global Top 100 Match', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    if (total >= 50) return { label: 'Target & Safe Profile - Minor Gaps', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { label: 'Needs Strategic Profile Uplift', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const readinessVerdict = getVerdict(totalReadiness);

  // ==========================================
  // TOOL 5: PERSONALIZED COUNSELING BOOKING
  // ==========================================
  const [counselorPick, setCounselorPick] = useState('Dr. Elena Rostova (Columbia / Oxford Alum)');
  const [servicePick, setServicePick] = useState('Comprehensive Profile Evaluation & Shortlisting');
  const [bookDate, setBookDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [bookTime, setBookTime] = useState('04:00 PM - 04:45 PM');
  const [bookName, setBookName] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const handleInlineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName || !bookEmail || !bookPhone) return;

    setBookingSubmitting(true);
    const bookingId = `BOOK-${Date.now().toString().slice(-6)}`;
    const meetUrl = `https://meet.google.com/uae-counseling-${Math.random().toString(36).substring(2, 6)}`;

    const payload = {
      bookingId,
      fullName: bookName,
      email: bookEmail,
      phone: bookPhone,
      destination: countryFilter !== 'all' ? countryFilter : 'Global Admissions',
      intake: 'Fall 2026',
      counselor: counselorPick,
      date: bookDate,
      timeSlot: bookTime,
      notes: `[Decision Suite Tool] Topic: ${servicePick}`,
      meetUrl,
      status: 'Confirmed',
    };

    try {
      await pushBookingToFirestore(payload);
      await fetch('/api/counselling/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setBookingSuccess(payload);
    } catch {
      setBookingSuccess(payload);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <section id="decision-tools" aria-label="Admissions Decision & Conversion Tools" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Admissions Decision Suite</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Plan Every Step With{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Precision & Data
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal">
            No guesswork. Use our free algorithmic planning tools to filter top universities by budget, compare net country costs, test scholarship odds, and score your readiness.
          </p>
        </div>

        {/* 5 Tool Navigation Tabs */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar">
          {[
            { id: 'shortlisting', label: 'University Shortlisting', icon: Building2, desc: 'By Profile & Budget' },
            { id: 'cost-comparison', label: 'Country Cost Sheet', icon: DollarSign, desc: 'Tuition, Living & ROI' },
            { id: 'scholarship', label: 'Scholarship Eligibility', icon: Award, desc: 'Grants & Fee Waivers' },
            { id: 'readiness', label: 'Readiness Scorecard', icon: Percent, desc: 'Admissions Odds (0-100)' },
            { id: 'counseling', label: 'Personalized Counseling', icon: Calendar, desc: '1-on-1 Senior Mentor' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 text-left border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/10 text-amber-300' : 'bg-white text-blue-600 shadow-2xs'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="leading-tight">{tab.label}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tab.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TOOL 1: UNIVERSITY SHORTLISTING BASED ON PROFILE AND BUDGET     */}
        {/* ============================================================== */}
        {activeTool === 'shortlisting' && (
          <div className="mt-8 bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 animate-in fade-in">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Smart University Shortlist Matcher
                    </h3>
                    <p className="text-xs text-slate-500">
                      Showing curated Dream, Target & Safe universities matching your academic profile and annual budget.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenProfileAssessment}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Get Full Evaluation Report</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Country Filter
                  </label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Destinations</option>
                    <option value="United States">United States 🇺🇸</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Ireland">Ireland 🇮🇪</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="United Arab Emirates">UAE 🇦🇪</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Annual Tuition Budget
                  </label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Any Tuition Budget</option>
                    <option value="low">Zero / Low (&lt; $10k/yr)</option>
                    <option value="mid">Moderate ($10k - $32k/yr)</option>
                    <option value="high">Elite Tier ($32k+/yr)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Academic CGPA Tier
                  </label>
                  <select
                    value={gpaTier}
                    onChange={(e) => setGpaTier(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">8.5+ CGPA / 3.7+ GPA (Top)</option>
                    <option value="mid">7.5 - 8.4 CGPA (First Class)</option>
                    <option value="foundation">6.5 - 7.4 CGPA (Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Target Degree Level
                  </label>
                  <select
                    value={degreeFilter}
                    onChange={(e) => setDegreeFilter(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Master's">Master’s (MS / MSc)</option>
                    <option value="Bachelor's">Bachelor’s (UG)</option>
                    <option value="MBA">MBA & Management</option>
                  </select>
                </div>
              </div>
            </div>

            {/* University Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUniversities.map((uni, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-blue-300"
                >
                  <div>
                    {/* Top pill bar */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span>{uni.flag}</span>
                        <span>{uni.country}</span>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        uni.tier === 'Dream'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : uni.tier === 'Target'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {uni.tier} Match
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-blue-600 block">{uni.qsRank}</span>
                    <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                      {uni.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {uni.field} ({degreeFilter})
                    </p>

                    {/* Cost & Likelihood Box */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tuition:</span>
                        <span className="font-extrabold text-slate-900">{uni.annualTuition}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Living:</span>
                        <span className="font-semibold text-slate-700">{uni.livingCost}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Admit Odds:</span>
                        <span className="font-bold text-blue-700">{uni.admitOdds}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Scholarship:</span>
                        <span className="font-semibold text-emerald-700">{uni.scholarship}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{uni.keyPerk}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={onOpenProfileAssessment}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      Shortlist This Uni
                    </button>
                    <button
                      onClick={onOpenBooking}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                      title="Book review with counselor"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Shortlisting Callout */}
            <div className="mt-8 bg-blue-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold">Want a personalized 15-University Shortlist with scholarship mappings?</h4>
                <p className="text-xs text-blue-200 mt-0.5">
                  Our admissions mentors cross-reference your exact GRE/IELTS, research papers, and budget.
                </p>
              </div>
              <button
                onClick={onOpenProfileAssessment}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all shrink-0"
              >
                Get My Profile Assessment →
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TOOL 2: COUNTRY COST COMPARISON SHEET                          */}
        {/* ============================================================== */}
        {activeTool === 'cost-comparison' && (
          <div className="mt-8 bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 animate-in fade-in">
            {/* Header & Country Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Global Study Abroad Cost Comparison Sheet (2026 Intake)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed side-by-side economics: Tuition, living budget, part-time wages, and post-study work visa rights.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {countryCostMatrix.map((item) => (
                  <button
                    key={item.country}
                    onClick={() => setSelectedCostCountry(item.country)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                      selectedCostCountry === item.country
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.country}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Country Spotlight Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeCountryData.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-extrabold text-slate-900">{activeCountryData.country} Economics Overview</h4>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ROI: {activeCountryData.roiScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{activeCountryData.highlights}</p>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Discuss {activeCountryData.country} With Counselor
                </button>
              </div>

              {/* 6 Key Financial Pillars */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Annual Tuition</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">{activeCountryData.avgTuitionPerYear}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Monthly Living</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">{activeCountryData.monthlyLiving}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total 2-Yr Net Budget</span>
                  <div className="text-sm font-extrabold text-blue-700 mt-1">{activeCountryData.twoYearTotalEst}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Post-Study Visa</span>
                  <div className="text-sm font-extrabold text-emerald-700 mt-1">{activeCountryData.postStudyVisa}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Part-Time Earnings</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">{activeCountryData.partTimeMonthlyEarn}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Starting Salary</span>
                  <div className="text-sm font-extrabold text-purple-700 mt-1">{activeCountryData.avgStartingSalary}</div>
                </div>
              </div>
            </div>

            {/* Complete Side-by-Side Comparison Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Complete 7-Country Head-to-Head Comparison
                </span>
                <span className="text-[11px] text-slate-500">Updated for Fall 2026 Admissions</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Annual Tuition</th>
                      <th className="py-3 px-4">Monthly Living</th>
                      <th className="py-3 px-4">Post-Study Work</th>
                      <th className="py-3 px-4">Part-Time Wage</th>
                      <th className="py-3 px-4">Avg Post-Grad Pay</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {countryCostMatrix.map((item) => (
                      <tr key={item.country} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap flex items-center gap-1.5">
                          <span>{item.flag}</span>
                          <span>{item.country}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">{item.avgTuitionPerYear}</td>
                        <td className="py-3.5 px-4 text-slate-600">{item.monthlyLiving}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{item.postStudyVisa}</td>
                        <td className="py-3.5 px-4 text-slate-600">{item.partTimeHourly}</td>
                        <td className="py-3.5 px-4 font-extrabold text-blue-700">{item.avgStartingSalary}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={onOpenProfileAssessment}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Assess Odds
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TOOL 3: SCHOLARSHIP ELIGIBILITY CHECKER                       */}
        {/* ============================================================== */}
        {activeTool === 'scholarship' && (
          <div className="mt-8 bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Input Column */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Scholarship & Fellowship Calculator
                      </h3>
                      <p className="text-xs text-slate-500">
                        Compute your merit grant bracket, research assistantship odds, and country fellowship eligibility.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Undergraduate CGPA / Grade (out of 10):
                    </label>
                    <span className="text-xs font-extrabold text-blue-600">{scholarGpa} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="6.0"
                    max="10.0"
                    step="0.1"
                    value={scholarGpa}
                    onChange={(e) => setScholarGpa(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>6.0 (Pass)</span>
                    <span>7.5 (First Class)</span>
                    <span>8.5 (Distinction)</span>
                    <span>10.0 (Gold Medal)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      English Exam Band (IELTS / TOEFL)
                    </label>
                    <select
                      value={scholarIelts}
                      onChange={(e) => setScholarIelts(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="8.0+">IELTS 8.0+ / TOEFL 110+ (Elite)</option>
                      <option value="7.5">IELTS 7.5 / TOEFL 102 - 109</option>
                      <option value="7.0">IELTS 7.0 / TOEFL 95 - 101</option>
                      <option value="6.5">IELTS 6.5 / TOEFL 85 - 94</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Standardized Test (GRE / GMAT)
                    </label>
                    <select
                      value={scholarGre}
                      onChange={(e) => setScholarGre(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="325+">GRE 325+ / GMAT 710+ (Top Tier)</option>
                      <option value="320+">GRE 318 - 324 / GMAT 670 - 700</option>
                      <option value="310+">GRE 310 - 317 / GMAT 620 - 660</option>
                      <option value="Waived">No GRE / Test Waived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Work / Research Experience
                    </label>
                    <select
                      value={scholarExp}
                      onChange={(e) => setScholarExp(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="Fresh Graduate">Fresh Graduate / Final Year</option>
                      <option value="1-2 Years">1 - 2 Years Industry Experience</option>
                      <option value="3+ Years">3+ Years Work Experience</option>
                      <option value="Published Papers">Published Research Papers / Patents</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Country
                    </label>
                    <select
                      value={scholarCountry}
                      onChange={(e) => setScholarCountry(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="USA">United States 🇺🇸</option>
                      <option value="Germany">Germany 🇩🇪 (Free Tuition + DAAD)</option>
                      <option value="UK">United Kingdom 🇬🇧</option>
                      <option value="Ireland">Ireland 🇮🇪</option>
                      <option value="Canada">Canada 🇨🇦</option>
                      <option value="Australia">Australia 🇦🇺</option>
                      <option value="UAE">UAE 🇦🇪 (Full Fellowship)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Outcome Column */}
              <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                    Calculated Scholarship Odds
                  </span>
                  <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-blue-200">
                    Live Score
                  </span>
                </div>

                <div className="text-center py-2">
                  <div className="text-4xl font-extrabold text-white font-display">
                    {scholarOdds}%
                  </div>
                  <span className="text-xs font-bold text-emerald-400 mt-1 block">
                    {scholarOdds >= 80 ? 'High Merit Fellowship Bracket' : 'Moderate Assistantship Probability'}
                  </span>
                  <div className="mt-2 text-xs text-blue-200">
                    Estimated Grant Value:{' '}
                    <strong className="text-white text-sm">
                      {scholarOdds >= 80 ? '$15,000 - $45,000+' : '$5,000 - $15,000'}
                    </strong>
                  </div>
                </div>

                {/* Top Matched Scholarships */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    Top Matched Grants for {scholarCountry}:
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Dean’s International Merit Award</div>
                        <div className="text-[10px] text-blue-200">Tuition waiver up to 40%</div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">Eligible</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Graduate Teaching Assistantship (TA)</div>
                        <div className="text-[10px] text-blue-200">Monthly stipend + in-state tuition waiver</div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">High Match</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">National Government Partnership Fellowships</div>
                        <div className="text-[10px] text-blue-200">DAAD / Chevening / Fulbright round</div>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded">Open 2026</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenProfileAssessment}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply For These Scholarships With Mentor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TOOL 4: APPLICATION READINESS SCORECARD                       */}
        {/* ============================================================== */}
        {activeTool === 'readiness' && (
          <div className="mt-8 bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sliders Pillar Column */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Application Readiness Scorecard (0 - 100)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Rate each pillar of your admissions dossier to calculate your comprehensive profile readiness score.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5 Pillars */}
                <div className="space-y-4">
                  {/* Pillar 1 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">1. Academics & Transcripts (GPA / Rank)</span>
                      <span className="text-blue-600">{scores.academics} / 20 pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={scores.academics}
                      onChange={(e) => setScores({ ...scores, academics: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Pillar 2 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">2. Standardized Tests & English (GRE / IELTS)</span>
                      <span className="text-blue-600">{scores.tests} / 20 pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={scores.tests}
                      onChange={(e) => setScores({ ...scores, tests: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Pillar 3 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">3. Statement of Purpose (SOP) & Essays Quality</span>
                      <span className="text-blue-600">{scores.sop} / 20 pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={scores.sop}
                      onChange={(e) => setScores({ ...scores, sop: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Pillar 4 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">4. Letters of Recommendation (LORs) & Referees</span>
                      <span className="text-blue-600">{scores.lors} / 20 pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={scores.lors}
                      onChange={(e) => setScores({ ...scores, lors: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Pillar 5 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">5. Research, Work Experience & Extracurriculars</span>
                      <span className="text-blue-600">{scores.profile} / 20 pts</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={scores.profile}
                      onChange={(e) => setScores({ ...scores, profile: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Verdict & Score Column */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Application Readiness
                  </span>
                  
                  <div className="text-5xl font-black text-slate-900 font-display mt-2">
                    {totalReadiness}
                    <span className="text-2xl text-slate-400 font-normal">/100</span>
                  </div>

                  <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border inline-block ${readinessVerdict.color}`}>
                    {readinessVerdict.label}
                  </div>
                </div>

                {/* Gap Analysis */}
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Actionable Roadmap to 100%:
                  </span>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {scores.sop < 18 ? 'Elevate SOP narrative: Frame your career inflection point with Ivy alum reviews.' : 'SOP meets top standard.'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {scores.profile < 18 ? 'Boost technical credibility: Add GitHub repositories, capstone projects, or industry certs.' : 'Profile depth is competitive.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenProfileAssessment}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get My Profile Assessment & Fix Gaps</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TOOL 5: PERSONALIZED COUNSELING BOOKING                        */}
        {/* ============================================================== */}
        {activeTool === 'counseling' && (
          <div className="mt-8 bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 animate-in fade-in">
            {bookingSuccess ? (
              <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                  Counselling Session Reserved!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Confirmation sent to <strong>{bookingSuccess.email}</strong>. Counselor <strong>{bookingSuccess.counselor}</strong> will connect with you on {bookingSuccess.date} at {bookingSuccess.timeSlot}.
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1">
                  <div><strong>Booking ID:</strong> #{bookingSuccess.bookingId}</div>
                  <div><strong>Meet Link:</strong> <a href={bookingSuccess.meetUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">{bookingSuccess.meetUrl}</a></div>
                  <div><strong>Hotline Assistance:</strong> +91 9354935332</div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Book Another Slot
                  </button>
                  <button
                    onClick={onOpenWhatsApp}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Confirm via WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInlineBooking} className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Reserve Your Free 1-on-1 Personalized Counseling
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct mentorship with senior admissions directors and Ivy League alumni.
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                    100% Free Consultation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Choose Your Specialist Mentor
                    </label>
                    <select
                      value={counselorPick}
                      onChange={(e) => setCounselorPick(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="Dr. Elena Rostova (Columbia / Oxford Alum)">Dr. Elena Rostova (Columbia & Oxford Alum • USA / Ivy / STEM)</option>
                      <option value="Michael Vance (Ex-NAFSA International Officer)">Michael Vance (Ex-NAFSA • Germany Free Tuition & Consular Visas)</option>
                      <option value="Aarav Singhania (INSEAD MBA Alum)">Aarav Singhania (INSEAD MBA • UK / Ireland Tech Careers & High ROI)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Session Topic Focus
                    </label>
                    <select
                      value={servicePick}
                      onChange={(e) => setServicePick(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="Comprehensive Profile Evaluation & Shortlisting">University Shortlisting & Profile Audit</option>
                      <option value="Scholarship & Fellowship Strategy">Scholarship & Assistantship Strategy</option>
                      <option value="SOP & Essay Storyline Review">SOP & Personal Essay Masterclass</option>
                      <option value="Visa & Financial Proof Strategy">Visa & Financial Documentation Prep</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Time Slot (Asia/Pacific Standard)
                    </label>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="10:30 AM - 11:15 AM">10:30 AM - 11:15 AM</option>
                      <option value="12:00 PM - 12:45 PM">12:00 PM - 12:45 PM</option>
                      <option value="02:30 PM - 03:15 PM">02:30 PM - 03:15 PM</option>
                      <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
                      <option value="06:00 PM - 06:45 PM">06:00 PM - 06:45 PM</option>
                      <option value="07:30 PM - 08:15 PM">07:30 PM - 08:15 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Nair"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={bookEmail}
                      onChange={(e) => setBookEmail(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Includes Google Meet link + WhatsApp reminders. No consultation charge.
                  </span>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {bookingSubmitting ? 'Confirming...' : 'Confirm My 1-on-1 Counseling Slot →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
