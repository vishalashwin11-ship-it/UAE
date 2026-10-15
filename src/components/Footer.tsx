import React from 'react';
import { 
  Globe2, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Facebook, 
  Sparkles,
  Phone
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAiChat: () => void;
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAiChat,
  onOpenBooking,
  onOpenWhatsApp,
}) => {
  return (
    <footer role="contentinfo" className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Overview (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 cursor-pointer group inline-flex"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-white font-display">
                    Upbeat
                  </span>
                  <span className="text-xs uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30">
                    Abroad
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                  Education Advisory
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Premier international education consultancy empowering students to achieve top admissions, generous scholarships, and high-ROI careers across USA, UK, Germany, Canada, Australia, Ireland, and UAE.
            </p>

            {/* Social media links: Only Facebook, Instagram, YouTube, LinkedIn */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/upbeatabroad"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/upbeatabroad"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@upbeatabroad"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/upbeat-abroad-education"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <nav aria-label="Study Destinations Links">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Top Destinations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇺🇸</span>
                  <span>Study in United States</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇬🇧</span>
                  <span>Study in United Kingdom</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇩🇪</span>
                  <span>Study in Germany</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇨🇦</span>
                  <span>Study in Canada</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇦🇺</span>
                  <span>Study in Australia</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇮🇪</span>
                  <span>Study in Ireland</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <span className="w-5 text-center text-sm">🇦🇪</span>
                  <span>Study in UAE</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Col 3: Services & Tools */}
          <nav aria-label="Services & Tools Links">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Services & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Profile Evaluation & Strategy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  University Shortlisting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  SOP & Essay Masterclass
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors">
                  Country Career Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors">
                  ROI & Payback Calculator
                </button>
              </li>
              <li>
                <button onClick={onOpenAiChat} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Upbeat AI Advisor
                </button>
              </li>
            </ul>
          </nav>

          {/* Col 4: Quick Action Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
              Book Consultation
            </h4>
            <p className="text-xs text-slate-400">
              Schedule your free 30-min admissions & scholarship review with our Academic Director.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm text-center"
            >
              Book Free Session
            </button>
            <button
              onClick={onOpenWhatsApp}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm text-center"
            >
              Chat on WhatsApp
            </button>
            <address className="not-italic pt-1 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-900">
              <span>Asia Desk:</span>
              <a href="tel:+919354935332" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                <Phone className="w-3 h-3" />
                +91 93549 35332
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Upbeat Abroad Education. All rights reserved.</p>
          <nav aria-label="Legal and Privacy Links" className="flex items-center gap-6">
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Contact Desk
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};
