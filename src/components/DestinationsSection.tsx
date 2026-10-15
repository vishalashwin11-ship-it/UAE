import React, { useState } from 'react';
import { DESTINATIONS, Destination } from '../data/destinationsData';
import { 
  Building2, 
  Clock, 
  Coins, 
  FileCheck2, 
  GraduationCap, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  Briefcase,
  X,
  ExternalLink,
  Award
} from 'lucide-react';

interface DestinationsSectionProps {
  onSelectDestinationForBooking: (countryName: string) => void;
  onExploreCareersForCountry: (countryId: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onSelectDestinationForBooking,
  onExploreCareersForCountry,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredDestinations = activeFilter === 'all' 
    ? DESTINATIONS 
    : DESTINATIONS.filter(d => d.id === activeFilter);

  return (
    <section id="destinations-section" aria-labelledby="destinations-heading" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Global Study Hubs
          </div>
          <h2 id="destinations-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Explore Top Study Destinations
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Compare post-study work rights, tuition investments, cost of living, and high-demand career pathways across the world's most sought-after education hubs.
          </p>

          {/* Quick country pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Destinations ({DESTINATIONS.length})
            </button>
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setActiveFilter(dest.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeFilter === dest.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{dest.flag}</span>
                <span>{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <article
              key={dest.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={dest.heroImage}
                  alt={`Study abroad in ${dest.name} - University campus and global student life`}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-xs">
                  <span className="text-base">{dest.flag}</span>
                  <h3 className="text-xs font-bold text-slate-900 inline">{dest.name}</h3>
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  {dest.visaSuccessRate} Visa Success
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs text-blue-200 font-semibold tracking-wide">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {dest.description}
                  </p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                        Post-Study Work
                      </span>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1" title={dest.postStudyWorkVisa}>
                        {dest.postStudyWorkVisa}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                        Avg Tuition/Yr
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {dest.avgTuitionYear}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                        Living Cost/Yr
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {dest.livingCostYear}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                        Primary Intake
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        {dest.intakes[0].split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Top Universities Preview */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Top Target Institutions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.topUniversities.slice(0, 3).map((uni, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {uni.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top Career Highlight */}
                  <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100/80 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      <span>Key Career: {dest.topCareers[0]?.title}</span>
                    </div>
                    <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                      Starting: {dest.topCareers[0]?.avgSalary}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDestination(dest)}
                    className="flex-1 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors text-center"
                  >
                    View Country Guide
                  </button>
                  <button
                    onClick={() => onSelectDestinationForBooking(dest.name)}
                    className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center shadow-2xs"
                  >
                    Book Counselling
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Destination Detail Modal */}
        {selectedDestination && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header with Image */}
              <div className="relative h-56 sm:h-64 w-full">
                <img
                  src={selectedDestination.heroImage}
                  alt={`Admissions and university overview for ${selectedDestination.name}`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{selectedDestination.flag}</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                      Study in {selectedDestination.name}
                    </h3>
                  </div>
                  <p className="text-sm text-blue-200 font-medium">
                    {selectedDestination.tagline}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Why Choose {selectedDestination.name}?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedDestination.description}
                  </p>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDestination.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Snapshot Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Post-Study Work</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDestination.postStudyWorkVisa}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Tuition Range</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDestination.avgTuitionYear}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Living Costs</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDestination.livingCostYear}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Visa Success</span>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">{selectedDestination.visaSuccessRate}</p>
                  </div>
                </div>

                {/* Top Universities Section */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Top Universities & Popular Courses
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDestination.topUniversities.map((uni, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{uni.name}</span>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {uni.rank}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {uni.city} • Acceptance: {uni.acceptanceRate}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {uni.popularCourses.map((c, cIdx) => (
                            <span key={cIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Career Options in this destination */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>In-Demand Careers in {selectedDestination.name}</span>
                    <button
                      onClick={() => {
                        setSelectedDestination(null);
                        onExploreCareersForCountry(selectedDestination.id);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View Full Career Matrix <ArrowRight className="w-3 h-3" />
                    </button>
                  </h4>
                  <div className="space-y-2">
                    {selectedDestination.topCareers.map((career, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{career.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              career.demandLevel === 'Critical Shortage'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {career.demandLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Top Employers: {career.topEmployers.join(', ')}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Salary</span>
                          <span className="text-xs font-extrabold text-blue-600">{career.avgSalary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scholarships & Work Rights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      Scholarships & Financial Aid
                    </h5>
                    <ul className="space-y-1">
                      {selectedDestination.scholarships.map((sch, idx) => (
                        <li key={idx} className="text-[11px] text-amber-800 flex items-start gap-1.5">
                          <span className="text-amber-600">•</span>
                          <span>{sch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                    <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Student Part-Time Work Rights
                    </h5>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      {selectedDestination.workRights}
                    </p>
                  </div>
                </div>

                {/* Modal Footer CTA */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Targeting {selectedDestination.name} for Fall 2026? Book a personalized profile review.
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedDestination(null)}
                      className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const destName = selectedDestination.name;
                        setSelectedDestination(null);
                        onSelectDestinationForBooking(destName);
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                    >
                      Book 1-on-1 Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
