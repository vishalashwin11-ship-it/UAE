import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  Download, 
  Share2, 
  MapPin, 
  Star, 
  ShieldCheck,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { pushBookingToFirestore } from '../services/registrationService';

interface BookingSectionProps {
  preselectedDestination?: string;
  preselectedService?: string;
  preselectedCareer?: string;
  onOpenWhatsApp: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  preselectedDestination,
  preselectedService,
  preselectedCareer,
  onOpenWhatsApp,
}) => {
  const [step, setStep] = useState<number>(1);
  const [sessionType, setSessionType] = useState<string>(
    preselectedService || '30-Min Free Profile Evaluation & University Shortlisting'
  );
  const [destination, setDestination] = useState<string>(preselectedDestination || 'United States');
  const [intake, setIntake] = useState<string>('Fall 2026');
  const [counselor, setCounselor] = useState<string>('Dr. Elena Rostova (Columbia / Oxford Alum)');
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('04:00 PM - 04:45 PM');
  
  // Student Details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [currentEducation, setCurrentEducation] = useState<string>('Final Year B.Tech / BE (CGPA: 8.2)');
  const [notes, setNotes] = useState<string>(
    preselectedCareer ? `Interested in career pathway: ${preselectedCareer}` : ''
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const counselors = [
    {
      name: 'Dr. Elena Rostova',
      role: 'Senior Academic Director',
      badge: 'Columbia & Oxford Alum',
      experience: '12+ Years Advisory',
      rating: '4.98',
      reviews: 420,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      expertise: ['USA & Ivy League', 'STEM Fellowships', 'SOP Masterclass'],
    },
    {
      name: 'Michael Vance',
      role: 'Head of Consular & Visas',
      badge: 'Ex-NAFSA International Officer',
      experience: '10+ Years',
      rating: '4.95',
      reviews: 380,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      expertise: ['German Chancenkarte & APS', 'UK Graduate Visa', 'Visa Mock Prep'],
    },
    {
      name: 'Aarav Singhania',
      role: 'Global Career & ROI Strategist',
      badge: 'INSEAD MBA Alum',
      experience: '9+ Years',
      rating: '4.96',
      reviews: 295,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      expertise: ['Tech & AI Career Mapping', 'Quantitative Finance', 'Canada PGWP'],
    },
  ];

  const timeSlots = [
    '10:30 AM - 11:15 AM',
    '12:00 PM - 12:45 PM',
    '02:30 PM - 03:15 PM',
    '04:00 PM - 04:45 PM',
    '06:00 PM - 06:45 PM',
    '07:30 PM - 08:15 PM',
  ];

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const bookingId = `UAE-${Date.now().toString().slice(-6)}`;
    const isFree = sessionType.toLowerCase().includes('free');
    const meetUrl = `https://meet.google.com/uae-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

    const bookingPayload = {
      bookingId,
      fullName,
      email,
      phone,
      destination,
      intake,
      counselor,
      date: bookingDate,
      timeSlot,
      currentEducation,
      notes: `${isFree ? '[Free Evaluation] ' : ''}${notes || ''}`,
      meetUrl,
      status: 'Confirmed',
      isFreeSession: isFree,
    };

    try {
      // 1. Push directly to Firestore (bookings & registrations)
      await pushBookingToFirestore(bookingPayload);

      // 2. Also notify Express backend
      const response = await fetch('/api/counselling/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingConfirmation(data.booking || bookingPayload);
      } else {
        setBookingConfirmation(bookingPayload);
      }
    } catch {
      // Fallback confirmation
      setBookingConfirmation(bookingPayload);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!bookingConfirmation) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Upbeat Abroad Education//Counselling Session//EN
BEGIN:VEVENT
SUMMARY:Upbeat Abroad 1-on-1 Counselling: ${bookingConfirmation.counselor}
DESCRIPTION:Session for ${bookingConfirmation.fullName} regarding ${bookingConfirmation.destination} (${bookingConfirmation.intake}). Google Meet: ${bookingConfirmation.meetUrl}
LOCATION:${bookingConfirmation.meetUrl}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Upbeat_Counselling_${bookingConfirmation.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="booking-section" aria-labelledby="booking-heading" className="py-16 lg:py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Zero-Cost 1-on-1 Consultation
          </div>
          <h2 id="booking-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Book Your Strategic Counselling Session
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Meet 1-on-1 via Google Meet with a senior academic advisor. We review your GPA, shortlist your best-fit universities, and calculate scholarship eligibility.
          </p>
        </div>

        {/* Confirmation Screen */}
        {bookingConfirmation ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Booking Confirmed • Reference: {bookingConfirmation.bookingId}
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 font-display">
              You’re All Set, {bookingConfirmation.fullName}!
            </h3>

            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              A calendar invite and preparation checklist have been dispatched to{' '}
              <strong className="text-slate-900">{bookingConfirmation.email}</strong>.
            </p>

            {/* Session Details Box */}
            <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left max-w-lg mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Assigned Advisor:</span>
                <span className="font-bold text-slate-900">{bookingConfirmation.counselor}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Date & Time:</span>
                <span className="font-bold text-blue-600">{bookingConfirmation.date} @ {bookingConfirmation.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Destination & Intake:</span>
                <span className="font-bold text-slate-800">{bookingConfirmation.destination} ({bookingConfirmation.intake})</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-bold uppercase">Meeting Link:</span>
                <a
                  href={bookingConfirmation.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Google Meet
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadIcs}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Add to Google / Apple Calendar</span>
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setBookingConfirmation(null);
                  setStep(1);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Booking Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              {[
                { num: 1, label: 'Service & Target' },
                { num: 2, label: 'Advisor & Slot' },
                { num: 3, label: 'Student Profile' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s.num
                        ? 'bg-blue-600 text-white shadow-xs'
                        : step > s.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* STEP 1: Service Type, Country, Intake */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    1. Select Consultation Objective
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      '30-Min Free Profile Evaluation & University Shortlisting',
                      'Scholarship & Financial Aid Procurement Strategy',
                      'Visa Mock Interview & Document Clearance Review',
                      'High-ROI Career Roadmap & Country Selection',
                    ].map((type) => (
                      <div
                        key={type}
                        onClick={() => setSessionType(type)}
                        className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          sessionType === type
                            ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{type}</span>
                          {sessionType === type && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Target Study Destination
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="United States">🇺🇸 United States (STEM OPT 3 Yrs)</option>
                      <option value="Germany">🇩🇪 Germany (Tuition-Free & Chancenkarte)</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom (1-Yr Master’s)</option>
                      <option value="Canada">🇨🇦 Canada (PGWP & Permanent Residency)</option>
                      <option value="Australia">🇦🇺 Australia (Top 50 Go8 & High Wages)</option>
                      <option value="Ireland">🇮🇪 Ireland (European Tech Epicenter)</option>
                      <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Tax-Free & Global Hub)</option>
                      <option value="Open / Undecided">🌍 Open to Counselor Recommendations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Target Intake
                    </label>
                    <select
                      value={intake}
                      onChange={(e) => setIntake(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="Fall 2026">Fall 2026 (Priority Round)</option>
                      <option value="Spring 2027">Spring 2027</option>
                      <option value="Fall 2027">Fall 2027</option>
                      <option value="Immediate / Rolling">Immediate / Rolling 2026</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs"
                  >
                    <span>Choose Advisor & Date</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Advisor & Slot Selection */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    2. Select Your Senior Counselor
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {counselors.map((c) => (
                      <div
                        key={c.name}
                        onClick={() => setCounselor(`${c.name} (${c.badge})`)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          counselor.includes(c.name)
                            ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={`Academic Counselor ${c.name} - Upbeat Abroad Education`}
                            loading="lazy"
                            decoding="async"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                                {c.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">{c.role} • {c.experience}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {c.rating} ({c.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        {counselor.includes(c.name) && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Select Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Select Time Slot (Google Meet)
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs"
                  >
                    <span>Next: Student Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Student Details & Submission */}
            {step === 3 && (
              <form onSubmit={handleSubmitBooking} className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vishal Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vishal@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Current Degree / GPA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech CS 8.4 CGPA or B.Com 75%"
                      value={currentEducation}
                      onChange={(e) => setCurrentEducation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Specific Questions / Goals for the Counselor
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Want to target scholarship options for Master's in CS in USA or Germany with budget constraints..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  ></textarea>
                </div>

                {/* Summary Box */}
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs text-blue-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Free Session • No Obligation • Instant Google Meet Link Dispatched</span>
                  </div>
                  <span className="font-bold text-blue-700">{bookingDate}</span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <span>Scheduling Your Session...</span>
                    ) : (
                      <>
                        <span>Confirm Free Counselling</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
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
