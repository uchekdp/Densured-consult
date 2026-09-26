import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../context/AppContext';
import { PageImageShowcase } from '../common/PageImageShowcase';
import { ExamProgram, StudyMode, StudentShift } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Printer,
  ArrowRight,
  AlertCircle,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  Globe,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Check,
  Download,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Hash,
  Fingerprint,
  Camera,
  FileCheck,
  Briefcase,
  HelpCircle,
  Upload,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

export const AdmissionPage: React.FC = () => {
  const { submitAdmission, openPaymentModal, setCurrentPage, setUserRole, loginStudent } = useApp();

  // Program & Track Selection
  const [activeFormType, setActiveFormType] = useState<ExamProgram>('UTME');
  const [studentShift, setStudentShift] = useState<StudentShift>('Morning');
  const [studyMode, setStudyMode] = useState<StudyMode>('Physical Weekday');

  // Section 1: Biodata Fields
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2007-06-15');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [maritalStatus, setMaritalStatus] = useState<'Single' | 'Married'>('Single');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [genotype, setGenotype] = useState('AA');
  const [nin, setNin] = useState('');
  const [nationality, setNationality] = useState('Nigerian');
  const [stateOfOrigin, setStateOfOrigin] = useState('Lagos');
  const [lga, setLga] = useState('Ojo');
  const [hometown, setHometown] = useState('Okomaiko');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('Igboelerin Bus Stop');
  const [disabilityStatus, setDisabilityStatus] = useState('None');
  const [passportPhotoUrl, setPassportPhotoUrl] = useState('');

  // Candidate Passport Upload Handler for ID Card Production
  const handlePassportFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('Selected photograph exceeds 5MB. Please upload an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPassportPhotoUrl(reader.result as string);
        setValidationError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Section 2: Contact & Guardian
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Father');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentOccupation, setParentOccupation] = useState('');
  const [parentAddress, setParentAddress] = useState('');

  // Section 3: Specific Exam Registration Information
  // UTME (JAMB)
  const [firstChoiceInstitution, setFirstChoiceInstitution] = useState('University of Lagos (UNILAG)');
  const [firstChoiceCourse, setFirstChoiceCourse] = useState('Computer Science');
  const [secondChoiceInstitution, setSecondChoiceInstitution] = useState('Lagos State University (LASU)');
  const [secondChoiceCourse, setSecondChoiceCourse] = useState('Software Engineering');
  const [thirdChoiceInstitution, setThirdChoiceInstitution] = useState('Yaba College of Technology (YABATECH)');
  const [preferredExamTown, setPreferredExamTown] = useState('Lagos West - Ojo / Okomaiko');
  const [selectedUtmeSubjects, setSelectedUtmeSubjects] = useState<string[]>([
    'Mathematics',
    'Physics',
    'Chemistry',
  ]);

  // WAEC / NECO specific
  const [waecDiet, setWaecDiet] = useState<'Internal School May/June' | 'Nov/Dec Private GCE'>('Internal School May/June');
  const [selectedOlevelRegistrationSubjects, setSelectedOlevelRegistrationSubjects] = useState<string[]>([
    'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Civic Education', 'Economics', 'Geography', 'Data Processing'
  ]);

  // IELTS specific
  const [ieltsModule, setIeltsModule] = useState<'Academic' | 'General Training'>('Academic');
  const [ieltsDelivery, setIeltsDelivery] = useState<'Computer-Delivered' | 'Paper-Based'>('Computer-Delivered');
  const [ieltsTargetBand, setIeltsTargetBand] = useState('Band 8.0');
  const [ieltsPurpose, setIeltsPurpose] = useState('Higher Education / Post-Graduate');
  const [destinationCountry, setDestinationCountry] = useState('United Kingdom');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('2028-11-20');

  // ATSWA specific
  const [atswaStage, setAtswaStage] = useState('Part I (Foundations of Accounting)');
  const [icanStudentPin, setIcanStudentPin] = useState('');

  // SAT / TOEFL specific
  const [satCollegeBoardId, setSatCollegeBoardId] = useState('');
  const [satTargetIntake, setSatTargetIntake] = useState('Fall 2027 US Intake');

  // Section 5: Portal Security
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [submittedRegData, setSubmittedRegData] = useState<any>(null);
  const [validationError, setValidationError] = useState('');

  // Available Nigerian UTME elective subjects
  const availableElectiveSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Government',
    'Literature in English',
    'Christian Religious Studies (CRS)',
    'Islamic Religious Studies (IRS)',
    'Financial Accounting',
    'Commerce',
    'Geography',
    'Agricultural Science',
    'Further Mathematics',
  ];

  const handleToggleElectiveSubject = (subject: string) => {
    setValidationError('');
    if (selectedUtmeSubjects.includes(subject)) {
      setSelectedUtmeSubjects(selectedUtmeSubjects.filter((s) => s !== subject));
    } else {
      if (selectedUtmeSubjects.length >= 3) {
        setValidationError('You can only choose exactly 3 subjects alongside compulsory English Language (Total: 4 subjects).');
        return;
      }
      setSelectedUtmeSubjects([...selectedUtmeSubjects, subject]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!surname.trim() || !firstName.trim()) {
      setValidationError('Please specify both Surname and First Name in the biodata section.');
      return;
    }

    if (!email.trim() || !phone.trim()) {
      setValidationError('Please provide a valid personal email address and WhatsApp phone number.');
      return;
    }

    if (!parentName.trim() || !parentPhone.trim()) {
      setValidationError('Please provide your parent / guardian contact information.');
      return;
    }

    if (!password || password.length < 6) {
      setValidationError('Please choose a secure portal password of at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter.');
      return;
    }

    if (activeFormType === 'UTME' && selectedUtmeSubjects.length !== 3) {
      setValidationError(`For UTME registration, please choose exactly 3 subjects to accompany compulsory English Language (current: ${selectedUtmeSubjects.length} selected).`);
      return;
    }

    if (!passportPhotoUrl) {
      setValidationError('Please upload a passport photograph. This picture is required for your official student ID card production.');
      return;
    }

    if (!agreedTerms) {
      setValidationError('Please agree to the center terms and regulations.');
      return;
    }

    setIsSubmitting(true);

    const fullCalculatedName = `${surname.trim().toUpperCase()} ${firstName.trim()} ${middleName.trim()}`.trim();
    const fullUtmeSubjectList = ['English Language (Compulsory)', ...selectedUtmeSubjects];

    const submissionPayload = {
      fullName: fullCalculatedName,
      surname: surname.trim(),
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim() || undefined,
      dateOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      genotype,
      nationality,
      stateOfOrigin,
      lga,
      hometown,
      nin: nin.trim() || undefined,
      residentialAddress: residentialAddress.trim() || 'DOYIN PLAZA, OKOMAIKO, LAGOS',
      disabilityStatus,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentRelationship,
      parentEmail: parentEmail.trim() || undefined,
      parentOccupation: parentOccupation.trim() || undefined,
      parentAddress: parentAddress.trim() || undefined,
      program: activeFormType,
      studyMode,
      studentShift,
      academicSession: 'Official 2026/2027 academic session',
      targetInstitution: activeFormType === 'UTME' ? firstChoiceInstitution : destinationCountry,
      targetCourse: activeFormType === 'UTME' ? firstChoiceCourse : `IELTS ${ieltsModule} (${ieltsTargetBand})`,
      secondChoiceInstitution: activeFormType === 'UTME' ? secondChoiceInstitution : undefined,
      secondChoiceCourse: activeFormType === 'UTME' ? secondChoiceCourse : undefined,
      thirdChoiceInstitution: activeFormType === 'UTME' ? thirdChoiceInstitution : undefined,
      preferredExamTown: activeFormType === 'UTME' ? preferredExamTown : undefined,
      subjectCombinations: activeFormType === 'UTME'
        ? fullUtmeSubjectList
        : activeFormType === 'IELTS'
        ? ['Listening', 'Reading', 'Writing', 'Speaking']
        : selectedOlevelRegistrationSubjects,
      ieltsModule: activeFormType === 'IELTS' ? ieltsModule : undefined,
      ieltsTargetBand: activeFormType === 'IELTS' ? ieltsTargetBand : undefined,
      destinationCountry: activeFormType === 'IELTS' ? destinationCountry : undefined,
      passportNumber: activeFormType === 'IELTS' ? passportNumber : undefined,
      passportExpiry: activeFormType === 'IELTS' ? passportExpiry : undefined,
      passportPhotoUrl,
      atswaStage: activeFormType === 'ATSWA' ? atswaStage : undefined,
      satCollegeBoardId: (activeFormType === 'SAT' || activeFormType === 'TOEFL') ? satCollegeBoardId : undefined,
      password,
      notes: `Detailed ${activeFormType} registration for Official 2026/2027 academic session. Enrolled shift: ${studentShift}. ID card photo attached.`,
    };

    setTimeout(() => {
      const generatedId = submitAdmission(submissionPayload as any);
      setIsSubmitting(false);
      setSubmittedApplicationId(generatedId);
      setSubmittedRegData({ ...submissionPayload, id: generatedId });
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }, 750);
  };

  const handleSignInDirectly = async () => {
    if (submittedApplicationId) {
      await loginStudent(submittedApplicationId, password);
    }
    setUserRole('student');
    setCurrentPage('student-portal');
  };

  const handleDownloadSlip = () => {
    const slipEl = document.getElementById('printable-registration-slip');
    if (slipEl && submittedRegData) {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DEC_Registration_Slip_${submittedApplicationId}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body class="bg-white p-8 font-sans">
  <div class="max-w-3xl mx-auto border-2 border-[#D5241B] rounded-3xl p-6 shadow-md">
    ${slipEl.innerHTML}
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DEC_Candidate_Registration_Slip_${submittedApplicationId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-slate-50/60 min-h-screen space-y-12 pb-20 text-[#1D1918]">
      {/* Hero Header Section - Attractive Light Colors */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-sky-50 border-b-2 border-sky-200 py-12 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider shadow-xs border border-sky-300">
            ★ Official 2026/2027 academic session Candidate Registration
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-sky-600">
            Comprehensive Candidate Bio-Data &amp; Exam Registration
          </h1>
          <p className="text-sky-800 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
            Accredited examination enrollment for UTME (JAMB CBT), WAEC, NECO, IELTS, ATSWA &amp; SAT. Complete your bio-data below to generate your official identity clearance and admission slip.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedApplicationId && submittedRegData ? (
          /* ============================================================ */
          /* PRINTABLE & DOWNLOADABLE REGISTRATION CONFIRMATION SLIP     */
          /* ============================================================ */
          <div className="bg-white rounded-3xl border-2 border-[#D5241B] shadow-2xl overflow-hidden animate-in fade-in duration-300">
            {/* Action Top Bar */}
            <div className="bg-[#D5241B] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#FFC600] print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white p-1 border border-[#FFC600] shrink-0">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div>
                  <span className="font-black text-sm block">Registration Confirmed</span>
                  <span className="text-[10px] text-[#FFC600] font-bold uppercase tracking-wider">
                    Official 2026/2027 academic session
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadSlip}
                  className="px-4 py-2 rounded-xl bg-[#FFC600] text-[#25166B] font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:bg-[#e6b300]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:bg-white/30 border border-white/20"
                >
                  <Printer className="w-4 h-4 text-[#FFC600]" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={handleSignInDirectly}
                  className="px-5 py-2 rounded-xl bg-white text-[#D5241B] font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:bg-slate-100"
                >
                  <UserCheck className="w-4 h-4 text-[#D5241B]" />
                  <span>Enter E-Portal</span>
                </button>
              </div>
            </div>

            {/* Printable Registration Slip Body - LIGHT DESIGN */}
            <div id="printable-registration-slip" className="p-6 sm:p-10 space-y-6 bg-white text-[#1D1918]">
              {/* Slip Header */}
              <div className="border-b-2 border-[#D5241B] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D5241B] shadow-sm shrink-0 bg-white p-1">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#D5241B] text-[10px] font-black uppercase tracking-wider border border-red-200">
                      Official 2026/2027 academic session
                    </div>
                    <h2 className="text-2xl font-black text-[#25166B] uppercase tracking-tight">
                      D Ensured Consult
                    </h2>
                    <p className="text-xs font-black text-[#D5241B]">
                      CANDIDATE BIOMETRIC EXAMINATION REGISTRATION SLIP
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">
                      DOYIN PLAZA, IGBOELERIN BUSSTOP, BESIDE PRIME-MART, OKOMAIKO, LAGOS
                    </p>
                    <p className="text-[10px] text-slate-600">
                      Hotline: <strong className="text-[#D5241B] font-mono">08147896930</strong> | Email: <strong>Densuredconsult@gmail.com</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end shrink-0">
                  <div className="bg-red-50 border-2 border-[#D5241B] p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Candidate Reg Number
                    </span>
                    <span className="font-mono text-xl font-black text-[#D5241B]">
                      {submittedApplicationId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidate Photo & Core Biodata Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="sm:col-span-1 flex flex-col items-center space-y-2">
                  <img
                    src={submittedRegData.passportPhotoUrl}
                    alt={submittedRegData.fullName}
                    className="w-32 h-36 rounded-2xl object-cover border-2 border-[#D5241B] ring-2 ring-[#FFC600] shadow-md bg-white"
                  />
                  <span className="px-2 py-0.5 rounded-md bg-[#028D3B] text-white font-black text-[9px] uppercase tracking-wider">
                    Official Student ID Photo Attached
                  </span>
                </div>

                <div className="sm:col-span-3 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Full Candidate Name</span>
                    <h3 className="text-lg font-black text-[#25166B]">{submittedRegData.fullName}</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Date of Birth</span>
                      <strong className="text-slate-800">{submittedRegData.dateOfBirth}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Gender / Sex</span>
                      <strong className="text-slate-800">{submittedRegData.gender}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Blood Group / Genotype</span>
                      <strong className="text-slate-800">{submittedRegData.bloodGroup} / {submittedRegData.genotype}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">State of Origin / LGA</span>
                      <strong className="text-slate-800">{submittedRegData.stateOfOrigin} ({submittedRegData.lga})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">NIN (11 Digits)</span>
                      <strong className="font-mono text-[#D5241B]">{submittedRegData.nin || 'Verified on File'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Nationality</span>
                      <strong className="text-slate-800">{submittedRegData.nationality}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Specifics & Academic Track */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-black text-[#D5241B] uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                    Academic Track &amp; Study Schedule
                  </h4>
                  <p><span className="text-slate-500">Program Track:</span> <strong className="text-[#25166B] font-black">{submittedRegData.program}</strong></p>
                  <p><span className="text-slate-500">Study Shift:</span> <strong className="px-2 py-0.5 rounded bg-[#D5241B] text-white font-black text-[11px]">{submittedRegData.studentShift} Student ({submittedRegData.studentShift === 'Morning' ? '09:00 AM – 01:30 PM' : '02:00 PM – 06:30 PM'})</strong></p>
                  <p><span className="text-slate-500">Study Mode:</span> <strong>{submittedRegData.studyMode}</strong></p>
                  <p><span className="text-slate-500">Monthly Tuition Rate:</span> <strong className="font-mono text-[#25166B] font-black">₦{submittedRegData.studentShift === 'Morning' ? '20,000' : '15,000'}/month</strong></p>
                  <p><span className="text-slate-500">Academic Session:</span> <strong className="text-[#D5241B]">Official 2026/2027 academic session</strong></p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <h4 className="font-black text-[#D5241B] uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                    Contact &amp; Guardian Particulars
                  </h4>
                  <p><span className="text-slate-500">Personal Email:</span> <strong>{submittedRegData.email}</strong></p>
                  <p><span className="text-slate-500">Candidate WhatsApp:</span> <strong className="font-mono text-slate-800">{submittedRegData.phone}</strong></p>
                  <p><span className="text-slate-500">Parent / Guardian:</span> <strong>{submittedRegData.parentName} ({submittedRegData.parentRelationship})</strong></p>
                  <p><span className="text-slate-500">Guardian Phone:</span> <strong className="font-mono text-slate-800">{submittedRegData.parentPhone}</strong></p>
                  <p><span className="text-slate-500">Residential Address:</span> <span className="text-slate-700">{submittedRegData.residentialAddress}</span></p>
                </div>
              </div>

              {/* Program Subject Combination / IELTS Skills Review */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-black text-[#25166B] uppercase text-[11px] block">
                  Registered Examination Subject Combination:
                </span>
                <div className="flex flex-wrap gap-2">
                  {submittedRegData.subjectCombinations && submittedRegData.subjectCombinations.map((sub: string, i: number) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                        sub.toLowerCase().includes('english')
                          ? 'bg-[#25166B] text-white flex items-center gap-1 shadow-2xs'
                          : 'bg-white border-2 border-[#D5241B]/30 text-[#D5241B]'
                      }`}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
                {submittedRegData.targetInstitution && (
                  <p className="text-[11px] text-slate-600 pt-1">
                    Target Institution: <strong className="text-[#25166B]">{submittedRegData.targetInstitution}</strong> • Target Course: <strong className="text-[#25166B]">{submittedRegData.targetCourse}</strong>
                  </p>
                )}
              </div>

              {/* Center Verification & Barcode Foot */}
              <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="font-mono font-black text-sm text-[#25166B] tracking-widest">
                    |||| | ||||| || |||| || ||||| ||
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    BARCODE: {submittedApplicationId} • D ENSURED CONSULT DIRECTORY
                  </p>
                </div>

                <div className="border-2 border-[#028D3B] rounded-xl px-4 py-1.5 text-center bg-emerald-50/60">
                  <span className="text-[9px] font-black text-[#028D3B] uppercase block">
                    ★ OFFICIAL ADMISSION SEAL ★
                  </span>
                  <span className="text-[8px] font-bold text-slate-600 block">
                    SESSION 2026/2027 CLEARED
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-300 shadow-2xs shrink-0 flex flex-col items-center">
                  <QRCodeSVG
                    value={`https://densuredconsult.edu.ng/verify-admission?id=${submittedApplicationId}&name=${encodeURIComponent(submittedRegData.fullName)}&session=2026-2027`}
                    size={64}
                    level="M"
                  />
                  <span className="text-[7px] font-mono text-[#D5241B] font-black mt-0.5">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handleSignInDirectly}
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all border border-[#FFC600]"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Access Your Student Portal &amp; Download ID Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fee = submittedRegData.studentShift === 'Morning' ? 20000 : 15000;
                    openPaymentModal(fee, `Tuition Clearance for ${submittedRegData.studentShift} Student (${submittedApplicationId})`);
                  }}
                  className="w-full sm:w-auto py-4 px-6 rounded-xl bg-[#FFC600] text-[#25166B] font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-[#e6b300]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Tuition Clearance (₦{submittedRegData.studentShift === 'Morning' ? '20,000' : '15,000'})</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* ULTRA-DETAILED CANDIDATE REGISTRATION FORM                  */
          /* ============================================================ */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-xl space-y-8">
            {/* Form Track Selector */}
            <div>
              <label className="text-xs font-black text-[#D5241B] uppercase tracking-wider block mb-2">
                1. Select Examination Track:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'UTME', label: 'UTME (JAMB CBT)', desc: 'Tertiary Entrance' },
                  { id: 'WAEC', label: 'WAEC (SSCE/GCE)', desc: 'Senior Certificate' },
                  { id: 'NECO', label: 'NECO (SSCE/GCE)', desc: 'National Exam' },
                  { id: 'IELTS', label: 'IELTS (British Council)', desc: 'International' },
                  { id: 'COMBINED_OLEVEL_UTME', label: 'O-Level + UTME', desc: 'Dual Intensive' },
                  { id: 'ATSWA', label: 'ATSWA (ICAN)', desc: 'Professional' },
                  { id: 'SAT', label: 'SAT / TOEFL', desc: 'USA / Study Abroad' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveFormType(item.id as ExamProgram);
                      setValidationError('');
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      activeFormType === item.id
                        ? 'border-[#D5241B] bg-red-50 text-[#D5241B] shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-black text-xs block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shift Selector */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
              <label className="text-xs font-black text-[#25166B] uppercase tracking-wider block">
                2. Select Study Shift &amp; Lecture Batch:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStudentShift('Morning')}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    studentShift === 'Morning'
                      ? 'border-[#D5241B] bg-white text-[#D5241B] shadow-xs'
                      : 'border-slate-200 bg-slate-100 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-[#25166B]">Morning Student</span>
                    <span className="font-mono font-black text-sm text-[#D5241B]">₦20,000/mo</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Hours: <strong>09:00 AM – 01:30 PM</strong> (Monday – Friday) • Full CBT Lab
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentShift('Evening')}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    studentShift === 'Evening'
                      ? 'border-[#D5241B] bg-white text-[#D5241B] shadow-xs'
                      : 'border-slate-200 bg-slate-100 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-[#25166B]">Evening Student</span>
                    <span className="font-mono font-black text-sm text-[#D5241B]">₦15,000/mo</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Hours: <strong>02:00 PM – 06:30 PM</strong> (Monday – Friday) • Accelerated Drills
                  </p>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {validationError && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-[#D5241B] text-[#D5241B] text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0 text-[#D5241B]" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* SECTION 1: CANDIDATE DETAILED BIODATA */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 text-sm font-black text-[#25166B] uppercase tracking-wider border-b-2 border-slate-200 pb-2">
                  <span className="w-7 h-7 rounded-full bg-[#D5241B] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>Comprehensive Candidate Bio-Data</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Surname (Last Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="e.g. ADELEKE"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      First Name (Given Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Oluwaseun"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Middle / Other Name
                    </label>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="e.g. Emmanuel"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Gender / Sex *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Marital Status
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value as any)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Blood Group &amp; Genotype
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                      <select
                        value={genotype}
                        onChange={(e) => setGenotype(e.target.value)}
                        className="p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        {['AA', 'AS', 'AC', 'SS', 'SC'].map((gt) => (
                          <option key={gt} value={gt}>{gt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      National Identification Number (NIN)
                    </label>
                    <input
                      type="text"
                      value={nin}
                      maxLength={11}
                      onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                      placeholder="11-digit NIN (e.g. 78291038291)"
                      className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      State of Origin *
                    </label>
                    <select
                      value={stateOfOrigin}
                      onChange={(e) => setStateOfOrigin(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st} State</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Local Government Area (LGA)
                    </label>
                    <input
                      type="text"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Ojo, Alimosho, Ikeja"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Hometown / City
                    </label>
                    <input
                      type="text"
                      value={hometown}
                      onChange={(e) => setHometown(e.target.value)}
                      placeholder="e.g. Okomaiko, Badagry"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Residential Street Address &amp; Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={residentialAddress}
                      onChange={(e) => setResidentialAddress(e.target.value)}
                      placeholder="e.g. 14, Adeleke Close, Igboelerin Road, Okomaiko"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Nearest Bus Stop / Landmark
                    </label>
                    <input
                      type="text"
                      value={nearestLandmark}
                      onChange={(e) => setNearestLandmark(e.target.value)}
                      placeholder="e.g. Beside Prime-Mart, Doyin Plaza"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>
                </div>

                {/* CANDIDATE PASSPORT PHOTOGRAPH UPLOAD (FOR ID CARD PRODUCTION) */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <label className="block font-black text-[#25166B] text-xs uppercase tracking-wider">
                        Candidate Passport Photograph (For Student ID Card Production) *
                      </label>
                      <span className="text-[11px] text-slate-500 block">
                        Upload your clear front-facing portrait. This photo will be printed directly on your Student ID Card (3.375 × 2.125 inches) and examination clearance documents.
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#D5241B] border border-red-200 text-[10px] font-black uppercase tracking-wider self-start sm:self-auto shrink-0">
                      Required for ID Card
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#D5241B] transition-colors">
                    {/* Portrait Preview Box */}
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-[#D5241B] ring-2 ring-[#FFC600] shadow-md bg-white flex items-center justify-center">
                        {passportPhotoUrl ? (
                          <img
                            src={passportPhotoUrl}
                            alt="Uploaded Candidate Portrait"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-2 text-center text-slate-400">
                            <Camera className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                            <span className="text-[9px] font-bold block">No picture</span>
                          </div>
                        )}
                      </div>
                      {passportPhotoUrl && (
                        <span className="mt-1.5 px-2 py-0.2 rounded-full bg-[#028D3B] text-white text-[8.5px] font-black tracking-wider uppercase">
                          ID Cleared
                        </span>
                      )}
                    </div>

                    {/* Upload Controls & Camera Trigger */}
                    <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        {/* Browse File */}
                        <div>
                          <input
                            type="file"
                            id="candidate-id-photo-input"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePassportFileUpload}
                          />
                          <label
                            htmlFor="candidate-id-photo-input"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25166B] hover:bg-[#1a0f4c] text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
                          >
                            <Upload className="w-4 h-4 text-[#FFC600]" />
                            <span>Upload Picture from Device</span>
                          </label>
                        </div>

                        {/* Snap with Camera */}
                        <div>
                          <input
                            type="file"
                            id="candidate-id-camera-input"
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={handlePassportFileUpload}
                          />
                          <label
                            htmlFor="candidate-id-camera-input"
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer border border-slate-300 transition-all"
                          >
                            <Camera className="w-4 h-4 text-[#D5241B]" />
                            <span>Snap Photo with Camera</span>
                          </label>
                        </div>

                        {passportPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setPassportPhotoUrl('')}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs cursor-pointer transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-medium">
                        <strong>ID Card Requirement:</strong> Please upload a clear head-and-shoulders photograph. This photo is directly used by our production unit to generate your physical Student Identification Card (standard dimensions <strong>3.375 × 2.125 inches</strong>) and examination registration slip.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONTACT & GUARDIAN / NEXT OF KIN */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2.5 text-sm font-black text-[#25166B] uppercase tracking-wider border-b-2 border-slate-200 pb-2">
                  <span className="w-7 h-7 rounded-full bg-[#D5241B] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>Contact Information &amp; Parent / Next of Kin</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Candidate Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@gmail.com"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Primary WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08147896930"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Alternate Telephone Number
                    </label>
                    <input
                      type="tel"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      placeholder="e.g. 08023456789"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Parent / Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Elder Samuel Adeleke"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Relationship to Student
                    </label>
                    <select
                      value={parentRelationship}
                      onChange={(e) => setParentRelationship(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Sponsor">Sponsor</option>
                      <option value="Self">Self</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Parent / Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="e.g. 08034567890"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: EXAM-SPECIFIC PARTICULARS */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2.5 text-sm font-black text-[#25166B] uppercase tracking-wider border-b-2 border-slate-200 pb-2">
                  <span className="w-7 h-7 rounded-full bg-[#D5241B] text-white flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <span>{activeFormType} Examination Registration Particulars</span>
                </div>

                {activeFormType === 'UTME' && (
                  /* UTME (JAMB CBT) FIELDS */
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-black text-[#25166B] mb-1">
                          Preferred CBT Exam Town / Zone
                        </label>
                        <input
                          type="text"
                          value={preferredExamTown}
                          onChange={(e) => setPreferredExamTown(e.target.value)}
                          placeholder="e.g. Lagos West - Ojo / Okomaiko"
                          className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-[#25166B] mb-1">
                          1st Choice University / Tertiary Institution *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstChoiceInstitution}
                          onChange={(e) => setFirstChoiceInstitution(e.target.value)}
                          placeholder="e.g. University of Lagos (UNILAG)"
                          className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-[#25166B] mb-1">
                          1st Choice Course of Study *
                        </label>
                        <input
                          type="text"
                          required
                          value={firstChoiceCourse}
                          onChange={(e) => setFirstChoiceCourse(e.target.value)}
                          placeholder="e.g. Computer Science, Medicine, Law"
                          className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-[#25166B] mb-1">
                          2nd Choice Tertiary Institution
                        </label>
                        <input
                          type="text"
                          value={secondChoiceInstitution}
                          onChange={(e) => setSecondChoiceInstitution(e.target.value)}
                          placeholder="e.g. Lagos State University (LASU)"
                          className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-black text-[#25166B] mb-1">
                          2nd Choice Course of Study
                        </label>
                        <input
                          type="text"
                          value={secondChoiceCourse}
                          onChange={(e) => setSecondChoiceCourse(e.target.value)}
                          placeholder="e.g. Software Engineering"
                          className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                        />
                      </div>
                    </div>

                    {/* 4-Subject Combination Selection with English Compulsory */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-black text-[#25166B] text-xs uppercase tracking-wider">
                          UTME 4-Subject Combination Selection:
                        </label>
                        <span className="text-xs font-black text-[#D5241B]">
                          Selected: English (Compulsory) + {selectedUtmeSubjects.length}/3 Electives
                        </span>
                      </div>

                      <div className="p-3 bg-red-50/60 rounded-xl border-2 border-[#D5241B]/30 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#D5241B] text-white flex items-center justify-center font-black text-xs">
                            1
                          </div>
                          <div>
                            <span className="font-black text-[#25166B] text-sm block">English Language</span>
                            <span className="text-[11px] text-slate-500">Compulsory for all UTME candidates</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#D5241B] text-white">
                          COMPULSORY
                        </span>
                      </div>

                      <span className="text-slate-600 text-xs block font-medium">
                        Click to toggle exactly 3 elective subjects:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                        {availableElectiveSubjects.map((sub) => {
                          const isSelected = selectedUtmeSubjects.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => handleToggleElectiveSubject(sub)}
                              className={`p-2.5 rounded-xl border-2 text-left font-bold transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#D5241B] bg-red-50 text-[#D5241B] shadow-2xs'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span>{sub}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#D5241B]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeFormType === 'IELTS' && (
                  /* IELTS SPECIFIC FIELDS */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-black text-[#25166B] mb-1">
                        IELTS Test Track / Module *
                      </label>
                      <select
                        value={ieltsModule}
                        onChange={(e) => setIeltsModule(e.target.value as any)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        <option value="Academic">Academic (University &amp; Professional Licensure)</option>
                        <option value="General Training">General Training (Work Visa &amp; Immigration)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-black text-[#25166B] mb-1">
                        Delivery Mode
                      </label>
                      <select
                        value={ieltsDelivery}
                        onChange={(e) => setIeltsDelivery(e.target.value as any)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        <option value="Computer-Delivered">Computer-Delivered (CD-IELTS)</option>
                        <option value="Paper-Based">Paper-Based</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-black text-[#25166B] mb-1">
                        Target Overall Band Score *
                      </label>
                      <select
                        value={ieltsTargetBand}
                        onChange={(e) => setIeltsTargetBand(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        {['Band 7.0', 'Band 7.5', 'Band 8.0', 'Band 8.5', 'Band 9.0 (Expert)'].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-black text-[#25166B] mb-1">
                        Target Destination Country
                      </label>
                      <input
                        type="text"
                        value={destinationCountry}
                        onChange={(e) => setDestinationCountry(e.target.value)}
                        placeholder="e.g. United Kingdom, Canada, USA, Australia"
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-[#25166B] mb-1">
                        International Passport Number
                      </label>
                      <input
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. A12345678"
                        className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold text-[#1D1918] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-[#25166B] mb-1">
                        Passport Expiry Date
                      </label>
                      <input
                        type="date"
                        value={passportExpiry}
                        onChange={(e) => setPassportExpiry(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      />
                    </div>
                  </div>
                )}

                {(activeFormType === 'WAEC' || activeFormType === 'NECO') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-black text-[#25166B] mb-1">Exam Category / Diet</label>
                      <select
                        value={waecDiet}
                        onChange={(e) => setWaecDiet(e.target.value as any)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        <option value="Internal School May/June">Internal School Candidate (May/June)</option>
                        <option value="Nov/Dec Private GCE">Private Candidate GCE (Nov/Dec)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-black text-[#25166B] mb-1">Examination Center</label>
                      <input
                        type="text"
                        disabled
                        value="D Ensured Consult Accredited Center, Okomaiko, Lagos"
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-600 bg-slate-100"
                      />
                    </div>
                  </div>
                )}

                {activeFormType === 'ATSWA' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-black text-[#25166B] mb-1">ICAN / ATSWA Stage</label>
                      <select
                        value={atswaStage}
                        onChange={(e) => setAtswaStage(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      >
                        <option value="Part I (Foundations of Accounting)">Part I (Foundations of Accounting)</option>
                        <option value="Part II (Financial & Management Principles)">Part II (Financial & Management Principles)</option>
                        <option value="Part III (Professional Application)">Part III (Professional Application)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-black text-[#25166B] mb-1">ICAN Student Pin (if assigned)</label>
                      <input
                        type="text"
                        value={icanStudentPin}
                        onChange={(e) => setIcanStudentPin(e.target.value)}
                        placeholder="e.g. ICAN-ST-8921"
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: PORTAL ACCOUNT & SECURITY */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2.5 text-sm font-black text-[#25166B] uppercase tracking-wider border-b-2 border-slate-200 pb-2">
                  <span className="w-7 h-7 rounded-full bg-[#D5241B] text-white flex items-center justify-center text-xs font-black">
                    4
                  </span>
                  <span>E-Portal Password &amp; Identity Declaration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Create E-Portal Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-[#25166B] mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-[#1D1918] focus:border-[#D5241B] outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 accent-[#D5241B] w-4 h-4 shrink-0"
                    />
                    <span className="text-slate-700 leading-relaxed font-medium">
                      I declare that all bio-data and academic particulars supplied above are true and verifiable. I understand that my official identification card and payment receipt will be issued based on these records for the <strong>Official 2026/2027 academic session</strong>.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Registration Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all border-2 border-[#FFC600] disabled:opacity-50"
                >
                  <FileCheck className="w-5 h-5 text-[#FFC600]" />
                  <span>
                    {isSubmitting
                      ? 'Submitting & Generating Official Admission Slip...'
                      : 'Submit Registration & Generate Official Admission Slip'}
                  </span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Once registered, your student profile is created and you can immediately print your official ID card and receipt.
                </p>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Dynamic Campus Facilities & Admission Office Images */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageImageShowcase
          page="admission"
          title="Center Facilities & Learning Environment"
          subtitle="Explore the environment where your lectures, mock exams, and CBT sessions take place."
        />
      </section>
    </div>
  );
};
