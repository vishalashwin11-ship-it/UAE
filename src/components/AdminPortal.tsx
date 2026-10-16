import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchAllRegistrations, 
  updateRegistrationStatusInFirestore, 
  deleteRegistrationFromFirestore,
  pushRegistrationToFirestore,
  StudentRegistration,
  SECRET_ADMIN_URL
} from '../services/registrationService';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Sparkles, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Mail, 
  Phone, 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Building2, 
  Plus, 
  X,
  ExternalLink,
  GraduationCap,
  Lock,
  KeyRound,
  Copy,
  Check,
  LogOut,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface AdminPortalProps {
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
  onNavigateHome?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigateHome,
}) => {
  const { user, isAdmin, adminLogin, adminLogout } = useAuth();
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Strict Login Form State
  const [adminEmailInput, setAdminEmailInput] = useState('vishalashwin11@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [copiedSecretUrl, setCopiedSecretUrl] = useState(false);

  // Manual Add Form State
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualSource, setManualSource] = useState<StudentRegistration['source']>('counselling_booking');
  const [manualDest, setManualDest] = useState('United States');
  const [manualIntake, setManualIntake] = useState('Fall 2026');
  const [manualCounselor, setManualCounselor] = useState('Dr. Elena Rostova');
  const [manualNotes, setManualNotes] = useState('');
  const [addingLead, setAddingLead] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthenticating(true);
    const res = await adminLogin(adminEmailInput, adminPasswordInput);
    setIsAuthenticating(false);
    if (res.success) {
      setAdminPasswordInput('');
      await loadData();
    } else {
      setLoginError(res.error || 'Authentication rejected. Please check your credentials.');
    }
  };

  const handleCopySecretUrl = () => {
    const fullUrl = `${window.location.origin}${SECRET_ADMIN_URL}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSecretUrl(true);
    setTimeout(() => setCopiedSecretUrl(false), 2500);
  };

  const handleStatusChange = async (id: string, newStatus: StudentRegistration['status']) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    await updateRegistrationStatusInFirestore(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this registration record?')) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      await deleteRegistrationFromFirestore(id);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualEmail) return;

    setAddingLead(true);
    const newReg = await pushRegistrationToFirestore({
      fullName: manualName,
      email: manualEmail,
      phone: manualPhone,
      source: manualSource,
      destination: manualDest,
      intake: manualIntake,
      counselor: manualCounselor,
      notes: manualNotes,
      status: 'New',
    });

    setRegistrations((prev) => [newReg, ...prev]);
    setAddingLead(false);
    setShowAddModal(false);
    // Reset form
    setManualName('');
    setManualEmail('');
    setManualPhone('');
    setManualNotes('');
  };

  const handleExportCsv = () => {
    if (!registrations.length) return;
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Source',
      'Target Destination',
      'Intake',
      'Counselor',
      'Session Date',
      'Time Slot',
      'Status',
      'Created At',
      'Notes',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.source}"`,
      `"${r.destination}"`,
      `"${r.intake}"`,
      `"${r.counselor || ''}"`,
      `"${r.sessionDate || ''}"`,
      `"${r.timeSlot || ''}"`,
      `"${r.status}"`,
      `"${r.createdAt}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Upbeat_Registrations_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.counselor && reg.counselor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSource =
      sourceFilter === 'All' ||
      (sourceFilter === 'Book Counselling' && reg.source === 'counselling_booking') ||
      (sourceFilter === 'Book Free Session' && reg.source === 'free_session_booking') ||
      (sourceFilter === 'Sign In / Up Tab' && (reg.source === 'account_signup' || reg.source === 'account_signin')) ||
      (sourceFilter === 'Contact Inquiry' && reg.source === 'contact_inquiry');

    const matchesStatus = statusFilter === 'All' || reg.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  // Calculate metrics
  const totalCount = registrations.length;
  const counsellingCount = registrations.filter((r) => r.source === 'counselling_booking').length;
  const freeSessionCount = registrations.filter((r) => r.source === 'free_session_booking').length;
  const accountSignups = registrations.filter((r) => r.source === 'account_signup' || r.source === 'account_signin').length;
  const contactInquiries = registrations.filter((r) => r.source === 'contact_inquiry').length;

  const getSourceBadge = (source: StudentRegistration['source']) => {
    switch (source) {
      case 'counselling_booking':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Calendar className="w-3 h-3" />
            <span>Book Counselling</span>
          </span>
        );
      case 'free_session_booking':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="w-3 h-3" />
            <span>Book Free Session</span>
          </span>
        );
      case 'account_signup':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3 h-3" />
            <span>Sign Up Tab</span>
          </span>
        );
      case 'account_signin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck className="w-3 h-3" />
            <span>Sign In Tab</span>
          </span>
        );
      case 'contact_inquiry':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <MessageSquare className="w-3 h-3" />
            <span>Contact Inquiry</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            {source}
          </span>
        );
    }
  };

  // STRICT ACCESS PROTECTION: If user is not authenticated as administrator with valid backend token
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

          <div className="relative z-10 space-y-6">
            {/* Header Lock Icon & Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 mb-3">
                <Lock className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Restricted Access Portal</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight">
                Administrator Authentication
              </h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Strict login protection is enforced. You must authenticate with verified administrator credentials to decrypt and view sensitive student records.
              </p>
            </div>

            {/* Secret URL Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Secret Gateway Route:</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopySecretUrl}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  {copiedSecretUrl ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
              <code className="block px-2.5 py-1.5 rounded-lg bg-slate-950 font-mono text-[11px] text-amber-300 border border-slate-800 break-all select-all">
                {SECRET_ADMIN_URL}
              </code>
              <p className="text-[10px] text-slate-400">
                Default public admin buttons have been removed from the navbar. Bookmark this secret URL for all future logins.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Strict Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Administrator Email / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    placeholder="vishalashwin11@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Secure Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>Verify Credentials & Enter Dashboard</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Home CTA */}
            {onNavigateHome && (
              <div className="pt-2 text-center border-t border-slate-800">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Website</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Admin User Details Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/30">
                <ShieldCheck className="w-9 h-9 text-amber-300" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                    Super Administrator
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Firestore Connected
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                  Vishal Ashwin
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <strong>vishalashwin11@gmail.com</strong>
                  </span>
                  <span>•</span>
                  <span>Role: Director of Admissions & Operations</span>
                  <span>•</span>
                  <span className="text-slate-400">Firebase: upbeat-abroad-education</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Firestore</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({filteredRegistrations.length})</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student Lead</span>
              </button>

              <button
                onClick={adminLogout}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-rose-600/20"
                title="End active administrator session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Secure Logout</span>
              </button>
            </div>
          </div>

          {/* Secret URL & Security Status Banner */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-emerald-400">Strict Auth Enforced:</span>
              <span className="text-slate-400">Protected Backend • Secret URL:</span>
              <code className="px-2 py-0.5 rounded bg-slate-950 font-mono text-[11px] text-amber-300 border border-slate-800">
                {SECRET_ADMIN_URL}
              </code>
            </div>
            <button
              type="button"
              onClick={handleCopySecretUrl}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copiedSecretUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Secret URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Registrations</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {totalCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across all portal channels</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Book Counselling</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 font-display">
              {counsellingCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Scheduled sessions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Book Free Session</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">
              {freeSessionCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Complimentary evaluations</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Sign In / Up Tab</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display">
              {accountSignups}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Student portal accounts</p>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Contact Enquiries</span>
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-display">
              {contactInquiries}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Website contact forms</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, email, phone, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Source Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['All', 'Book Counselling', 'Book Free Session', 'Sign In / Up Tab', 'Contact Inquiry'].map((src) => (
              <button
                key={src}
                onClick={() => setSourceFilter(src)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sourceFilter === src
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Master Registrations Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-display">
                All Student Registrations ({filteredRegistrations.length})
              </h3>
              <span className="text-xs text-slate-500">
                Pushed to Firestore collection: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-[11px]">/registrations</code>
              </span>
            </div>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No registrations match your search filters.</p>
              <button
                onClick={() => { setSearchTerm(''); setSourceFilter('All'); setStatusFilter('All'); }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Student Details</th>
                    <th className="py-3.5 px-4">Registration Source</th>
                    <th className="py-3.5 px-4">Target Destination & Intake</th>
                    <th className="py-3.5 px-4">Session Date / Slot</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Registered On</th>
                    <th className="py-3.5 px-4 text-right">Quick Contact Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRegistrations.map((reg) => {
                    const cleanPhone = (reg.phone || '').replace(/[^0-9]/g, '');
                    const waMessage = encodeURIComponent(
                      `Hello ${reg.fullName}, this is Vishal Ashwin from Upbeat Abroad Education regarding your registration for ${reg.destination} (${reg.intake}). How can we assist you with admissions and scholarships today?`
                    );
                    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMessage}` : `https://wa.me/919354935332?text=${waMessage}`;

                    return (
                      <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Student */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                              {reg.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {reg.fullName}
                              </span>
                              <span className="text-slate-500 block text-[11px]">
                                {reg.email}
                              </span>
                              {reg.phone && (
                                <span className="text-slate-400 block text-[10px]">
                                  {reg.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Source */}
                        <td className="py-3.5 px-4">
                          {getSourceBadge(reg.source)}
                        </td>

                        {/* Destination & Intake */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block text-xs">
                            {reg.destination}
                          </span>
                          <span className="text-[11px] text-blue-600 font-semibold block">
                            {reg.intake}
                          </span>
                        </td>

                        {/* Counselor & Slot */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {reg.sessionDate ? (
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {reg.sessionDate}
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                {reg.timeSlot || '04:00 PM'}
                              </span>
                              {reg.counselor && (
                                <span className="text-[10px] text-indigo-700 block mt-0.5">
                                  {reg.counselor}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">General Registration</span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={reg.status}
                            onChange={(e) => handleStatusChange(reg.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                              reg.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : reg.status === 'New'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : reg.status === 'In Progress'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : reg.status === 'Contacted'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        {/* Created At */}
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(reg.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Message Student on WhatsApp"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            <a
                              href={`mailto:${reg.email}?subject=Upbeat Abroad Education Advisory`}
                              title="Email Student"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            >
                              <Mail className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => handleDelete(reg.id)}
                              title="Delete Record"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add Student Lead Manually */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-900 p-6 text-white relative">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold font-display">Add Student Lead Manually</h3>
                <p className="text-xs text-slate-300 mt-1">Pushes lead directly to Firestore /registrations</p>
              </div>

              <form onSubmit={handleManualAdd} className="p-6 space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ananya@example.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Registration Source
                    </label>
                    <select
                      value={manualSource}
                      onChange={(e) => setManualSource(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="counselling_booking">Book Counselling</option>
                      <option value="free_session_booking">Book Free Session</option>
                      <option value="account_signup">Sign Up Tab</option>
                      <option value="account_signin">Sign In Tab</option>
                      <option value="contact_inquiry">Contact Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Destination
                    </label>
                    <select
                      value={manualDest}
                      onChange={(e) => setManualDest(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Ireland">Ireland</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Counselor Notes & Evaluation
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Walk-in student for Fall 2026 CS & AI with 8.5 CGPA."
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingLead}
                    className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
                  >
                    {addingLead ? 'Saving...' : 'Push to Firestore'}
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
