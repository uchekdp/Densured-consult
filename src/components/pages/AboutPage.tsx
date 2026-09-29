import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Target,
  ArrowRight,
  Compass,
  Award,
  BookOpen,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const teamMembers = [
    {
      name: 'Mr. Akinjo Rotimi',
      role: 'Directorate & Super Admin',
      credentials: 'B.Sc. Mathematics & Statistics (OAU), Pioneer Educational Consultant',
      bio: 'Visionary founder and Directorate of D Ensured Consult. With over 15 years pioneering standardized examination tutoring, CBT diagnostics, and student mentorship in Lagos, he has guided thousands to top university admissions.',
      initials: 'AR',
      accentColor: 'bg-sky-100 text-sky-700 border-sky-300',
    },
    {
      name: 'Mrs. Abigail Mensah',
      role: 'Lead IELTS Examiner & International Studies Dean',
      credentials: 'MA Applied Linguistics (Manchester), British Council Certified Trainer',
      bio: 'Specialist in English phonetics, academic writing cohesion, and UKVI language clearance with hundreds of Band 8.0+ scholars.',
      initials: 'AM',
      accentColor: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    },
    {
      name: 'Dr. Kelechi Okafor',
      role: 'Head of STEM & Medical Pre-Degree Track',
      credentials: 'M.Sc. Physics (UNN), Ph.D. Applied Biophysics',
      bio: 'Architect of our renowned UTME physics and chemistry shortcuts. Has mentored more than 140 students who gained admission into Medicine & Surgery.',
      initials: 'KO',
      accentColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    },
    {
      name: 'Engr. Taiwo Balogun',
      role: 'Chief Examiner WAEC & NECO Mathematics',
      credentials: 'B.Eng. Mechanical Engineering (OAU), WAEC Marking Team Leader',
      bio: 'Transforms students from mathematics anxiety to straight A1s in General Mathematics, Further Maths, and Technical Drawing.',
      initials: 'TB',
      accentColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  return (
    <div className="space-y-16 pb-16 bg-slate-50/60">
      {/* Hero Banner - Attractive Light Colors (No Images) */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-sky-50 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-sky-200">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider border border-sky-300">
            <GraduationCap className="w-4 h-4 text-sky-600" />
            <span>Official 2026/2027 academic session • Education is Power</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto text-sky-600">
            About D Ensured Consult
          </h1>
          <p className="text-sky-800 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
            Bridging the gap between secondary school curriculum and competitive university entry standards for UTME, WAEC, NECO, GCE, Adult Education, and IELTS examinations from our dedicated Lagos center.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-sky-100 hover:border-sky-300 shadow-sm space-y-4 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-2xl font-black text-sky-600">Our Mission</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              To dismantle exam failure by providing high-precision coaching, authentic computer-based testing technology, and personalized academic counseling that guarantees admissions into world-class universities in Nigeria and abroad.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-sky-100 hover:border-sky-300 shadow-sm space-y-4 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Compass className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-2xl font-black text-sky-600">Our Vision</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              To be Africa&apos;s most reputable and technologically advanced educational consultancy, renowned for unmatched pass rates, academic integrity, and holistic scholar development.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-300 px-3.5 py-1 rounded-full">
            Ethos &amp; Foundation
          </span>
          <h2 className="text-3xl font-black text-sky-600 tracking-tight">Our Core Values</h2>
          <p className="text-sky-800 text-sm font-semibold">
            Guiding principles powering exceptional student performance and academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border-2 border-sky-100 hover:border-sky-300 space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-black">
              1
            </div>
            <h4 className="font-black text-sky-600 text-base">Academic Rigor</h4>
            <p className="text-slate-700 text-xs leading-relaxed font-medium">
              No shortcuts or compromises. We teach deep conceptual understanding that enables students to solve any question variation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-sky-100 hover:border-sky-300 space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-black">
              2
            </div>
            <h4 className="font-black text-sky-600 text-base">Zero Malpractice</h4>
            <p className="text-slate-700 text-xs leading-relaxed font-medium">
              We uphold uncompromised examination ethics. Our students achieve 300+ and straight A1s through sheer mastery and disciplined practice.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-sky-100 hover:border-sky-300 space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-black">
              3
            </div>
            <h4 className="font-black text-sky-600 text-base">Technological Leadership</h4>
            <p className="text-slate-700 text-xs leading-relaxed font-medium">
              From automated CBT engines to our dedicated student e-portal, modern technology is woven into our everyday student journey.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-sky-100 hover:border-sky-300 space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-black">
              4
            </div>
            <h4 className="font-black text-sky-600 text-base">Individualized Mentorship</h4>
            <p className="text-slate-700 text-xs leading-relaxed font-medium">
              Every student is assigned a personal academic advisor who tracks diagnostic weak points, study habits, and psychological exam readiness.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Stage Learning Framework - Clean Design */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/70 rounded-3xl p-8 sm:p-12 space-y-8 border-2 border-sky-200 shadow-md">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-300 px-3 py-1 rounded-full">
              Our Proven Formula
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-600">
              The D Ensured 4-Stage Mastery Framework
            </h3>
            <p className="text-sky-800 text-xs sm:text-sm font-semibold">
              How we systematically elevate candidate scores across all exam categories for the Official 2026/2027 academic session:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-sky-200 space-y-3 shadow-xs">
              <div className="text-sky-600 font-black font-mono text-xs">STAGE 01</div>
              <h4 className="text-base font-bold text-sky-600">Diagnostic Entry Audit</h4>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">
                Every enrollee sits for a baseline assessment to uncover specific cognitive blind spots across each syllabus topic.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sky-200 space-y-3 shadow-xs">
              <div className="text-sky-600 font-black font-mono text-xs">STAGE 02</div>
              <h4 className="text-base font-bold text-sky-600">Syllabus Deconstruction</h4>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">
                Intensive lectures conducted by seasoned examiners covering 100% of the prescribed curriculum with formula breakdowns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sky-200 space-y-3 shadow-xs">
              <div className="text-sky-600 font-black font-mono text-xs">STAGE 03</div>
              <h4 className="text-base font-bold text-sky-600">High-Pressure CBT Drills</h4>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">
                Weekly timed computer assessments that condition students to answer 40 questions in under 30 minutes without panic.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sky-200 space-y-3 shadow-xs">
              <div className="text-sky-600 font-black font-mono text-xs">STAGE 04</div>
              <h4 className="text-base font-bold text-sky-600">Admission Placement Advisory</h4>
              <p className="text-slate-700 text-xs leading-relaxed font-medium">
                Post-exam guidance on subject combination matching, university catchment quotas, and Post-UTME screening applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team (Typography & Badges - No Images) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-300 px-3.5 py-1 rounded-full">
            Faculty of Authorities
          </span>
          <h2 className="text-3xl font-black text-sky-600 tracking-tight">
            Academic Leadership &amp; Faculty
          </h2>
          <p className="text-sky-800 text-sm font-semibold">
            Guided by certified examiners, education directors, and international test consultants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-xl shadow-xs ${member.accentColor}`}>
                  {member.initials}
                </div>
                <div>
                  <h4 className="font-black text-sky-600 text-base">{member.name}</h4>
                  <p className="text-xs font-bold text-sky-700">{member.role}</p>
                </div>
                <p className="text-[11px] text-slate-700 font-bold">{member.credentials}</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{member.bio}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Faculty Lead</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Program Tuition Overview Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-8 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-300 px-3 py-1 rounded-full">
              Official Center Tuition
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-600">
              Affordable, High-Standard Academic Fees
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Transparent program tuition fees for the Official 2026/2027 Academic Session:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-2">
              <span className="text-xs font-bold text-sky-800 uppercase block">JAMB • WAEC • NECO • GCE</span>
              <p className="text-3xl font-black text-[#D5241B]">₦20,000</p>
              <p className="text-xs text-slate-600 font-medium">Full intensive coaching &amp; CBT drills</p>
            </div>

            <div className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-2">
              <span className="text-xs font-bold text-sky-800 uppercase block">IELTS Academic &amp; General</span>
              <p className="text-3xl font-black text-[#25166B]">₦70,000</p>
              <p className="text-xs text-slate-600 font-medium">Audio listening lab &amp; Band 8+ coaching</p>
            </div>

            <div className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-2">
              <span className="text-xs font-bold text-sky-800 uppercase block">Adult Education</span>
              <p className="text-3xl font-black text-[#028D3B]">₦60,000</p>
              <p className="text-xs text-slate-600 font-medium">Flexible evening &amp; executive modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50 border-2 border-sky-200 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-md">
          <h3 className="text-2xl sm:text-3xl font-black text-sky-600">
            Join the Next Generation of High Achievers
          </h3>
          <p className="text-slate-700 text-sm max-w-xl mx-auto font-medium">
            Admissions for our upcoming morning and evening batches at Doyin Plaza, Okomaiko, Lagos are currently ongoing for the <strong>Official 2026/2027 academic session</strong>. Secure your seat today.
          </p>
          <button
            type="button"
            onClick={() => setCurrentPage('admission')}
            className="px-8 py-4 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-black text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer border border-[#FFC600]"
          >
            <span>Proceed to Admission Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
export default AboutPage;
