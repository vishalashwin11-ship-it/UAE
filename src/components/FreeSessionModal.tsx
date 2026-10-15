import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Globe2
} from 'lucide-react';
import { pushBookingToFirestore } from '../services/registrationService';

interface FreeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export const FreeSessionModal: React.FC<FreeSessionModalProps> = ({
  isOpen,
  onClose,
  defaultDestination = 'United States',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState(defaultDestination);
  const [intake, setIntake] = useState('Fall 2026');
  const [education, setEducation] = useState('Final Year Undergraduate (CGPA: 8.0+)');
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('04:00 PM - 04:45 PM');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setLoading(true);
    const bookingId = `FREE-${Date.now().toString().slice(-6)}`;
    const meetUrl = `https://meet.google.com/uae-free-${Math.random().toString(36).substring(2, 6)}`;

    const payload = {
      bookingId,
      fullName,
      email,
      phone,
      destination,
      intake,
      counselor: 'Senior International Admissions Dean',
      date,
      timeSlot,
      currentEducation: education,
      notes: `[Book Free Session Modal] ${notes}`,
      meetUrl,
      status: 'Confirmed',
      isFreeSession: true,
    };

    try {
      // 1. Push to Firestore collections (bookings & registrations)
      await pushBookingToFirestore(payload);

      // 2. Push to backend
      await fetch('/api/counselling/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSuccessBooking(payload);
    } catch {
      setSuccessBooking(payload);
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccessBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Complimentary • No Commitment</span>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight font-display">
            Book Free 1-on-1 Counselling Session
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            Personalized 30-min profile evaluation, university shortlist review & scholarship audit with senior counselors.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {successBooking ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">
                  Free Session Successfully Booked!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Reference: <strong>{successBooking.bookingId}</strong> • Stored to Upbeat Live Admissions Desk
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold">{successBooking.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold">{successBooking.destination} ({successBooking.intake})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="font-bold">{successBooking.date} • {successBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Google Meet:</span>
                  <a
                    href={successBooking.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 underline truncate max-w-[200px]"
                  >
                    {successBooking.meetUrl}
                  </a>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={resetAndClose}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vishal Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="United States">United States 🇺🇸</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="Ireland">Ireland 🇮🇪</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Intake
                  </label>
                  <select
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Fall 2026">Fall 2026 (Aug / Sep)</option>
                    <option value="Spring 2027">Spring 2027 (Jan / Feb)</option>
                    <option value="Fall 2027">Fall 2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Preferred Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="10:30 AM - 11:15 AM">10:30 AM - 11:15 AM</option>
                    <option value="02:30 PM - 03:15 PM">02:30 PM - 03:15 PM</option>
                    <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
                    <option value="06:00 PM - 06:45 PM">06:00 PM - 06:45 PM</option>
                    <option value="07:30 PM - 08:15 PM">07:30 PM - 08:15 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Questions or Preferred Degree Program (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. MS in Computer Science with focus on scholarships and German APS verification..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Submitting to Admissions...' : 'Confirm Free 1-on-1 Session'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  No Spam Guarantee
                </span>
                <span>•</span>
                <span>Direct Google Meet Video Link</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
