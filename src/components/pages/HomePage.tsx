import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, BookOpen } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, setCurrentPage } = useApp();

  const handleNavigate = (page: 'admission' | 'services') => {
    if (typeof navigateTo === 'function') {
      navigateTo(page);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50 via-white to-blue-50/50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative subtle light ambient glows (No background images) */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* 
        HERO CONTENT:
        Light, attractive, clean card with strictly the 4 requested elements:
        1. "Unlock 300+ in UTME, Straight A's in WAEC & Band 8+ in IELTS."
        2. "Accredited coaching at Doyin Plaza, Okomaiko, Lagos. Intensive morning & evening batches with full computer CBT laboratory simulations."
        3. "Apply for Admission"
        4. "Explore programs"
      */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-sky-100 shadow-[0_20px_60px_-15px_rgba(2,132,199,0.15)] space-y-7 sm:space-y-9">
          <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.16]">
            <span className="text-[#D5241B] block">
              Unlock 300+ in UTME,
            </span>
            <span className="text-[#1e1b4b] block mt-1 sm:mt-2">
              Straight A&apos;s in WAEC
            </span>
            <span className="text-[#0284c7] block mt-1 sm:mt-2">
              &amp; Band 8+ in IELTS.
            </span>
          </h1>

          <p className="text-slate-700 text-base sm:text-xl md:text-2xl font-semibold leading-relaxed max-w-2xl mx-auto">
            Accredited coaching at Doyin Plaza, Okomaiko, Lagos. Intensive morning &amp; evening batches with full computer CBT laboratory simulations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => handleNavigate('admission')}
              className="px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-black bg-[#D5241B] hover:bg-[#b81d15] text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer border-2 border-[#FFC600]"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('services')}
              className="px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border-2 border-sky-300 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Explore programs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
