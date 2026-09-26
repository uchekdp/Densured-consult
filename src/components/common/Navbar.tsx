import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Lock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo, isAdminLoggedIn } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageId; label: string; href: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', href: '#/home', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', href: '#/about', icon: <Award className="w-4 h-4" /> },
    { id: 'services', label: 'Services & Exams', href: '#/services', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', href: '#/gallery', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'admission', label: 'Admission', href: '#/admission', icon: <Calendar className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', href: '#/contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const handleNavClick = (e: React.MouseEvent, page: PageId) => {
    e.preventDefault();
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar - Primary Red #D5241B with Left-to-Right Moving Text */}
      <div className="bg-[#D5241B] text-white text-xs py-2 px-4 shadow-xs overflow-hidden border-b border-red-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="relative flex-1 overflow-hidden whitespace-nowrap py-0.5">
            <div className="animate-move-ltr flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFC600] text-[#25166B] uppercase tracking-wider shadow-xs">
                ★ Official 2026/2027 academic session Enrollment Open
              </span>
              <span className="text-white font-bold text-xs sm:text-[13px] tracking-wide">
                🎓 D Ensured Consult: UTME (JAMB CBT), WAEC, NECO, IELTS, ATSWA & SAT Masterclasses • Morning (9:00 AM) & Evening (2:00 PM) Batches Now Enrolling!
              </span>
              <span className="text-[#FFC600] font-black text-xs">
                ✦ DOYIN PLAZA, IGBOELERIN BUSSTOP, OKOMAIKO, LAGOS
              </span>
              <span className="text-white/90 font-medium text-xs">
                Call/WhatsApp: <strong className="text-white font-mono">08147896930</strong>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-white/90 shrink-0">
            <a
              href="tel:08147896930"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#FFC600]" />
              <span className="font-mono font-bold text-xs">08147896930</span>
            </a>
            <span className="text-white/50">|</span>
            <a
              href="https://wa.me/2348147896930?text=Hello%20D%20Ensured%20Consult,%20I%20want%20to%20inquire%20about%20UTME%20and%20IELTS%20preparation."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#FFC600] hover:underline font-bold text-xs"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with individual link */}
          <a
            href="#/home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <img
              src="/logo.jpg"
              alt="D Ensured Consult Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FFC600] shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-sky-600">
                  D ENSURED
                </span>
                <span className="font-black text-xl tracking-tight text-[#D5241B]">
                  CONSULT
                </span>
              </div>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#028D3B]">
                Education is power
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-50 text-[#D5241B] font-black border-b-2 border-[#D5241B]'
                      : 'text-[#1D1918]/80 hover:text-[#D5241B] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Portals and Admission CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* e-portal / Student Portal Link */}
            <a
              href="#/student-portal"
              onClick={(e) => handleNavClick(e, 'student-portal')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentPage === 'student-portal'
                  ? 'bg-[#25166B] text-white border-[#25166B] shadow-sm'
                  : 'bg-white text-[#25166B] border-slate-300 hover:border-[#098CD0] hover:text-[#098CD0]'
              }`}
              title="Access your individual e-portal (Student Portal)"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#098CD0]" />
              <span>e-portal</span>
            </a>

            {/* Admin Hub Link */}
            <a
              href="#/admin-portal"
              onClick={(e) => handleNavClick(e, 'admin-portal')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentPage === 'admin-portal'
                  ? 'bg-[#25166B] text-white border-[#25166B] shadow-sm'
                  : 'bg-slate-50 text-[#1D1918]/80 border-slate-300 hover:border-[#25166B]'
              }`}
              title="Directorate Executive Admin Terminal"
            >
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-3.5 h-3.5 text-[#028D3B]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Admin</span>
            </a>

            {/* Apply Admission CTA - Primary Red #D5241B */}
            <a
              href="#/admission"
              onClick={(e) => handleNavClick(e, 'admission')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#D5241B] text-white hover:bg-[#b81d15] shadow-sm transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#0a192f] hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#0a192f]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <a
              href="#/student-portal"
              onClick={(e) => handleNavClick(e, 'student-portal')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#25166B] text-white cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#098CD0]" />
              <span>e-portal</span>
            </a>

            <a
              href="#/admin-portal"
              onClick={(e) => handleNavClick(e, 'admin-portal')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 text-[#25166B] border border-slate-300 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#028D3B]" />
              <span>Admin Portal</span>
            </a>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-50 text-[#D5241B] font-extrabold border-l-4 border-[#D5241B]'
                      : 'text-[#1D1918]/80 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {link.icon}
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              );
            })}
          </div>

          <div className="pt-2">
            <a
              href="#/admission"
              onClick={(e) => handleNavClick(e, 'admission')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black bg-[#D5241B] text-white shadow-sm hover:bg-[#b81d15] transition-colors cursor-pointer"
            >
              <span>Enroll Now / Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
