import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TESTIMONIALS } from '../../data/mockData';
import {
  ArrowRight,
  Star,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setCurrentPage, galleryItems } = useApp();

  // Filter images configured for Hero section (or sitewide 'all')
  const heroImages = galleryItems.filter(
    (item) => item.page === 'hero' || item.page === 'all' || !item.page
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide from left to right every 4.5 seconds
  useEffect(() => {
    if (heroImages.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroImages.length, isPaused]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroImages.length);
  };

  const currentHeroImage = heroImages[activeSlide] || heroImages[0];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION WITH LEFT-TO-RIGHT DYNAMIC IMAGE SLIDER */}
      <section className="bg-gradient-to-b from-[#25166B] via-[#1c1152] to-[#25166B] text-white pt-16 sm:pt-24 pb-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D5241B] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D5241B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC600]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Top Hero Grid: Copy on Left, Dynamic Left-to-Right Carousel on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D5241B] text-white text-xs font-black uppercase tracking-wider shadow-sm border border-[#FFC600]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC600]" />
                <span>Official 2026/2027 academic session Enrollment Open</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                <span className="text-[#FFC600] inline-block">
                  Unlock 300+ in UTME,
                </span>
                <br />
                <span className="text-white">
                  Straight A&apos;s in WAEC
                </span>
                <br />
                <span className="text-[#098CD0] inline-block">
                  &amp; Band 8+ in IELTS.
                </span>
              </h1>

              <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Accredited coaching at Doyin Plaza, Okomaiko, Lagos. Intensive morning &amp; evening batches with full computer CBT laboratory simulations.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setCurrentPage('admission')}
                  className="px-8 py-4 rounded-xl text-sm sm:text-base font-black bg-[#D5241B] hover:bg-[#b81d15] text-white shadow-xl transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer border-2 border-[#FFC600]"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage('services')}
                  className="px-7 py-4 rounded-xl text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#FFC600]" />
                  <span>Explore Programs</span>
                </button>
              </div>

              {/* Quick stats mini-row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="text-lg sm:text-2xl font-black text-[#FFC600] block">300+</span>
                  <span className="text-[11px] text-white/80 font-medium">JAMB CBT Scores</span>
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-black text-white block">100%</span>
                  <span className="text-[11px] text-white/80 font-medium">Accredited CBT Hall</span>
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-black text-[#098CD0] block">₦15k/₦20k</span>
                  <span className="text-[11px] text-white/80 font-medium">Morning / Evening</span>
                </div>
              </div>
            </div>

            {/* Right Column: Left-to-Right Hero Image Slider (5 Cols) */}
            <div className="lg:col-span-5">
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="relative bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-2 border-[#FFC600]/40 shadow-2xl overflow-hidden group"
              >
                {/* Image Display Window with Left-to-Right Motion */}
                <div className="relative aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden bg-slate-900 border border-white/20">
                  {currentHeroImage && (
                    <img
                      key={currentHeroImage.id}
                      src={currentHeroImage.imageUrl}
                      alt={currentHeroImage.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 animate-in fade-in slide-in-from-left-6"
                    />
                  )}

                  {/* Gradient Overlay & Captions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-4 sm:p-5 text-white">
                    {/* Top tags */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D5241B] text-white border border-[#FFC600]">
                        {currentHeroImage?.category || 'CBT Lab'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white border border-white/20">
                        {activeSlide + 1} / {heroImages.length}
                      </span>
                    </div>

                    {/* Bottom Title & Description */}
                    <div className="space-y-1">
                      <h3 className="font-black text-sm sm:text-base leading-snug text-white drop-shadow-sm">
                        {currentHeroImage?.title}
                      </h3>
                      {currentHeroImage?.caption && (
                        <p className="text-xs text-white/85 line-clamp-2 leading-relaxed font-medium">
                          {currentHeroImage.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left & Right Interactive Navigation Controls */}
                <div className="flex items-center justify-between pt-3 px-1">
                  <div className="flex items-center gap-1.5">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx
                            ? 'w-7 bg-[#FFC600]'
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="w-9 h-9 rounded-xl bg-white/15 hover:bg-[#D5241B] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                      title="Slide Left"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="w-9 h-9 rounded-xl bg-[#FFC600] hover:bg-[#e6b300] text-[#25166B] flex items-center justify-center font-black transition-colors cursor-pointer shadow-sm"
                      title="Slide Right"
                    >
                      <ChevronRight className="w-5 h-5 text-[#25166B]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left-to-Right Horizontal Scrolling Ribbon Strip of Hero Images */}
          {heroImages.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/80 font-bold px-1">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC600]" />
                  <span>Campus &amp; Facilities Showcase (Left-to-Right Flow):</span>
                </span>
                <span className="text-[11px] text-[#FFC600] font-mono font-normal">
                  Click any thumbnail to preview in slider
                </span>
              </div>

              {/* Horizontal Scroll Track */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                {heroImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`flex items-center gap-3 p-2 rounded-2xl border-2 transition-all cursor-pointer shrink-0 text-left ${
                      activeSlide === idx
                        ? 'border-[#FFC600] bg-white/20 shadow-md ring-2 ring-[#FFC600]/30'
                        : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30'
                    }`}
                    style={{ minWidth: '220px', maxWidth: '260px' }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#FFC600] block truncate">
                        {img.category}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate leading-tight">
                        {img.title}
                      </h4>
                      <span className="text-[10px] text-white/70 block mt-0.5">
                        {img.year || '2026/2027'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. SCHOLARS’ HALL OF FAME (TESTIMONIALS OF NIGERIAN STUDENTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#D5241B] bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
            Scholars’ Hall of Fame
          </span>
          <h2 className="text-3xl font-black text-[#25166B] tracking-tight">
            Real Results from Our Nigerian Scholars
          </h2>
          <p className="text-slate-600 text-sm">
            Read how D Ensured Consult transformed preparation into top university admissions for the 2026/2027 session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#FFC600]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFC600] text-[#FFC600]" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-5 flex items-center gap-3">
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D5241B]"
                />
                <div>
                  <h4 className="font-black text-sm text-[#25166B]">{t.name}</h4>
                  <p className="text-xs font-black text-[#D5241B]">{t.scoreAchieved}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {t.course} • {t.universityAdmitted}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BOTTOM ACTION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#25166B] via-[#1c1152] to-[#25166B] rounded-3xl p-8 sm:p-12 text-white shadow-xl border-2 border-[#D5241B] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Enroll for Official 2026/2027 academic session
            </h3>
            <p className="text-white/80 text-sm max-w-xl">
              Seats in our air-conditioned CBT halls and intensive morning &amp; evening batches fill up quickly. Complete your registration online today and download your official clearance ID &amp; receipt instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('admission')}
              className="px-7 py-4 rounded-xl text-sm font-black bg-[#D5241B] text-white hover:bg-[#b81d15] shadow-lg transition-all cursor-pointer border border-[#FFC600]"
            >
              Apply for Admission Now
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-6 py-4 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 transition-colors cursor-pointer"
            >
              Contact Us &amp; Locate Campus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
