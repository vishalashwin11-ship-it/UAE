import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  ShieldCheck,
  Mail,
  Phone,
  Globe2 
} from 'lucide-react';
import { pushRegistrationToFirestore } from '../services/registrationService';

interface ContactUsSectionProps {
  onOpenWhatsApp: () => void;
  onOpenBooking: () => void;
}

export const ContactUsSection: React.FC<ContactUsSectionProps> = ({
  onOpenWhatsApp,
  onOpenBooking,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('USA');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);


  const faqs = [
    {
      q: 'Are your initial counseling and profile evaluation sessions really free?',
      a: 'Yes, 100% free! Every student is entitled to a complimentary 30-minute 1-on-1 strategy session with a senior counselor to review your GPA, test scores, target countries, and realistic admit possibilities with zero upfront commitment.',
    },
    {
      q: 'When should I begin my study abroad application process?',
      a: 'Ideally 9 to 12 months prior to your target intake. For Fall 2026 admissions, the optimal preparation starts between September and January to meet early priority scholarship deadlines and ensure comfortable visa appointment slots.',
    },
    {
      q: 'Do you help students with lower GPAs or backlogs?',
      a: 'Absolutely. A great SOP, strong research portfolio, competitive GRE/GMAT scores, and strategic university shortlisting regularly overcome GPA constraints. Over 40% of our successful students came from non-premier colleges with modest transcripts.',
    },
    {
      q: 'How does Upbeat assist with student visa applications and interviews?',
      a: 'We provide an end-to-end consular audit: DS-160/CAS verification, financial proof reviews, blocked account guidance for Germany, and 3 full-length video mock interviews with former consular officers.',
    },
    {
      q: 'Can I study in Germany completely tuition-free in English?',
      a: 'Yes! Germany has over 2,000 international Master’s degree programs taught entirely in English at public universities that charge zero tuition fees for all international students (with only a nominal semester contribution of ~€300).',
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Push directly to Firestore registrations
      await pushRegistrationToFirestore({
        id: `REG-${ticketId}`,
        fullName: name,
        email,
        phone,
        source: 'contact_inquiry',
        destination,
        intake: 'Fall 2026',
        counselor: 'Regional Desk',
        notes: message,
        status: 'New',
      });

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, destination, message }),
      });
      setSubmittedTicket(ticketId);
    } catch {
      setSubmittedTicket(ticketId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            Global Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Get in Touch with Our Global Advisors
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Have questions about Fall 2026 intake, visa eligibility, or university selection? Speak with our experts.
          </p>
        </div>

        {/* Contact Grid: Form + Quick Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 bg-slate-50/70 p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Send Us an Enquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Average counselor response time: under 3 business hours.
              </p>
            </div>

            {submittedTicket ? (
              <div className="bg-white p-8 rounded-2xl border border-emerald-200 text-center animate-in fade-in duration-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Enquiry Received!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Ticket #{submittedTicket} has been generated. An assigned regional counselor will reach out to you via WhatsApp and email shortly.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="mt-5 px-5 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vishal Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
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
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      WhatsApp Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Destination of Interest
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="USA">🇺🇸 United States</option>
                      <option value="UK">🇬🇧 United Kingdom</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Australia">🇦🇺 Australia</option>
                      <option value="Ireland">🇮🇪 Ireland</option>
                      <option value="UAE">🇦🇪 United Arab Emirates</option>
                      <option value="Multiple">Multiple / Undecided</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Your Message / Specific Query
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your background, intended course, budget, or any specific admission hurdles..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit Student Enquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Direct Contact Channels: 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Asia Regional Desk Helpline Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-indigo-700/40 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">
                      Regional Desk
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Asia Admissions Hub
                    </h4>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Active Now
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Dedicated regional coordinator for student profile evaluations, scholarships, and visa appointments across India, UAE, and Southeast Asia.
              </p>

              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-black tracking-wide text-white">
                    +91 93549 35332
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-300">Mon - Sat (9am - 8pm IST)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+919354935332"
                  className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Asia Desk</span>
                </a>
                <a
                  href="https://wa.me/919354935332?text=Hello%20Upbeat%20Asia%20Regional%20Desk!%20I%20would%20like%20guidance%20on%20study%20abroad%20admissions."
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Quick Box */}
            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200/90 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    Instant WhatsApp Advisory
                  </h4>
                  <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Senior Counselor Online Now
                  </span>
                </div>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                Prefer immediate messaging? Connect directly with our lead admissions coordinators on WhatsApp for quick query resolutions.
              </p>
              <button
                onClick={onOpenWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Direct Booking Box */}
            <div className="bg-blue-50/80 rounded-3xl p-6 border border-blue-200/90 shadow-2xs">
              <h4 className="text-sm font-extrabold text-blue-950 mb-1">
                Prefer a Face-to-Face Video Consultation?
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed mb-4">
                Reserve a 30-minute private slot with our Academic Director via Google Meet to evaluate your transcripts and scholarships.
              </p>
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Book 1-on-1 Consultation
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Privacy Guarantee</span>
                <span>Your academic data and phone number are strictly confidential. We never sell student data or spam.</span>
              </div>
            </div>
          </div>
        </div>


        {/* Frequently Asked Questions (FAQ) Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Clear answers to the most common queries from students and parents.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
