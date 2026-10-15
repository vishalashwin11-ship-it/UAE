import React, { useState } from 'react';
import { SERVICES } from '../data/servicesData';
import { 
  Compass, 
  GraduationCap, 
  FileText, 
  Award, 
  BadgeDollarSign, 
  ShieldCheck, 
  PlaneTakeoff, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Check,
  Star
} from 'lucide-react';

interface ServicesSectionProps {
  onBookService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-blue-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-violet-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'BadgeDollarSign':
        return <BadgeDollarSign className="w-5 h-5 text-emerald-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'PlaneTakeoff':
        return <PlaneTakeoff className="w-5 h-5 text-rose-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-600" />;
    }
  };

  const timelineSteps = [
    { month: 'Months 10-12 Before Intake', title: 'Profile Diagnostics & Goal Setting', desc: 'Holistic evaluation of transcript, gap remediation, and test prep planning.' },
    { month: 'Months 8-10 Before Intake', title: 'University Shortlisting & Faculty Match', desc: 'Curating Dream/Reach/Safe university tiers and scholarship calendars.' },
    { month: 'Months 6-8 Before Intake', title: 'SOP, LOR & Application Polishing', desc: 'Narrative crafting with Ivy/Oxbridge alumni editors and submission.' },
    { month: 'Months 3-5 Before Intake', title: 'Offer Letters & Financial Engineering', desc: 'Comparing admits, negotiating fellowship grants, and loan disbursal.' },
    { month: 'Months 1-3 Before Intake', title: 'Visa Filing, Housing & Pre-Departure', desc: 'Consular mock interviews, visa clearance, flight bookings, and dorm selection.' },
  ];

  return (
    <section id="services-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            End-to-End Advisory Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            A Structured, High-Admit Guidance Suite
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            From your very first transcript review to landing on campus, our senior counselors and alumni editors accompany you through every critical milestone.
          </p>
        </div>

        {/* 7 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-blue-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.highlightTag && (
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {service.highlightTag}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Deliverables */}
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Key Deliverables:
                  </span>
                  {service.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Step 0{idx + 1} of 07
                </span>
                <button
                  onClick={() => onBookService(service.title)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 12-Month Application Roadmap (Interactive Timeline) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
              Methodology
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
              The 12-Month Admissions Roadmap
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Timing is everything in international admissions. See how we sequence your preparation to maximize scholarships and eliminate last-minute visa anxiety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-blue-600/30 border-blue-400 shadow-md'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-300">Phase 0{idx + 1}</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h4 className="text-xs font-extrabold text-white mb-1">
                  {step.title}
                </h4>
                <span className="text-[10px] text-amber-300 font-semibold block mb-2">
                  {step.month}
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>We handle all portal submissions, document audits, and fee waivers.</span>
            </div>
            <button
              onClick={() => onBookService('Complete Admissions Roadmap')}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center"
            >
              Get Your Custom Timeline
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
