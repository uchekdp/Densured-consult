import React from 'react';
import {
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Award,
  BookCheck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#081426] text-slate-300 border-t-4 border-sky-500">
      {/* Upper CTA Banner - Deep Navy Blue */}
      <div className="bg-gradient-to-r from-[#060e1c] via-[#0b1b36] to-[#060e1c] border-b border-sky-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-300 border border-sky-700/60 shadow-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Official 2026/2027 Academic Session • 98.4% Pass Rate
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">
              Ready to Secure Your High Score &amp; University Admission?
            </h3>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl font-medium">
              Join thousands of scholars at D Ensured Consult. Intensive CBT lab drills, past question breakdowns, and masterclasses for UTME, WAEC, NECO, IELTS &amp; ATSWA.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <a
              href="https://wa.me/2348147896930?text=Hello%20D%20Ensured%20Consult,%20I%20would%20like%20to%20enroll%20for%20classes."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-extrabold bg-[#D5241B] hover:bg-[#b01c14] text-white border border-[#FFC600] transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp: 08147896930</span>
            </a>
            <a
              href="tel:08147896930"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#0d2242] hover:bg-[#122e57] text-sky-300 border border-sky-700/50 transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>Call Helpline: 08147896930</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Navy Blue */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#081426]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: Brand & Directorate Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="D Ensured Consult Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-sky-400 shadow-md"
              />
              <div>
                <span className="font-extrabold text-xl text-sky-400 tracking-tight">
                  D ENSURED <span className="text-[#D5241B]">CONSULT</span>
                </span>
                <p className="text-xs text-[#009E49] font-bold uppercase tracking-wider">
                  Education is power
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed pr-4 font-medium">
              D Ensured Consult is an educational tutorial center dedicated to rigorous student preparation for UTME (JAMB CBT), WAEC, NECO, IELTS, and ATSWA examinations with a track record of high scores and direct university admissions.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e223f] border border-sky-800/60 text-slate-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#009E49]" />
                JAMB CBT Accredited Software
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e223f] border border-sky-800/60 text-slate-200 font-medium">
                <Award className="w-3.5 h-3.5 text-[#009E49]" />
                British Council Certified Tutors
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e223f] border border-sky-800/60 text-slate-200 font-medium">
                <BookCheck className="w-3.5 h-3.5 text-[#009E49]" />
                98.4% Proven Pass Rate
              </span>
            </div>
          </div>

          {/* Col 2: Academic Programs Overview (Informational, No page/portal links) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sky-400 font-bold text-sm uppercase tracking-wider">
              Coaching Specializations
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>UTME (JAMB) CBT Coaching</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>WAEC / WASSCE Science &amp; Arts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>NECO Senior School Certificate</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>IELTS Academic &amp; General</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>ATSWA Professional Accounting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Post-UTME Screening Drills</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Office Location & Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sky-400 font-bold text-sm uppercase tracking-wider">
              Campus Headquarters
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <p className="font-bold text-sky-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D5241B] shrink-0" />
                  Office Address:
                </p>
                <p className="mt-1 pl-5 text-slate-200 font-medium leading-relaxed">
                  DOYIN PLAZA, IGBOELERIN BUSSTOP<br />
                  BESIDE PRIME-MART, OKOMAIKO, LAGOS
                </p>
              </div>

              <div>
                <p className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Office Hours:
                </p>
                <p className="mt-1 pl-5 font-medium text-slate-300">
                  Mon – Fri: 8:00 AM – 6:30 PM
                  <br />
                  Saturday: 8:30 AM – 5:00 PM
                </p>
              </div>

              <div>
                <p className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  Phone &amp; WhatsApp:
                </p>
                <p className="mt-1 pl-5 font-mono font-bold text-sky-300 text-sm">
                  <a href="tel:08147896930" className="hover:text-white transition-colors">08147896930</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Directorate Notice */}
        <div className="mt-10 pt-6 border-t border-sky-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} D Ensured Consult. Directorate &amp; Super Admin: Mr Akinjo Rotimi.</p>
          <p className="text-slate-400">
            Doyin Plaza, Okomaiko, Lagos State, Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
