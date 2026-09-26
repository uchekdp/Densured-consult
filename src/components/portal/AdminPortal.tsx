import React, { useState } from 'react';
import { useApp, AdminPortalTab } from '../../context/AppContext';
import {
  StudentProfile,
  ProgramItem,
  SubjectItem,
  CourseModule,
  StudyMaterial,
  PracticeQuestion,
  CBTExam,
  DailyAttendanceSession,
  AttendanceEntry,
  StudentShift,
  OfficialReceipt,
  GalleryItem,
  WebsitePageTarget,
  UploadedQuestionBatch,
} from '../../types';
import { ReceiptAndIDCardVerificationModal } from '../common/ReceiptAndIDCardVerificationModal';
import { ADMIN_CREDENTIALS } from '../../data/portalData';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Users,
  Calendar,
  CreditCard,
  BookOpen,
  HelpCircle,
  Award,
  DollarSign,
  Megaphone,
  Image as ImageIcon,
  Settings,
  FileText,
  Clock,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Edit,
  TrendingUp,
  Download,
  Filter,
  LogOut,
  Mail,
  Key,
  Check,
  Send,
  Eye,
  EyeOff,
  Upload,
  FileUp,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    isAdminLoggedIn,
    adminUser,
    loginAdmin,
    logoutAdmin,
    studentsList,
    addStudent,
    deleteStudent,
    recordIndividualStudentAttendance,
    applications,
    updateApplicationStatus,
    programmes,
    subjects,
    updateSubjectCoverage,
    courses,
    studyMaterials,
    addStudyMaterial,
    deleteStudyMaterial,
    practiceQuestions,
    addPracticeQuestion,
    deletePracticeQuestion,
    questionBatches,
    uploadQuestionBatch,
    approveQuestionBatch,
    rejectQuestionBatch,
    galleryItems,
    addGalleryItem,
    deleteGalleryItem,
    cbtExams,
    addCBTExam,
    cbtAttempts,
    attendanceSessions,
    saveAttendanceSession,
    transactions,
    processPayment,
    approveTuitionPayment,
    rejectTuitionPayment,
    openReceiptModal,
    announcements,
    addAnnouncement,
    auditLogs,
    adminUsers,
    showToast,
  } = useApp();

  // Login form state (confidential credentials, cleared by default)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Student directory search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentProgFilter, setStudentProgFilter] = useState('All');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: 'UTME' as any,
    studyMode: 'Physical Weekday' as any,
    targetScore: '320+',
    targetExamDate: 'April 2026',
    tuitionTotal: 85000,
    tuitionPaid: 50000,
  });

  // Daily attendance session creator state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceProg, setAttendanceProg] = useState('UTME');
  const [attendanceCohort, setAttendanceCohort] = useState('Morning Weekday Batch A');
  const [attendanceEntries, setAttendanceEntries] = useState<Record<string, 'Present' | 'Late' | 'Absent' | 'Excused'>>({});

  // Add study material state & deletion
  const [showAddMatModal, setShowAddMatModal] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialSubjectFilter, setMaterialSubjectFilter] = useState('All');
  const [materialToDelete, setMaterialToDelete] = useState<StudyMaterial | null>(null);
  const [newMatForm, setNewMatForm] = useState({
    title: '',
    subject: 'Physics',
    program: 'UTME',
    fileType: 'PDF' as 'PDF' | 'DOCX' | 'PPTX' | 'ZIP',
    fileSize: '4.2 MB',
    author: 'Engr. Chidi Okafor',
  });

  // Add practice question state
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState({
    subject: 'Physics',
    program: 'UTME',
    examYear: '2026 Model Series',
    questionText: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctOption: 'A',
    explanation: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
  });

  // Add CBT Exam state
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamForm, setNewExamForm] = useState({
    title: '',
    program: 'UTME' as any,
    durationMinutes: 120,
    totalQuestions: 180,
    passMark: 250,
    scheduledDate: '2026-04-05',
    instructions: 'Timed CBT simulation. Complete all questions before time runs out.',
    status: 'Active' as const,
  });

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'Urgent' | 'Academic' | 'Exam Registration' | 'Holiday'>('Academic');
  const [annContent, setAnnContent] = useState('');

  // Receipt Modal State
  const [viewingReceipt, setViewingReceipt] = useState<any | null>(null);

  // Quick accept payment state
  const [showQuickPayModal, setShowQuickPayModal] = useState(false);
  const [quickPayStudentId, setQuickPayStudentId] = useState('');
  const [quickPayAmount, setQuickPayAmount] = useState('');
  const [quickPayMethod, setQuickPayMethod] = useState<'Paystack Card' | 'Bank Transfer' | 'Cash / POS'>('Bank Transfer');

  // Student Profile Dossier & Attendance Detail Modal
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<StudentProfile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);
  const [individualAttendanceDate, setIndividualAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [individualAttendanceStatus, setIndividualAttendanceStatus] = useState<'Present' | 'Late' | 'Absent' | 'Excused'>('Present');
  const [individualAttendanceRemark, setIndividualAttendanceRemark] = useState('');

  // ID Card & Official Receipt Modal for Admin
  const [idCardReceiptModal, setIdCardReceiptModal] = useState<{
    isOpen: boolean;
    receipt: OfficialReceipt | null;
    initialTab: 'receipt' | 'id-card';
    studentAvatar?: string;
  }>({
    isOpen: false,
    receipt: null,
    initialTab: 'id-card',
  });

  // Website Images & Gallery Management
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState<GalleryItem['category']>('CBT Lab');
  const [imageCaption, setImageCaption] = useState('');
  const [imageYear, setImageYear] = useState('2026');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageTargetPage, setImageTargetPage] = useState<WebsitePageTarget>('hero');
  const [imagePageFilter, setImagePageFilter] = useState<string>('All');
  const [imageToDelete, setImageToDelete] = useState<GalleryItem | null>(null);

  // Question Document Upload (MS Word / PDF)
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [docSubject, setDocSubject] = useState('Mathematics');
  const [docProgram, setDocProgram] = useState<'UTME' | 'WAEC' | 'NECO' | 'IELTS'>('UTME');
  const [docFileName, setDocFileName] = useState('');
  const [docFileType, setDocFileType] = useState<'DOCX' | 'PDF'>('DOCX');
  const [docParsedQuestionsCount, setDocParsedQuestionsCount] = useState(3);
  const [isParsingDoc, setIsParsingDoc] = useState(false);

  // Helper: Open cryptographic ID card / Receipt modal for any student
  const openStudentDocumentModal = (student: StudentProfile, tab: 'id-card' | 'receipt') => {
    const shift = student.studentShift || 'Morning';
    const amount = student.monthlyFee || (shift === 'Morning' ? 20000 : 15000);
    const now = new Date();
    const receiptNum = `DEC-REC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const validUntil = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;

    const receiptData: OfficialReceipt = student.lastApprovedReceipt || {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      transactionReference: `DEC-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentPhone: student.phone,
      registrationNumber: student.registrationNumber,
      program: student.program,
      studentShift: shift,
      amount,
      amountInWords: amount === 20000 ? 'TWENTY THOUSAND NAIRA ONLY' : 'FIFTEEN THOUSAND NAIRA ONLY',
      currency: 'NGN',
      monthPeriod: student.subscriptionMonth || 'September 2026',
      validUntil,
      issueDate: new Date().toLocaleDateString('en-GB'),
      approvedBy: 'Mr. Akinjo Rotimi (Founder)',
      approvedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      qrPayload: `https://densuredconsult.edu.ng/verify-receipt?receipt=${receiptNum}&student=${encodeURIComponent(student.fullName)}&reg=${student.registrationNumber}&shift=${shift}&amount=${amount}&status=APPROVED`,
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
    };

    setIdCardReceiptModal({
      isOpen: true,
      receipt: receiptData,
      initialTab: tab,
      studentAvatar: student.avatar,
    });
  };

  // Helper: Download individual student attendance CSV
  const downloadStudentAttendanceCSV = (student: StudentProfile, filterType: 'all' | 'monthly' | 'weekly') => {
    const history = student.attendanceHistory || [];
    const now = new Date();
    let filtered = history;

    if (filterType === 'monthly') {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filtered = history.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    } else if (filterType === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = history.filter((item) => {
        const d = new Date(item.date);
        return d >= oneWeekAgo && d <= now;
      });
    }

    if (filtered.length === 0) {
      showToast('info', 'No Records', `No attendance sessions recorded for the selected ${filterType} period.`);
      return;
    }

    const headers = ['Date', 'Student Name', 'Registration Number', 'Program', 'Shift', 'Status', 'Remark'];
    const rows = filtered.map((item) => [
      `"${item.date}"`,
      `"${student.fullName}"`,
      `"${student.registrationNumber}"`,
      `"${student.program}"`,
      `"${student.studentShift || 'Morning'}"`,
      `"${item.status}"`,
      `"${(item.remark || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${student.registrationNumber}_Attendance_${filterType.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'CSV Exported', `Downloaded ${filterType} attendance report for ${student.fullName}.`);
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginAdmin(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (!res.success) {
      setLoginError(res.message);
    }
  };

  // Handle Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = Math.max(0, newStudentForm.tuitionTotal - newStudentForm.tuitionPaid);
    const regNo = `DEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addStudent({
      registrationNumber: regNo,
      fullName: newStudentForm.fullName,
      email: newStudentForm.email,
      phone: newStudentForm.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      program: newStudentForm.program,
      studyMode: newStudentForm.studyMode,
      targetExamDate: newStudentForm.targetExamDate,
      daysRemaining: 45,
      targetScore: newStudentForm.targetScore,
      currentAverageScore: 280,
      attendanceRate: 100,
      syllabusCompletion: 50,
      tuitionTotal: newStudentForm.tuitionTotal,
      tuitionPaid: newStudentForm.tuitionPaid,
      tuitionBalance: balance,
      currency: 'NGN',
      studentShift: 'Morning',
      monthlyFee: 20000,
      subscriptionStatus: 'Active',
      subscriptionMonth: 'September 2026',
      subscriptionExpiryDate: '30 Sep 2026',
      nextClass: 'Use of English - Saturday 09:00 AM (Hall A)',
      assignedAdvisor: 'Mr. Akinjo Rotimi (Founder)',
      recentMockTests: [],
    });

    setShowAddStudentModal(false);
    setNewStudentForm({
      fullName: '',
      email: '',
      phone: '',
      program: 'UTME',
      studyMode: 'Physical Weekday',
      targetScore: '320+',
      targetExamDate: 'April 2026',
      tuitionTotal: 85000,
      tuitionPaid: 50000,
    });
  };

  // Handle Save Attendance
  const handleSaveAttendance = () => {
    const relevantStudents = studentsList.filter(
      (s) => attendanceProg === 'All' || s.program === attendanceProg
    );

    const entries: AttendanceEntry[] = relevantStudents.map((std) => ({
      studentId: std.id,
      studentName: std.fullName,
      registrationNumber: std.registrationNumber,
      status: attendanceEntries[std.id] || 'Present',
    }));

    const session: DailyAttendanceSession = {
      id: `att-sess-${Date.now()}`,
      date: attendanceDate,
      program: attendanceProg as any,
      cohort: attendanceCohort,
      takenBy: adminUser ? adminUser.name : 'Directorate Office',
      entries,
    };

    saveAttendanceSession(session);
  };

  // Handle Add Material
  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudyMaterial(newMatForm);
    setShowAddMatModal(false);
    setNewMatForm({
      title: '',
      subject: 'Physics',
      program: 'UTME',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      author: 'Engr. Chidi Okafor',
    });
  };

  // Handle Add Question
  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPracticeQuestion({
      subject: newQuestionForm.subject,
      program: newQuestionForm.program,
      examYear: newQuestionForm.examYear,
      questionText: newQuestionForm.questionText,
      options: [
        { label: 'A', text: newQuestionForm.optA },
        { label: 'B', text: newQuestionForm.optB },
        { label: 'C', text: newQuestionForm.optC },
        { label: 'D', text: newQuestionForm.optD },
      ],
      correctOption: newQuestionForm.correctOption,
      explanation: newQuestionForm.explanation,
      difficulty: newQuestionForm.difficulty,
    });
    setShowAddQuestionModal(false);
    setNewQuestionForm({
      subject: 'Physics',
      program: 'UTME',
      examYear: '2026 Model Series',
      questionText: '',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      correctOption: 'A',
      explanation: '',
      difficulty: 'Medium',
    });
  };

  // Handle Add Exam
  const handleAddExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCBTExam(newExamForm);
    setShowAddExamModal(false);
    setNewExamForm({
      title: '',
      program: 'UTME',
      durationMinutes: 120,
      totalQuestions: 180,
      passMark: 250,
      scheduledDate: '2026-04-05',
      instructions: 'Timed CBT simulation. Complete all questions before time runs out.',
      status: 'Active',
    });
  };

  // Handle Quick Pay
  const handleQuickPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(quickPayAmount);
    if (!amountNum || isNaN(amountNum)) {
      alert('Please enter a valid amount');
      return;
    }
    processPayment(amountNum, 'Direct Tuition Payment Receipt', quickPayMethod, quickPayStudentId);
    setShowQuickPayModal(false);
    setQuickPayAmount('');
    setQuickPayStudentId('');
  };

  // Navigation menu grouped according to instructions
  const navSections: {
    section: string;
    items: { id: AdminPortalTab; label: string; icon: React.ReactNode; badge?: string }[];
  }[] = [
    {
      section: 'STUDENT MANAGEMENT',
      items: [
        { id: 'students', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
        { id: 'attendance', label: 'Daily Attendance', icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      section: 'ACADEMIC',
      items: [
        { id: 'materials', label: 'Study Materials', icon: <Download className="w-4 h-4" /> },
        { id: 'practice-questions', label: 'Practice Questions', icon: <HelpCircle className="w-4 h-4" /> },
      ],
    },
    {
      section: 'CBT MANAGEMENT',
      items: [
        { id: 'cbt-management', label: 'CBT Management', icon: <Award className="w-4 h-4" />, badge: 'Core' },
        { id: 'cbt-results', label: 'CBT Results & Attempts', icon: <TrendingUp className="w-4 h-4" /> },
      ],
    },
    {
      section: 'FINANCE',
      items: [
        { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'pending-payments', label: 'Pending Payments', icon: <Clock className="w-4 h-4" /> },
        { id: 'payment-history', label: 'Payment History', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'receipts', label: 'Receipts', icon: <Printer className="w-4 h-4" /> },
        { id: 'finance-reports', label: 'Finance Reports', icon: <TrendingUp className="w-4 h-4" /> },
      ],
    },
    {
      section: 'COMMUNICATION',
      items: [
        { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
      ],
    },
    {
      section: 'ADMINISTRATION',
      items: [
        { id: 'website-images', label: 'Website Images', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'admin-users', label: 'Admin Users', icon: <Users className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
        { id: 'audit-logs', label: 'Audit Logs', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'general-reports', label: 'General Reports', icon: <FileText className="w-4 h-4" /> },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'My Profile', icon: <UserCheck className="w-4 h-4" /> },
      ],
    },
  ];

  // If not logged in, render the login gate
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] bg-[#FAFAFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-md">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-7 h-7 text-sky-600" />
            </div>
            <h2 className="text-2xl font-black text-sky-600 tracking-tight">Executive Admin Portal</h2>
            <p className="text-xs text-sky-800 font-semibold">
              D Ensured Consult Directorate • Confidential System Access
            </p>
          </div>

          {/* Confidential Notice (no passwords or usernames displayed) */}
          <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-200 text-xs text-[#1D1918] space-y-1">
            <div className="flex items-center gap-2 font-bold text-sky-700">
              <Lock className="w-4 h-4 text-sky-600" />
              <span>Directorate Clearance Required</span>
            </div>
            <p className="text-[11px] text-[#1D1918]/80 leading-relaxed">
              This terminal is confidential and strictly restricted to accredited directorate executives, registrars, and CBT coordinators.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-[#D5241B]/30 text-[#D5241B] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D5241B]" />
              <span className="font-medium">{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#25166B] mb-1">Directorate Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@densuredconsult.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-medium text-[#1D1918] focus:border-[#098CD0] focus:ring-2 focus:ring-[#098CD0]/20 outline-hidden bg-[#FAFAFA]"
                />
                <Mail className="w-4 h-4 text-[#098CD0] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#25166B] mb-1">Directorate Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 font-medium text-[#1D1918] focus:border-[#098CD0] focus:ring-2 focus:ring-[#098CD0]/20 outline-hidden bg-[#FAFAFA]"
                />
                <Key className="w-4 h-4 text-[#098CD0] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-[#25166B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-bold text-sm shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Directorate Hub</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Enrolled Filtering
  const filteredStudents = studentsList.filter((std) => {
    const matchesFilter = studentProgFilter === 'All' || std.program === studentProgFilter;
    const matchesSearch =
      std.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      std.registrationNumber.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'Successful' ? t.amount : 0), 0);
  const pendingFeesTotal = studentsList.reduce((acc, s) => acc + s.tuitionBalance, 0);

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-80px)] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Executive Header Banner */}
        <div className="bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#0a192f] text-white p-6 sm:p-7 rounded-3xl border-2 border-[#d97706]/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d97706]/15 text-[#d97706] border border-[#d97706]/40 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#d97706]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Executive Directorate Portal</h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#d97706] text-[#0a192f] uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Logged in as: <strong className="text-white">{adminUser ? adminUser.name : 'Directorate Executive'}</strong> • Session 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Categorized Navigation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-5 sticky top-24 max-h-[80vh] overflow-y-auto">
              {navSections.map((sec, idx) => (
                <div key={idx} className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-2">
                    {sec.section}
                  </span>
                  <div className="space-y-0.5">
                    {sec.items.map((item) => {
                      const isActive = adminTab === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#/admin-portal?tab=${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setAdminTab(item.id);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#0a192f] text-[#d97706] shadow-2xs'
                              : 'text-slate-600 hover:text-[#0a192f] hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </span>
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                isActive ? 'bg-[#d97706] text-[#0a192f]' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* FEATURE 1: STUDENT DIRECTORY */}
            {adminTab === 'students' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">Student Directory</h2>
                    <p className="text-slate-500 text-xs">
                      Enrolled candidate dossiers, academic tracking, and attendance standings.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enroll New Student</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by student name or reg number..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:border-[#d97706]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={studentProgFilter}
                    onChange={(e) => setStudentProgFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#0a192f] bg-white outline-hidden"
                  >
                    <option value="All">All Programmes ({studentsList.length})</option>
                    <option value="UTME">UTME</option>
                    <option value="WAEC">WAEC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="ATSWA">ATSWA</option>
                    <option value="SAT">SAT</option>
                  </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-3">Reg No</th>
                        <th className="py-3 px-3">Candidate</th>
                        <th className="py-3 px-3">Programme</th>
                        <th className="py-3 px-3">Avg Score</th>
                        <th className="py-3 px-3">Attendance</th>
                        <th className="py-3 px-3">Shift & Tuition</th>
                        <th className="py-3 px-3 text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredStudents.map((std) => (
                        <tr
                          key={std.id}
                          className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedStudentDetails(std)}
                        >
                          <td className="py-3.5 px-3 font-mono font-bold text-[#0a192f]">
                            <span className="underline decoration-dotted text-[#25166B] font-bold group-hover:text-[#D5241B]">
                              {std.registrationNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={std.avatar}
                                alt={std.fullName}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <span className="font-bold text-[#0a192f] group-hover:text-[#D5241B] block">
                                  {std.fullName}
                                </span>
                                <span className="text-[10px] text-slate-400">{std.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-bold">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-[#25166B] font-bold text-[11px]">
                              {std.program}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-[#d97706]">{std.currentAverageScore}</td>
                          <td className="py-3.5 px-3 font-bold text-emerald-600">{std.attendanceRate}%</td>
                          <td className="py-3.5 px-3">
                            <span className="text-[11px] font-bold text-slate-700 block">
                              {std.studentShift || 'Morning'} (₦{(std.monthlyFee || (std.studentShift === 'Evening' ? 15000 : 20000)).toLocaleString()}/mo)
                            </span>
                            {std.tuitionBalance > 0 ? (
                              <span className="font-mono text-amber-700 font-bold text-[11px]">
                                Bal: ₦{std.tuitionBalance.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-bold text-[10px]">Active Cleared</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                title="View Full Candidate Dossier"
                                onClick={() => setSelectedStudentDetails(std)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-[#25166B] hover:bg-[#25166B]/10 text-[#25166B] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Print / Download Student ID Card"
                                onClick={() => openStudentDocumentModal(std, 'id-card')}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-[#009E49] hover:bg-[#009E49]/10 text-[#009E49] transition-colors cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Delete Candidate Profile from Database"
                                onClick={() => setStudentToDelete(std)}
                                className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                  <span>💡 <strong>Tip:</strong> Click on any student row or name to view their complete biodata, registered subjects, take individual daily attendance, download weekly/monthly/overall attendance in CSV, or print official documents.</span>
                  <span className="font-bold text-slate-700">Total Enrolled: {studentsList.length} Candidates</span>
                </div>
              </div>
            )}

            {/* FEATURE 2: DAILY ATTENDANCE */}
            {adminTab === 'attendance' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">Daily Attendance Logging</h2>
                    <p className="text-slate-500 text-xs">
                      Take roll call for physical lecture halls and CBT practical sessions.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Attendance Session</span>
                  </button>
                </div>

                {/* Session Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Session Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Programme</label>
                    <select
                      value={attendanceProg}
                      onChange={(e) => setAttendanceProg(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                    >
                      <option value="UTME">UTME Intensive</option>
                      <option value="WAEC">WAEC / WASSCE</option>
                      <option value="IELTS">IELTS Prep</option>
                      <option value="All">All Cohorts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lecture Cohort</label>
                    <input
                      type="text"
                      value={attendanceCohort}
                      onChange={(e) => setAttendanceCohort(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                    />
                  </div>
                </div>

                {/* Candidate Attendance Roll */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-[#0a192f] text-sm">Roll Call List</h3>
                  <div className="space-y-2">
                    {studentsList
                      .filter((s) => attendanceProg === 'All' || s.program === attendanceProg)
                      .map((std) => {
                        const currentStatus = attendanceEntries[std.id] || 'Present';
                        return (
                          <div
                            key={std.id}
                            className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <span className="font-bold text-[#0a192f] text-sm">{std.fullName}</span>
                              <span className="text-slate-400 font-mono block text-[11px]">
                                {std.registrationNumber} • {std.program}
                              </span>
                            </div>

                            <div className="flex gap-1.5">
                              {(['Present', 'Late', 'Absent', 'Excused'] as const).map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    setAttendanceEntries((prev) => ({ ...prev, [std.id]: status }));
                                  }}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                    currentStatus === status
                                      ? status === 'Present'
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : status === 'Late'
                                        ? 'bg-amber-600 text-white shadow-2xs'
                                        : status === 'Absent'
                                        ? 'bg-red-600 text-white shadow-2xs'
                                        : 'bg-blue-600 text-white shadow-2xs'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE: STUDY MATERIALS REPOSITORY & MANAGEMENT */}
            {adminTab === 'materials' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">Study Materials Repository</h2>
                    <p className="text-slate-500 text-xs">
                      Upload, organize, and delete downloadable lesson summaries, past question booklets, and syllabus notes.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddMatModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#25166B] hover:bg-[#1a0f4c] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4 text-[#FFC600]" />
                    <span>Upload New Material</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={materialSearch}
                      onChange={(e) => setMaterialSearch(e.target.value)}
                      placeholder="Search study materials by title, author, or keyword..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-[#25166B] bg-slate-50/50"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-500 shrink-0">Subject:</span>
                    <select
                      value={materialSubjectFilter}
                      onChange={(e) => setMaterialSubjectFilter(e.target.value)}
                      className="w-full sm:w-48 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0a192f] bg-slate-50/50 cursor-pointer focus:outline-hidden"
                    >
                      <option value="All">All Subjects</option>
                      <option value="Physics">Physics</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Use of English & Literature">Use of English</option>
                      <option value="Economics">Economics</option>
                      <option value="Government">Government</option>
                      <option value="Literature in English">Literature</option>
                      <option value="Accounting">Accounting</option>
                    </select>
                  </div>
                </div>

                {/* Materials Grid */}
                {(() => {
                  const filtered = studyMaterials.filter((mat) => {
                    const matchesSearch =
                      !materialSearch ||
                      mat.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
                      mat.subject.toLowerCase().includes(materialSearch.toLowerCase()) ||
                      mat.author.toLowerCase().includes(materialSearch.toLowerCase());
                    const matchesSubject =
                      materialSubjectFilter === 'All' || mat.subject.toLowerCase().includes(materialSubjectFilter.toLowerCase());
                    return matchesSearch && matchesSubject;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-sm text-[#0a192f]">No study materials found</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          {materialSearch || materialSubjectFilter !== 'All'
                            ? 'Try changing your search query or subject filter.'
                            : 'No study materials in the repository yet. Click below to add the first one.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddMatModal(true)}
                          className="px-4 py-2 rounded-xl bg-[#25166B] text-[#FFC600] font-black text-xs cursor-pointer shadow-xs hover:bg-[#1a0f4c]"
                        >
                          + Upload Study Material
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-[#25166B]/30 hover:shadow-xs transition-all space-y-3 text-xs flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#25166B] text-[#FFC600] uppercase tracking-wider">
                                {mat.fileType} • {mat.fileSize}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px]">{mat.dateAdded}</span>
                            </div>
                            <h3 className="font-extrabold text-[#0a192f] text-sm leading-snug">{mat.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-[11px]">
                              <span>Subject: <strong className="text-slate-700">{mat.subject}</strong></span>
                              <span>•</span>
                              <span>Author: <strong className="text-slate-700">{mat.author}</strong></span>
                              {mat.program && (
                                <>
                                  <span>•</span>
                                  <span>Target: <strong className="text-[#D5241B]">{mat.program}</strong></span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                            <span className="font-medium text-slate-400">
                              {mat.downloadsCount} candidate downloads
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => showToast('info', 'Download Link Copied', `Copied link for ${mat.title}`)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold hover:text-[#25166B] transition-colors cursor-pointer"
                              >
                                Copy Link
                              </button>
                              <button
                                type="button"
                                title="Delete study material from database"
                                onClick={() => setMaterialToDelete(mat)}
                                className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#D5241B] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* FEATURE 7: PRACTICE QUESTIONS & BATCH UPLOAD */}
            {adminTab === 'practice-questions' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">Practice Question Bank & Uploads</h2>
                    <p className="text-slate-500 text-xs">
                      Curated questions, heuristic solutions, and MS Word/PDF document question batch management.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadDocModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#25166B] hover:bg-[#1a0f4c] text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <FileUp className="w-4 h-4 text-[#FFC600]" />
                      <span>Upload MS Word / PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddQuestionModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-black text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Single Question</span>
                    </button>
                  </div>
                </div>

                {/* Uploaded Question Batches Approval Pipeline */}
                {questionBatches.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileUp className="w-5 h-5 text-[#D5241B]" />
                        <h3 className="font-extrabold text-[#25166B] text-sm">
                          MS Word / PDF Batches Requiring Directorate Approval ({questionBatches.filter((b) => b.status === 'Pending Review').length} Pending)
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Approval automatically syncs questions to candidate practice portals.
                      </span>
                    </div>

                    <div className="space-y-3">
                      {questionBatches.map((batch) => (
                        <div
                          key={batch.id}
                          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  batch.fileType === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {batch.fileType}
                              </span>
                              <span className="font-bold text-[#0a192f] text-sm">{batch.fileName}</span>
                              <span className="text-slate-400">•</span>
                              <span className="font-bold text-[#25166B]">{batch.subject}</span>
                              <span className="text-slate-400">•</span>
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold">{batch.program}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  batch.status === 'Approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : batch.status === 'Rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {batch.status}
                              </span>
                              <span className="text-[11px] text-slate-400">{batch.uploadDate}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-600">
                            <strong>Extracted Questions:</strong> {(batch.parsedQuestions || batch.questions || []).length} items parsed from document.
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="text-[11px] text-slate-500 italic">
                              {batch.status === 'Approved'
                                ? '✓ Published to Student Portal'
                                : batch.status === 'Rejected'
                                ? '✕ Batch rejected'
                                : 'Awaiting directorate approval before publishing to student portal'}
                            </div>

                            {batch.status === 'Pending Review' && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => approveQuestionBatch(batch.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#009E49] hover:bg-[#00823c] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 transition-all"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve & Publish to Student Portal</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rejectQuestionBatch(batch.id)}
                                  className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Published Question List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-[#0a192f] text-sm">
                      Active Questions Repository ({practiceQuestions.length} Questions)
                    </h3>
                  </div>

                  {practiceQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#d97706]">{q.subject} ({q.program})</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-bold">
                            {q.difficulty}
                          </span>
                          <button
                            type="button"
                            onClick={() => deletePracticeQuestion(q.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="font-bold text-[#0a192f] text-sm">
                        {idx + 1}. {q.questionText}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => (
                          <div
                            key={opt.label}
                            className={`p-2 rounded-lg border text-xs ${
                              opt.label === q.correctOption
                                ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <strong>{opt.label}.</strong> {opt.text}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
                        <strong>Solution:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 8: CBT MANAGEMENT */}
            {adminTab === 'cbt-management' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">CBT Mock Examination Manager</h2>
                    <p className="text-slate-500 text-xs">
                      Configure exam durations, question quotas, cut-off marks, and test activation dates.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddExamModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#d97706] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New CBT Mock</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cbtExams.map((exam) => (
                    <div key={exam.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706] uppercase">
                          {exam.program}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {exam.status}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-[#0a192f] text-base">{exam.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{exam.instructions}</p>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center font-bold">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-normal">Duration</span>
                          <span>{exam.durationMinutes} mins</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-normal">Questions</span>
                          <span>{exam.totalQuestions} items</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-normal">Pass Mark</span>
                          <span className="text-emerald-700">{exam.passMark}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 9: CBT RESULTS & ATTEMPTS */}
            {adminTab === 'cbt-results' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">CBT Results & Candidate Attempts</h2>
                    <p className="text-slate-500 text-xs">
                      Real-time test scores, accuracy percentages, and pass/fail standings.
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Result Ledger</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-3">Candidate</th>
                        <th className="py-3 px-3">Exam Title</th>
                        <th className="py-3 px-3">Submitted At</th>
                        <th className="py-3 px-3">Score</th>
                        <th className="py-3 px-3">Percentage</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {cbtAttempts.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-[#0a192f] block">{att.studentName}</span>
                            <span className="text-[10px] font-mono text-slate-400">{att.registrationNumber}</span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-800">{att.examTitle}</td>
                          <td className="py-3.5 px-3 text-slate-500">{att.submittedAt}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-[#0a192f]">
                            {att.score} / {att.maxScore}
                          </td>
                          <td className="py-3.5 px-3 font-mono font-bold text-[#d97706]">{att.percentage}%</td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                att.status === 'Passed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FEATURE 10: FINANCE - PAYMENTS */}
            {adminTab === 'payments' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">Finance & Payment Overview</h2>
                    <p className="text-slate-500 text-xs">
                      Tuition collection revenue, payment channel reconciliation, and cashiering.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQuickPayModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#d97706] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Log Tuition Payment</span>
                  </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-xs text-slate-500 font-bold uppercase">Total Revenue Collected</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#0a192f] font-mono">
                      ₦{totalRevenue.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold">100% Verified in Bank</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                    <span className="text-xs text-amber-700 font-bold uppercase">Total Outstanding Balances</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#d97706] font-mono">
                      ₦{pendingFeesTotal.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-amber-600 font-medium">Pending Candidate Settlement</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <span className="text-xs text-emerald-700 font-bold uppercase">Settled Receipts</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
                      {transactions.length} Records
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium">Auto-reconciled with Paystack</span>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 11: FINANCE - PENDING PAYMENTS */}
            {adminTab === 'pending-payments' && (
              <div className="space-y-6">
                {/* Section A: Monthly Tuition Payments Pending Admin Approval */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#D5241B]/30 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-[#D5241B]/10 text-[#D5241B]">
                          <ShieldCheck className="w-5 h-5 text-[#D5241B]" />
                        </span>
                        <h2 className="text-xl font-black text-[#25166B]">
                          Monthly Tuition Clearance & Approvals
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#D5241B] text-white">
                          {transactions.filter((t) => t.status === 'Pending').length} Pending
                        </span>
                      </div>
                      <p className="text-[#1D1918]/70 text-xs mt-1">
                        Every payment must be approved by the admin on this dashboard before full features in the candidate portal are unlocked.
                      </p>
                    </div>
                  </div>

                  {transactions.filter((t) => t.status === 'Pending').length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-[#1D1918] flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>
                          <strong>Directorate Policy:</strong> Approving a monthly tuition payment immediately generates an official receipt with the authentic <strong>De ensured Consult logo</strong> and a <strong>verifiable QR code</strong>, while unlocking all portal features for the candidate until the end of the month.
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                            <tr>
                              <th className="py-3 px-3">Candidate</th>
                              <th className="py-3 px-3">Shift & Fee</th>
                              <th className="py-3 px-3">Month Period</th>
                              <th className="py-3 px-3">Reference / Channel</th>
                              <th className="py-3 px-3">Submitted At</th>
                              <th className="py-3 px-3 text-right">Clearance Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {transactions
                              .filter((t) => t.status === 'Pending')
                              .map((tx) => {
                                const std = studentsList.find((s) => s.id === tx.studentId);
                                const shift = tx.studentShift || std?.studentShift || 'Morning';
                                return (
                                  <tr key={tx.id} className="hover:bg-amber-50/40 transition-colors">
                                    <td className="py-3.5 px-3">
                                      <span className="font-bold text-[#25166B] block text-sm">{tx.studentName}</span>
                                      <span className="text-[11px] text-slate-500 font-mono">
                                        Reg: {std?.registrationNumber || 'Pending'} • {tx.program}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                                          shift === 'Morning'
                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                            : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                        }`}
                                      >
                                        <Clock className="w-3 h-3" />
                                        {shift} Student
                                      </span>
                                      <span className="font-mono font-black text-[#25166B] block mt-0.5 text-xs">
                                        ₦{tx.amount.toLocaleString()} / mo
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <span className="font-bold text-[#1D1918]">{tx.monthPeriod || 'September 2026'}</span>
                                      <span className="text-[10px] text-slate-500 block">
                                        Expires: {tx.validUntil || 'End of Month'}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-3">
                                      <span className="font-mono font-bold text-[#098CD0] block">{tx.reference}</span>
                                      <span className="text-[11px] text-slate-500">{tx.paymentMethod}</span>
                                    </td>
                                    <td className="py-3.5 px-3 text-slate-500">{tx.timestamp}</td>
                                    <td className="py-3.5 px-3 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const rec = approveTuitionPayment(tx.id);
                                            if (rec) {
                                              openReceiptModal(rec);
                                            }
                                          }}
                                          className="px-3.5 py-1.5 rounded-xl bg-[#028D3B] hover:bg-[#027531] text-white text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>Approve & Issue Receipt</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => rejectTuitionPayment(tx.id, 'Declined by Bursary')}
                                          className="px-2.5 py-1.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer transition-colors"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#028D3B]/10 text-[#028D3B] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6 text-[#028D3B]" />
                      </div>
                      <h4 className="font-bold text-[#25166B] text-sm">All Monthly Tuition Payments Cleared</h4>
                      <p className="text-slate-500 max-w-sm mx-auto">
                        No pending monthly tuition approvals at this time. All submitted candidate payments have been approved and official receipts generated.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section B: Session Defaulters & Balance Due */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-xl font-black text-[#25166B]">Total Session Defaulters & Balance Invoices</h2>
                    <p className="text-slate-500 text-xs">
                      Students with remaining session balance for overall curriculum fees.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                        <tr>
                          <th className="py-3 px-3">Candidate</th>
                          <th className="py-3 px-3">Programme</th>
                          <th className="py-3 px-3">Total Fee</th>
                          <th className="py-3 px-3">Amount Paid</th>
                          <th className="py-3 px-3">Balance Due</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {studentsList
                          .filter((s) => s.tuitionBalance > 0)
                          .map((std) => (
                            <tr key={std.id} className="hover:bg-slate-50">
                              <td className="py-3.5 px-3">
                                <span className="font-bold text-[#25166B] block">{std.fullName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{std.phone}</span>
                              </td>
                              <td className="py-3.5 px-3">{std.program}</td>
                              <td className="py-3.5 px-3 font-mono">₦{std.tuitionTotal.toLocaleString()}</td>
                              <td className="py-3.5 px-3 font-mono text-[#028D3B]">₦{std.tuitionPaid.toLocaleString()}</td>
                              <td className="py-3.5 px-3 font-mono font-bold text-[#D5241B]">
                                ₦{std.tuitionBalance.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    showToast(
                                      'info',
                                      'SMS Reminder Dispatched',
                                      `Reminder SMS sent to ${std.fullName} (${std.phone}) for ₦${std.tuitionBalance.toLocaleString()}`
                                    );
                                  }}
                                  className="px-3 py-1 rounded-lg bg-[#25166B] text-[#FFC600] text-xs font-bold hover:bg-[#1c1152] cursor-pointer"
                                >
                                  Send Reminder
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 12: FINANCE - PAYMENT HISTORY */}
            {adminTab === 'payment-history' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Master Financial Payment Ledger</h2>
                  <p className="text-slate-500 text-xs">
                    Historical transactions across bank deposits, online cards, and POS terminals.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-3">Ref ID</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Candidate</th>
                        <th className="py-3 px-3">Method</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#0a192f]">{tx.reference}</td>
                          <td className="py-3.5 px-3 text-slate-500">{tx.timestamp}</td>
                          <td className="py-3.5 px-3 font-semibold">{tx.studentName}</td>
                          <td className="py-3.5 px-3">{tx.paymentMethod}</td>
                          <td className="py-3.5 px-3 font-mono font-bold text-[#0a192f]">
                            ₦{tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FEATURE 13: FINANCE - RECEIPTS */}
            {adminTab === 'receipts' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Official Tuition Receipts Desk</h2>
                  <p className="text-slate-500 text-xs">
                    Printable receipts with official watermark and directorate validation seal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-[#d97706]">{tx.reference}</span>
                        <span className="text-slate-400">{tx.timestamp}</span>
                      </div>
                      <h3 className="font-bold text-[#0a192f] text-sm">{tx.studentName}</h3>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Method: {tx.paymentMethod}</span>
                        <span className="text-base font-black font-mono text-[#0a192f]">
                          ₦{tx.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const std = studentsList.find((s) => s.id === tx.studentId || s.fullName === tx.studentName);
                            const shift = tx.studentShift || std?.studentShift || 'Morning';
                            const amount = tx.amount || (shift === 'Morning' ? 20000 : 15000);
                            const receiptNum = tx.receiptNumber || `DEC-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                            const month = tx.monthPeriod || std?.subscriptionMonth || 'September 2026';
                            const validUntil = tx.validUntil || std?.subscriptionExpiryDate || '30 Sep 2026';

                            const receipt: OfficialReceipt = {
                              id: `rec-${tx.id}`,
                              receiptNumber: receiptNum,
                              transactionReference: tx.reference,
                              studentId: tx.studentId || std?.id || 'std-1',
                              studentName: tx.studentName,
                              studentEmail: std?.email || 'candidate@densuredconsult.ng',
                              studentPhone: std?.phone || '08147896930',
                              registrationNumber: std?.registrationNumber || 'DEC-2026-REG',
                              program: tx.program || std?.program || 'UTME',
                              studentShift: shift,
                              amount,
                              amountInWords: shift === 'Morning' ? 'TWENTY THOUSAND NAIRA ONLY' : 'FIFTEEN THOUSAND NAIRA ONLY',
                              currency: 'NGN',
                              monthPeriod: month,
                              validUntil,
                              issueDate: tx.timestamp,
                              approvedBy: tx.approvedBy || 'Dr. Anthony Adeleke (Director of Academic Affairs)',
                              approvedAt: tx.approvedAt || tx.timestamp,
                              qrPayload: tx.qrPayload || `https://densuredconsult.ng/verify-receipt?receipt=${receiptNum}&ref=${tx.reference}&student=${encodeURIComponent(tx.studentName)}&shift=${shift}&amount=${amount}&status=APPROVED`,
                              status: 'Approved',
                              paymentMethod: tx.paymentMethod,
                            };
                            openReceiptModal(receipt);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#25166B] hover:bg-[#1c1152] text-[#FFC600] font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#FFC600]" />
                          <span>View Official Receipt (with QR Code)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 14: FINANCE - FINANCE REPORTS */}
            {adminTab === 'finance-reports' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Financial Revenue Reports & Analytics</h2>
                  <p className="text-slate-500 text-xs">
                    Breakdown of revenue streams by program, projected cashflows, and payment channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="font-extrabold text-[#0a192f] text-sm">Revenue by Programme</h3>
                    <div className="space-y-2 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span>UTME / JAMB Intensive:</span>
                        <span className="font-mono font-bold text-[#0a192f]">₦3,450,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WAEC / SSCE Science & Arts:</span>
                        <span className="font-mono font-bold text-[#0a192f]">₦1,850,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IELTS International Training:</span>
                        <span className="font-mono font-bold text-[#0a192f]">₦2,100,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ATSWA Accounting Diet:</span>
                        <span className="font-mono font-bold text-[#0a192f]">₦920,000</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="font-extrabold text-[#0a192f] text-sm">Collection Methods Distribution</h3>
                    <div className="space-y-2 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span>Paystack Online (Card/Transfer):</span>
                        <span className="font-mono font-bold text-emerald-700">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Direct Bank Wire / USSD:</span>
                        <span className="font-mono font-bold text-blue-700">22%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Center POS Terminal:</span>
                        <span className="font-mono font-bold text-amber-700">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 15: ANNOUNCEMENTS */}
            {adminTab === 'announcements' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Broadcast Announcements</h2>
                  <p className="text-slate-500 text-xs">
                    Dispatch official directives directly onto student and candidate portals.
                  </p>
                </div>

                {/* Creator Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!annTitle || !annContent) return;
                    addAnnouncement(annTitle, annCategory, annContent);
                    setAnnTitle('');
                    setAnnContent('');
                  }}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs"
                >
                  <h3 className="font-extrabold text-[#0a192f] text-sm">Create New Bulletin</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Headline</label>
                      <input
                        type="text"
                        required
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="e.g. Schedule for Grand Mock 4 CBT"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={annCategory}
                        onChange={(e) => setAnnCategory(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Exam Registration">Exam Registration</option>
                        <option value="Holiday">Holiday</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Notice Details</label>
                    <textarea
                      rows={3}
                      required
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Enter the full directive instructions..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0a192f] text-[#d97706] font-black text-xs hover:bg-[#112240] cursor-pointer"
                  >
                    Broadcast Announcement Live
                  </button>
                </form>

                {/* List of broadcasts */}
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706]">
                          {ann.category}
                        </span>
                        <span className="text-slate-400">{ann.date}</span>
                      </div>
                      <h4 className="font-bold text-[#0a192f] text-sm">{ann.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 16: WEBSITE IMAGES & MULTI-PAGE MEDIA DESK */}
            {adminTab === 'website-images' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[#0a192f]">Website Images &amp; Page Media Desk</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#25166B] text-white">
                        {galleryItems.length} Total
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFC600] text-[#25166B]">
                        {galleryItems.filter((i) => i.page === 'hero').length} in Hero Slider
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Upload high-resolution media across all website pages and the left-to-right Hero section carousel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageTitle('');
                      setImageCaption('');
                      setImageUrlInput('');
                      setImagePreview('');
                      setImageYear('2026/2027');
                      setImageCategory('CBT Lab');
                      setImageTargetPage('hero');
                      setShowUploadImageModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Image</span>
                  </button>
                </div>

                {/* Page Filter Navigation Pills */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Filter by Website Destination / Page:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'All', label: 'All Website Images', count: galleryItems.length },
                      { id: 'hero', label: '★ Hero Section (Left-to-Right)', count: galleryItems.filter((i) => i.page === 'hero').length },
                      { id: 'home', label: 'Home Page', count: galleryItems.filter((i) => i.page === 'home' || i.page === 'all').length },
                      { id: 'about', label: 'About Page', count: galleryItems.filter((i) => i.page === 'about' || i.page === 'all').length },
                      { id: 'services', label: 'Services Page', count: galleryItems.filter((i) => i.page === 'services' || i.page === 'all').length },
                      { id: 'gallery', label: 'Gallery Page', count: galleryItems.filter((i) => i.page === 'gallery' || i.page === 'all').length },
                      { id: 'admission', label: 'Admission Page', count: galleryItems.filter((i) => i.page === 'admission' || i.page === 'all').length },
                      { id: 'contact', label: 'Contact Page', count: galleryItems.filter((i) => i.page === 'contact' || i.page === 'all').length },
                    ].map((tab) => {
                      const isSelected = imagePageFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setImagePageFilter(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#25166B] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                              isSelected ? 'bg-[#FFC600] text-[#25166B]' : 'bg-white text-slate-600'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryItems
                    .filter((img) => {
                      if (imagePageFilter === 'All') return true;
                      if (imagePageFilter === 'hero') return img.page === 'hero';
                      return img.page === imagePageFilter || img.page === 'all';
                    })
                    .map((img) => (
                      <div
                        key={img.id}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="relative group">
                          <img
                            src={img.imageUrl}
                            alt={img.title}
                            className="w-full h-44 object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black bg-[#0a192f]/85 text-white backdrop-blur-xs">
                            {img.category}
                          </span>
                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {img.year || '2026/2027'}
                          </span>
                          {/* Target Page Badge */}
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-xs ${
                                img.page === 'hero'
                                  ? 'bg-[#FFC600] text-[#25166B] ring-1 ring-amber-400'
                                  : img.page === 'all'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#25166B] text-white'
                              }`}
                            >
                              {img.page === 'hero'
                                ? '★ Hero (Left-to-Right)'
                                : img.page === 'all'
                                ? 'Sitewide (All Pages)'
                                : `${img.page?.toUpperCase() || 'PAGE'} PAGE`}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <h4 className="font-bold text-[#0a192f] text-sm leading-snug">{img.title}</h4>
                            <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">{img.caption}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">ID: {img.id}</span>
                            <button
                              type="button"
                              onClick={() => setImageToDelete(img)}
                              className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 font-bold text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Image</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* FEATURE 17: ADMIN USERS */}
            {adminTab === 'admin-users' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Administrative Personnel & Access Control</h2>
                  <p className="text-slate-500 text-xs">
                    Staff credentials, roles, and administrative login privilege settings.
                  </p>
                </div>

                <div className="space-y-3">
                  {adminUsers.map((usr) => (
                    <div key={usr.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0a192f] text-sm block">{usr.name}</span>
                        <span className="text-slate-500 font-mono">{usr.email}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#0a192f] text-[#d97706] uppercase block mb-0.5">
                          {usr.role}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">{usr.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FEATURE 18: SETTINGS */}
            {adminTab === 'settings' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Center Settings & Configuration</h2>
                  <p className="text-slate-500 text-xs">
                    Official center address, contact numbers, and academic diet parameters.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#0a192f] mb-1">Official Center Address</label>
                    <input
                      type="text"
                      readOnly
                      value="DOYIN PLAZA, IGBOELERIN BUSSTOP, BESIDE PRIME-MART, OKOMAIKO, LAGOS"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0a192f] mb-1">Directorate Phone & WhatsApp</label>
                      <input
                        type="text"
                        readOnly
                        value="08147896930"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-slate-50 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0a192f] mb-1">Academic Session</label>
                      <input
                        type="text"
                        readOnly
                        value="2026 Admissions & Preparation"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 text-xs block">Public Admissions Portal: ACTIVE</span>
                    <p className="text-emerald-700 text-[11px]">
                      Prospective candidates can submit direct online application dossiers 24/7.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 19: AUDIT LOGS */}
            {adminTab === 'audit-logs' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Security Audit & Activity Logs</h2>
                  <p className="text-slate-500 text-xs">
                    Immutable security log of directorate administrative operations.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-3">Timestamp</th>
                        <th className="py-3 px-3">User</th>
                        <th className="py-3 px-3">Action</th>
                        <th className="py-3 px-3">Details</th>
                        <th className="py-3 px-3">Gateway IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                          <td className="py-3.5 px-3 font-bold text-[#0a192f]">{log.adminName}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">{log.details}</td>
                          <td className="py-3.5 px-3 font-mono text-slate-400 text-[10px]">{log.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FEATURE 20: GENERAL REPORTS */}
            {adminTab === 'general-reports' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-[#0a192f]">Executive Institutional Summary</h2>
                    <p className="text-slate-500 text-xs">
                      High-level statistical audit of admissions, exam performance, and attendance rates.
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Executive Summary</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs text-slate-500 font-bold uppercase">Average CBT Mock Score</span>
                    <div className="text-3xl font-black text-[#0a192f] font-mono">292 / 400</div>
                    <span className="text-[11px] text-emerald-600 font-bold">98.4% Pass Rate</span>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs text-slate-500 font-bold uppercase">Institutional Attendance</span>
                    <div className="text-3xl font-black text-[#0a192f] font-mono">96.8%</div>
                    <span className="text-[11px] text-slate-500">Consistent Daily Presence</span>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs text-slate-500 font-bold uppercase">Pending Review Files</span>
                    <div className="text-3xl font-black text-[#d97706] font-mono">
                      {applications.filter((a) => a.status === 'Pending Review').length}
                    </div>
                    <span className="text-[11px] text-amber-600 font-bold">Registrar Desk</span>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 21: ACCOUNT - MY PROFILE */}
            {adminTab === 'profile' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-[#0a192f]">Executive Admin Profile</h2>
                  <p className="text-slate-500 text-xs">
                    Account credentials and security authorization parameters.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs max-w-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a192f] text-[#d97706] border border-[#d97706] flex items-center justify-center font-black text-xl">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#0a192f] text-base">
                        {adminUser ? adminUser.name : 'Directorate Office'}
                      </h3>
                      <span className="text-slate-500 font-mono">
                        {adminUser ? adminUser.email : 'Densuredconsult@gmail.com'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Security Clearance:</span>
                      <strong className="text-emerald-700">Level 5 Super Admin</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Authorized Account:</span>
                      <strong className="font-mono">Directorate Office (Confidential)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Campus Jurisdiction:</span>
                      <strong>Okomaiko Campus & Online Network</strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={logoutAdmin}
                      className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all cursor-pointer"
                    >
                      Sign Out of Executive Portal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Enroll New Student */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-black text-[#0a192f] text-lg">Enroll New Candidate</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Candidate Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.fullName}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                  placeholder="e.g. Babatunde Fashola"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    placeholder="candidate@student.dec.ng"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    placeholder="08012345678"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Programme</label>
                  <select
                    value={newStudentForm.program}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, program: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="UTME">UTME</option>
                    <option value="WAEC">WAEC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="ATSWA">ATSWA</option>
                    <option value="SAT">SAT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Study Mode</label>
                  <select
                    value={newStudentForm.studyMode}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, studyMode: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="Physical Weekday">Physical Weekday</option>
                    <option value="Weekend Intensive">Weekend Intensive</option>
                    <option value="Online Virtual Live">Online Virtual Live</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Tuition (₦)</label>
                  <input
                    type="number"
                    value={newStudentForm.tuitionTotal}
                    onChange={(e) =>
                      setNewStudentForm({ ...newStudentForm, tuitionTotal: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Deposit Paid (₦)</label>
                  <input
                    type="number"
                    value={newStudentForm.tuitionPaid}
                    onChange={(e) =>
                      setNewStudentForm({ ...newStudentForm, tuitionPaid: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d97706] text-white font-black cursor-pointer shadow-sm hover:bg-[#b45309]"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Study Material */}
      {showAddMatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#25166B] text-white flex items-center justify-center">
                  <Download className="w-4 h-4 text-[#FFC600]" />
                </div>
                <h3 className="font-black text-[#0a192f] text-lg">Upload Study Material</h3>
              </div>
              <button
                onClick={() => setShowAddMatModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-3.5 text-xs">
              {/* Optional local file upload */}
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-1.5 text-center">
                <FileUp className="w-6 h-6 text-[#25166B] mx-auto" />
                <label className="block font-bold text-slate-700 cursor-pointer">
                  <span className="text-[#25166B] underline">Choose File</span> or select document
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                        const ext = file.name.split('.').pop()?.toUpperCase();
                        let detectedType: 'PDF' | 'DOCX' | 'PPTX' | 'ZIP' = 'PDF';
                        if (ext === 'DOC' || ext === 'DOCX') detectedType = 'DOCX';
                        else if (ext === 'PPT' || ext === 'PPTX') detectedType = 'PPTX';
                        else if (ext === 'ZIP') detectedType = 'ZIP';

                        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
                        setNewMatForm((prev) => ({
                          ...prev,
                          title: prev.title || nameWithoutExt,
                          fileType: detectedType,
                          fileSize: `${sizeInMB} MB`,
                        }));
                        showToast('info', 'File Loaded', `Selected "${file.name}" (${sizeInMB} MB)`);
                      }
                    }}
                  />
                </label>
                <p className="text-[10px] text-slate-400">PDF, DOCX, PPTX, or ZIP documents (max 50MB)</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newMatForm.title}
                  onChange={(e) => setNewMatForm({ ...newMatForm, title: e.target.value })}
                  placeholder="e.g. Physics Formula Sheet & UTME Past Solutions"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:border-[#25166B] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={newMatForm.subject}
                    onChange={(e) => setNewMatForm({ ...newMatForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Use of English & Literature">Use of English</option>
                    <option value="Economics">Economics</option>
                    <option value="Government">Government</option>
                    <option value="Literature in English">Literature in English</option>
                    <option value="Accounting">Accounting</option>
                    <option value="General Studies">General Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Exam *</label>
                  <select
                    value={newMatForm.program}
                    onChange={(e) => setNewMatForm({ ...newMatForm, program: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="UTME">UTME (JAMB)</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                    <option value="IELTS">IELTS</option>
                    <option value="ATSWA">ATSWA</option>
                    <option value="SAT">SAT</option>
                    <option value="General">All Candidates</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Format</label>
                  <select
                    value={newMatForm.fileType}
                    onChange={(e) =>
                      setNewMatForm({
                        ...newMatForm,
                        fileType: e.target.value as 'PDF' | 'DOCX' | 'PPTX' | 'ZIP',
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="PPTX">PowerPoint (.pptx)</option>
                    <option value="ZIP">ZIP Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    required
                    value={newMatForm.fileSize}
                    onChange={(e) => setNewMatForm({ ...newMatForm, fileSize: e.target.value })}
                    placeholder="3.5 MB"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author / Tutor</label>
                  <input
                    type="text"
                    required
                    value={newMatForm.author}
                    onChange={(e) => setNewMatForm({ ...newMatForm, author: e.target.value })}
                    placeholder="Engr. Chidi Okafor"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMatModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#25166B] hover:bg-[#1a0f4c] text-white font-black cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#FFC600]" />
                  <span>Publish Material to Repository</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirm Delete Study Material */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[#0a192f] text-base">Delete Study Material?</h3>
                <p className="text-slate-500 text-xs">This action removes this resource from the database.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-[#0a192f] block text-sm">{materialToDelete.title}</span>
              <div className="text-slate-500 flex gap-2">
                <span>Subject: <strong>{materialToDelete.subject}</strong></span>
                <span>•</span>
                <span>Format: <strong>{materialToDelete.fileType}</strong> ({materialToDelete.fileSize})</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this study material? Candidates will no longer be able to view or download it from their student portals.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudyMaterial(materialToDelete.id);
                  setMaterialToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-bold cursor-pointer shadow-sm transition-all text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Material</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Practice Question */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-black text-[#0a192f] text-lg">Add Practice Question</h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newQuestionForm.subject}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Use of English & Literature">Use of English</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Year / Tag</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.examYear}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, examYear: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text *</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionForm.questionText}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, questionText: e.target.value })}
                  placeholder="Enter the question problem statement..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Option A</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.optA}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optA: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Option B</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.optB}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optB: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Option C</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.optC}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optC: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Option D</label>
                  <input
                    type="text"
                    required
                    value={newQuestionForm.optD}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optD: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correct Answer</label>
                  <select
                    value={newQuestionForm.correctOption}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, correctOption: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestionForm.difficulty}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, difficulty: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation / Solution Steps</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionForm.explanation}
                  onChange={(e) => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                  placeholder="Show the step-by-step heuristic deduction..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d97706] text-white font-black cursor-pointer shadow-sm"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add CBT Exam */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-black text-[#0a192f] text-lg">Create CBT Examination</h3>
              <button
                onClick={() => setShowAddExamModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={newExamForm.title}
                  onChange={(e) => setNewExamForm({ ...newExamForm, title: e.target.value })}
                  placeholder="e.g. National Mock Simulation Diet 5"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Programme</label>
                  <select
                    value={newExamForm.program}
                    onChange={(e) => setNewExamForm({ ...newExamForm, program: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="UTME">UTME</option>
                    <option value="WAEC">WAEC</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newExamForm.durationMinutes}
                    onChange={(e) => setNewExamForm({ ...newExamForm, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Questions</label>
                  <input
                    type="number"
                    value={newExamForm.totalQuestions}
                    onChange={(e) => setNewExamForm({ ...newExamForm, totalQuestions: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cut-Off / Pass Mark</label>
                  <input
                    type="number"
                    value={newExamForm.passMark}
                    onChange={(e) => setNewExamForm({ ...newExamForm, passMark: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d97706] text-white font-black cursor-pointer shadow-sm"
                >
                  Activate CBT Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Pay */}
      {showQuickPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-black text-[#0a192f] text-lg">Log Tuition Payment</h3>
              <button
                onClick={() => setShowQuickPayModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickPaySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Candidate</label>
                <select
                  required
                  value={quickPayStudentId}
                  onChange={(e) => setQuickPayStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                >
                  <option value="">-- Select Candidate --</option>
                  {studentsList.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.fullName} ({std.registrationNumber}) - Bal: ₦{std.tuitionBalance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount Paid (₦) *</label>
                <input
                  type="number"
                  required
                  value={quickPayAmount}
                  onChange={(e) => setQuickPayAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={quickPayMethod}
                  onChange={(e) => setQuickPayMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Paystack Card">Paystack Card</option>
                  <option value="Cash / POS">Cash / POS</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickPayModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer shadow-sm hover:bg-emerald-700"
                >
                  Verify & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View & Print Official Receipt */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#d97706] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-[#d97706]" />
                <div>
                  <span className="font-black text-sm text-[#0a192f] block">D ENSURED CONSULT</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#d97706] font-bold block">
                    Bursary Department Receipt
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Ref:</span>
                <strong className="font-mono text-[#0a192f]">{viewingReceipt.reference}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Issued:</span>
                <strong>{viewingReceipt.timestamp}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <strong className="text-slate-800">{viewingReceipt.studentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <strong>{viewingReceipt.paymentMethod}</strong>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center my-3">
                <span className="text-slate-600 font-bold uppercase text-[11px]">Total Paid:</span>
                <span className="text-xl font-black text-[#0a192f] font-mono">
                  ₦{viewingReceipt.amount.toLocaleString()}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 text-center italic">
                DOYIN PLAZA, IGBOELERIN BUSSTOP, BESIDE PRIME-MART, OKOMAIKO, LAGOS.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#0a192f] text-[#d97706] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Full Student Profile Dossier & Attendance Inspector */}
      {selectedStudentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#25166B] to-[#1a0f4c] text-white flex items-center justify-between border-b border-[#FFC600]/30 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentDetails.avatar}
                  alt={selectedStudentDetails.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FFC600] shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg sm:text-xl text-white">{selectedStudentDetails.fullName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#FFC600] text-[#25166B]">
                      {selectedStudentDetails.program}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    Reg No: <strong className="text-white">{selectedStudentDetails.registrationNumber}</strong> • Shift: {selectedStudentDetails.studentShift || 'Morning'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentDetails(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-xs">
              {/* Quick Action Banner */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedStudentDetails.subscriptionStatus === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    Tuition Status: {selectedStudentDetails.subscriptionStatus || 'Active'}
                  </span>
                  <span className="text-slate-500 text-xs">
                    Monthly Fee: ₦{(selectedStudentDetails.monthlyFee || (selectedStudentDetails.studentShift === 'Evening' ? 15000 : 20000)).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openStudentDocumentModal(selectedStudentDetails, 'id-card')}
                    className="px-3 py-1.5 rounded-xl bg-[#25166B] hover:bg-[#1a0f4c] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#FFC600]" />
                    <span>Print ID Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openStudentDocumentModal(selectedStudentDetails, 'receipt')}
                    className="px-3 py-1.5 rounded-xl bg-[#009E49] hover:bg-[#00823c] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentToDelete(selectedStudentDetails);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Profile</span>
                  </button>
                </div>
              </div>

              {/* Complete Biodata Section */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#25166B] text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <UserCheck className="w-4 h-4 text-[#D5241B]" />
                  <span>Comprehensive Candidate Biodata & Registration Particulars</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200 font-medium">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">National ID (NIN)</span>
                    <span className="font-mono font-bold text-slate-800">{selectedStudentDetails.nin || 'NIN-89342019482'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Date of Birth / Gender</span>
                    <span className="text-slate-800">
                      {selectedStudentDetails.dateOfBirth || '14 May 2007'} ({selectedStudentDetails.gender || 'Female'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Academic Session</span>
                    <span className="font-bold text-[#D5241B]">Official 2026/2027 academic session</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Email Address</span>
                    <span className="text-slate-800">{selectedStudentDetails.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Phone Number</span>
                    <span className="font-mono text-slate-800">{selectedStudentDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Study Mode</span>
                    <span className="text-slate-800">{selectedStudentDetails.studyMode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">State of Origin / LGA</span>
                    <span className="text-slate-800">
                      {selectedStudentDetails.stateOfOrigin || 'Lagos State'} • {selectedStudentDetails.lga || 'Ojo LGA'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Residential Address</span>
                    <span className="text-slate-800">{selectedStudentDetails.residentialAddress || 'Igbo-Elerin, Ojo, Lagos'}</span>
                  </div>
                </div>
              </div>

              {/* Registered Examination Subjects */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#25166B] text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <BookOpen className="w-4 h-4 text-[#FFC600]" />
                  <span>Selected Registered Examination Subjects</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedStudentDetails.selectedSubjects || selectedStudentDetails.subjectCombinations || [
                    'Use of English',
                    'Mathematics',
                    'Physics',
                    'Chemistry',
                  ]).map((subj) => (
                    <span
                      key={subj}
                      className="px-3 py-1.5 rounded-xl bg-[#25166B]/10 border border-[#25166B]/20 text-[#25166B] font-bold text-xs"
                    >
                      ✓ {subj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parent / Guardian Particulars */}
              {selectedStudentDetails.parentName && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-[#25166B] text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Users className="w-4 h-4 text-[#009E49]" />
                    <span>Parent / Guardian Emergency Contact Details</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Guardian Name</span>
                      <span className="font-bold text-slate-800">{selectedStudentDetails.parentName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Relationship</span>
                      <span className="text-slate-800">{selectedStudentDetails.parentRelationship || 'Parent'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Guardian Phone</span>
                      <span className="font-mono font-bold text-slate-800">{selectedStudentDetails.parentPhone}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Attendance Management & CSV Exports */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-[#25166B] text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D5241B]" />
                      <span>Individual Attendance Logging & CSV Reports</span>
                    </h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Log daily roll-call for this candidate. Attendance automatically persists and calculates rate.
                    </p>
                  </div>

                  {/* CSV Export Dropdown / Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => downloadStudentAttendanceCSV(selectedStudentDetails, 'weekly')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Export Weekly Attendance in CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-[#25166B]" />
                      <span>Weekly CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadStudentAttendanceCSV(selectedStudentDetails, 'monthly')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Export Monthly Attendance in CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-[#009E49]" />
                      <span>Monthly CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadStudentAttendanceCSV(selectedStudentDetails, 'all')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#25166B] text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs hover:bg-[#1a0f4c] transition-colors"
                      title="Export Complete Overall Attendance in CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FFC600]" />
                      <span>Overall CSV</span>
                    </button>
                  </div>
                </div>

                {/* Individual Daily Attendance Logger Form */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                  <span className="font-bold text-[#25166B] text-xs block">
                    Take Daily Attendance for {selectedStudentDetails.fullName}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Date</label>
                      <input
                        type="date"
                        value={individualAttendanceDate}
                        onChange={(e) => setIndividualAttendanceDate(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Status</label>
                      <select
                        value={individualAttendanceStatus}
                        onChange={(e) => setIndividualAttendanceStatus(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white font-bold outline-hidden"
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                        <option value="Excused">Excused</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Remark / Note</label>
                      <input
                        type="text"
                        placeholder="e.g. Regular on-time arrival"
                        value={individualAttendanceRemark}
                        onChange={(e) => setIndividualAttendanceRemark(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium outline-hidden"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          recordIndividualStudentAttendance(
                            selectedStudentDetails.id,
                            individualAttendanceDate,
                            individualAttendanceStatus,
                            individualAttendanceRemark || `Logged on ${individualAttendanceDate}`
                          );
                          // Update local copy
                          const updatedStudent = studentsList.find((s) => s.id === selectedStudentDetails.id);
                          if (updatedStudent) {
                            setSelectedStudentDetails({ ...updatedStudent });
                          }
                          setIndividualAttendanceRemark('');
                        }}
                        className="w-full py-2 rounded-xl bg-[#009E49] hover:bg-[#00823c] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Attendance</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Attendance History Table for this student */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Attendance Records ({selectedStudentDetails.attendanceHistory?.length || 0} Sessions)</span>
                    <span className="font-mono font-bold text-emerald-700">
                      Current Standing: {selectedStudentDetails.attendanceRate}% Attendance Rate
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {(selectedStudentDetails.attendanceHistory || []).map((att, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-600">{att.date}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  att.status === 'Present'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : att.status === 'Late'
                                    ? 'bg-amber-100 text-amber-800'
                                    : att.status === 'Excused'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {att.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-500">{att.remark || 'Class Session'}</td>
                          </tr>
                        ))}
                        {(!selectedStudentDetails.attendanceHistory || selectedStudentDetails.attendanceHistory.length === 0) && (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-slate-400">
                              No attendance recorded yet. Use the logger above to record the first session.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">Student ID: {selectedStudentDetails.id}</span>
              <button
                type="button"
                onClick={() => setSelectedStudentDetails(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Student Profile Confirmation */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#0a192f] text-base">Delete Student Profile</h3>
                <p className="text-red-600 text-xs font-bold">Irreversible Administrative Action</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Are you sure you want to delete <strong>{studentToDelete.fullName}</strong> (Reg No: {studentToDelete.registrationNumber})?
              This will automatically and permanently remove their entire dossier, attendance records, test attempts, and tuition receipts from the institutional database.
            </p>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-[11px] text-red-800">
              ⚠️ Warning: This candidate will no longer be able to sign in or access any features in the student portal.
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStudent(studentToDelete.id);
                  if (selectedStudentDetails?.id === studentToDelete.id) {
                    setSelectedStudentDetails(null);
                  }
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#D5241B] hover:bg-[#b81d15] text-white font-bold cursor-pointer shadow-sm transition-all"
              >
                Yes, Delete Profile Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upload New Website/Gallery Image */}
      {showUploadImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#25166B] text-white flex items-center justify-center">
                  <Upload className="w-4 h-4 text-[#FFC600]" />
                </div>
                <h3 className="font-black text-[#0a192f] text-base">Upload Image to Campus Gallery</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadImageModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* File Picker or URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Choose Image File from Computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const res = reader.result as string;
                        setImagePreview(res);
                        setImageUrlInput(res);
                      };
                      reader.readAsDataURL(file);
                      if (!imageTitle) {
                        setImageTitle(file.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full p-2 rounded-xl border border-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#25166B] file:text-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Or Paste Direct Image Web Link</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              {/* Preview */}
              {imagePreview && (
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Live Image Preview</span>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-lg"
                    onError={() => showToast('error', 'Image Error', 'Could not load image preview.')}
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 CBT Center Simulation Hall"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Website Page *</label>
                  <select
                    value={imageTargetPage}
                    onChange={(e) => setImageTargetPage(e.target.value as WebsitePageTarget)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white text-[#25166B] outline-hidden"
                  >
                    <option value="hero">Hero Section (Left-to-Right Carousel)</option>
                    <option value="all">All Pages (Sitewide)</option>
                    <option value="home">Home Page</option>
                    <option value="about">About Page</option>
                    <option value="services">Services Page</option>
                    <option value="gallery">Gallery Page</option>
                    <option value="admission">Admission Page</option>
                    <option value="contact">Contact Page</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={imageCategory}
                    onChange={(e) => setImageCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="CBT Lab">CBT Lab</option>
                    <option value="Classrooms">Classrooms</option>
                    <option value="Practicals">Practicals</option>
                    <option value="Awards & Achievers">Awards & Achievers</option>
                    <option value="Campus Life">Campus Life</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={imageYear}
                  onChange={(e) => setImageYear(e.target.value)}
                  placeholder="2026/2027"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description / Caption</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the facility or achiever featured..."
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadImageModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!imageTitle || !imageUrlInput) {
                      alert('Please provide an image and title');
                      return;
                    }
                    addGalleryItem({
                      title: imageTitle,
                      category: imageCategory,
                      caption: imageCaption || imageTitle,
                      imageUrl: imageUrlInput,
                      year: imageYear || '2026/2027',
                      page: imageTargetPage,
                    });
                    setShowUploadImageModal(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#25166B] hover:bg-[#1a0f4c] text-white font-bold cursor-pointer shadow-sm"
                >
                  Upload & Publish to Website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete Gallery Image Confirmation */}
      {imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#0a192f] text-base">Delete Gallery Image</h3>
                <p className="text-slate-400 text-xs">Remove photo from website & portals</p>
              </div>
            </div>

            <img
              src={imageToDelete.imageUrl}
              alt={imageToDelete.title}
              className="w-full h-32 object-cover rounded-xl border border-slate-200"
            />

            <p className="text-slate-600 text-xs">
              Are you sure you want to permanently delete <strong>&quot;{imageToDelete.title}&quot;</strong>? This photo will be removed immediately from the public Achievers Gallery and website.
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteGalleryItem(imageToDelete.id);
                  setImageToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
              >
                Yes, Delete Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upload Questions Document (MS Word / PDF) */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#25166B] text-white flex items-center justify-center">
                  <FileUp className="w-4 h-4 text-[#FFC600]" />
                </div>
                <div>
                  <h3 className="font-black text-[#0a192f] text-base">Upload Questions Document</h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">MS Word (.docx) or PDF</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadDocModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                📄 <strong>Automated Extraction:</strong> When you upload an MS Word or PDF question sheet, it automatically reflects on this admin portal under <em>Pending Review</em>. After you approve it, the questions instantly publish to candidate portals.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select MS Word (.docx, .doc) or PDF File *</label>
                <input
                  type="file"
                  accept=".docx,.doc,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocFileName(file.name);
                      setDocFileType(file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX');
                    }
                  }}
                  className="w-full p-2 rounded-xl border border-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#25166B] file:text-white cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={docSubject}
                    onChange={(e) => setDocSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Use of English & Literature">Use of English</option>
                    <option value="Economics">Economics</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Programme</label>
                  <select
                    value={docProgram}
                    onChange={(e) => setDocProgram(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                  >
                    <option value="UTME">UTME / JAMB</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!docFileName || isParsingDoc}
                  onClick={() => {
                    setIsParsingDoc(true);
                    setTimeout(() => {
                      uploadQuestionBatch(
                        docFileName || `${docSubject}_Questions_2026.${docFileType.toLowerCase()}`,
                        docFileType,
                        docSubject,
                        docProgram
                      );
                      setIsParsingDoc(false);
                      setShowUploadDocModal(false);
                    }, 500);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#009E49] hover:bg-[#00823c] text-white font-bold cursor-pointer shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isParsingDoc ? (
                    <span>Parsing Document...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Upload for Admin Approval</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Receipt & ID Card Verification Modal */}
      <ReceiptAndIDCardVerificationModal
        isOpen={idCardReceiptModal.isOpen}
        receipt={idCardReceiptModal.receipt}
        initialTab={idCardReceiptModal.initialTab}
        studentAvatar={idCardReceiptModal.studentAvatar}
        onClose={() => setIdCardReceiptModal({ ...idCardReceiptModal, isOpen: false })}
      />
    </div>
  );
};
