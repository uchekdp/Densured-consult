import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageImageShowcase } from '../common/PageImageShowcase';
import { FAQS } from '../../data/mockData';
import { GoogleMapSection } from '../common/GoogleMapSection';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building,
  Navigation,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'UTME',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const waText = `*Inquiry to D Ensured Consult (2026/2027 Session)*
*Name:* ${formState.name}
*Phone:* ${formState.phone}
*Email:* ${formState.email}
*Program:* ${formState.program}
*Message:* ${formState.message}`;

    const waUrl = `https://wa.me/2348147896930?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      showToast(
        'success',
        'Inquiry Dispatched to WhatsApp',
        'Redirecting to official WhatsApp desk: 08147896930.'
      );
      // Open WhatsApp chat directly
      window.open(waUrl, '_blank');
      setFormState({
        name: '',
        email: '',
        phone: '',
        program: 'UTME',
        message: '',
      });
    }, 600);
  };

  return (
    <div className="space-y-16 pb-16 bg-slate-50/60">
      {/* Header Banner - Attractive Light Colors */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-sky-50 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4 border-b-2 border-sky-200">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider border border-sky-300">
            <Phone className="w-4 h-4 text-sky-600" />
            Official 2026/2027 academic session Admissions Helpdesk
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-sky-600">
            Contact D Ensured Consult
          </h1>
          <p className="text-sky-800 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
            Have questions about syllabus requirements, CBT mock schedules, or tuition installment plans? Our counselors are here to guide you.
          </p>
        </div>
      </section>

      {/* Main Grid: Form & Lagos Center Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 hover:border-sky-300 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-black text-sky-600">
                Send an Admissions Inquiry
              </h2>
              <p className="text-xs text-sky-800 mt-1 font-semibold">
                Fill out the quick form below. Our response time is typically under 15 minutes during office hours.
              </p>
            </div>

            {isSent ? (
              <div className="p-6 bg-red-50 border-2 border-[#D5241B] rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#D5241B] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base font-black text-[#25166B]">Inquiry Received Successfully!</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                  We have forwarded your request to our admissions coordinator. You can also message our desk directly on WhatsApp.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-xs font-bold text-[#25166B] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                  <a
                    href="https://wa.me/2348147896930?text=Hello%20D%20Ensured%20Consult,%20I%20just%20sent%20an%20inquiry%20via%20your%20website."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#028D3B] hover:bg-[#027531] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#25166B] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Oluwaseun Adeleke"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#D5241B] outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#25166B] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. student@gmail.com"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#D5241B] outline-hidden font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#25166B] mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="08147896930"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#D5241B] outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#25166B] mb-1">Interested Program *</label>
                    <select
                      value={formState.program}
                      onChange={(e) => setFormState({ ...formState, program: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#D5241B] outline-hidden font-medium bg-white"
                    >
                      <option value="UTME">JAMB UTME Coaching</option>
                      <option value="WAEC">WAEC (WASSCE) Preparation</option>
                      <option value="NECO">NECO SSCE Preparation</option>
                      <option value="IELTS">IELTS Masterclass (Academic/General)</option>
                      <option value="ATSWA">ATSWA (ICAN Accounting Technicians)</option>
                      <option value="TOEFL">TOEFL iBT Exam Preparation</option>
                      <option value="SAT">SAT University Preparation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#25166B] mb-1">Your Message or Question *</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us your target exam, current school standing, or specific inquiry..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#D5241B] outline-hidden font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3.5 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 border border-[#FFC600]"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching Message...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Office Location & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Connect Box - Attractive Light Colors */}
            <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/70 text-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 border-2 border-sky-200 shadow-md">
              <h3 className="text-xl font-black text-sky-600">Direct Contacts</h3>
              <p className="text-xs text-sky-800 font-semibold">
                Reach our counseling desk through direct hotlines and WhatsApp:
              </p>

              <div className="space-y-3 text-xs pt-1">
                <a
                  href="tel:08147896930"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white hover:bg-sky-50 transition-colors border border-sky-200 shadow-xs"
                >
                  <div className="p-2.5 rounded-xl bg-sky-600 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">Phone Number</span>
                    <span className="font-bold text-sky-700 text-sm font-mono">08147896930</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/2348147896930?text=Hello%20D%20Ensured%20Consult,%20I%20am%20inquiring%20about%20exam%20coaching%20fees."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#028D3B]/10 hover:bg-[#028D3B]/20 transition-colors border border-[#028D3B]/30"
                >
                  <div className="p-2.5 rounded-xl bg-[#028D3B] text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#028D3B] block font-extrabold uppercase">WhatsApp Number</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">08147896930</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-sky-200 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-sky-100 text-sky-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold uppercase">Official Email</span>
                    <span className="font-bold text-slate-800 text-sm">Densuredconsult@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Address Location */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xs space-y-4 text-xs">
              <h3 className="text-base font-black text-sky-600 flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-600" />
                Campus &amp; CBT Laboratory Address
              </h3>

              <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D5241B] shrink-0" />
                  <span className="font-black text-sky-600 text-sm">
                    D Ensured Consult Campus
                  </span>
                </div>
                <div className="text-slate-800 font-bold pl-6 text-xs sm:text-sm leading-relaxed">
                  DOYIN PLAZA, IGBOELERIN BUSSTOP<br />
                  BESIDE PRIME-MART, OKOMAIKO, LAGOS
                </div>
                <div className="pt-2 pl-6 space-y-1 text-slate-600 font-medium">
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Monday – Friday: 8:00 AM – 6:30 PM (Morning &amp; Evening)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Saturday (Grand Mock CBT Tests): 8:00 AM – 4:00 PM</span>
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-sky-200/60 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-300">
                    Igboelerin • Okomaiko, Lagos
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("DOYIN PLAZA, IGBOELERIN BUS STOP, BESIDE PRIME-MART, OKOMAIKO, LAGOS")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoogleMapSection />
      </section>

      {/* Dynamic Images Added by Admin for Contact / Center Visit Page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageImageShowcase
          page="contact"
          title="Inside Our Okomaiko, Lagos Center"
          subtitle="View our admission office, verification desk, and counseling reception."
        />
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 border border-sky-300 px-3.5 py-1.5 rounded-full inline-block">
            Official 2026/2027 Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-sky-600 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sky-800 text-xs sm:text-sm font-semibold">
            Answers to common inquiries regarding registration, CBT lab simulations, and class batch options.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-sky-100 hover:border-sky-300 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-sky-700 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-800 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
