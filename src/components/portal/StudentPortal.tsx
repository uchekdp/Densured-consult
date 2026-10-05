import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp, StudentPortalTab } from '../../context/AppContext';
import {
  StudentProfile,
  ScheduledLesson,
  MockTestResult,
  StudyMaterial,
  PracticeQuestion,
  StudentShift,
  OfficialReceipt,
} from '../../types';
import {
  LayoutDashboard,
  CreditCard,
  User,
  CalendarCheck,
  Award,
  BookOpen,
  Megaphone,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  Search,
  ExternalLink,
  HelpCircle,
  Sparkles,
  QrCode,
  ShieldCheck,
  GraduationCap,
  PlayCircle,
  RotateCcw,
  Check,
  DollarSign,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Upload,
  Camera,
  BookCheck,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    studentTab,
    setStudentTab,
    currentStudent,
    studentsList,
    applications,
    switchStudent,
    updateStudentPhoto,
    isStudentLoggedIn,
    loginStudent,
    logoutStudent,
    setCurrentPage,
    lessons,
    openPaymentModal,
    transactions,
    submitMonthlyTuition,
    approveTuitionPayment,
    isStudentSubscriptionActive,
    openReceiptModal,
    setAdminTab,
    navigateTo,
    announcements,
    studyMaterials,
    practiceQuestions,
    cbtExams,
    cbtAttempts,
    recordCBTAttempt,
    showToast,
  } = useApp();

  // Monthly Tuition Subscription & Lock Gate State
  const isSubscriptionActive = isStudentSubscriptionActive(currentStudent);
  const pendingTx = transactions.find(
    (t) =>
      (t.studentId === currentStudent.id ||
        t.studentId === currentStudent.registrationNumber ||
        (t.studentName && t.studentName.toLowerCase().trim() === currentStudent.fullName.toLowerCase().trim())) &&
      t.status === 'Pending'
  );

  const now = new Date();
  const currentMonthPeriod = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const defaultEndOfMonth = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}, 11:59 PM`;
  const defaultValidUntil = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;

  const [selectedShift, setSelectedShift] = useState<StudentShift>(
    currentStudent.studentShift || 'Morning'
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Bank Transfer');
  const [isSubmittingMonthly, setIsSubmittingMonthly] = useState(false);
  const [idCardZoom, setIdCardZoom] = useState<number>(1.25);
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState<string>('All');

  const isValidPhoto = (url?: any): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.includes('<svg') || trimmed.includes('data:image/svg') || trimmed.includes('unsplash.com')) return false;
    return true;
  };

  const findValidPhoto = (...candidates: any[]): string => {
    for (const c of candidates) {
      if (isValidPhoto(c)) return c;
    }
    return '';
  };

  const getStudentPhoto = (studentObj: any): string => {
    if (!studentObj) return '';
    return findValidPhoto(
      studentObj.passportPhotoUrl,
      studentObj.photoUrl,
      studentObj.photo_url,
      studentObj.studentAvatar,
      studentObj.avatar,
      studentObj.image,
      studentObj.picture
    );
  };

  // Multi-tier photo resolution for student ID card
  const studentAvatarImg = useMemo(() => {
    // 1. Direct photo on currentStudent
    const directPic = getStudentPhoto(currentStudent);
    if (directPic) return directPic;

    // 2. Matching application
    const matchingApp = applications.find(
      (a) =>
        (a.email && (a.email || '').toLowerCase() === (currentStudent.email || '').toLowerCase()) ||
        (a.fullName && (a.fullName || '').toLowerCase() === (currentStudent.fullName || '').toLowerCase()) ||
        a.id === currentStudent.id ||
        a.id === currentStudent.registrationNumber ||
        (a as any).student_id === currentStudent.id ||
        (a as any).student_id === currentStudent.registrationNumber
    );
    const appPic = getStudentPhoto(matchingApp);
    if (appPic) return appPic;

    // 3. Match from studentsList
    const inList = studentsList.find(
      (s) =>
        s.id === currentStudent.id ||
        s.registrationNumber === currentStudent.registrationNumber ||
        (s.email && (s.email || '').toLowerCase() === (currentStudent.email || '').toLowerCase())
    );
    const inListPic = getStudentPhoto(inList);
    if (inListPic) return inListPic;

    // 4. LocalStorage
    const localPhoto =
      (currentStudent.email && localStorage.getItem(`dec_photo_${currentStudent.email.toLowerCase().trim()}`)) ||
      (currentStudent.id && localStorage.getItem(`dec_photo_${currentStudent.id}`)) ||
      (currentStudent.registrationNumber && localStorage.getItem(`dec_photo_${currentStudent.registrationNumber}`));
    if (isValidPhoto(localPhoto)) return localPhoto!;

    return (
      (isValidPhoto(currentStudent.avatar) ? currentStudent.avatar : '') ||
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23e0f2fe"/><circle cx="100" cy="80" r="40" fill="%230284c7"/><path d="M35 175 C35 130 65 118 100 118 C135 118 165 130 165 175 Z" fill="%230369a1"/></svg>'
    );
  }, [currentStudent, applications, studentsList]);

  // Handler to upload / replace student passport photo directly from ID card view
  const handleStudentPassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'File Too Large', 'Passport photo must be under 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawUrl = (event.target?.result as string) || '';
        const img = new Image();
        img.onload = () => {
          const maxDim = 320;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            updateStudentPhoto(currentStudent.id, compressed);
          } else {
            updateStudentPhoto(currentStudent.id, rawUrl);
          }
        };
        img.onerror = () => {
          updateStudentPhoto(currentStudent.id, rawUrl);
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync shift selection when switching candidates
  useEffect(() => {
    if (currentStudent.studentShift) {
      setSelectedShift(currentStudent.studentShift);
    }
  }, [currentStudent.id, currentStudent.studentShift]);

  // Open the authentic Official Receipt with Logo and QR Code
  const handleOpenOfficialReceipt = (tx?: any) => {
    if (currentStudent.lastApprovedReceipt && (!tx || tx.reference === currentStudent.lastApprovedReceipt.transactionReference)) {
      openReceiptModal({
        ...currentStudent.lastApprovedReceipt,
        studentAvatar: studentAvatarImg,
      });
      return;
    }

    const targetTx = tx || transactions.find((t) => t.studentId === currentStudent.id && t.status === 'Successful');
    const shift = targetTx?.studentShift || currentStudent.studentShift || 'Morning';
    const amount = targetTx?.amount || (shift === 'Morning' ? 20000 : 15000);
    const receiptNum = targetTx?.receiptNumber || `DEC-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const month = targetTx?.monthPeriod || currentStudent.subscriptionMonth || 'September 2026';
    const validUntil = targetTx?.validUntil || currentStudent.subscriptionExpiryDate || '30 Sep 2026';

    const officialReceipt: OfficialReceipt = {
      id: `rec-${targetTx ? targetTx.id : Date.now()}`,
      receiptNumber: receiptNum,
      transactionReference: targetTx ? targetTx.reference : `DEC-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      studentEmail: currentStudent.email,
      studentPhone: currentStudent.phone,
      registrationNumber: currentStudent.registrationNumber,
      program: currentStudent.program,
      studentShift: shift,
      amount,
      amountInWords: shift === 'Morning' ? 'TWENTY THOUSAND NAIRA ONLY' : 'FIFTEEN THOUSAND NAIRA ONLY',
      currency: 'NGN',
      monthPeriod: month,
      validUntil,
      issueDate: targetTx?.timestamp || new Date().toLocaleDateString('en-GB'),
      approvedBy: 'Mr. Akinjo Rotimi (Founder)',
      approvedAt: targetTx?.approvedAt || 'Immediate Verification',
      qrPayload: `https://densuredconsult.ng/verify-receipt?receipt=${receiptNum}&student=${encodeURIComponent(currentStudent.fullName)}&reg=${currentStudent.registrationNumber}&shift=${shift}&amount=${amount}&status=APPROVED`,
      status: 'Approved',
      paymentMethod: (targetTx?.paymentMethod as any) || 'Bank Transfer',
      studentAvatar: studentAvatarImg,
      photoUrl: studentAvatarImg,
    };

    openReceiptModal(officialReceipt);
  };

  const handleDownloadIdCard = () => {
    const cardEl = document.getElementById('student-portal-id-card-front');
    const cardBackEl = document.getElementById('student-portal-id-card-back');
    if (cardEl && currentStudent) {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DEC_Student_ID_${currentStudent.registrationNumber}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { 
      size: 3.375in 2.125in; 
      margin: 0; 
    }
    @media print { 
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; background: #fff; }
      .cr80-print-card { 
        width: 3.375in !important; 
        height: 2.125in !important; 
        max-width: 3.375in !important; 
        max-height: 2.125in !important; 
        margin: 0 !important; 
        page-break-after: always; 
        border-radius: 0.125in !important;
      }
    }
    body { background: #f1f5f9; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 16px; font-family: ui-sans-serif, system-ui, sans-serif; }
  </style>
</head>
<body>
  <div class="cr80-print-card" style="width: 3.375in; height: 2.125in;">
    ${cardEl.innerHTML}
  </div>
  ${cardBackEl ? `<div class="cr80-print-card" style="width: 3.375in; height: 2.125in;">${cardBackEl.innerHTML}</div>` : ''}
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DEC_Student_ID_3.375x2.125_${currentStudent.registrationNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.print();
    }
  };

  // Student Login Gate state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CBT interactive simulator state
  const [activeCbtExamId, setActiveCbtExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(600); // 10 mins for test
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  // Practice sets filter & interactive answer reveal
  const [practiceSubjectFilter, setPracticeSubjectFilter] = useState<string>('All');
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [practiceUserAnswers, setPracticeUserAnswers] = useState<Record<string, string>>({});

  // Receipt Modal state for printable official receipt
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<any | null>(null);

  // Filter transactions for current student
  const studentTransactions = transactions.filter((t) => t.studentId === currentStudent.id);

  // Countdown timer for CBT
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeCbtExamId && !isExamCompleted && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCbtExamId, isExamCompleted, examTimeLeft]);

  const [selectedCbtSubjectFilter, setSelectedCbtSubjectFilter] = useState<string>('All');
  const [cbtReviewFilter, setCbtReviewFilter] = useState<'failed' | 'all'>('failed');
  const [completedExamQuestions, setCompletedExamQuestions] = useState<PracticeQuestion[]>([]);

  const registeredSubjects = currentStudent.selectedSubjects?.length
    ? currentStudent.selectedSubjects
    : currentStudent.subjectCombinations?.length
    ? currentStudent.subjectCombinations
    : ['Mathematics', 'Physics', 'Chemistry', 'Use of English'];

  // CBT questions dynamically generated from student's registered subjects
  const studentCbtQuestions = useMemo(() => {
    let matching = practiceQuestions.filter((q) =>
      registeredSubjects.some(
        (subj) =>
          subj &&
          q?.subject &&
          (subj.toLowerCase().includes(q.subject.toLowerCase()) ||
            q.subject.toLowerCase().includes(subj.toLowerCase()))
      )
    );
    if (matching.length === 0) matching = practiceQuestions;

    if (selectedCbtSubjectFilter !== 'All') {
      const bySubject = matching.filter(
        (q) =>
          q.subject.toLowerCase().includes(selectedCbtSubjectFilter.toLowerCase()) ||
          selectedCbtSubjectFilter.toLowerCase().includes(q.subject.toLowerCase())
      );
      if (bySubject.length > 0) return bySubject;
    }

    return matching;
  }, [practiceQuestions, registeredSubjects, selectedCbtSubjectFilter]);

  // Study materials tailored to student's chosen subjects or all uploaded materials
  const filteredStudyMaterials = useMemo(() => {
    if (materialSubjectFilter === 'All') {
      return studyMaterials;
    }
    if (materialSubjectFilter === 'My Subjects') {
      return studyMaterials.filter((mat) => {
        if (mat.subject === 'General' || mat.subject === 'All') return true;
        return registeredSubjects.some(
          (subj) =>
            subj &&
            mat?.subject &&
            (subj.toLowerCase().includes(mat.subject.toLowerCase()) ||
              mat.subject.toLowerCase().includes(subj.toLowerCase()))
        );
      });
    }
    return studyMaterials.filter((mat) => (mat.subject || '').toLowerCase().includes(materialSubjectFilter.toLowerCase()));
  }, [studyMaterials, registeredSubjects, materialSubjectFilter]);

  const handleStartExam = (examId: string) => {
    setActiveCbtExamId(examId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamTimeLeft(600);
    setIsExamCompleted(false);
    setExamScore(null);
    setCompletedExamQuestions([]);
    showToast('info', 'CBT Mock Started', `Simulation generated for your registered subjects: ${registeredSubjects.join(', ')}`);
  };

  const handleSelectAnswer = (qIndex: number, optionLabel: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optionLabel,
    }));
  };

  const handleFinishExam = () => {
    const examQuestions = studentCbtQuestions;
    setCompletedExamQuestions(examQuestions);
    let correctCount = 0;
    examQuestions.forEach((q: PracticeQuestion, idx: number) => {
      if (selectedAnswers[idx] === q.correctOption) {
        correctCount += 1;
      }
    });

    const total = examQuestions.length || 1;
    const percentage = Math.round((correctCount / total) * 100);
    const scaledScore = Math.round((percentage / 100) * 400);

    setExamScore({
      correct: correctCount,
      total,
      percentage,
    });
    setIsExamCompleted(true);

    const activeExam = cbtExams.find((e) => e.id === activeCbtExamId);
    recordCBTAttempt({
      examId: activeCbtExamId || 'cbt-jam-01',
      examTitle: activeExam ? `${activeExam.title}` : `${selectedCbtSubjectFilter === 'All' ? 'Registered Subjects' : selectedCbtSubjectFilter} CBT Practice`,
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      registrationNumber: currentStudent.registrationNumber,
      score: scaledScore,
      maxScore: 400,
      percentage,
      status: percentage >= 60 ? 'Passed' : 'Failed',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const LockedFeatureNotice: React.FC<{ featureName: string }> = ({ featureName }) => (
    <div className="bg-white rounded-3xl border-2 border-amber-400/80 p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 shadow-sm animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8 text-amber-600" />
      </div>
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
          Payment-Protected Learning Feature
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#25166B]">
          {featureName} is Locked
        </h3>
        <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed max-w-md mx-auto">
          Your monthly payment has not been approved. Please complete your ₦20,000 monthly payment to access this feature.
        </p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="text-slate-500">Candidate Name:</span>
          <strong className="text-[#25166B]">{currentStudent.fullName}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Student ID / Reg:</span>
          <strong className="font-mono text-slate-900">{currentStudent.registrationNumber}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Enrollment Status:</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            APPROVED
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Monthly Payment Status:</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black border ${
              isSubscriptionActive || currentStudent.paymentStatus === 'APPROVED' || currentStudent.subscriptionStatus === 'Active'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : currentStudent.paymentStatus === 'PENDING' || currentStudent.subscriptionStatus === 'Pending Approval'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : currentStudent.paymentStatus === 'EXPIRED' || currentStudent.subscriptionStatus === 'Expired'
                ? 'bg-red-100 text-red-900 border-red-300'
                : 'bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            {isSubscriptionActive || currentStudent.paymentStatus === 'APPROVED' || currentStudent.subscriptionStatus === 'Active'
              ? 'APPROVED'
              : currentStudent.paymentStatus === 'PENDING' || currentStudent.subscriptionStatus === 'Pending Approval'
              ? 'PENDING ADMIN APPROVAL'
              : currentStudent.paymentStatus === 'EXPIRED' || currentStudent.subscriptionStatus === 'Expired'
              ? 'EXPIRED'
              : 'NOT PAID'}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
          <span className="text-slate-700">Monthly Tuition Fee:</span>
          <span className="font-mono text-[#D5241B] text-sm">₦20,000</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStudentTab('finance')}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
      >
        <CreditCard className="w-4 h-4" />
        <span>Complete ₦20,000 Monthly Payment</span>
      </button>
    </div>
  );

  const navItems: { id: StudentPortalTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'id-card', label: 'My ID Card', icon: <CreditCard className="w-4 h-4" />, badge: 'Official' },
    { id: 'profile', label: 'Candidate Profile', icon: <User className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance Record', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'cbt-mocks', label: 'Mock Exams (CBT)', icon: <Award className="w-4 h-4" />, badge: 'Active' },
    { id: 'results', label: 'My Results', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'progress', label: 'Academic Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'practice-sets', label: 'Practice Sets', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'timetables', label: 'Timetables', icon: <Clock className="w-4 h-4" /> },
    { id: 'notes', label: 'Lecture Notes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'finance', label: 'Tuition & Receipts', icon: <DollarSign className="w-4 h-4" /> },
  ];

  const handleStudentLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginStudent(loginIdentifier, loginPassword);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  if (!isStudentLoggedIn) {
    return (
      <div className="min-h-[85vh] bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-md">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-7 h-7 text-sky-600" />
            </div>
            <h2 className="text-2xl font-black text-sky-600 tracking-tight">Student e-portal Sign In</h2>
            <p className="text-xs text-sky-800 font-semibold">
              D Ensured Consult • Individual Candidate Access Desk
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-200 text-xs text-[#1D1918] space-y-1">
            <div className="flex items-center gap-2 font-bold text-sky-700">
              <Lock className="w-4 h-4 text-sky-600" />
              <span>Registered Candidate Authentication</span>
            </div>
            <p className="text-[11px] text-slate-900 leading-relaxed font-medium">
              Sign in with your official <strong>Registration Number</strong> (e.g. <code>DEC-2026-XXXX</code>) or registered <strong>Email Address</strong> and your portal password.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-[#D5241B]/30 text-[#D5241B] text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D5241B]" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleStudentLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#25166B] mb-1">
                Registration Number or Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. DEC-2026-4821 or student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium text-[#1D1918] focus:border-[#098CD0] focus:ring-2 focus:ring-[#098CD0]/20 outline-hidden bg-[#FAFAFA]"
                />
                <User className="w-4 h-4 text-[#098CD0] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#25166B] mb-1">
                Portal Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your portal password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 font-medium text-[#1D1918] focus:border-[#098CD0] focus:ring-2 focus:ring-[#098CD0]/20 outline-hidden bg-[#FAFAFA]"
                />
                <Lock className="w-4 h-4 text-[#098CD0] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-[#25166B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button: Primary Red #D5241B */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-bold text-sm shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <span>Verifying Student Record...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In to Student e-portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick select registered candidate demo */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-[#1D1918]/60 uppercase tracking-wider block text-center">
              Quick Select Registered Profile:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {studentsList.slice(0, 3).map((std) => (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => {
                    setLoginIdentifier(std.registrationNumber);
                    setLoginPassword(std.password || 'student123');
                  }}
                  className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-[#098CD0]/10 text-[#25166B] font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  {std.fullName.split(' ')[0]} ({std.program})
                </button>
              ))}
            </div>
          </div>

          {/* New student prompt */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#1D1918]/70">
              New candidate?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('admission')}
                className="font-bold text-[#098CD0] hover:underline cursor-pointer"
              >
                Complete UTME / IELTS Registration Here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Student Profile Quick Switcher Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={studentAvatarImg}
              alt={currentStudent.fullName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#098CD0]/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#25166B] text-base sm:text-lg">
                  {currentStudent.fullName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-black bg-[#25166B]/10 text-[#25166B] border border-[#25166B]/20">
                  {currentStudent.program}
                </span>
              </div>
              <p className="text-xs text-[#1D1918]/70 font-medium">
                Reg No: <strong className="font-mono text-[#1D1918]">{currentStudent.registrationNumber}</strong> • Mode:{' '}
                <strong className="text-[#1D1918]">{currentStudent.studyMode}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <span className="text-xs text-[#1D1918]/60 font-semibold">Switch Candidate:</span>
              <div className="flex gap-1">
                {studentsList.slice(0, 4).map((std) => (
                  <button
                    key={std.id}
                    onClick={() => switchStudent(std.id)}
                    title={std.fullName}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      std.id === currentStudent.id
                        ? 'bg-[#25166B] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {std.fullName.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={logoutStudent}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-[#D5241B] hover:bg-red-50 text-xs font-bold text-slate-600 hover:text-[#D5241B] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Active Subscription Banner or Payment Status Alert */}
        {isSubscriptionActive ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#028D3B]/15 text-[#028D3B] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#028D3B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#25166B] text-sm sm:text-base">
                    Monthly Pass Active: {currentStudent.studentShift} Student
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#028D3B] text-white">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Monthly Tuition: <strong>₦{currentStudent.monthlyFee.toLocaleString()}/mo</strong> • Valid until end of month: <strong className="text-[#25166B]">{currentStudent.subscriptionExpiryDate || currentStudent.paymentExpiryDate || defaultEndOfMonth}</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenOfficialReceipt()}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-[#25166B] hover:bg-[#1c1152] text-[#FFC600] font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-2 shrink-0 transition-all"
            >
              <QrCode className="w-4 h-4 text-[#FFC600]" />
              <span>View Official Receipt (with QR Code)</span>
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {currentStudent.paymentStatus === 'EXPIRED' || currentStudent.subscriptionStatus === 'Expired'
                    ? 'Your monthly payment has expired.'
                    : currentStudent.paymentStatus === 'PENDING' || currentStudent.subscriptionStatus === 'Pending Approval'
                    ? 'Monthly payment pending admin approval.'
                    : 'Your monthly payment has not been approved.'}
                </h3>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Your monthly payment has not been approved. Please complete your ₦20,000 monthly payment to access this feature.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStudentTab('finance')}
              className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {currentStudent.paymentStatus === 'PENDING' || currentStudent.subscriptionStatus === 'Pending Approval'
                  ? 'View Payment Status'
                  : 'Pay ₦20,000 Tuition'}
              </span>
            </button>
          </div>
        )}

        {/* Horizontal Scrollable Tabs with Direct Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs overflow-x-auto">
          <nav className="flex items-center gap-1.5 min-w-max">
            {navItems.map((tab) => {
              const isActive = studentTab === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#/student-portal?tab=${tab.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setStudentTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#25166B] text-[#FFC600] shadow-sm'
                      : 'text-slate-600 hover:text-[#25166B] hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        isActive ? 'bg-[#FFC600] text-[#25166B]' : 'bg-amber-100 text-[#25166B]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* TAB 1: DASHBOARD */}
        {studentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706]/20 border border-[#d97706]/30 text-[#d97706] text-xs font-black uppercase mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    e-portal Student Desk
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Welcome back, {currentStudent.fullName}!
                  </h2>
                  <p className="text-slate-300 text-sm mt-1 max-w-xl">
                    Your target score goal is <strong className="text-[#f59e0b]">{currentStudent.targetScore}</strong>.
                    You are in the final countdown to your official {currentStudent.program} exams.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center shrink-0 w-full md:w-auto">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block">
                    Official Exam Date
                  </span>
                  <div className="text-2xl font-black text-[#f59e0b] font-mono mt-0.5">
                    {currentStudent.daysRemaining} Days Left
                  </div>
                  <span className="text-xs text-slate-300 block mt-0.5">{currentStudent.targetExamDate}</span>
                </div>
              </div>
            </div>

            {/* Metric KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Current Avg Score</span>
                  <Award className="w-4 h-4 text-[#d97706]" />
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0a192f] font-mono">
                  {currentStudent.currentAverageScore}
                  <span className="text-xs text-slate-400 font-normal"> / 400</span>
                </div>
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Top 6% in Class Percentile
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Attendance Rate</span>
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0a192f] font-mono">
                  {currentStudent.attendanceRate}%
                </div>
                <p className="text-xs text-slate-500 font-medium">32 of 34 lectures attended</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Syllabus Coverage</span>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0a192f] font-mono">
                  {currentStudent.syllabusCompletion}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-[#d97706] h-full rounded-full"
                    style={{ width: `${currentStudent.syllabusCompletion}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>Tuition Balance</span>
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0a192f] font-mono">
                  ₦{currentStudent.tuitionBalance.toLocaleString()}
                </div>
                {currentStudent.tuitionBalance > 0 ? (
                  <button
                    onClick={() => openPaymentModal(currentStudent.tuitionBalance, 'Tuition Balance Clearance')}
                    className="text-xs text-[#d97706] font-extrabold hover:underline cursor-pointer"
                  >
                    Clear Balance Now →
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-bold">100% Fully Cleared</span>
                )}
              </div>
            </div>

            {/* Quick Actions & Next Class */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Next Lesson Box */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#0a192f] text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#d97706]" />
                    <span>Next Scheduled Class</span>
                  </h3>
                  <a
                    href="#/student-portal?tab=timetables"
                    onClick={(e) => {
                      e.preventDefault();
                      setStudentTab('timetables');
                    }}
                    className="text-xs font-bold text-[#d97706] hover:underline"
                  >
                    View Timetable →
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706] uppercase">
                      Physical Hall A
                    </span>
                    <h4 className="font-bold text-[#0a192f] text-sm">
                      {currentStudent.nextClass}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Assigned Lead: {currentStudent.assignedAdvisor}
                    </p>
                  </div>
                  <a
                    href="#/student-portal?tab=notes"
                    onClick={(e) => {
                      e.preventDefault();
                      setStudentTab('notes');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0a192f] hover:bg-[#112240] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Download Handout
                  </a>
                </div>

                {/* Quick Portal Shortcuts */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
                    Quick Shortcuts:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <a
                      href="#/student-portal?tab=cbt-mocks"
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentTab('cbt-mocks');
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center space-y-1 transition-colors block"
                    >
                      <Award className="w-5 h-5 text-[#d97706] mx-auto" />
                      <span className="text-xs font-bold text-[#0a192f] block">Take CBT Mock</span>
                    </a>

                    <a
                      href="#/student-portal?tab=id-card"
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentTab('id-card');
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center space-y-1 transition-colors block"
                    >
                      <CreditCard className="w-5 h-5 text-blue-600 mx-auto" />
                      <span className="text-xs font-bold text-[#0a192f] block">Student ID Card</span>
                    </a>

                    <a
                      href="#/student-portal?tab=notes"
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentTab('notes');
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center space-y-1 transition-colors block"
                    >
                      <BookOpen className="w-5 h-5 text-emerald-600 mx-auto" />
                      <span className="text-xs font-bold text-[#0a192f] block">Lecture Notes</span>
                    </a>

                    <a
                      href="#/student-portal?tab=finance"
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentTab('finance');
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-center space-y-1 transition-colors block"
                    >
                      <DollarSign className="w-5 h-5 text-purple-600 mx-auto" />
                      <span className="text-xs font-bold text-[#0a192f] block">Tuition Receipt</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Latest Announcement Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[#0a192f] text-base flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#d97706]" />
                    <span>Notice Board</span>
                  </h3>
                  <a
                    href="#/student-portal?tab=announcements"
                    onClick={(e) => {
                      e.preventDefault();
                      setStudentTab('announcements');
                    }}
                    className="text-xs font-bold text-[#d97706] hover:underline"
                  >
                    All →
                  </a>
                </div>

                <div className="space-y-3">
                  {announcements.slice(0, 3).map((ann) => (
                    <div key={ann.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-[#d97706] uppercase">{ann.category}</span>
                        <span className="text-slate-400">{ann.date}</span>
                      </div>
                      <h4 className="font-bold text-[#0a192f] text-xs leading-snug">{ann.title}</h4>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY ID CARD */}
        {studentTab === 'id-card' && (
          <div className="space-y-6">
            {!isSubscriptionActive ? (
              <LockedFeatureNotice featureName="Official Student ID Card" />
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#25166B]">
                    Official Student Identity Card
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Authorized identity credential with embedded cryptographic QR code issued by D Ensured Consult Directorate for the Official 2026/2027 academic session.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0284c7] font-bold text-xs shadow-xs cursor-pointer transition-all border border-[#0284c7]">
                    <Upload className="w-4 h-4" />
                    <span>Upload/Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleStudentPassportUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenOfficialReceipt()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-black text-xs shadow-xs cursor-pointer transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadIdCard}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFC600] hover:bg-[#e6b300] text-[#25166B] font-black text-xs shadow-xs cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ID</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1D1918] font-bold text-xs shadow-xs cursor-pointer transition-all border border-slate-200"
                  >
                    <Printer className="w-4 h-4 text-[#D5241B]" />
                    <span>Print ID Card</span>
                  </button>
                </div>
              </div>

              {/* ID Card Graphic Front & Back - CR80 Standard (3.375 x 2.125 inches) */}
              <div className="space-y-4">
                {/* CR80 Standard Dimension Header & Scale Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-2xs print:hidden text-xs max-w-2xl mx-auto">
                  <div>
                    <span className="font-black text-[#25166B] block">
                      Candidate Student ID Card (CR80 Standard)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Official Dimensions: <strong className="text-[#D5241B]">3.375 x 2.125 inches</strong> (85.6mm × 54.0mm)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px] font-bold">Zoom:</span>
                    <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200">
                      {[1, 1.25, 1.5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setIdCardZoom(s)}
                          className={`px-2.5 py-0.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                            idCardZoom === s
                              ? 'bg-[#25166B] text-white shadow-xs'
                              : 'text-slate-600 hover:text-[#25166B]'
                          }`}
                        >
                          {s === 1 ? '100% (3.375"×2.125")' : `${Math.round(s * 100)}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scaled ID Cards Container */}
                <div className="overflow-x-auto py-2 flex flex-col items-center gap-6">
                  {/* Front of ID Card (3.375in x 2.125in) */}
                  <div
                    style={{
                      transform: idCardZoom !== 1 ? `scale(${idCardZoom})` : undefined,
                      transformOrigin: 'top center',
                      marginBottom: idCardZoom > 1 ? `${(idCardZoom - 1) * 204}px` : '0',
                    }}
                    className="transition-transform duration-150"
                  >
                    <div
                      id="student-portal-id-card-front"
                      className="cr80-id-card relative bg-white border-2 border-[#FFC600] shadow-xl overflow-hidden flex flex-col justify-between"
                      style={{
                        width: '3.375in',
                        height: '2.125in',
                        minWidth: '3.375in',
                        minHeight: '2.125in',
                        maxWidth: '3.375in',
                        maxHeight: '2.125in',
                        borderRadius: '0.125in',
                      }}
                    >
                      {/* Top Navy & Gold Header */}
                      <div className="bg-gradient-to-r from-[#0a192f] via-[#25166B] to-[#0284c7] text-white px-2.5 py-1.5 flex items-center justify-between border-b-2 border-[#FFC600]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-white p-0.5 shrink-0 border border-[#FFC600]">
                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
                          </div>
                          <div>
                            <span className="font-extrabold text-[10px] tracking-tight block text-white leading-tight">
                              D ENSURED CONSULT
                            </span>
                            <span className="text-[6.5px] uppercase tracking-widest text-[#FFC600] font-black block leading-none">
                              Learn, Emerge and Succeed.
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-1.5 py-0.5 rounded text-[7.5px] font-black bg-[#FFC600] text-[#0a192f] uppercase tracking-wider block">
                            {currentStudent.studentShift || 'Morning'}
                          </span>
                          <span className="text-[6.5px] text-white/90 font-bold block mt-0.5">
                            2026/2027 Session
                          </span>
                        </div>
                      </div>

                      {/* Body: Photo & Credentials */}
                      <div className="px-2.5 py-1.5 flex items-start gap-2 flex-1 bg-gradient-to-b from-white via-slate-50/50 to-white">
                        {/* Photo with clean gold & navy ring */}
                        <div className="relative shrink-0">
                          <img
                            src={studentAvatarImg}
                            alt={currentStudent.fullName}
                            style={{ width: '0.72in', height: '0.90in' }}
                            className="rounded-lg object-cover border-2 border-[#FFC600] ring-1 ring-[#0a192f]/20 shadow-xs bg-slate-100"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23e0f2fe"/><circle cx="100" cy="80" r="40" fill="%230284c7"/><path d="M35 175 C35 130 65 118 100 118 C135 118 165 130 165 175 Z" fill="%230369a1"/></svg>';
                            }}
                          />
                          <div className="absolute -bottom-1 -right-0.5 px-1 py-0.2 rounded bg-[#028D3B] text-white font-black text-[6.5px] uppercase tracking-wider shadow-2xs">
                            CLEARED
                          </div>
                        </div>

                        <div className="flex-1 space-y-0.5 leading-tight">
                          <div>
                            <span className="text-[7px] text-slate-400 uppercase font-black tracking-wider block">Candidate Name</span>
                            <h3 className="text-[10.5px] font-black text-[#0a192f] leading-tight truncate">
                              {currentStudent.fullName}
                            </h3>
                          </div>

                          <div>
                            <span className="text-[6.5px] text-slate-400 uppercase font-bold tracking-wider block">Reg Number</span>
                            <strong className="font-mono text-[9.5px] font-black text-[#0284c7]">
                              {currentStudent.registrationNumber}
                            </strong>
                          </div>

                          <div className="grid grid-cols-2 gap-1 pt-0.5 border-t border-slate-200 text-[7px]">
                            <div>
                              <span className="text-slate-400 block">Shift</span>
                              <strong className="text-[#0a192f]">{currentStudent.studentShift || 'Morning'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Program</span>
                              <strong className="text-[#0a192f] truncate block">{currentStudent.program}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Bar: Barcode, Expiry & QR */}
                      <div className="px-2.5 py-1 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[7px]">
                        <div className="space-y-0.2">
                          <div className="font-mono text-[#0a192f] text-[7.5px] tracking-widest font-black leading-none">
                            |||| || ||||| || ||||
                          </div>
                          <span className="text-[6.5px] text-[#028D3B] font-mono font-bold block">
                            EXPIRES: {currentStudent.subscriptionExpiryDate || '30 Sep 2026'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="text-right leading-none">
                            <span className="text-[6px] text-[#0284c7] font-black block">DIRECTORATE</span>
                            <span className="text-[5.5px] text-slate-500">Mr. Akinjo Rotimi</span>
                          </div>
                          <div className="bg-white p-0.5 rounded border border-[#0284c7]/30 shadow-2xs shrink-0">
                            <QRCodeSVG
                              value={`https://densuredconsult.edu.ng/verify?reg=${currentStudent.registrationNumber}&student=${encodeURIComponent(currentStudent.fullName)}&status=VALID`}
                              size={28}
                              level="M"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of ID Card (3.375in x 2.125in) */}
                  <div
                    style={{
                      transform: idCardZoom !== 1 ? `scale(${idCardZoom})` : undefined,
                      transformOrigin: 'top center',
                      marginBottom: idCardZoom > 1 ? `${(idCardZoom - 1) * 204}px` : '0',
                    }}
                    className="transition-transform duration-150"
                  >
                    <div
                      id="student-portal-id-card-back"
                      className="cr80-id-card relative bg-white border-2 border-slate-300 shadow-md overflow-hidden flex flex-col justify-between p-2.5 text-[7.5px] text-[#1D1918]"
                      style={{
                        width: '3.375in',
                        height: '2.125in',
                        minWidth: '3.375in',
                        minHeight: '2.125in',
                        maxWidth: '3.375in',
                        maxHeight: '2.125in',
                        borderRadius: '0.125in',
                      }}
                    >
                      <div className="border-b border-[#FFC600] pb-1 flex items-center justify-between bg-gradient-to-r from-[#0a192f] to-[#25166B] text-white p-1 rounded-md">
                        <span className="font-extrabold uppercase tracking-wider text-[#FFC600] text-[8px]">
                          TERMS &amp; CENTER REGULATIONS
                        </span>
                        <span className="text-[6.5px] font-bold text-white bg-emerald-600 px-1 py-0.2 rounded">
                          OFFICIAL 2026/2027
                        </span>
                      </div>

                      <ul className="list-disc pl-3 space-y-0.5 text-slate-600 text-[7px] leading-tight mt-1">
                        <li>This card is the property of D Ensured Consult and must be presented for CBT mock drills and physical lectures.</li>
                        <li>Cardholder is officially cleared for student e-portal resources, past questions, and test simulations.</li>
                        <li>Loss or damage must be promptly reported to the directorate desk.</li>
                      </ul>

                      <div className="pt-1 border-t border-slate-200 text-[6.5px] text-slate-600 space-y-0.2 leading-tight">
                        <p><strong>Campus:</strong> DOYIN PLAZA, IGBOELERIN BUSSTOP, OKOMAIKO, LAGOS</p>
                        <p><strong>Hotline:</strong> <span className="font-mono font-bold text-[#0284c7]">08147896930</span> | Densuredconsult@gmail.com</p>
                      </div>

                      <div className="flex justify-between items-center pt-0.5 border-t border-slate-200 text-[6.5px]">
                        <span className="font-mono text-slate-400">Card Type: CR80 PVC Standard</span>
                        <span className="font-serif italic font-bold text-[#0a192f]">Akinjo Rotimi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CANDIDATE PROFILE */}
        {studentTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Candidate Academic Profile</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Detailed enrollment records, chosen subjects, and academic targets.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card Summary */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="relative inline-block mx-auto">
                  <img
                    src={studentAvatarImg}
                    alt={currentStudent.fullName}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-[#d97706]/40 shadow-md bg-white"
                  />
                  <label className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#0284c7] hover:bg-[#026aa2] text-white shadow-md cursor-pointer transition-transform hover:scale-110" title="Update Passport Photo">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleStudentPassportUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0a192f] text-lg">{currentStudent.fullName}</h3>
                  <span className="text-xs text-[#d97706] font-bold block">{currentStudent.email}</span>
                  <span className="text-xs text-slate-500 font-mono mt-0.5 block">{currentStudent.phone}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration ID:</span>
                    <strong className="font-mono text-slate-800">{currentStudent.registrationNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Academic Diet:</span>
                    <strong className="text-slate-800">2026 Session</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Center:</span>
                    <strong className="text-slate-800">Okomaiko Campus</strong>
                  </div>
                </div>
              </div>

              {/* Comprehensive Profile Form/Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold block">Enrolled Programme:</span>
                    <strong className="text-[#0a192f] text-sm block">{currentStudent.program}</strong>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold block">Study Mode:</span>
                    <strong className="text-[#0a192f] text-sm block">{currentStudent.studyMode}</strong>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold block">Assigned Academic Advisor:</span>
                    <strong className="text-[#0a192f] text-sm block">{currentStudent.assignedAdvisor}</strong>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-semibold block">Target Score Goal:</span>
                    <strong className="text-[#d97706] text-sm block">{currentStudent.targetScore}</strong>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-[#098CD0]/30 shadow-xs space-y-3">
                  <h4 className="font-bold text-[#25166B] text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#028D3B]" />
                    <span>
                      {currentStudent.program === 'IELTS'
                        ? 'IELTS Module Specifications & Skills Plan'
                        : 'Official 4-Subject Combination & Syllabus Plan'}
                    </span>
                  </h4>

                  {currentStudent.program === 'IELTS' ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-lg bg-[#25166B] text-white font-bold">
                          Module: {currentStudent.ieltsModule || 'Academic'}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-[#028D3B]/10 text-[#028D3B] font-bold border border-[#028D3B]/20">
                          Target: {currentStudent.ieltsTargetBand || 'Band 8.0'}
                        </span>
                        {currentStudent.destinationCountry && (
                          <span className="px-3 py-1 rounded-lg bg-slate-100 text-[#1D1918] font-bold">
                            Destination: {currentStudent.destinationCountry}
                          </span>
                        )}
                      </div>
                      <div className="p-3 bg-[#FAFAFA] rounded-xl border border-slate-200">
                        <span className="font-bold text-[#25166B] block mb-1">British Council 4-Skill Tracks:</span>
                        <p className="text-[#1D1918]/80">
                          Active laboratory enrollment in: <strong>Listening Audio Lab</strong>, <strong>Reading Heuristics</strong>,{' '}
                          <strong>Writing Tasks 1 & 2</strong>, and <strong>Speaking 1-on-1 Interview Simulations</strong>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-[#25166B] block">Approved 4 Examination Subjects:</span>
                      <div className="flex flex-wrap gap-2">
                        {currentStudent.subjectCombinations && currentStudent.subjectCombinations.length > 0 ? (
                          currentStudent.subjectCombinations.map((sub, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                (sub || '').toLowerCase().includes('english')
                                  ? 'bg-[#25166B] text-white flex items-center gap-1 shadow-2xs'
                                  : 'bg-white border border-[#098CD0]/40 text-[#25166B]'
                              }`}
                            >
                              {sub}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="px-3 py-1.5 rounded-lg bg-[#25166B] text-white font-bold flex items-center gap-1 shadow-2xs">
                              <Lock className="w-3 h-3 text-[#FFC600]" />
                              English Language (Compulsory)
                            </span>
                            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#098CD0]/40 text-[#25166B] font-bold">Mathematics</span>
                            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#098CD0]/40 text-[#25166B] font-bold">Physics</span>
                            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#098CD0]/40 text-[#25166B] font-bold">Chemistry</span>
                          </>
                        )}
                      </div>
                      {currentStudent.targetInstitution && (
                        <p className="text-[11px] text-[#1D1918]/70 pt-1">
                          Target Institution: <strong>{currentStudent.targetInstitution}</strong> • Course: <strong>{currentStudent.targetCourse}</strong>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ATTENDANCE RECORD */}
        {studentTab === 'attendance' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Daily Attendance Record</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Biometric and register logs across physical and online tutorial sessions.
                </p>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                Overall Attendance: {currentStudent.attendanceRate}% (Excellent)
              </div>
            </div>

            {/* Attendance Log Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Subject / Module</th>
                    <th className="py-3 px-4">Time Slot</th>
                    <th className="py-3 px-4">Hall / Venue</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-[#0a192f]">22 Mar 2026</td>
                    <td className="py-3.5 px-4">Physics: Electric Field Calculations</td>
                    <td className="py-3.5 px-4">08:30 AM - 11:00 AM</td>
                    <td className="py-3.5 px-4">CBT Lab 1</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Present
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-[#0a192f]">20 Mar 2026</td>
                    <td className="py-3.5 px-4">Mathematics: Coordinate Geometry</td>
                    <td className="py-3.5 px-4">09:00 AM - 11:30 AM</td>
                    <td className="py-3.5 px-4">Lecture Hall A</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Present
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-[#0a192f]">18 Mar 2026</td>
                    <td className="py-3.5 px-4">Grand Mock Test 4 Simulation</td>
                    <td className="py-3.5 px-4">10:00 AM - 12:00 PM</td>
                    <td className="py-3.5 px-4">CBT Suite A</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Present
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-[#0a192f]">16 Mar 2026</td>
                    <td className="py-3.5 px-4">Chemistry: Qualitative Analysis Practical</td>
                    <td className="py-3.5 px-4">01:00 PM - 03:30 PM</td>
                    <td className="py-3.5 px-4">Science Lab B</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                        Late (15 mins)
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-[#0a192f]">14 Mar 2026</td>
                    <td className="py-3.5 px-4">Use of English: Lexis & Structure</td>
                    <td className="py-3.5 px-4">09:00 AM - 11:00 AM</td>
                    <td className="py-3.5 px-4">Lecture Hall A</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Present
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CBT & EXAMINATIONS: MOCK EXAMS (CBT) */}
        {studentTab === 'cbt-mocks' && (
          <div className="space-y-6">
            {!isSubscriptionActive ? (
              <LockedFeatureNotice featureName="Mock Exams & CBT Practice Simulations" />
            ) : !activeCbtExamId ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full inline-block mb-1.5">
                      Exam Standard Simulation
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">
                      Computer-Based Test (CBT) Practice Hub
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Practice past questions tailored to your registered subjects with instant scoring and heuristic explanations.
                    </p>
                  </div>

                  {/* Registered Subject Filter Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">Subject:</span>
                    <select
                      value={selectedCbtSubjectFilter}
                      onChange={(e) => setSelectedCbtSubjectFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#0a192f] bg-white outline-hidden focus:border-[#25166B]"
                    >
                      <option value="All">All Registered Subjects ({registeredSubjects.length})</option>
                      {registeredSubjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Candidate's Registered Subjects Banner */}
                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <BookCheck className="w-5 h-5 text-[#0284c7]" />
                    <div>
                      <span className="font-extrabold text-[#0a192f]">Your Registered Subject Combination:</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        {registeredSubjects.join(' • ')} ({currentStudent.program} Track)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {studentCbtQuestions.length} Questions in Pool
                  </span>
                </div>

                {/* CBT Exam Simulations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cbtExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 hover:border-[#d97706]/60 hover:bg-slate-50 transition-all space-y-3.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706] uppercase">
                          {exam.program}
                        </span>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                          {exam.durationMinutes} Minutes
                        </span>
                      </div>

                      <h3 className="font-extrabold text-[#0a192f] text-base">{exam.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{exam.instructions}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <span className="text-slate-500 font-medium">
                          Target Subjects: <strong>{selectedCbtSubjectFilter === 'All' ? 'Registered Combination' : selectedCbtSubjectFilter}</strong>
                        </span>
                        <button
                          onClick={() => handleStartExam(exam.id)}
                          className="px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold text-xs shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Start CBT Practice</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Interactive CBT Simulator Window */
              <div className="bg-white rounded-3xl border-2 border-[#d97706] shadow-xl overflow-hidden">
                {/* CBT Header */}
                <div className="bg-[#0a192f] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-black text-[#d97706] block">
                      Active CBT Mock Simulation
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg">
                      {cbtExams.find((e) => e.id === activeCbtExamId)?.title || 'National Mock Exam'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 px-4 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide">
                        TIME REMAINING: {formatTime(examTimeLeft)}
                      </span>
                    </div>

                    {!isExamCompleted && (
                      <button
                        onClick={handleFinishExam}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                      >
                        Submit Test
                      </button>
                    )}
                  </div>
                </div>

                {/* CBT Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {!isExamCompleted ? (
                    <div>
                      {/* Question Pallet */}
                      <div className="flex flex-wrap gap-1.5 mb-6 pb-4 border-b border-slate-200">
                        {studentCbtQuestions.map((_: PracticeQuestion, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              currentQuestionIndex === idx
                                ? 'bg-[#0a192f] text-[#d97706] ring-2 ring-[#d97706]'
                                : selectedAnswers[idx]
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      {/* Current Question */}
                      {studentCbtQuestions[currentQuestionIndex] && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-[#d97706]/15 text-[#d97706]">
                                {studentCbtQuestions[currentQuestionIndex].subject}
                              </span>
                              <span className="text-xs text-slate-400 font-bold">
                                Question {currentQuestionIndex + 1} of {studentCbtQuestions.length}
                              </span>
                            </div>
                            <p className="text-base sm:text-lg font-bold text-[#0a192f] leading-relaxed">
                              {studentCbtQuestions[currentQuestionIndex].questionText}
                            </p>
                          </div>

                          {/* Options */}
                          <div className="space-y-2.5">
                            {studentCbtQuestions[currentQuestionIndex].options.map((opt: { label: string; text: string }) => {
                              const isSelected = selectedAnswers[currentQuestionIndex] === opt.label;
                              return (
                                <button
                                  key={opt.label}
                                  onClick={() => handleSelectAnswer(currentQuestionIndex, opt.label)}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                                    isSelected
                                      ? 'border-[#d97706] bg-amber-50/50 text-[#0a192f] font-bold shadow-2xs'
                                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                  }`}
                                >
                                  <span
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                      isSelected
                                        ? 'bg-[#d97706] text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {opt.label}
                                  </span>
                                  <span className="text-sm font-medium">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Prev / Next controls */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <button
                              disabled={currentQuestionIndex === 0}
                              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-40 cursor-pointer"
                            >
                              ← Previous Question
                            </button>

                            {currentQuestionIndex < studentCbtQuestions.length - 1 ? (
                              <button
                                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                                className="px-5 py-2 rounded-xl bg-[#0a192f] text-white font-bold text-xs cursor-pointer hover:bg-[#112240]"
                              >
                                Next Question →
                              </button>
                            ) : (
                              <button
                                onClick={handleFinishExam}
                                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs cursor-pointer hover:bg-emerald-700 shadow-sm"
                              >
                                Complete & View Score
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Score Screen & Failed Questions Heuristic Explanations Review */
                    <div className="space-y-6">
                      <div className="text-center py-4 space-y-3 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                          <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-[#0a192f]">Practice Simulation Completed!</h3>
                        <p className="text-slate-600 text-xs">
                          Your test has been officially scored and your academic progression has been updated.
                        </p>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                          <span className="text-xs text-slate-500 uppercase font-bold">Estimated JAMB / WAEC Scaled Score</span>
                          <div className="text-4xl font-black text-[#d97706] font-mono">
                            {Math.round(((examScore?.percentage || 0) / 100) * 400)} / 400
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            Accuracy: {examScore?.correct} of {examScore?.total} correct ({examScore?.percentage}%) • Status:{' '}
                            <strong className={(examScore?.percentage || 0) >= 60 ? 'text-emerald-700' : 'text-red-600'}>
                              {(examScore?.percentage || 0) >= 60 ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                            </strong>
                          </p>
                        </div>

                        <div className="flex gap-2 justify-center pt-2">
                          <button
                            onClick={() => setActiveCbtExamId(null)}
                            className="px-5 py-2.5 rounded-xl bg-[#0a192f] text-white font-bold text-xs cursor-pointer hover:bg-[#112240]"
                          >
                            Return to CBT Hub
                          </button>
                          <button
                            onClick={() => handleStartExam(activeCbtExamId || 'cbt-jam-01')}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retake Test</span>
                          </button>
                        </div>
                      </div>

                      {/* Missed Questions & Explanations Review Section */}
                      <div className="border-t border-slate-200 pt-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <div>
                            <h4 className="font-black text-[#0a192f] text-sm">
                              Detailed Answers & Heuristic Solution Review
                            </h4>
                            <p className="text-slate-500 text-xs">
                              Review step-by-step explanations for questions to master the concepts.
                            </p>
                          </div>

                          <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setCbtReviewFilter('failed')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                cbtReviewFilter === 'failed'
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Failed Questions ({completedExamQuestions.filter((_, idx) => selectedAnswers[idx] !== completedExamQuestions[idx]?.correctOption).length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setCbtReviewFilter('all')}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                cbtReviewFilter === 'all'
                                  ? 'bg-[#0a192f] text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              All Questions ({completedExamQuestions.length})
                            </button>
                          </div>
                        </div>

                        {/* Questions List with Explanations */}
                        <div className="space-y-4">
                          {completedExamQuestions
                            .map((q, idx) => ({ q, idx, userAns: selectedAnswers[idx], isCorrect: selectedAnswers[idx] === q.correctOption }))
                            .filter((item) => (cbtReviewFilter === 'failed' ? !item.isCorrect : true))
                            .map(({ q, idx, userAns, isCorrect }) => (
                              <div
                                key={q.id || idx}
                                className={`p-5 rounded-2xl border-2 space-y-3 text-xs transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : 'bg-red-50/40 border-red-200'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#FFC600]">
                                      {q.subject}
                                    </span>
                                    <span className="font-bold text-[#0a192f]">Question {idx + 1}</span>
                                  </div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      isCorrect
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-red-100 text-red-800 border border-red-300'
                                    }`}
                                  >
                                    {isCorrect ? '✓ Correct Answer' : '✕ Missed / Failed'}
                                  </span>
                                </div>

                                <p className="font-bold text-slate-900 text-sm leading-relaxed">
                                  {q.questionText}
                                </p>

                                {/* Options breakdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {q.options.map((opt) => {
                                    const isUserChoice = userAns === opt.label;
                                    const isCorrectOpt = opt.label === q.correctOption;

                                    return (
                                      <div
                                        key={opt.label}
                                        className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                                          isCorrectOpt
                                            ? 'border-emerald-500 bg-emerald-100/70 text-emerald-900 font-bold'
                                            : isUserChoice && !isCorrectOpt
                                            ? 'border-red-400 bg-red-100/70 text-red-900 font-bold'
                                            : 'border-slate-200 bg-white text-slate-600'
                                        }`}
                                      >
                                        <span
                                          className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${
                                            isCorrectOpt
                                              ? 'bg-emerald-600 text-white'
                                              : isUserChoice && !isCorrectOpt
                                              ? 'bg-red-600 text-white'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}
                                        >
                                          {opt.label}
                                        </span>
                                        <span className="text-xs">{opt.text}</span>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Step-by-Step Heuristic Solution */}
                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Step-by-Step Solution & Heuristic Explanation:</span>
                                  </div>
                                  <p className="text-slate-700 text-xs leading-relaxed">
                                    {q.explanation}
                                  </p>
                                </div>
                              </div>
                            ))}

                          {cbtReviewFilter === 'failed' &&
                            completedExamQuestions.filter((_, idx) => selectedAnswers[idx] !== completedExamQuestions[idx]?.correctOption).length === 0 && (
                              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-xs space-y-1">
                                <p className="text-sm font-black">Outstanding Work! 100% Correct</p>
                                <p className="text-emerald-600">You did not fail any questions in this practice simulation.</p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: MY RESULTS */}
        {studentTab === 'results' && (
          <div className="space-y-6">
            {!isSubscriptionActive ? (
              <LockedFeatureNotice featureName="My CBT Examination Results" />
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">My Results & Test History</h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Detailed subject performance analytics and tutor diagnostic feedback.
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Result Slip</span>
                  </button>
                </div>

                {/* Test Results Cards */}
                <div className="space-y-6">
                  {currentStudent.recentMockTests.map((test) => (
                    <div key={test.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-[#0a192f] text-base">{test.title}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                              {test.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{test.date} • Standard Testing Format</span>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-[#0a192f] font-mono">
                            {test.totalScore} <span className="text-xs text-slate-400 font-normal">/ {test.maxScore}</span>
                          </span>
                          <span className="text-xs text-emerald-600 font-bold block">
                            {test.percentage}% (Percentile: {test.percentile}th)
                          </span>
                        </div>
                      </div>

                      {/* Subject Scores */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {test.subjects.map((sub, idx) => (
                          <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-[#0a192f]">{sub.subject}</span>
                              <span className="font-mono text-[#d97706]">
                                {sub.score} / {sub.maxScore}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] italic">"{sub.teacherFeedback}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6B: ACADEMIC PROGRESS (Requirement 34) */}
        {studentTab === 'progress' && (
          <div className="space-y-6">
            {!isSubscriptionActive ? (
              <LockedFeatureNotice featureName="Academic Progress Scorecard" />
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full inline-block mb-1.5">
                      Academic Performance Ledger
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">Continuous Academic Progress</h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Multi-assessment heuristic progress, subject mastery curves, and teacher evaluation comments.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Progress Report</span>
                  </button>
                </div>

            {/* High-Level Standing Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Cumulative Average</span>
                <div className="text-2xl sm:text-3xl font-black text-[#0284c7] font-mono">
                  {Math.round(
                    currentStudent.recentMockTests.reduce((acc, t) => acc + (t.percentage || 78), 0) /
                      (currentStudent.recentMockTests.length || 1)
                  )}%
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Excellence Benchmark</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Assessments Logged</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {currentStudent.recentMockTests.length + cbtAttempts.length}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Class Tests &amp; Mocks</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Target Score</span>
                <div className="text-2xl sm:text-3xl font-black text-[#ea580c] font-mono">
                  {currentStudent.targetScore || '320+'}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{currentStudent.program} Track</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Attendance Standing</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                  {currentStudent.attendanceRate || 96}%
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">Good Standing</span>
              </div>
            </div>

            {/* Assessment History Table */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Assessment History &amp; Diagnostics</h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Assessment Type</th>
                      <th className="p-3.5">Title / Subject</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5">Percentage</th>
                      <th className="p-3.5">Teacher / Proctor Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentStudent.recentMockTests.map((test) => (
                      <tr key={test.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-800">
                          <span className="px-2.5 py-1 rounded-md bg-sky-50 text-[#0284c7] font-extrabold border border-sky-200">
                            Mock Examination
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{test.title}</td>
                        <td className="p-3.5 font-mono text-slate-500">{test.date}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {test.totalScore} / {test.maxScore}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] bg-emerald-100 text-emerald-800">
                            {test.percentage}%
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 italic">
                          "Consistent accuracy in calculation heuristics. Recommended for speed pacing drills."
                        </td>
                      </tr>
                    ))}
                    {cbtAttempts.slice(0, 3).map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-800">
                          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-extrabold border border-amber-200">
                            CBT Practice
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{att.examTitle}</td>
                        <td className="p-3.5 font-mono text-slate-500">{att.submittedAt}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {att.score} / {att.maxScore}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full font-bold font-mono text-[11px] bg-emerald-100 text-emerald-800">
                            {att.percentage}%
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 italic">
                          Automatic CBT scoring. Status: {att.status}.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            )}
          </div>
        )}

        {/* TAB 7: PRACTICE SETS */}
        {studentTab === 'practice-sets' && (
          <div className="space-y-6">
            {!isSubscriptionActive ? (
              <LockedFeatureNotice featureName="Interactive Practice Question Bank" />
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Interactive Practice Question Bank</h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Topical past questions with instant answer checking and step-by-step heuristic solutions.
                    </p>
                  </div>

                  {/* Subject Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Subject:</span>
                    <select
                      value={practiceSubjectFilter}
                      onChange={(e) => setPracticeSubjectFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#0a192f] bg-white outline-hidden"
                    >
                      <option value="All">All Subjects</option>
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Use of English & Literature">Use of English</option>
                    </select>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {practiceQuestions
                    .filter((q) => practiceSubjectFilter === 'All' || q.subject.includes(practiceSubjectFilter))
                    .map((q, idx) => {
                      const isRevealed = revealedExplanations[q.id];
                      const chosenOpt = practiceUserAnswers[q.id];
                      return (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706]">
                                {q.subject}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px]">{q.examYear}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                              {q.difficulty}
                            </span>
                          </div>

                          <h4 className="font-bold text-[#0a192f] text-sm leading-relaxed">
                            {idx + 1}. {q.questionText}
                          </h4>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt) => {
                              const isSelected = chosenOpt === opt.label;
                              const isCorrect = isRevealed && opt.label === q.correctOption;
                              const isWrong = isRevealed && isSelected && opt.label !== q.correctOption;
                              return (
                                <button
                                  key={opt.label}
                                  onClick={() => {
                                    setPracticeUserAnswers((prev) => ({ ...prev, [q.id]: opt.label }));
                                  }}
                                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                    isCorrect
                                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                                      : isWrong
                                      ? 'border-red-400 bg-red-50 text-red-900'
                                      : isSelected
                                      ? 'border-[#d97706] bg-amber-50/50 text-[#0a192f] font-bold'
                                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                      isCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : isWrong
                                        ? 'bg-red-600 text-white'
                                        : isSelected
                                        ? 'bg-[#d97706] text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {opt.label}
                                  </span>
                                  <span className="text-xs">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Reveal Explanation Button */}
                          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                            <button
                              onClick={() => {
                                setRevealedExplanations((prev) => ({
                                  ...prev,
                                  [q.id]: !prev[q.id],
                                }));
                              }}
                              className="text-xs text-[#d97706] font-bold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>{isRevealed ? 'Hide Solution' : 'Check Correct Answer & Heuristic Solution'}</span>
                            </button>
                          </div>

                          {isRevealed && (
                            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-slate-800 space-y-1">
                              <span className="font-bold text-[#0a192f] block">
                                Correct Answer: Option {q.correctOption}
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-600">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: TIMETABLES */}
        {studentTab === 'timetables' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Weekly Master Timetable</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Scheduled lecture halls, practical labs, and virtual live sessions.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Schedule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706] uppercase">
                      {lesson.dayOfWeek}
                    </span>
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                      {lesson.time}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#0a192f] text-sm">{lesson.title}</h3>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{lesson.topicSummary}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Venue: <strong className="text-slate-800">{lesson.room}</strong></span>
                    <span>Tutor: <strong className="text-slate-800">{lesson.tutorName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: LECTURE NOTES & STUDY MATERIALS */}
        {studentTab === 'notes' && (
          <div className="space-y-6">
            {!isSubscriptionActive ? (
              <LockedFeatureNotice featureName="Digital Study Materials & Handouts" />
            ) : (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Digital Study Materials &amp; Handouts</h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Official lesson summaries, formula cheat sheets, and syllabus compilations uploaded from the Directorate.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">Filter:</span>
                    <select
                      value={materialSubjectFilter}
                      onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#0a192f] bg-slate-50 cursor-pointer focus:outline-hidden"
                    >
                      <option value="All">All Academy Materials ({studyMaterials.length})</option>
                      <option value="My Subjects">My Enrolled Subjects</option>
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Use of English & Literature">Use of English</option>
                      <option value="Economics">Economics</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50/50 rounded-2xl border border-sky-200 text-xs text-[#0a192f] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0284c7] shrink-0" />
                    <span>
                      Showing <strong>{filteredStudyMaterials.length}</strong> study resource{filteredStudyMaterials.length === 1 ? '' : 's'} ({materialSubjectFilter === 'All' ? 'All Academy Handouts' : materialSubjectFilter === 'My Subjects' ? 'Enrolled Subjects' : materialSubjectFilter})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap text-[10px]">
                    {registeredSubjects.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full font-bold bg-[#0a192f] text-[#FFC600]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {filteredStudyMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredStudyMaterials.map((mat: StudyMaterial) => (
                      <div
                        key={mat.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 space-y-3 text-xs transition-shadow hover:shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#FFC600]">
                            {mat.subject}
                          </span>
                          <span className="font-mono text-slate-400 font-bold">{mat.fileSize}</span>
                        </div>

                        <h3 className="font-extrabold text-[#0a192f] text-sm leading-snug">{mat.title}</h3>
                        <p className="text-slate-500 text-[11px]">
                          Author: {mat.author} • Program: {mat.program}
                        </p>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">{mat.downloadsCount || 0} downloads</span>
                          <button
                            onClick={() => {
                              showToast('success', 'Download Started', `Downloading "${mat.title}" (${mat.fileSize})`);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#0a192f] hover:bg-[#112240] text-[#FFC600] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Handout</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700 text-sm">No study materials in this filter yet</p>
                    <p className="text-slate-400 text-xs">Switch to &quot;All Academy Materials&quot; to view all handouts uploaded by the Directorate.</p>
                    <button
                      type="button"
                      onClick={() => setMaterialSubjectFilter('All')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0a192f] text-[#FFC600] font-bold text-xs cursor-pointer inline-flex items-center gap-1 mt-2"
                    >
                      View All Materials
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 10: ANNOUNCEMENTS */}
        {studentTab === 'announcements' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Official Directorate Bulletins</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Announcements, examination schedules, and center directives.
              </p>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706] uppercase">
                      {ann.category}
                    </span>
                    <span className="text-slate-400 font-medium">{ann.date}</span>
                  </div>
                  <h3 className="font-extrabold text-[#0a192f] text-base">{ann.title}</h3>
                  <p className="text-slate-700 leading-relaxed text-xs">{ann.content}</p>
                  <div className="pt-2 text-[11px] text-slate-400 font-semibold">
                    Issued by: {ann.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: FINANCE: TUITION & RECEIPTS */}
        {studentTab === 'finance' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">Tuition Status & Official Receipts</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Track fee installments, outstanding balance, and generate official payment receipts.
                </p>
              </div>

              {currentStudent.tuitionBalance > 0 && (
                <button
                  onClick={() => openPaymentModal(currentStudent.tuitionBalance, 'Tuition Balance Clearance')}
                  className="px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Make Online Payment (Paystack)</span>
                </button>
              )}
            </div>

            {/* Monthly Tuition Subscription Badge & Official Receipt */}
            <div className="bg-[#25166B]/5 border-2 border-[#25166B]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25166B] text-[#FFC600] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#FFC600]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#25166B] text-sm sm:text-base">
                      Monthly Tuition Pass: {currentStudent.studentShift} Student
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#028D3B] text-white">
                      Directorate Cleared
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Monthly Fee: <strong className="font-mono text-[#25166B]">₦{currentStudent.monthlyFee.toLocaleString()}/month</strong> • Current Cycle: <strong>{currentStudent.subscriptionMonth || currentStudent.paymentMonth || currentMonthPeriod}</strong> • Valid Until: <strong className="text-[#25166B]">{currentStudent.subscriptionExpiryDate || currentStudent.paymentExpiryDate || defaultEndOfMonth}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenOfficialReceipt()}
                className="px-4 py-2.5 rounded-xl bg-[#25166B] hover:bg-[#1c1152] text-[#FFC600] font-black text-xs cursor-pointer flex items-center gap-2 shadow-xs shrink-0 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#FFC600]" />
                <span>View Official Receipt (with QR Code)</span>
              </button>
            </div>

            {/* Tuition Breakdown Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Tuition Fee</span>
                <div className="text-2xl font-black text-[#0a192f] font-mono">
                  ₦{currentStudent.tuitionTotal.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400 block">{currentStudent.program} Full Session</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-xs text-emerald-700 font-bold uppercase">Amount Paid</span>
                <div className="text-2xl font-black text-emerald-800 font-mono">
                  ₦{currentStudent.tuitionPaid.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-600 block">Verified by Accounts Desk</span>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-xs text-amber-700 font-bold uppercase">Balance Outstanding</span>
                <div className="text-2xl font-black text-[#d97706] font-mono">
                  ₦{currentStudent.tuitionBalance.toLocaleString()}
                </div>
                <span className="text-[11px] text-amber-600 block">
                  {currentStudent.tuitionBalance === 0 ? 'Fully Paid' : 'Due Before Exams'}
                </span>
              </div>
            </div>

            {/* Payment Transactions & Receipts Table */}
            <div className="space-y-4 pt-4">
              <h3 className="font-extrabold text-[#0a192f] text-base">Payment History & Verified Receipts</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Receipt Reference</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Receipt Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {studentTransactions.length > 0 ? (
                      studentTransactions.map((tx) => {
                        const isApproved = tx.status === 'Successful';

                        return (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#0a192f]">
                              {tx.receiptNumber || tx.reference}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">{tx.approvedAt || tx.timestamp}</td>
                            <td className="py-3.5 px-4">{tx.paymentMethod}</td>
                            <td className="py-3.5 px-4 font-bold text-[#0a192f] font-mono">
                              ₦{tx.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isApproved
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {isApproved ? 'Approved by Admin' : 'Pending Admin Clearance'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {isApproved ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenOfficialReceipt(tx)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#25166B] hover:bg-[#1c1152] text-[#FFC600] text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-2xs"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#FFC600]" />
                                  <span>View Receipt (with QR)</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-amber-700 font-bold italic">
                                  Awaiting Clearance
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-10 text-center">
                          <div className="max-w-md mx-auto space-y-2">
                            <p className="font-bold text-slate-700 text-sm">No Recorded Payment History Yet</p>
                            <p className="text-slate-400 text-xs">
                              All initial dummy payments have been removed. Once you make your tuition payment and it is approved by the admin, your official verified receipt will appear here.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
