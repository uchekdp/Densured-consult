import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  MessageCircle,
  Lock,
  UserCheck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const handleLinkClick = (e: React.MouseEvent, page: PageId, tab?: string) => {
    e.preventDefault();
    navigateTo(page, tab);
  };

  return (
    <footer className="bg-[#180e47] text-slate-300 border-t-4 border-[#D5241B]">
      {/* Upper CTA Banner */}
      <div className="bg-gradient-to-r from-[#25166B] via-[#1c1152] to-[#25166B] border-b border-[#D5241B]/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D5241B] text-white shadow-sm mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFC600]" />
              Official 2026/2027 Academic Session • 98.4% Pass Rate
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Secure Your High Score & University Admission?
            </h3>
            <p className="text-slate-200 text-sm mt-2 max-w-2xl">
              Join thousands of scholars at D Ensured Consult. Intensive CBT lab drills, past question breakdowns, and masterclasses for UTME, WAEC, NECO, IELTS & ATSWA.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <a
              href="#/admission"
              onClick={(e) => handleLinkClick(e, 'admission')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-extrabold bg-[#D5241B] text-white hover:bg-[#b01c14] transition-all shadow-lg text-center cursor-pointer active:scale-95"
            >
              Start Admission Online
            </a>
            <a
              href="https://wa.me/2348147896930?text=Hello%20D%20Ensured%20Consult,%20I%20would%20like%20to%20enroll%20for%20classes."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#FFC600]" />
              <span>Chat on WhatsApp: 08147896930</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Credibility */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="D Ensured Consult Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FFC600] shadow-md"
              />
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  D ENSURED <span className="text-[#D5241B]">CONSULT</span>
                </span>
                <p className="text-xs text-[#FFC600] font-bold uppercase tracking-wider">
                  Education is power
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed pr-4">
              D Ensured Consult is an educational tutorial center dedicated to rigorous student preparation for UTME (JAMB CBT), WAEC, NECO, IELTS, and ATSWA examinations with a track record of high scores and direct university admissions.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25166B] border border-white/10 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#009E49]" />
                JAMB CBT Accredited Software
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25166B] border border-white/10 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#009E49]" />
                British Council Certified Tutors
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25166B] border border-white/10 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#009E49]" />
                98.4% Proven Pass Rate
              </span>
            </div>
          </div>

          {/* Col 2: Programs */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Examination Programs
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  UTME (JAMB) CBT Coaching
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  WAEC / WASSCE Science & Arts
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  NECO Senior School Certificate
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  IELTS Academic & General
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  ATSWA Professional Accounting
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  SAT & TOEFL Coaching
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Portals & Pages
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="#/student-portal"
                  onClick={(e) => handleLinkClick(e, 'student-portal')}
                  className="text-[#FFC600] hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>e-portal (Student Portal)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="#/admin-portal"
                  onClick={(e) => handleLinkClick(e, 'admin-portal')}
                  className="text-white hover:text-[#FFC600] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D5241B]" />
                  <span>Admin Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="#/home"
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className="hover:text-[#FFC600] transition-colors cursor-pointer block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#/about"
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="hover:text-[#FFC600] transition-colors cursor-pointer block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => handleLinkClick(e, 'services')}
                  className="hover:text-[#FFC600] transition-colors cursor-pointer block"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="#/gallery"
                  onClick={(e) => handleLinkClick(e, 'gallery')}
                  className="hover:text-[#FFC600] transition-colors cursor-pointer block"
                >
                  Campus Gallery
                </a>
              </li>
              <li>
                <a
                  href="#/admission"
                  onClick={(e) => handleLinkClick(e, 'admission')}
                  className="hover:text-[#FFC600] transition-colors cursor-pointer block"
                >
                  Admission Processing
                </a>
              </li>
              <li>
                <a
                  href="#/contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="hover:text-[#FFC600] transition-colors cursor-pointer block"
                >
                  Contact & Office Map
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Office Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Office Location
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D5241B] shrink-0" />
                  Office Address:
                </p>
                <p className="mt-0.5 pl-4.5 text-slate-200 font-medium leading-relaxed">
                  DOYIN PLAZA, IGBOELERIN BUSSTOP<br />
                  BESIDE PRIME-MART, OKOMAIKO, LAGOS
                </p>
              </div>

              <div>
                <p className="font-semibold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D5241B] shrink-0" />
                  Office Hours:
                </p>
                <p className="mt-0.5 pl-4.5">
                  Mon – Fri: 8:00 AM – 6:30 PM
                  <br />
                  Saturday: 8:30 AM – 5:00 PM
                </p>
              </div>

              <div>
                <p className="font-semibold text-white flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#D5241B] shrink-0" />
                  Phone & WhatsApp:
                </p>
                <p className="mt-0.5 pl-4.5 font-mono text-slate-200">
                  <a href="tel:08147896930" className="hover:text-[#FFC600]">08147896930</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} D Ensured Consult. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="#/contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="hover:text-white cursor-pointer"
            >
              Terms & Guidelines
            </a>
            <span>•</span>
            <a
              href="#/contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="hover:text-white cursor-pointer"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
