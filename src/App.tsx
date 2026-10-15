import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationsSection } from './components/DestinationsSection';
import { CareerOptionsSection } from './components/CareerOptionsSection';
import { ServicesSection } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { BlogSection } from './components/BlogSection';
import { ContactUsSection } from './components/ContactUsSection';
import { SocialHandlesBar } from './components/SocialHandlesBar';
import { Footer } from './components/Footer';
import { AiChatbotModal } from './components/AiChatbotModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AuthModal } from './components/AuthModal';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { FreeSessionModal } from './components/FreeSessionModal';
import { Sparkles, Calendar, MessageSquare, ArrowRight, GraduationCap, FileCheck2, ShieldCheck, Phone } from 'lucide-react';

function MainApp() {
  const { user, isAdmin, loginAsAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFreeSessionOpen, setIsFreeSessionOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'admin'>('signin');

  // Pre-fill parameters for booking
  const [bookingDestination, setBookingDestination] = useState<string>('United States');
  const [bookingService, setBookingService] = useState<string>('');
  const [bookingCareer, setBookingCareer] = useState<string>('');

  const handleOpenBooking = (dest?: string, service?: string, career?: string) => {
    if (dest) setBookingDestination(dest);
    if (service) setBookingService(service);
    if (career) setBookingCareer(career);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'admin' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleExploreDestinations = (_destId?: string) => {
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCareers = (_domain?: string) => {
    setActiveTab('careers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Advisory Banner */}
      <div className="bg-slate-900 text-slate-200 text-[11px] sm:text-xs py-2 px-4 text-center font-medium border-b border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>
            <strong>Fall 2026 Admissions:</strong> Priority scholarship rounds are active!
          </span>
        </div>
        
        <span className="hidden sm:inline text-slate-700">|</span>

        {/* Regional Desk Asia Helpline */}
        <a 
          href="tel:+919354935332"
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
          title="Direct Asia Regional Admissions Desk"
        >
          <Phone className="w-3 h-3 text-emerald-400" />
          <span>Asia Regional Desk: 9354935332</span>
        </a>

        <span className="hidden sm:inline text-slate-700">|</span>

        {/* Quick Free Session CTA */}
        <button
          onClick={() => setIsFreeSessionOpen(true)}
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline underline-offset-2 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Book Free 1-on-1 Session</span>
        </button>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenFreeSession={() => setIsFreeSessionOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {/* ADMIN PORTAL VIEW */}
        {activeTab === 'admin' && (
          <AdminPortal
            onOpenBooking={() => handleOpenBooking()}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {/* STUDENT PORTAL VIEW */}
        {activeTab === 'portal' && (
          <StudentPortal
            onOpenBooking={() => handleOpenBooking()}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        )}

        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreDestinations={handleExploreDestinations}
              onExploreCareers={handleExploreCareers}
              onOpenBooking={() => handleOpenBooking()}
              onOpenAiChat={() => setIsAiChatOpen(true)}
              onOpenFreeSession={() => setIsFreeSessionOpen(true)}
            />

            {/* Quick Student Portal Callout Strip */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-5 border-y border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">
                      Looking for Course Recommendations & Application Tracking?
                    </h4>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Log in to access your Dream, Target, and Safe university shortlist & live stage 1-6 timeline.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {user ? (
                    <button
                      onClick={() => {
                        setActiveTab('portal');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Open My Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenAuth('signin')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleOpenAuth('signup')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span>Create Student Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DestinationsSection
              onSelectDestinationForBooking={(dest) => handleOpenBooking(dest)}
              onExploreCareersForCountry={(_countryId) => setActiveTab('careers')}
            />
            <CareerOptionsSection
              onOpenBookingForCareer={(role, dest) => handleOpenBooking(dest, undefined, role)}
            />
            <ServicesSection
              onBookService={(service) => handleOpenBooking(undefined, service)}
            />
            <BookingSection
              preselectedDestination={bookingDestination}
              preselectedService={bookingService}
              preselectedCareer={bookingCareer}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            />
            <SuccessStoriesSection
              onOpenBooking={() => handleOpenBooking()}
            />
            <BlogSection />
            <SocialHandlesBar />
            <ContactUsSection
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onOpenBooking={() => handleOpenBooking()}
            />
          </>
        )}

        {activeTab === 'destinations' && (
          <div>
            <DestinationsSection
              onSelectDestinationForBooking={(dest) => handleOpenBooking(dest)}
              onExploreCareersForCountry={(_countryId) => setActiveTab('careers')}
            />
            <CareerOptionsSection
              onOpenBookingForCareer={(role, dest) => handleOpenBooking(dest, undefined, role)}
            />
            <SocialHandlesBar />
          </div>
        )}

        {activeTab === 'careers' && (
          <div>
            <CareerOptionsSection
              onOpenBookingForCareer={(role, dest) => handleOpenBooking(dest, undefined, role)}
            />
            <DestinationsSection
              onSelectDestinationForBooking={(dest) => handleOpenBooking(dest)}
              onExploreCareersForCountry={(_countryId) => setActiveTab('careers')}
            />
            <SocialHandlesBar />
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <ServicesSection
              onBookService={(service) => handleOpenBooking(undefined, service)}
            />
            <BookingSection
              preselectedDestination={bookingDestination}
              preselectedService={bookingService}
              preselectedCareer={bookingCareer}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            />
            <SocialHandlesBar />
          </div>
        )}

        {activeTab === 'booking' && (
          <div>
            <BookingSection
              preselectedDestination={bookingDestination}
              preselectedService={bookingService}
              preselectedCareer={bookingCareer}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            />
            <SuccessStoriesSection
              onOpenBooking={() => handleOpenBooking()}
            />
          </div>
        )}

        {activeTab === 'success' && (
          <div>
            <SuccessStoriesSection
              onOpenBooking={() => handleOpenBooking()}
            />
            <BookingSection
              preselectedDestination={bookingDestination}
              preselectedService={bookingService}
              preselectedCareer={bookingCareer}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
            />
            <SocialHandlesBar />
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <BlogSection />
            <SocialHandlesBar />
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <ContactUsSection
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onOpenBooking={() => handleOpenBooking()}
            />
            <SocialHandlesBar />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Floating AI Chatbot trigger badge on bottom-left */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs rounded-full shadow-lg hover:shadow-xl shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>Ask Upbeat AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        onOpen={() => setIsWhatsAppOpen(true)}
      />

      {/* AI Chatbot Dialog Modal */}
      <AiChatbotModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onOpenBooking={() => {
          setIsAiChatOpen(false);
          handleOpenBooking();
        }}
      />

      {/* Firebase Sign In & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(targetMode?: string) => {
          if (targetMode === 'admin' || authModalMode === 'admin') {
            setActiveTab('admin');
          } else {
            setActiveTab('portal');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        initialMode={authModalMode}
      />

      {/* Book Free Session Modal */}
      <FreeSessionModal
        isOpen={isFreeSessionOpen}
        onClose={() => setIsFreeSessionOpen(false)}
        defaultDestination={bookingDestination}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
