import React, { useState } from 'react';
import { SUCCESS_STORIES, SuccessStory } from '../data/successStoriesData';
import { 
  Award, 
  Building2, 
  CheckCircle2, 
  GraduationCap, 
  Quote, 
  Sparkles, 
  Star, 
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

interface SuccessStoriesSectionProps {
  onOpenBooking: () => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ onOpenBooking }) => {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const filteredStories = countryFilter === 'all'
    ? SUCCESS_STORIES
    : SUCCESS_STORIES.filter((s) => s.destination.toLowerCase().includes(countryFilter));

  return (
    <section id="success-stories-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            Verified Student Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Real Students. Top Admits. Life-Changing Careers.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Discover how students from tier-2 colleges, non-traditional backgrounds, and varied GPAs secured Ivy League, Russell Group, and TU9 admits with significant merit scholarships.
          </p>

          {/* Destination Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Admits (12,000+)' },
              { id: 'united states', label: '🇺🇸 USA' },
              { id: 'united kingdom', label: '🇬🇧 UK' },
              { id: 'germany', label: '🇩🇪 Germany' },
              { id: 'canada', label: '🇨🇦 Canada' },
              { id: 'australia', label: '🇦🇺 Australia' },
              { id: 'ireland', label: '🇮🇪 Ireland' },
              { id: 'united arab emirates', label: '🇦🇪 UAE' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCountryFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  countryFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 group"
            >
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.studentName}
                      className="w-13 h-13 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {story.studentName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {story.undergradProfile}
                      </p>
                      <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                        {story.testScores}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl">{story.flag}</span>
                </div>

                {/* University Admit Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>{story.admittedUniversity}</span>
                  </div>
                  <p className="text-xs text-blue-700 font-semibold mt-1">
                    {story.degreeProgram}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    <Award className="w-3 h-3 text-emerald-700" />
                    <span>{story.scholarshipWon}</span>
                  </div>
                </div>

                {/* Current Placement */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100/70">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="line-clamp-1">{story.currentRole}</span>
                </div>

                {/* Quote */}
                <div className="relative pl-3 border-l-2 border-emerald-400">
                  <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-3">
                    "{story.quote}"
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {story.intakeYear}
                </span>
                <button
                  onClick={() => setSelectedStory(story)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study Modal */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStory.avatar}
                    alt={selectedStory.studentName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedStory.studentName}'s Admit Story
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedStory.undergradProfile} • {selectedStory.testScores}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Admit & Scholarship Secured</span>
                  <h4 className="text-base font-extrabold text-emerald-950 mt-0.5">
                    {selectedStory.admittedUniversity}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800">{selectedStory.degreeProgram}</p>
                  <p className="text-xs font-extrabold text-emerald-700 mt-1">Scholarship: {selectedStory.scholarshipWon}</p>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Admissions Strategy Applied by Upbeat:
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    {selectedStory.strategyHighlight}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student Testimonial:
                  </h5>
                  <p className="text-xs text-slate-700 italic leading-relaxed bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                    "{selectedStory.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-800">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Current Placement: {selectedStory.currentRole}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                >
                  Start Your Profile Evaluation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
            Ready to Write Your Own Success Story?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Book a complimentary profile diagnosis. We will evaluate your GPA, suggest universities with high admit probability, and estimate potential scholarships.
          </p>
          <button
            onClick={onOpenBooking}
            className="mt-6 px-8 py-3 bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Book Your Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
