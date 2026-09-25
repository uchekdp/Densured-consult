import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageImageShowcase } from '../common/PageImageShowcase';
import {
  GraduationCap,
  Target,
  ArrowRight,
  Compass,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const teamMembers = [
    {
      name: 'Mr. Akinjo Rotimi',
      role: 'Founder & Managing Director',
      credentials: 'B.Sc. Mathematics & Statistics (OAU), Pioneer Educational Consultant',
      bio: 'Visionary founder of D Ensured Consult. With over 15 years pioneering standardized examination tutoring, CBT diagnostics, and student mentorship in Lagos, he has guided thousands to top university admissions.',
      image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Mrs. Abigail Mensah',
      role: 'Lead IELTS Examiner & International Studies Dean',
      credentials: 'MA Applied Linguistics (Manchester), British Council Certified Trainer',
      bio: 'Specialist in English phonetics, academic writing cohesion, and UKVI language clearance with hundreds of Band 8.0+ scholars.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Kelechi Okafor',
      role: 'Head of STEM & Medical Pre-Degree Track',
      credentials: 'M.Sc. Physics (UNN), Ph.D. Applied Biophysics',
      bio: 'Architect of our renowned UTME physics and chemistry shortcuts. Has mentored more than 140 students who gained admission into Medicine & Surgery.',
      image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Engr. Taiwo Balogun',
      role: 'Chief Examiner WAEC & NECO Mathematics',
      credentials: 'B.Eng. Mechanical Engineering (OAU), WAEC Marking Team Leader',
      bio: 'Transforms students from mathematics anxiety to straight A1s in General Mathematics, Further Maths, and Technical Drawing.',
      image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#25166B] via-[#1c1152] to-[#25166B] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-4 border-[#D5241B]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D5241B] text-white text-xs font-black uppercase tracking-wider border border-[#FFC600]">
            <img src="/logo.jpg" alt="Logo" className="w-4 h-4 rounded-full" />
            <span>Official 2026/2027 academic session • Education is Power</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto text-white">
            <span className="text-[#FFC600]">About</span> D Ensured Consult
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between secondary school curriculum and competitive university entry standards for UTME, WAEC, NECO, ATSWA, and international IELTS examinations from our dedicated Lagos center.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-[#D5241B] shadow-xs space-y-4 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D5241B] text-white flex items-center justify-center">
              <Target className="w-6 h-6 text-[#FFC600]" />
            </div>
            <h3 className="text-2xl font-black text-[#25166B]">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To dismantle exam failure by providing high-precision coaching, authentic computer-based testing technology, and personalized academic counseling that guarantees admissions into world-class universities in Nigeria and abroad.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-[#D5241B] shadow-xs space-y-4 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#25166B] text-white flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#FFC600]" />
            </div>
            <h3 className="text-2xl font-black text-[#25166B]">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be Africa&apos;s most reputable and technologically advanced educational consultancy, renowned for unmatched pass rates, academic integrity, and holistic scholar development.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#D5241B] bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
            Ethos &amp; Foundation
          </span>
          <h2 className="text-3xl font-black text-[#25166B] tracking-tight">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#D5241B] space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#D5241B] text-white flex items-center justify-center font-black">
              1
            </div>
            <h4 className="font-black text-[#25166B] text-base">Academic Rigor</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              No shortcuts or compromises. We teach deep conceptual understanding that enables students to solve any question variation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#D5241B] space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#25166B] text-white flex items-center justify-center font-black">
              2
            </div>
            <h4 className="font-black text-[#25166B] text-base">Zero Malpractice</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              We uphold uncompromised examination ethics. Our students achieve 300+ and straight A1s through sheer mastery and disciplined practice.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#D5241B] space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#D5241B] text-white flex items-center justify-center font-black">
              3
            </div>
            <h4 className="font-black text-[#25166B] text-base">Technological Leadership</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              From automated CBT engines to our dedicated student e-portal, modern technology is woven into our everyday student journey.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#D5241B] space-y-2 transition-all shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#25166B] text-white flex items-center justify-center font-black">
              4
            </div>
            <h4 className="font-black text-[#25166B] text-base">Individualized Mentorship</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Every student is assigned a personal academic advisor who tracks diagnostic weak points, study habits, and psychological exam readiness.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Stage Learning Framework */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#25166B] text-white rounded-3xl p-8 sm:p-12 space-y-8 border-2 border-[#D5241B] shadow-xl">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFC600] bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              Our Proven Formula
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              The D Ensured 4-Stage Mastery Framework
            </h3>
            <p className="text-white/80 text-xs sm:text-sm">
              How we systematically elevate candidate scores across all exam categories for the Official 2026/2027 academic session:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
              <div className="text-[#FFC600] font-black font-mono text-xs">STAGE 01</div>
              <h4 className="text-base font-bold text-white">Diagnostic Entry Audit</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Every enrollee sits for a baseline assessment to uncover specific cognitive blind spots across each syllabus topic.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
              <div className="text-[#FFC600] font-black font-mono text-xs">STAGE 02</div>
              <h4 className="text-base font-bold text-white">Syllabus Deconstruction</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Intensive lectures conducted by seasoned examiners covering 100% of the prescribed curriculum with formula breakdowns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
              <div className="text-[#FFC600] font-black font-mono text-xs">STAGE 03</div>
              <h4 className="text-base font-bold text-white">High-Pressure CBT Drills</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Weekly timed computer assessments that condition students to answer 40 questions in under 30 minutes without panic.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3">
              <div className="text-[#FFC600] font-black font-mono text-xs">STAGE 04</div>
              <h4 className="text-base font-bold text-white">Admission Placement Advisory</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                Post-exam guidance on subject combination matching, university catchment quotas, and Post-UTME screening applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#D5241B] bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
            Faculty of Authorities
          </span>
          <h2 className="text-3xl font-black text-[#25166B] tracking-tight">
            Academic Leadership &amp; Faculty
          </h2>
          <p className="text-slate-600 text-sm">
            Taught by certified examiners, university lecturers, and international test consultants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#D5241B] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black text-[#25166B] text-base">{member.name}</h4>
                  <p className="text-xs font-bold text-[#D5241B]">{member.role}</p>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">{member.credentials}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Images Added by Admin for About Page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageImageShowcase
          page="about"
          title="Campus Life, Lecture Suites & Achievements"
          subtitle="Direct highlights from our lecture halls, study clinics, and matriculation ceremonies."
        />
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#25166B] border-2 border-[#D5241B] rounded-3xl p-8 text-center space-y-4 text-white shadow-xl">
          <h3 className="text-2xl font-black text-white">
            Join the Next Generation of High Achievers
          </h3>
          <p className="text-white/80 text-sm max-w-xl mx-auto">
            Admissions for our upcoming morning and evening batches at our Lagos Center are currently being processed for the <strong>Official 2026/2027 academic session</strong>. Secure your seat today.
          </p>
          <button
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
