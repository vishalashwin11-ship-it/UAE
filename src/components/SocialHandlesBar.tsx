import React, { useState } from 'react';
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Facebook, 
  Share2, 
  Check, 
  ExternalLink,
  Users
} from 'lucide-react';

export const SocialHandlesBar: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);

  const socialLinks = [
    {
      name: 'Facebook',
      handle: 'Upbeat Abroad Global',
      tag: 'Parent & Alumni Community',
      bgColor: 'hover:bg-indigo-50 hover:text-indigo-600',
      icon: <Facebook className="w-5 h-5" />,
      url: 'https://facebook.com/upbeatabroad',
    },
    {
      name: 'Instagram',
      handle: '@upbeat.abroad',
      tag: 'Campus Tours & Student Reels',
      bgColor: 'hover:bg-rose-50 hover:text-rose-600',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://instagram.com/upbeatabroad',
    },
    {
      name: 'YouTube',
      handle: 'Upbeat Abroad Official',
      tag: 'Visa Mocks & Masterclasses',
      bgColor: 'hover:bg-red-50 hover:text-red-600',
      icon: <Youtube className="w-5 h-5" />,
      url: 'https://youtube.com/@upbeatabroad',
    },
    {
      name: 'LinkedIn',
      handle: 'Upbeat Abroad Education',
      tag: 'Global Career Insights',
      bgColor: 'hover:bg-blue-50 hover:text-blue-600',
      icon: <Linkedin className="w-5 h-5" />,
      url: 'https://linkedin.com/company/upbeat-abroad-education',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              Join Our Global Community
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Connect on Official Social Media Channels
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Follow our daily webinars, student Q&As, visa updates, and campus life takeovers.
            </p>
          </div>

          <button
            onClick={handleCopyLink}
            className="self-start md:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Upbeat Abroad</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Social Cards: Facebook, Instagram, YouTube, LinkedIn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-white shadow-xs text-slate-700 ${item.bgColor} transition-colors`}>
                    {item.icon}
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {item.handle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-blue-600 font-semibold truncate">
                  {item.tag}
                </span>
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                  Visit →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
