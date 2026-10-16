import React, { useState, useRef } from 'react';
import { useAuth, CourseRecommendation, ADMISSION_STAGES } from '../context/AuthContext';
import { 
  GraduationCap, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Download, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Building2, 
  ShieldCheck, 
  Search, 
  Filter, 
  RefreshCw,
  LogOut,
  ExternalLink,
  Plus,
  UploadCloud,
  Check,
  RotateCcw,
  FileText,
  ChevronRight
} from 'lucide-react';

interface StudentPortalProps {
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onOpenBooking,
  onOpenWhatsApp,
}) => {
  const { 
    user, 
    profile, 
    applications, 
    courseRecommendations, 
    logout, 
    updateProfileData,
    generateNewRecommendations,
    updateApplicationStage,
    updateDocumentStatus,
    resetToFreshPortal,
  } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetUploadIndex, setTargetUploadIndex] = useState<number | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'recommendations' | 'applications'>('recommendations');
  const [tierFilter, setTierFilter] = useState<'All' | 'Dream' | 'Target' | 'Safe'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customizer modal / form state
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [custDegree, setCustDegree] = useState(profile?.targetDegree || "Master's (MS/MSc)");
  const [custField, setCustField] = useState('Computer Science & AI');
  const [custDest, setCustDest] = useState(profile?.targetDestination || 'United States');
  const [custGpa, setCustGpa] = useState(profile?.gpa || '8.4 CGPA');
  const [custTest, setCustTest] = useState(profile?.testScores || 'IELTS 7.5 • GRE 320');
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter recommendations
  const filteredRecs = courseRecommendations.filter((item) => {
    const matchTier = tierFilter === 'All' || item.tier === tierFilter;
    const matchSearch = 
      item.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTier && matchSearch;
  });

  const handleRegenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    await updateProfileData({
      targetDegree: custDegree,
      targetDestination: custDest,
      gpa: custGpa,
      testScores: custTest,
    });
    await generateNewRecommendations({
      degree: custDegree,
      field: custField,
      destination: custDest,
      gpa: custGpa,
      testScore: custTest,
    });
    setIsGenerating(false);
    setShowCustomizer(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const activeApp = applications[0];

  return (
    <div className="py-10 lg:py-16 bg-slate-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Firebase Connected Banner */}
        {((user as any)?.previewNotice || (user as any)?.isGoogle) && (
          <div className="mb-4 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>
                Signed in with Google Account (<strong>{user?.email}</strong>). Course recommendations and application tracker are active.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200 shrink-0">
              Firebase: upbeat-abroad-education
            </span>
          </div>
        )}

        {/* Top Student Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    {profile?.displayName || 'Student Applicant'}
                  </h1>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Verified Account
                  </span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    Fall 2026 Cohort
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span>Target: {profile?.targetDegree}</span>
                  <span>•</span>
                  <span>Profile: {profile?.gpa} ({profile?.testScores})</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowCustomizer(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Evaluation Criteria</span>
              </button>

              <button
                onClick={logout}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 pt-5">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Course Recommendation Report ({courseRecommendations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Application Progress Tracker</span>
              {activeApp && (
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.2 rounded-full">
                  Stage {activeApp.currentStage}/6
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: COURSE RECOMMENDATION REPORT */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
                  Match Tier:
                </span>
                {(['All', 'Dream', 'Target', 'Safe'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tierFilter === tier
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search university or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <button
                  onClick={handlePrintReport}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between hover:border-blue-300 group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span>{rec.flag}</span>
                        <span>{rec.country}</span>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        rec.tier === 'Dream'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : rec.tier === 'Target'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {rec.tier} Match • {rec.fitScore}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-blue-600 block">{rec.rank}</span>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {rec.universityName}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        {rec.programName}
                      </p>
                    </div>

                    {/* Metrics Banner */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Est. Tuition:</span>
                        <span className="font-extrabold text-slate-800">{rec.avgTuition}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Admit Odds:</span>
                        <span className="font-semibold text-blue-700">{rec.admitProbability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Scholarship:</span>
                        <span className="font-semibold text-emerald-700">{rec.scholarshipChance}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mt-3 space-y-1">
                      {rec.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Counselor Advice Note */}
                    <div className="mt-3 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100/70 text-[11px] text-blue-900 leading-snug">
                      <strong>Advisor Tip:</strong> {rec.notes}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={onOpenBooking}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
                    >
                      Book Review Session
                    </button>
                    <button
                      onClick={onOpenWhatsApp}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
                      title="Ask on WhatsApp"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATION PROGRESS TRACKER */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {activeApp ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
                {/* Active Application Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        Application Ref: #{activeApp.id}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                        Status: {activeApp.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-display">
                      {activeApp.universityName}
                    </h2>
                    <p className="text-sm text-slate-600 font-medium">
                      {activeApp.programName} • {activeApp.destination} ({activeApp.intake})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Assigned Senior Counselor
                    </span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">
                      {activeApp.assignedCounselor}
                    </span>
                    <button
                      onClick={onOpenWhatsApp}
                      className="text-xs font-bold text-emerald-600 hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      Message Counselor on WhatsApp →
                    </button>
                  </div>
                </div>

                {/* Upload notification toast if active */}
                {uploadNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{uploadNotice}</span>
                    </div>
                    <button onClick={() => setUploadNotice(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">×</button>
                  </div>
                )}

                {/* Hidden File Input for document upload simulation */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0] && targetUploadIndex !== null) {
                      const file = e.target.files[0];
                      updateDocumentStatus(targetUploadIndex, 'Uploaded');
                      setUploadNotice(`"${file.name}" uploaded successfully for review.`);
                      setTimeout(() => setUploadNotice(null), 4000);
                      setTargetUploadIndex(null);
                    }
                  }}
                  className="hidden"
                />

                {/* 6-Stage Progress Stepper (Interactive - click any stage to advance or test) */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Admissions Lifecycle Timeline (Stage {activeApp.currentStage} of 6)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Click on any stage card below to navigate or advance your admissions milestone:
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateApplicationStage(Math.max(1, activeApp.currentStage - 1))}
                        disabled={activeApp.currentStage <= 1}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Prev Stage
                      </button>
                      <button
                        onClick={() => updateApplicationStage(Math.min(6, activeApp.currentStage + 1))}
                        disabled={activeApp.currentStage >= 6}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                      >
                        Next Stage →
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    {ADMISSION_STAGES.map((step) => {
                      const isComplete = step.stage < activeApp.currentStage;
                      const isCurrent = step.stage === activeApp.currentStage;
                      return (
                        <div
                          key={step.stage}
                          onClick={() => updateApplicationStage(step.stage)}
                          role="button"
                          tabIndex={0}
                          title={`Click to set Stage ${step.stage}: ${step.name}`}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                            isComplete
                              ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400 text-emerald-950 hover:shadow-xs'
                              : isCurrent
                              ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/20 text-blue-950'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-extrabold">0{step.stage}</span>
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isCurrent ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                          <h4 className="text-xs font-bold leading-tight mb-1">
                            {step.name}
                          </h4>
                          <p className="text-[10px] opacity-80 leading-normal">
                            {step.desc}
                          </p>
                          <div className="mt-2 text-[9px] font-semibold text-slate-400">
                            {isComplete ? 'Completed' : isCurrent ? 'Active Now' : 'Upcoming'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Action Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                        Active Stage Milestone Action
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {activeApp.nextAction}
                      </p>
                      <span className="text-xs text-slate-600 mt-1 block">
                        Target Timeline: <strong className="text-blue-900">{activeApp.actionDeadline}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={onOpenBooking}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Book 1-on-1 Session
                    </button>
                    <button
                      onClick={onOpenWhatsApp}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
                    >
                      Ask Advisor
                    </button>
                  </div>
                </div>

                {/* Document Verification Table */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Application Document Checklist & Verification
                      </h3>
                      <p className="text-xs text-slate-500">
                        Fresh portal state: Upload academic documents or change status as review progresses.
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {activeApp.documents.filter(d => d.status === 'Verified').length} of {activeApp.documents.length} Verified
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {activeApp.documents.map((docItem, idx) => (
                      <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-800 block">{docItem.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {docItem.status === 'Verified' ? 'Approved by Admissions Team' : docItem.status === 'Uploaded' ? 'Awaiting counselor review' : 'No document uploaded yet'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                          {/* Status Pill */}
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                            docItem.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : docItem.status === 'Uploaded'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : docItem.status === 'Under Review'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {docItem.status}
                          </span>

                          {/* Quick Upload Button */}
                          <button
                            onClick={() => {
                              setTargetUploadIndex(idx);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                                fileInputRef.current.click();
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                            title="Upload or update document"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Upload</span>
                          </button>

                          {/* Status Modifier Dropdown */}
                          <select
                            value={docItem.status}
                            onChange={(e) => updateDocumentStatus(idx, e.target.value)}
                            aria-label={`Change status for ${docItem.name}`}
                            className="text-[11px] font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="Pending Upload">Pending Upload</option>
                            <option value="Uploaded">Uploaded</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Verified">Verified</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage Progression & Portal Reset Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Jump to Stage:</span>
                    <div className="flex flex-wrap gap-1">
                      {[1, 2, 3, 4, 5, 6].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateApplicationStage(s)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            activeApp.currentStage === s
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          0{s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset this student portal to a fresh state (Stage 1 with all documents pending)?')) {
                        resetToFreshPortal();
                        setUploadNotice('Portal reset to fresh Stage 1 state with all documents pending.');
                        setTimeout(() => setUploadNotice(null), 3500);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Portal to Fresh Stage 1</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl text-center border border-slate-200">
                <p className="text-sm text-slate-600">No active applications found. Book a consultation to submit your first university application!</p>
              </div>
            )}
          </div>
        )}

        {/* Customizer Modal for Course Recommendations */}
        {showCustomizer && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-extrabold text-slate-900 font-display mb-1">
                Customize Your Course Report
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Our algorithm recalculates Dream, Target, and Safe fit scores based on your updated academics.
              </p>

              <form onSubmit={handleRegenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Degree Level
                  </label>
                  <select
                    value={custDegree}
                    onChange={(e) => setCustDegree(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  >
                    <option value="Master's (MS/MSc)">Master’s / MS / MSc Degree</option>
                    <option value="Bachelor's (BSc/BA)">Bachelor’s / Undergraduate</option>
                    <option value="MBA & Management">MBA & Executive Management</option>
                    <option value="PhD / Doctorate">PhD / Research Fellowship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Academic Field
                  </label>
                  <input
                    type="text"
                    value={custField}
                    onChange={(e) => setCustField(e.target.value)}
                    placeholder="e.g. Computer Science, Mechanical Eng, Data Analytics"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Primary Destination
                  </label>
                  <select
                    value={custDest}
                    onChange={(e) => setCustDest(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                  >
                    <option value="United States">🇺🇸 United States (STEM OPT 3 Yrs)</option>
                    <option value="Germany">🇩🇪 Germany (Tuition-Free & Chancenkarte)</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom (1-Yr Master’s)</option>
                    <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Tax-Free & Global Hub)</option>
                    <option value="Canada">🇨🇦 Canada (PGWP & Permanent Residency)</option>
                    <option value="Australia">🇦🇺 Australia (Top 50 Go8 & High Wages)</option>
                    <option value="Ireland">🇮🇪 Ireland (European Tech Epicenter)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Undergrad GPA / %
                    </label>
                    <input
                      type="text"
                      value={custGpa}
                      onChange={(e) => setCustGpa(e.target.value)}
                      placeholder="e.g. 8.4 CGPA or 3.6 GPA"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Test Scores
                    </label>
                    <input
                      type="text"
                      value={custTest}
                      onChange={(e) => setCustTest(e.target.value)}
                      placeholder="e.g. IELTS 7.5 / GRE 320"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCustomizer(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>{isGenerating ? 'Generating...' : 'Recalculate Fit Scores'}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
