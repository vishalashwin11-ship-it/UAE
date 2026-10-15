import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Phone,
  ShieldCheck,
  Globe2
} from 'lucide-react';

interface WhatsAppWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [selectedNumber, setSelectedNumber] = useState('+1 (212) 890-4420');
  const [userQuery, setUserQuery] = useState(
    'Hi Upbeat Team! I would like to check my profile and university options for Fall 2026 admissions.'
  );

  const starterMessages = [
    'Hi Upbeat! I’d like a free profile evaluation for Fall 2026 Master’s programs.',
    'Hello! Which scholarships can I target with an 8.2 CGPA and GRE 320?',
    'Hi! Can you guide me on Germany’s zero tuition universities and Chancenkarte?',
    'Hello! I need assistance with US F-1 visa mock interview and DS-160 filing.',
  ];

  const handleLaunchWhatsApp = () => {
    // Clean phone number for URL
    const cleanPhone = selectedNumber.replace(/\D/g, '');
    const encodedText = encodeURIComponent(userQuery);
    const url = `https://wa.me/${cleanPhone || '12128904420'}?text=${encodedText}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <>
      {/* Floating Button (visible when widget not open) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
          <div className="hidden sm:flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200/90 shadow-md text-xs font-semibold text-slate-700 animate-in fade-in slide-in-from-right duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            <span>Advisors Online • Chat on WhatsApp</span>
          </div>

          <button
            onClick={onOpen}
            className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
            aria-label="Open WhatsApp Chat"
          >
            <MessageSquare className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white text-[10px] font-bold flex items-center justify-center">
              1
            </span>
          </button>
        </div>
      )}

      {/* WhatsApp Chat Popup Box */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
          {/* Header */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-700"></span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold tracking-wide font-display">
                  Upbeat WhatsApp Advisory
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>Typically replies in 3 mins</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-emerald-50/40 space-y-3">
            {/* Counselor message preview */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-emerald-100 shadow-2xs text-xs text-slate-800 leading-relaxed">
              <p className="font-semibold text-emerald-950 mb-1">
                👋 Hello! Welcome to Upbeat Abroad Education.
              </p>
              <p className="text-slate-600">
                How can our senior counseling team assist you today? Select a common query or type your custom message below to launch direct WhatsApp chat.
              </p>
              <span className="text-[10px] text-slate-400 block mt-1 text-right">
                Official Verification Badge ✓
              </span>
            </div>

            {/* Regional number selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Select Your Regional Desk
              </label>
              <select
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="+1 (212) 890-4420">🇺🇸 Americas & Global (+1 212 890 4420)</option>
                <option value="+44 20 7946 0812">🇬🇧 UK & Europe (+44 20 7946 0812)</option>
                <option value="+91 98765 43210">🇮🇳 South Asia Hub (+91 98765 43210)</option>
              </select>
            </div>

            {/* Quick Starters */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Quick Starters
              </span>
              <div className="space-y-1">
                {starterMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserQuery(msg)}
                    className={`w-full text-left p-2 rounded-xl text-[11px] leading-tight border transition-colors ${
                      userQuery === msg
                        ? 'bg-emerald-100/70 border-emerald-300 font-semibold text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Message Preview
              </label>
              <textarea
                rows={2}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
              ></textarea>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunchWhatsApp}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Start WhatsApp Chat Now</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Business Account • 100% Free Consultation</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
