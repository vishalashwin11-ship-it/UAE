import React, { useState } from 'react';
import { CAREER_PATHWAYS, CareerPathway } from '../data/careersData';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Calculator, 
  ArrowRight,
  Award
} from 'lucide-react';

interface CareerOptionsSectionProps {
  initialDestinationFilter?: string;
  onOpenBookingForCareer: (roleTitle: string, destination: string) => void;
}

export const CareerOptionsSection: React.FC<CareerOptionsSectionProps> = ({
  initialDestinationFilter = 'all',
  onOpenBookingForCareer,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>(initialDestinationFilter);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedPathway, setSelectedPathway] = useState<CareerPathway | null>(null);

  // Interactive ROI Calculator State
  const [calcTuition, setCalcTuition] = useState<number>(35000);
  const [calcDurationYears, setCalcDurationYears] = useState<number>(2);
  const [calcCountry, setCalcCountry] = useState<string>('usa');

  // Filtered pathways
  const filteredPathways = CAREER_PATHWAYS.filter((p) => {
    const matchDest = selectedDestination === 'all' || p.destinationId === selectedDestination;
    const matchDomain = selectedDomain === 'all' || p.domain === selectedDomain;
    return matchDest && matchDomain;
  });

  // Calculate estimated ROI
  const calculateRoiDetails = () => {
    const livingRates: Record<string, number> = {
      usa: 18000,
      germany: 11000,
      uk: 15000,
      canada: 16000,
      australia: 19000,
      ireland: 14000,
      uae: 12000,
    };
    const avgStartSalaries: Record<string, number> = {
      usa: 115000,
      germany: 72000,
      uk: 75000,
      canada: 85000,
      australia: 92000,
      ireland: 68000,
      uae: 78000,
    };

    const livingCost = (livingRates[calcCountry] || 15000) * calcDurationYears;
    const totalTuition = calcTuition * calcDurationYears;
    const totalInvestment = totalTuition + livingCost;
    const expectedSalary = avgStartSalaries[calcCountry] || 85000;
    const netAnnualSavings = expectedSalary * 0.45; // ~45% net post-tax savings
    const paybackMonths = Math.max(6, Math.round((totalInvestment / netAnnualSavings) * 12));
    const fiveYearNet = Math.round(expectedSalary * 5 * 0.45 - totalInvestment);

    return { totalInvestment, expectedSalary, paybackMonths, fiveYearNet };
  };

  const roi = calculateRoiDetails();

  return (
    <section id="careers-section" className="py-16 lg:py-24 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            Strategic Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Top Career Options with Respect to Destination
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Education is an investment. We map university programs directly to shortage occupations, starting wage benchmarks, and post-study work visa rights in each country.
          </p>

          {/* Destination Filters */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Destination:
            </span>
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'usa', label: '🇺🇸 USA' },
              { id: 'germany', label: '🇩🇪 Germany' },
              { id: 'uk', label: '🇬🇧 UK' },
              { id: 'canada', label: '🇨🇦 Canada' },
              { id: 'australia', label: '🇦🇺 Australia' },
              { id: 'ireland', label: '🇮🇪 Ireland' },
              { id: 'uae', label: '🇦🇪 UAE' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDestination(d.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDestination === d.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Domain Filters */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Field / Domain:
            </span>
            {[
              { id: 'all', label: 'All Fields' },
              { id: 'Tech & AI', label: 'Tech & AI' },
              { id: 'Finance & Business', label: 'Finance & Business' },
              { id: 'Engineering & Clean Tech', label: 'Engineering & Clean Tech' },
              { id: 'Healthcare & Life Sciences', label: 'Healthcare & Biotech' },
              { id: 'Supply Chain & Analytics', label: 'Supply Chain & Analytics' },
            ].map((dom) => (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedDomain === dom.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {dom.label}
              </button>
            ))}
          </div>
        </div>

        {/* Career Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPathways.map((pathway) => (
            <div
              key={pathway.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-indigo-300 group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <span>{pathway.flag}</span>
                    <span>{pathway.destinationName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pathway.demandTier === 'Critical Shortage'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {pathway.demandTier}
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {pathway.roleTitle}
                </h3>
                <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {pathway.domain}
                </span>

                <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {pathway.overview}
                </p>

                {/* Compensation Banner */}
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-xl border border-blue-100/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Target Starting Compensation
                  </span>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-sm font-extrabold text-blue-900">
                      {pathway.salaryLocal}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 block mt-1">
                    Growth: {pathway.growthRate}
                  </span>
                </div>

                {/* Key Skills Tags */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Critical In-Demand Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pathway.inDemandSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visa & Program Snapshot */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span className="text-[11px]">
                      <strong>Work Visa:</strong> {pathway.visaRoute}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-[11px]">
                      <strong>Employers:</strong> {pathway.topHiringCompanies.slice(0, 3).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Payback</span>
                  <span className="text-xs font-bold text-slate-800">{pathway.paybackPeriod}</span>
                </div>
                <button
                  onClick={() => onOpenBookingForCareer(pathway.roleTitle, pathway.destinationName)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Career Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Study Abroad ROI Calculator */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5" />
                ROI & Financial Payback Modeling
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                Calculate Your Study Abroad Return on Investment
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Estimate how quickly your foreign degree pays for itself based on destination benchmarks.
              </p>
            </div>
            <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-center shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">Payback Period</span>
              <span className="text-xl font-extrabold font-display">~{roi.paybackMonths} Months</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Calculator Controls */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  <span>Target Destination</span>
                  <span className="text-blue-600 font-semibold">{calcCountry.toUpperCase()}</span>
                </label>
                <select
                  value={calcCountry}
                  onChange={(e) => setCalcCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="usa">United States (High Starting Salary ~$115k)</option>
                  <option value="germany">Germany (Zero/Low Tuition Fees ~$300/sem)</option>
                  <option value="uk">United Kingdom (Accelerated 1-Year Master’s)</option>
                  <option value="canada">Canada (PGWP & Favorable PR)</option>
                  <option value="australia">Australia (High Minimum & Go8 Wages)</option>
                  <option value="ireland">Ireland (European Tech Hub)</option>
                  <option value="uae">United Arab Emirates (100% Tax-Free Earnings)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  <span>Annual Tuition Fee ($ USD)</span>
                  <span className="text-indigo-600 font-bold">${calcTuition.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="65000"
                  step="2500"
                  value={calcTuition}
                  onChange={(e) => setCalcTuition(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$0 (Germany Public)</span>
                  <span>$35,000 (Avg US/UK)</span>
                  <span>$65,000 (Ivy/Top Private)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  <span>Program Duration</span>
                  <span className="text-indigo-600 font-bold">{calcDurationYears} {calcDurationYears === 1 ? 'Year' : 'Years'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcDurationYears(1)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      calcDurationYears === 1
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    1-Year Accelerated (UK / Ireland)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcDurationYears(2)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      calcDurationYears === 2
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    2-Year Standard (US / Canada / Germany)
                  </button>
                </div>
              </div>
            </div>

            {/* Projected Financial Outcome Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-4">
                  Projected Financial Matrix
                </span>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Total Est. Investment</span>
                    <span className="text-xl font-bold font-display text-white">
                      ${roi.totalInvestment.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Includes tuition + cost of living
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">Avg Target Starting Salary</span>
                    <span className="text-xl font-bold font-display text-emerald-400">
                      ${roi.expectedSalary.toLocaleString()} / yr
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block">5-Year Net Wealth Created</span>
                    <span className="text-2xl font-extrabold font-display text-amber-400">
                      +${roi.fiveYearNet.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[11px] text-indigo-200 leading-normal">
                  Based on Upbeat cohort data. Maximize ROI with merit scholarship guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
