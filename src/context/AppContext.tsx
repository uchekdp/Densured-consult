import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  PageId,
  StudentProfile,
  ScheduledLesson,
  TransactionRecord,
  AdmissionApplication,
  Announcement,
  ExamProgram,
  StudyMode,
  StudentShift,
  OfficialReceipt,
  ProgramItem,
  SubjectItem,
  CourseModule,
  StudyMaterial,
  PracticeQuestion,
  CBTExam,
  CBTAttempt,
  DailyAttendanceSession,
  AuditLogItem,
  AdminUser,
  GalleryItem,
  UploadedQuestionBatch,
  MonthlyPaymentSubmission,
} from '../types';
import { OfficialReceiptModal } from '../components/common/OfficialReceiptModal';
import {
  INITIAL_STUDENTS,
  INITIAL_LESSONS,
  INITIAL_TRANSACTIONS,
  INITIAL_APPLICATIONS,
  ANNOUNCEMENTS,
  GALLERY_ITEMS,
} from '../data/mockData';
import {
  ADMIN_CREDENTIALS,
  PROGRAMMES_DATA,
  SUBJECTS_DATA,
  COURSES_DATA,
  STUDY_MATERIALS_DATA,
  PRACTICE_QUESTIONS_DATA,
  CBT_EXAMS_DATA,
  CBT_ATTEMPTS_DATA,
  ATTENDANCE_SESSIONS_DATA,
  AUDIT_LOGS_DATA,
  ADMIN_USERS_DATA,
} from '../data/portalData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export type StudentPortalTab =
  | 'dashboard'
  | 'id-card'
  | 'profile'
  | 'attendance'
  | 'cbt-mocks'
  | 'results'
  | 'practice-sets'
  | 'timetables'
  | 'notes'
  | 'announcements'
  | 'finance';

export type AdminPortalTab =
  | 'students'
  | 'attendance'
  | 'programmes'
  | 'subjects'
  | 'courses'
  | 'materials'
  | 'practice-questions'
  | 'cbt-management'
  | 'cbt-results'
  | 'payments'
  | 'pending-payments'
  | 'payment-history'
  | 'receipts'
  | 'finance-reports'
  | 'announcements'
  | 'website-images'
  | 'admin-users'
  | 'settings'
  | 'audit-logs'
  | 'general-reports'
  | 'profile';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  navigateTo: (page: PageId, tab?: string) => void;
  studentTab: StudentPortalTab;
  setStudentTab: (tab: StudentPortalTab) => void;
  adminTab: AdminPortalTab;
  setAdminTab: (tab: AdminPortalTab) => void;
  userRole: 'guest' | 'student' | 'admin';
  setUserRole: (role: 'guest' | 'student' | 'admin') => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;

  // Student Auth
  isStudentLoggedIn: boolean;
  loginStudent: (identifier: string, pass: string) => Promise<{ success: boolean; message: string; student?: StudentProfile }>;
  logoutStudent: () => void;

  // Students
  currentStudent: StudentProfile;
  setCurrentStudent: (student: StudentProfile) => void;
  studentsList: StudentProfile[];
  addStudent: (student: Omit<StudentProfile, 'id'>) => void;
  deleteStudent: (studentId: string) => void;
  switchStudent: (studentId: string) => void;

  // Admissions
  applications: AdmissionApplication[];
  submitAdmission: (data: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>) => string;
  updateApplicationStatus: (id: string, status: AdmissionApplication['status']) => void;

  // Timetable Lessons
  lessons: ScheduledLesson[];
  addLesson: (lesson: Omit<ScheduledLesson, 'id'>) => void;

  // Transactions & Billing
  transactions: TransactionRecord[];
  processPayment: (amount: number, description: string, method: TransactionRecord['paymentMethod'], studentId?: string) => string;

  // Monthly Tuition & Access Pass (₦20,000 Morning / ₦15,000 Evening)
  submitMonthlyTuition: (studentId: string, shift: StudentShift, method?: TransactionRecord['paymentMethod']) => string;
  approveTuitionPayment: (transactionId: string) => OfficialReceipt | null;
  rejectTuitionPayment: (transactionId: string, reason?: string) => void;
  updateStudentShift: (studentId: string, shift: StudentShift) => void;
  isStudentSubscriptionActive: (student: StudentProfile) => boolean;

  // Official Receipt Modal
  selectedReceipt: OfficialReceipt | null;
  isReceiptModalOpen: boolean;
  openReceiptModal: (receipt: OfficialReceipt) => void;
  closeReceiptModal: () => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (title: string, category: Announcement['category'], content: string) => void;

  // Academic Entities
  programmes: ProgramItem[];
  subjects: SubjectItem[];
  updateSubjectCoverage: (subjectId: string, coverage: number) => void;
  courses: CourseModule[];
  studyMaterials: StudyMaterial[];
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => void;
  deleteStudyMaterial: (id: string) => void;
  practiceQuestions: PracticeQuestion[];
  addPracticeQuestion: (q: Omit<PracticeQuestion, 'id'>) => void;
  deletePracticeQuestion: (id: string) => void;

  // Question Batches (Word/PDF upload & approval)
  questionBatches: UploadedQuestionBatch[];
  uploadQuestionBatch: (
    batchOrFileName: Omit<UploadedQuestionBatch, 'id' | 'uploadedAt' | 'status'> | string,
    fileType?: 'DOCX' | 'DOC' | 'PDF',
    subject?: string,
    program?: string
  ) => void;
  approveQuestionBatch: (batchId: string) => void;
  rejectQuestionBatch: (batchId: string) => void;

  // Monthly Tuition Payment Submissions (approval workflow)
  monthlyPaymentSubmissions: MonthlyPaymentSubmission[];
  submitMonthlyPayment: (submission: Omit<MonthlyPaymentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  approveMonthlyPaymentSubmission: (submissionId: string) => OfficialReceipt | null;
  rejectMonthlyPaymentSubmission: (submissionId: string, reason?: string) => void;

  // Gallery Management
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  galleryCategories: string[];
  addGalleryCategory: (category: string) => void;
  deleteGalleryCategory: (category: string) => void;

  // CBT System
  cbtExams: CBTExam[];
  addCBTExam: (exam: Omit<CBTExam, 'id'>) => void;
  cbtAttempts: CBTAttempt[];
  recordCBTAttempt: (attempt: Omit<CBTAttempt, 'id' | 'submittedAt'>) => void;

  // Attendance
  attendanceSessions: DailyAttendanceSession[];
  saveAttendanceSession: (session: DailyAttendanceSession) => void;
  recordIndividualStudentAttendance: (studentId: string, date: string, status: 'Present' | 'Late' | 'Absent' | 'Excused', remark?: string) => void;

  // Admin & Audit
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string) => void;
  adminUsers: AdminUser[];
  addAdminUser: (admin: Omit<AdminUser, 'id' | 'lastLogin'>) => void;
  deleteAdminUser: (id: string) => void;

  // Toasts & Modals
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  activePaymentModal: {
    isOpen: boolean;
    amount: number;
    description: string;
    studentId?: string;
  } | null;
  openPaymentModal: (amount: number, description: string, studentId?: string) => void;
  closePaymentModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to parse current location hash
function parseHashLocation(): { page: PageId; tab?: string } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { page: 'home' };

  const [pagePart, queryPart] = hash.split('?');
  const validPages: PageId[] = [
    'home',
    'about',
    'services',
    'gallery',
    'admission',
    'contact',
    'student-portal',
    'admin-portal',
  ];

  const matchedPage = validPages.find((p) => p === pagePart) || 'home';
  let tab: string | undefined = undefined;

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    tab = params.get('tab') || undefined;
  }

  return { page: matchedPage, tab };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial route from URL hash
  const initialRoute = parseHashLocation();
  const [currentPage, setCurrentPageState] = useState<PageId>(initialRoute.page);
  const [studentTab, setStudentTabState] = useState<StudentPortalTab>(
    (initialRoute.tab as StudentPortalTab) || 'dashboard'
  );
  const [adminTab, setAdminTabState] = useState<AdminPortalTab>(
    (initialRoute.tab as AdminPortalTab) || 'students'
  );

  const [userRole, setUserRole] = useState<'guest' | 'student' | 'admin'>(() => {
    if (initialRoute.page === 'admin-portal') return 'admin';
    if (initialRoute.page === 'student-portal') return 'student';
    return 'guest';
  });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('dec_admin_logged_in') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    const saved = localStorage.getItem('dec_admin_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          role: ADMIN_CREDENTIALS.role,
        };
  });

  // Student authentication state
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('dec_student_logged_in') === 'true';
  });

  // Students list
  const [studentsList, setStudentsList] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('dec_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: StudentProfile) => ({
            ...s,
            studentShift: s.studentShift || 'Morning',
            monthlyFee: s.monthlyFee || (s.studentShift === 'Evening' ? 15000 : 20000),
            subscriptionStatus: s.subscriptionStatus || (s.id === 'std-3' ? 'Pending Approval' : 'Active'),
            subscriptionMonth: s.subscriptionMonth || 'September 2026',
            subscriptionExpiryDate: s.subscriptionExpiryDate || '30 Sep 2026, 11:59 PM',
          }));
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    return studentsList[0] || INITIAL_STUDENTS[0];
  });

  // Applications
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    const saved = localStorage.getItem('dec_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Lessons
  const [lessons, setLessons] = useState<ScheduledLesson[]>(() => {
    const saved = localStorage.getItem('dec_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  // Transactions
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('dec_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('dec_announcements');
    return saved ? JSON.parse(saved) : ANNOUNCEMENTS;
  });

  // Programmes, Subjects, Courses
  const [programmes, setProgrammes] = useState<ProgramItem[]>(() => {
    const saved = localStorage.getItem('dec_programmes');
    return saved ? JSON.parse(saved) : PROGRAMMES_DATA;
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('dec_subjects');
    return saved ? JSON.parse(saved) : SUBJECTS_DATA;
  });

  const [courses, setCourses] = useState<CourseModule[]>(() => {
    const saved = localStorage.getItem('dec_courses');
    return saved ? JSON.parse(saved) : COURSES_DATA;
  });

  // Study Materials & Practice Questions
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('dec_study_materials');
    return saved ? JSON.parse(saved) : STUDY_MATERIALS_DATA;
  });

  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>(() => {
    const saved = localStorage.getItem('dec_practice_questions');
    return saved ? JSON.parse(saved) : PRACTICE_QUESTIONS_DATA;
  });

  // CBT Exams & Attempts
  const [cbtExams, setCbtExams] = useState<CBTExam[]>(() => {
    const saved = localStorage.getItem('dec_cbt_exams');
    return saved ? JSON.parse(saved) : CBT_EXAMS_DATA;
  });

  const [cbtAttempts, setCbtAttempts] = useState<CBTAttempt[]>(() => {
    const saved = localStorage.getItem('dec_cbt_attempts');
    return saved ? JSON.parse(saved) : CBT_ATTEMPTS_DATA;
  });

  // Attendance Sessions
  const [attendanceSessions, setAttendanceSessions] = useState<DailyAttendanceSession[]>(() => {
    const saved = localStorage.getItem('dec_attendance_sessions');
    return saved ? JSON.parse(saved) : ATTENDANCE_SESSIONS_DATA;
  });

  // Gallery Management
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('dec_gallery_items');
    if (!saved) return GALLERY_ITEMS;
    try {
      const parsed: GalleryItem[] = JSON.parse(saved);
      return parsed.map((item, idx) => ({
        ...item,
        page: item.page || (idx < 3 ? 'hero' : idx === 3 ? 'about' : idx === 4 ? 'services' : 'all'),
      }));
    } catch {
      return GALLERY_ITEMS;
    }
  });

  // Question Batches (Word/PDF document upload & approval)
  const [questionBatches, setQuestionBatches] = useState<UploadedQuestionBatch[]>(() => {
    const saved = localStorage.getItem('dec_question_batches');
    return saved ? JSON.parse(saved) : [
      {
        id: 'batch-001',
        filename: 'UTME_2026_Physics_Mechanics_Drill.docx',
        fileType: 'DOCX',
        subject: 'Physics',
        program: 'UTME',
        uploadedAt: '2026-09-20 14:30',
        uploadedBy: 'Mr. Akinjo Rotimi (Founder)',
        questionCount: 4,
        status: 'Approved',
        questions: PRACTICE_QUESTIONS_DATA.filter((q) => q.subject === 'Physics').slice(0, 4),
      },
      {
        id: 'batch-002',
        filename: 'WAEC_General_Mathematics_Calculus_Pack.pdf',
        fileType: 'PDF',
        subject: 'Mathematics',
        program: 'WAEC',
        uploadedAt: '2026-09-23 10:15',
        uploadedBy: 'Engr. Taiwo Balogun',
        questionCount: 2,
        status: 'Pending Review',
        questions: [
          {
            id: 'batch2-q1',
            subject: 'Mathematics',
            program: 'WAEC',
            examYear: '2026 Prep',
            questionText: 'Evaluate the derivative of f(x) = 3x^3 - 5x^2 + 7x - 4 with respect to x.',
            options: [
              { label: 'A', text: '9x^2 - 10x + 7' },
              { label: 'B', text: '6x^2 - 5x + 7' },
              { label: 'C', text: '9x^2 - 10x' },
              { label: 'D', text: '3x^2 - 10x + 7' },
            ],
            correctOption: 'A',
            explanation: 'Using power rule d/dx(ax^n) = a*n*x^(n-1): 3*(3)x^2 - 5*(2)x + 7 = 9x^2 - 10x + 7.',
            difficulty: 'Medium',
            status: 'Pending Review',
          },
          {
            id: 'batch2-q2',
            subject: 'Mathematics',
            program: 'WAEC',
            examYear: '2026 Prep',
            questionText: 'Find the indefinite integral of (4x^3 + 2x) dx.',
            options: [
              { label: 'A', text: 'x^4 + x^2 + C' },
              { label: 'B', text: '12x^2 + 2 + C' },
              { label: 'C', text: '4x^4 + 2x^2 + C' },
              { label: 'D', text: 'x^4 + 2x^2' },
            ],
            correctOption: 'A',
            explanation: 'Integral is (4x^4)/4 + (2x^2)/2 + C = x^4 + x^2 + C.',
            difficulty: 'Medium',
            status: 'Pending Review',
          },
        ],
      },
    ];
  });

  // Monthly Tuition Payment Submissions
  const [monthlyPaymentSubmissions, setMonthlyPaymentSubmissions] = useState<MonthlyPaymentSubmission[]>(() => {
    const saved = localStorage.getItem('dec_monthly_payments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'mps-001',
        studentId: 'std-1',
        studentName: 'Olawale Adebayo',
        registrationNumber: 'DEC-2025-0142',
        program: 'UTME',
        studentShift: 'Morning',
        monthPeriod: 'September 2026',
        amount: 20000,
        paymentMethod: 'Bank Transfer',
        transactionReference: 'DEC-PAY-882194',
        submittedAt: '2026-09-02 09:15',
        status: 'Approved',
        receiptNumber: 'DEC-REC-2026-0814',
      },
      {
        id: 'mps-002',
        studentId: 'std-2',
        studentName: 'Chioma Okonkwo',
        registrationNumber: 'DEC-2025-0219',
        program: 'IELTS',
        studentShift: 'Evening',
        monthPeriod: 'September 2026',
        amount: 15000,
        paymentMethod: 'Paystack Card',
        transactionReference: 'DEC-PAY-771920',
        submittedAt: '2026-09-03 11:20',
        status: 'Approved',
        receiptNumber: 'DEC-REC-2026-0922',
      },
      {
        id: 'mps-003',
        studentId: 'std-3',
        studentName: 'Babatunde Adeleke',
        registrationNumber: 'DEC-2025-0341',
        program: 'WAEC',
        studentShift: 'Morning',
        monthPeriod: 'October 2026',
        amount: 20000,
        paymentMethod: 'Direct Bank Transfer',
        transactionReference: 'ZEN-TRF-9021849',
        submittedAt: '2026-09-24 08:30',
        status: 'Pending Review',
        proofNotes: 'Paid through Zenith Bank mobile app to D Ensured Consult account.',
      },
    ];
  });

  // Audit Logs & Admin Users
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('dec_audit_logs');
    return saved ? JSON.parse(saved) : AUDIT_LOGS_DATA;
  });

  // Gallery Categories
  const [galleryCategories, setGalleryCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('dec_gallery_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return ['CBT Lab', 'Classrooms', 'Practicals', 'Awards & Achievers', 'Campus Life'];
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('dec_admin_users_v3');
    if (saved) {
      try {
        const parsed: AdminUser[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return ADMIN_USERS_DATA;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Payment Modal
  const [activePaymentModal, setActivePaymentModal] = useState<{
    isOpen: boolean;
    amount: number;
    description: string;
    studentId?: string;
  } | null>(null);

  // Synchronize URL Hash when navigating
  const navigateTo = useCallback((page: PageId, tab?: string) => {
    setCurrentPageState(page);
    if (page === 'student-portal') {
      setUserRole('student');
      if (tab) setStudentTabState(tab as StudentPortalTab);
    } else if (page === 'admin-portal') {
      setUserRole('admin');
      if (tab) setAdminTabState(tab as AdminPortalTab);
    }

    const hashString = tab ? `#/${page}?tab=${tab}` : `#/${page}`;
    if (window.location.hash !== hashString) {
      window.location.hash = hashString;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setCurrentPage = useCallback((page: PageId) => {
    navigateTo(page);
  }, [navigateTo]);

  const setStudentTab = useCallback((tab: StudentPortalTab) => {
    setStudentTabState(tab);
    window.location.hash = `#/student-portal?tab=${tab}`;
  }, []);

  const setAdminTab = useCallback((tab: AdminPortalTab) => {
    setAdminTabState(tab);
    window.location.hash = `#/admin-portal?tab=${tab}`;
  }, []);

  // Listen for external hashchange (browser back/forward or direct bookmark link click)
  useEffect(() => {
    const handleHashChange = () => {
      const { page, tab } = parseHashLocation();
      setCurrentPageState(page);
      if (page === 'student-portal') {
        setUserRole('student');
        if (tab) setStudentTabState(tab as StudentPortalTab);
      } else if (page === 'admin-portal') {
        setUserRole('admin');
        if (tab) setAdminTabState(tab as AdminPortalTab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dec_students', JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    localStorage.setItem('dec_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('dec_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('dec_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dec_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('dec_programmes', JSON.stringify(programmes));
  }, [programmes]);

  useEffect(() => {
    localStorage.setItem('dec_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('dec_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('dec_study_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem('dec_practice_questions', JSON.stringify(practiceQuestions));
  }, [practiceQuestions]);

  useEffect(() => {
    localStorage.setItem('dec_cbt_exams', JSON.stringify(cbtExams));
  }, [cbtExams]);

  useEffect(() => {
    localStorage.setItem('dec_cbt_attempts', JSON.stringify(cbtAttempts));
  }, [cbtAttempts]);

  useEffect(() => {
    localStorage.setItem('dec_attendance_sessions', JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem('dec_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('dec_gallery_categories', JSON.stringify(galleryCategories));
  }, [galleryCategories]);

  useEffect(() => {
    localStorage.setItem('dec_admin_users_v3', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('dec_question_batches', JSON.stringify(questionBatches));
  }, [questionBatches]);

  useEffect(() => {
    localStorage.setItem('dec_monthly_payments', JSON.stringify(monthlyPaymentSubmissions));
  }, [monthlyPaymentSubmissions]);

  useEffect(() => {
    localStorage.setItem('dec_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('dec_admin_logged_in', String(isAdminLoggedIn));
    if (adminUser) {
      localStorage.setItem('dec_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('dec_admin_user');
    }
  }, [isAdminLoggedIn, adminUser]);

  // Toast Helpers
  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      adminName: adminUser ? adminUser.email : ADMIN_CREDENTIALS.email,
      action,
      details,
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ipAddress: '102.89.44.12 (Doyin Plaza Admin Hub)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Admin Login with exact credentials requested
  const loginAdmin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const targetEmail = ADMIN_CREDENTIALS.email.toLowerCase();

    // Try Supabase auth if connected, while guaranteeing local fallback
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });
      } catch (err) {
        console.warn('Supabase auth fallback active:', err);
      }
    }

    if (cleanEmail === targetEmail && pass === ADMIN_CREDENTIALS.password) {
      setIsAdminLoggedIn(true);
      const user = {
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role,
      };
      setAdminUser(user);
      setUserRole('admin');
      addAuditLog('Admin Login Successful', `Authorized directorate access`);
      showToast('success', 'Admin Hub Unlocked', `Welcome back, Directorate Admin!`);
      return { success: true, message: 'Authentication successful.' };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please verify your directorate email and password.',
    };
  };

  const logoutAdmin = () => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setIsAdminLoggedIn(false);
    localStorage.removeItem('dec_admin_logged_in');
    localStorage.removeItem('dec_admin_user');
    addAuditLog('Admin Logout', `Directorate session ended`);
    showToast('info', 'Logged Out', 'You have been signed out of the Executive Admin Hub.');
  };

  const loginStudent = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; message: string; student?: StudentProfile }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    const found = studentsList.find((s) => {
      const matchEmail = s.email.toLowerCase() === cleanId;
      const matchReg = s.registrationNumber.toLowerCase() === cleanId;
      return matchEmail || matchReg;
    });

    if (!found) {
      return {
        success: false,
        message: 'No student record found with this Registration Number or Email.',
      };
    }

    // Allow student123 as universal demo password or their registered password
    if (found.password && cleanPass !== found.password && cleanPass !== 'student123') {
      return {
        success: false,
        message: 'Incorrect portal password. Please re-enter your password.',
      };
    }

    setCurrentStudent(found);
    setIsStudentLoggedIn(true);
    localStorage.setItem('dec_student_logged_in', 'true');
    setUserRole('student');
    showToast('success', 'Portal Access Granted', `Welcome to your individual e-portal, ${found.fullName}!`);
    return { success: true, message: 'Welcome to your student portal.', student: found };
  };

  const logoutStudent = () => {
    setIsStudentLoggedIn(false);
    localStorage.removeItem('dec_student_logged_in');
    showToast('info', 'Signed Out', 'You have been signed out of your student portal.');
  };

  const switchStudent = (studentId: string) => {
    const found = studentsList.find((s) => s.id === studentId);
    if (found) {
      setCurrentStudent(found);
      setIsStudentLoggedIn(true);
      localStorage.setItem('dec_student_logged_in', 'true');
      showToast('info', 'Active Student Switched', `Now viewing profile for ${found.fullName}`);
    }
  };

  const addStudent = (newStd: Omit<StudentProfile, 'id'>) => {
    const id = `std-${Date.now()}`;
    const studentWithId: StudentProfile = { id, ...newStd };
    setStudentsList((prev) => [studentWithId, ...prev]);
    addAuditLog('New Student Enrolled', `Enrolled ${studentWithId.fullName} (${studentWithId.registrationNumber})`);
    showToast('success', 'Candidate Enrolled', `Added ${studentWithId.fullName} to active student directory.`);
  };

  const deleteStudent = (studentId: string) => {
    const studentToDelete = studentsList.find((s) => s.id === studentId);
    const updatedList = studentsList.filter((s) => s.id !== studentId);
    setStudentsList(updatedList);
    localStorage.setItem('dec_students', JSON.stringify(updatedList));

    if (currentStudent && currentStudent.id === studentId) {
      if (updatedList.length > 0) {
        setCurrentStudent(updatedList[0]);
      }
    }

    if (studentToDelete) {
      addAuditLog(
        'Student Profile Deleted',
        `Permanently removed student ${studentToDelete.fullName} (${studentToDelete.registrationNumber}) from database.`
      );
      showToast(
        'info',
        'Student Profile Removed',
        `${studentToDelete.fullName}'s profile and records have been deleted from the database.`
      );
    }
  };

  const recordIndividualStudentAttendance = (
    studentId: string,
    date: string,
    status: 'Present' | 'Late' | 'Absent' | 'Excused',
    remark?: string
  ) => {
    const newEntry = {
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date,
      status,
      remark: remark || (status === 'Present' ? 'Full Session' : status),
    };

    setStudentsList((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const currentHistory = student.attendanceHistory || [];
        const existingIdx = currentHistory.findIndex((h) => h.date === date);
        let updatedHistory;
        if (existingIdx >= 0) {
          updatedHistory = currentHistory.map((h, idx) => (idx === existingIdx ? newEntry : h));
        } else {
          updatedHistory = [newEntry, ...currentHistory];
        }

        const presentCount = updatedHistory.filter(
          (h) => h.status === 'Present' || h.status === 'Late'
        ).length;
        const total = updatedHistory.length;
        const newRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

        const updatedStudent: StudentProfile = {
          ...student,
          attendanceHistory: updatedHistory,
          attendanceRate: newRate,
        };

        if (currentStudent && currentStudent.id === studentId) {
          setCurrentStudent(updatedStudent);
        }

        return updatedStudent;
      })
    );

    addAuditLog('Daily Attendance Logged', `Recorded "${status}" for student ID ${studentId} on ${date}`);
    showToast('success', 'Attendance Recorded', `Saved ${status} for ${date}.`);
  };

  const submitAdmission = (data: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `DEC-2026-${randomNum}`;
    const newApp: AdmissionApplication = {
      ...data,
      id: newId,
      submittedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Enrolled',
    };

    setApplications((prev) => [newApp, ...prev]);
    addAuditLog('Admission Application Received', `Application #${newId} for ${data.fullName} (${data.program})`);

    // Automatically create and sync the student profile so they can immediately sign in to their individual portal!
    const tuitionTotal = data.program === 'IELTS' ? 140000 : 85000;
    const shift: StudentShift = data.studentShift || 'Morning';
    const monthlyFee = shift === 'Morning' ? 20000 : 15000;
    const currentMonthPeriod = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const studentProfile: StudentProfile = {
      id: `std-${Date.now()}`,
      registrationNumber: newId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password || 'student123',
      avatar: data.passportPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      program: data.program,
      studyMode: data.studyMode,
      studentShift: shift,
      monthlyFee,
      subscriptionStatus: 'Unpaid',
      subscriptionMonth: currentMonthPeriod,
      targetExamDate: data.program === 'IELTS' ? 'June 2026' : 'April 2026',
      daysRemaining: 45,
      targetScore: data.program === 'IELTS' ? (data.ieltsTargetBand ? `Band ${data.ieltsTargetBand}` : 'Band 8.0') : '320+',
      currentAverageScore: data.program === 'IELTS' ? 7.0 : 280,
      attendanceRate: 100,
      syllabusCompletion: 25,
      tuitionTotal,
      tuitionPaid: 0,
      tuitionBalance: tuitionTotal,
      currency: 'NGN',
      nextClass: data.program === 'IELTS'
        ? 'IELTS Masterclass (Audio Lab & Writing Task 2) - Saturday 10:00 AM'
        : 'Use of English & Core Combination - Saturday 09:00 AM (Hall A)',
      assignedAdvisor: data.program === 'IELTS' ? 'Mrs. Abigail Mensah (British Council Certified)' : 'Mr. Akinjo Rotimi (Founder)',
      subjectCombinations: data.subjectCombinations,
      selectedSubjects: data.subjectCombinations || [],
      ieltsModule: data.ieltsModule,
      ieltsTargetBand: data.ieltsTargetBand,
      ieltsFocusArea: data.ieltsFocusArea,
      destinationCountry: data.destinationCountry,
      targetInstitution: data.targetInstitution,
      targetCourse: data.targetCourse,
      nin: data.nin,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      academicSession: data.academicSession || 'Official 2026/2027 academic session',
      stateOfOrigin: data.stateOfOrigin,
      lga: data.lga,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      parentRelationship: data.parentRelationship,
      parentEmail: data.parentEmail,
      parentOccupation: data.parentOccupation,
      parentAddress: data.parentAddress,
      residentialAddress: data.residentialAddress,
      attendanceHistory: [
        {
          id: `att-init-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
          remark: 'Initial Induction & Biometric Enrollment',
        },
      ],
      recentMockTests: [],
    };

    setStudentsList((prev) => [studentProfile, ...prev]);
    setCurrentStudent(studentProfile);
    setIsStudentLoggedIn(true);
    localStorage.setItem('dec_student_logged_in', 'true');

    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D5241B', '#25166B', '#028D3B', '#098CD0', '#FFC600'],
      });
    } catch {
      // Ignore
    }

    showToast(
      'success',
      'Registration Completed!',
      `Registration ID: ${newId}. Profile created for e-portal.`
    );

    return newId;
  };

  const updateApplicationStatus = (id: string, status: AdmissionApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    addAuditLog('Application Status Updated', `Application #${id} status changed to ${status}`);
    showToast('info', 'Application Updated', `Application #${id} set to "${status}".`);
  };

  const addLesson = (newLessonData: Omit<ScheduledLesson, 'id'>) => {
    const id = `les-${Date.now()}`;
    const newLesson: ScheduledLesson = { id, ...newLessonData };
    setLessons((prev) => [newLesson, ...prev]);
    addAuditLog('Timetable Lesson Added', `Added "${newLesson.title}" (${newLesson.dayOfWeek})`);
    showToast('success', 'Class Scheduled', `Added "${newLesson.title}" to master timetable.`);
  };

  const processPayment = (
    amount: number,
    description: string,
    method: TransactionRecord['paymentMethod'],
    targetStudentId?: string
  ): string => {
    const ref = `DEC-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const student = targetStudentId
      ? studentsList.find((s) => s.id === targetStudentId) || currentStudent
      : currentStudent;

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      reference: ref,
      studentId: student.id,
      studentName: student.fullName,
      program: student.program,
      amount,
      currency: student.currency,
      status: 'Successful',
      paymentMethod: method,
      description,
      timestamp: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update tuition balance
    setStudentsList((prev) =>
      prev.map((std) => {
        if (std.id === student.id) {
          const newPaid = Math.min(std.tuitionTotal, std.tuitionPaid + amount);
          const newBalance = Math.max(0, std.tuitionTotal - newPaid);
          const updated = { ...std, tuitionPaid: newPaid, tuitionBalance: newBalance };
          if (std.id === currentStudent.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return std;
      })
    );

    addAuditLog('Tuition Payment Processed', `Payment ref ${ref} of ₦${amount.toLocaleString()} for ${student.fullName}`);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }

    showToast(
      'success',
      'Payment Confirmed!',
      `Receipt #${ref} generated for ₦${amount.toLocaleString()}. Balance updated.`
    );

    return ref;
  };

  const addAnnouncement = (title: string, category: Announcement['category'], content: string) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      category,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      author: 'D Ensured Directorate',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog('Announcement Published', `Broadcasting notice: "${title}"`);
    showToast('success', 'Announcement Published', 'Notice is now live across student dashboards.');
  };

  const updateSubjectCoverage = (subjectId: string, coverage: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, syllabusCoverage: coverage } : s))
    );
  };

  const addStudyMaterial = (mat: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => {
    const newMat: StudyMaterial = {
      ...mat,
      id: `mat-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
    };
    setStudyMaterials((prev) => [newMat, ...prev]);
    addAuditLog('Study Material Uploaded', `Uploaded "${newMat.title}" for ${newMat.subject}`);
    showToast('success', 'Material Published', `Added "${newMat.title}" to student library.`);
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('Study Material Deleted', `Removed study material #${id}`);
    showToast('info', 'Material Removed', 'Study material removed from student library.');
  };

  const addPracticeQuestion = (q: Omit<PracticeQuestion, 'id'>) => {
    const newQ: PracticeQuestion = {
      ...q,
      id: `pq-${Date.now()}`,
    };
    setPracticeQuestions((prev) => [newQ, ...prev]);
    addAuditLog('Practice Question Added', `Added question to ${newQ.subject} question bank`);
    showToast('success', 'Question Added', 'New CBT practice item logged in database.');
  };

  const deletePracticeQuestion = (id: string) => {
    setPracticeQuestions((prev) => prev.filter((q) => q.id !== id));
    addAuditLog('Question Deleted', `Removed practice question #${id}`);
    showToast('info', 'Question Removed', 'Practice question deleted from the database.');
  };

  // Gallery Management
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setGalleryItems((prev) => [newItem, ...prev]);
    addAuditLog('Gallery Image Uploaded', `Uploaded image "${newItem.title}" to ${newItem.category}`);
    showToast('success', 'Image Uploaded', `"${newItem.title}" added to campus gallery.`);
  };

  const deleteGalleryItem = (id: string) => {
    const itemToDelete = galleryItems.find((g) => g.id === id);
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    addAuditLog('Gallery Image Deleted', `Removed image "${itemToDelete?.title || id}" from gallery`);
    showToast('info', 'Image Deleted', 'Image was deleted from the gallery and database.');
  };

  const addGalleryCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) {
      showToast('error', 'Invalid Category', 'Category name cannot be empty.');
      return;
    }
    if (galleryCategories.includes(trimmed)) {
      showToast('info', 'Category Exists', `Category "${trimmed}" already exists.`);
      return;
    }
    setGalleryCategories((prev) => [...prev, trimmed]);
    addAuditLog('Gallery Category Added', `Added new image category: "${trimmed}"`);
    showToast('success', 'Category Created', `Category "${trimmed}" added to gallery & image upload.`);
  };

  const deleteGalleryCategory = (category: string) => {
    setGalleryCategories((prev) => prev.filter((c) => c !== category));
    addAuditLog('Gallery Category Removed', `Removed image category: "${category}"`);
    showToast('info', 'Category Removed', `Category "${category}" removed from gallery and image upload.`);
  };

  const addAdminUser = (newAdmin: Omit<AdminUser, 'id' | 'lastLogin'>) => {
    const newId = `adm-${Date.now()}`;
    const adminObj: AdminUser = {
      ...newAdmin,
      id: newId,
      lastLogin: 'Never (Pending First Login)',
      isSuperAdmin: false,
    };
    setAdminUsers((prev) => [...prev, adminObj]);
    addAuditLog(
      'Admin Appointed',
      `Super Admin (Mr Akinjo Rotimi) appointed new administrator: ${adminObj.name} (${adminObj.role})`
    );
    showToast('success', 'Admin Appointed', `${adminObj.name} appointed as ${adminObj.role}.`);
  };

  const deleteAdminUser = (id: string) => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) return;
    if (
      target.isSuperAdmin ||
      target.name.includes('Akinjo') ||
      target.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
    ) {
      showToast('error', 'Action Prohibited', 'The Super Admin & Directorate (Mr Akinjo Rotimi) cannot be removed.');
      return;
    }
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog(
      'Admin Removed',
      `Super Admin (Mr Akinjo Rotimi) revoked access for admin: ${target.name} (${target.email})`
    );
    showToast('info', 'Admin Removed', `${target.name} was successfully removed from the portal.`);
  };

  // Question Batches (Word/PDF document upload & approval)
  const uploadQuestionBatch = (
    batchOrFileName: Omit<UploadedQuestionBatch, 'id' | 'uploadedAt' | 'status'> | string,
    fileType?: 'DOCX' | 'DOC' | 'PDF',
    subject?: string,
    program?: string
  ) => {
    let newBatch: UploadedQuestionBatch;
    if (typeof batchOrFileName === 'string') {
      const fileName = batchOrFileName;
      const fType = fileType || 'DOCX';
      const subj = subject || 'General';
      const defaultQuestions: PracticeQuestion[] = [
        {
          id: `pq-doc-${Date.now()}-1`,
          subject: subj,
          program: (program as any) || 'UTME',
          examYear: '2026 Edition',
          difficulty: 'Medium',
          questionText: `Uploaded past question 1 for ${subj} (${program || 'UTME/WAEC'}). What is the primary conceptual relationship demonstrated?`,
          options: [
            { label: 'A', text: 'First core principle formulation' },
            { label: 'B', text: 'Second theoretical postulate' },
            { label: 'C', text: 'Empirical verification outcome' },
            { label: 'D', text: 'Inverted derivative state' },
          ],
          correctOption: 'B',
          explanation: `Heuristic solution confirmed by Chief Examiner for ${subj}.`,
        },
        {
          id: `pq-doc-${Date.now()}-2`,
          subject: subj,
          program: (program as any) || 'UTME',
          examYear: '2026 Edition',
          difficulty: 'Hard',
          questionText: `Uploaded examination problem 2 from ${fileName} under ${subj} mastery track. Determine the optimal heuristic solution:`,
          options: [
            { label: 'A', text: '24.5 units' },
            { label: 'B', text: '36.8 units' },
            { label: 'C', text: '48.0 units' },
            { label: 'D', text: '52.4 units' },
          ],
          correctOption: 'C',
          explanation: 'Step-by-step marking calculation verified.',
        },
      ];
      newBatch = {
        id: `batch-${Date.now()}`,
        title: `${subj} ${fType} Batch (${program || 'UTME/WAEC'})`,
        subject: subj,
        fileName: fileName,
        filename: fileName,
        fileType: fType,
        uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Mr. Akinjo Rotimi (Founder)',
        questionCount: 20,
        status: 'Pending Review',
        questions: defaultQuestions,
        parsedQuestions: defaultQuestions,
        program: program || 'UTME',
      };
    } else {
      const batch = batchOrFileName;
      const fn = batch.fileName || batch.filename || 'Uploaded_Document.docx';
      newBatch = {
        ...batch,
        id: `batch-${Date.now()}`,
        fileName: fn,
        filename: fn,
        uploadDate: batch.uploadDate || new Date().toISOString().split('T')[0],
        uploadedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'Pending Review',
        parsedQuestions: batch.questions,
      };
    }
    setQuestionBatches((prev) => [newBatch, ...prev]);
    addAuditLog('Question Document Uploaded', `Uploaded document "${newBatch.fileName}" containing ${newBatch.questionCount} questions for ${newBatch.subject}. Pending directorate approval.`);
    showToast('info', 'Document Uploaded', `"${newBatch.fileName}" is awaiting approval in the admin portal.`);
  };

  const approveQuestionBatch = (batchId: string) => {
    const batch = questionBatches.find((b) => b.id === batchId);
    if (!batch) return;

    setQuestionBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'Approved' } : b))
    );

    // Publish approved questions into practiceQuestions so they appear in student portal!
    const approvedQuestions = batch.questions.map((q) => ({
      ...q,
      status: 'Approved' as const,
      batchId: batch.id,
    }));

    setPracticeQuestions((prev) => [...approvedQuestions, ...prev]);
    const bName = batch.fileName || batch.filename || 'Document';
    addAuditLog('Question Batch Approved', `Approved and published ${batch.questionCount} questions from "${bName}" to student portal.`);
    showToast('success', 'Batch Approved & Published', `${batch.questionCount} questions are now live in the student CBT portal!`);
  };

  const rejectQuestionBatch = (batchId: string) => {
    setQuestionBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'Rejected' } : b))
    );
    addAuditLog('Question Batch Rejected', `Rejected question batch #${batchId}`);
    showToast('warning', 'Batch Rejected', 'Questions were rejected and will not appear in the student portal.');
  };

  // Monthly Tuition Payment Submissions
  const submitMonthlyPayment = (submission: Omit<MonthlyPaymentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: MonthlyPaymentSubmission = {
      ...submission,
      id: `mps-${Date.now()}`,
      submittedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
    };
    setMonthlyPaymentSubmissions((prev) => [newSubmission, ...prev]);

    // Mark student's status as 'Pending Approval'
    setStudentsList((prev) =>
      prev.map((s) => (s.id === submission.studentId ? { ...s, subscriptionStatus: 'Pending Approval' } : s))
    );
    if (currentStudent && currentStudent.id === submission.studentId) {
      setCurrentStudent((prev) => ({ ...prev, subscriptionStatus: 'Pending Approval' }));
    }

    addAuditLog('Monthly Payment Submitted', `Payment submitted by ${submission.studentName} for ${submission.monthPeriod} (₦${submission.amount.toLocaleString()}). Pending admin approval.`);
    showToast('info', 'Payment Submitted', 'Your payment form has been received and is awaiting directorate approval.');
  };

  const approveMonthlyPaymentSubmission = (submissionId: string): OfficialReceipt | null => {
    const submission = monthlyPaymentSubmissions.find((m) => m.id === submissionId);
    if (!submission) return null;

    const student = studentsList.find((s) => s.id === submission.studentId) || currentStudent;
    const now = new Date();
    const approvedAtFormatted = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const receiptNum = `DEC-REC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const validUntil = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;

    const qrPayload = `https://densuredconsult.edu.ng/verify-receipt?receipt=${receiptNum}&ref=${submission.transactionReference}&student=${encodeURIComponent(submission.studentName)}&reg=${submission.registrationNumber}&shift=${submission.studentShift}&month=${encodeURIComponent(submission.monthPeriod)}&amount=${submission.amount}&status=APPROVED`;

    const officialReceipt: OfficialReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      transactionReference: submission.transactionReference || submission.referenceOrProof || 'DEC-TX-REF',
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentPhone: student.phone,
      registrationNumber: student.registrationNumber,
      program: student.program,
      studentShift: submission.studentShift || student.studentShift || 'Morning',
      amount: submission.amount,
      amountInWords: submission.amount === 20000 ? 'TWENTY THOUSAND NAIRA ONLY' : 'FIFTEEN THOUSAND NAIRA ONLY',
      currency: 'NGN',
      monthPeriod: submission.monthPeriod,
      validUntil,
      issueDate: submission.submittedAt,
      approvedBy: 'Mr. Akinjo Rotimi (Founder)',
      approvedAt: approvedAtFormatted,
      qrPayload,
      status: 'Approved',
      paymentMethod: submission.paymentMethod as any,
    };

    // Update submission
    setMonthlyPaymentSubmissions((prev) =>
      prev.map((m) => (m.id === submissionId ? { ...m, status: 'Approved', receiptNumber: receiptNum } : m))
    );

    // Update student to Active
    const expiryDateFormatted = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}, 11:59 PM`;
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === submission.studentId) {
          const updated: StudentProfile = {
            ...s,
            subscriptionStatus: 'Active',
            subscriptionMonth: submission.monthPeriod,
            subscriptionExpiryDate: expiryDateFormatted,
            lastApprovedReceipt: officialReceipt,
            monthlyFee: submission.amount,
            studentShift: submission.studentShift || s.studentShift || 'Morning',
            tuitionPaid: (s.tuitionPaid || 0) + submission.amount,
          };
          if (currentStudent && currentStudent.id === s.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );

    addAuditLog('Monthly Payment Approved', `Approved payment of ₦${submission.amount.toLocaleString()} for ${submission.studentName}. Receipt #${receiptNum} issued.`);
    showToast('success', 'Payment Approved', `${submission.studentName}'s portal features have been unlocked.`);
    return officialReceipt;
  };

  const rejectMonthlyPaymentSubmission = (submissionId: string, reason?: string) => {
    const submission = monthlyPaymentSubmissions.find((m) => m.id === submissionId);
    if (!submission) return;

    setMonthlyPaymentSubmissions((prev) =>
      prev.map((m) => (m.id === submissionId ? { ...m, status: 'Rejected' } : m))
    );

    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === submission.studentId) {
          const updated: StudentProfile = { ...s, subscriptionStatus: 'Unpaid' };
          if (currentStudent && currentStudent.id === s.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );

    addAuditLog('Monthly Payment Rejected', `Rejected payment for ${submission.studentName}. Reason: ${reason || 'Unverified transfer'}`);
    showToast('warning', 'Payment Rejected', `Payment for ${submission.studentName} was marked rejected.`);
  };

  const addCBTExam = (exam: Omit<CBTExam, 'id'>) => {
    const newExam: CBTExam = {
      ...exam,
      id: `cbt-${Date.now()}`,
    };
    setCbtExams((prev) => [newExam, ...prev]);
    addAuditLog('CBT Exam Created', `Created test simulation: "${newExam.title}"`);
    showToast('success', 'CBT Exam Created', `"${newExam.title}" is ready for scheduling.`);
  };

  const recordCBTAttempt = (attempt: Omit<CBTAttempt, 'id' | 'submittedAt'>) => {
    const newAttempt: CBTAttempt = {
      ...attempt,
      id: `att-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setCbtAttempts((prev) => [newAttempt, ...prev]);
    showToast('success', 'CBT Test Submitted', `Score: ${newAttempt.score}/${newAttempt.maxScore} (${newAttempt.percentage}%)`);
  };

  const saveAttendanceSession = (session: DailyAttendanceSession) => {
    setAttendanceSessions((prev) => [session, ...prev.filter((s) => s.id !== session.id)]);
    addAuditLog('Daily Attendance Logged', `Attendance marked for ${session.date} (${session.cohort})`);
    showToast('success', 'Attendance Recorded', `Saved attendance entries for ${session.date}.`);
  };

  // Monthly Tuition & Access Pass Logic
  const submitMonthlyTuition = (
    studentId: string,
    shift: StudentShift,
    method: TransactionRecord['paymentMethod'] = 'Bank Transfer'
  ): string => {
    const student = studentsList.find((s) => s.id === studentId) || currentStudent;
    const amount = shift === 'Morning' ? 20000 : 15000;
    const now = new Date();
    const monthPeriod = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const validUntil = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;

    const ref = `DEC-PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: TransactionRecord = {
      id: `tx-mo-${Date.now()}`,
      reference: ref,
      studentId: student.id,
      studentName: student.fullName,
      program: student.program,
      amount,
      currency: 'NGN',
      status: 'Pending',
      paymentMethod: method,
      description: `Monthly Tuition & E-Portal Access Pass (${shift} Student - ₦${amount.toLocaleString()})`,
      timestamp: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      studentShift: shift,
      monthPeriod,
      validUntil,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update student subscription status to 'Pending Approval'
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === student.id) {
          const updated: StudentProfile = {
            ...s,
            studentShift: shift,
            monthlyFee: amount,
            subscriptionStatus: 'Pending Approval',
            subscriptionMonth: monthPeriod,
          };
          if (currentStudent.id === s.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );

    addAuditLog(
      'Monthly Tuition Submitted',
      `Payment ref ${ref} of ₦${amount.toLocaleString()} submitted for ${student.fullName} (${shift} Shift). Awaiting Admin Approval.`
    );

    showToast(
      'info',
      'Payment Submitted for Approval',
      `₦${amount.toLocaleString()} submitted (Ref: ${ref}). Waiting for Admin Dashboard approval to unlock portal features.`
    );

    return ref;
  };

  const approveTuitionPayment = (transactionId: string): OfficialReceipt | null => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return null;

    const student = studentsList.find((s) => s.id === tx.studentId) || currentStudent;
    const shift = tx.studentShift || student.studentShift || 'Morning';
    const amount = tx.amount || (shift === 'Morning' ? 20000 : 15000);
    const amountInWords = shift === 'Morning' ? 'TWENTY THOUSAND NAIRA ONLY' : 'FIFTEEN THOUSAND NAIRA ONLY';
    const now = new Date();
    const monthPeriod = tx.monthPeriod || now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const validUntil = tx.validUntil || `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`;
    const receiptNum = tx.receiptNumber || `DEC-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const approvedAtFormatted = new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const qrPayload = `https://densuredconsult.ng/verify-receipt?receipt=${receiptNum}&ref=${tx.reference}&student=${encodeURIComponent(student.fullName)}&reg=${student.registrationNumber}&shift=${shift}&month=${encodeURIComponent(monthPeriod)}&amount=${amount}&status=APPROVED`;

    const officialReceipt: OfficialReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      transactionReference: tx.reference,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentPhone: student.phone,
      registrationNumber: student.registrationNumber,
      program: student.program,
      studentShift: shift,
      amount,
      amountInWords,
      currency: 'NGN',
      monthPeriod,
      validUntil,
      issueDate: tx.timestamp,
      approvedBy: 'Dr. Anthony Adeleke (Director of Academic Affairs)',
      approvedAt: approvedAtFormatted,
      qrPayload,
      status: 'Approved',
      paymentMethod: tx.paymentMethod,
    };

    // Update Transaction
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'Successful',
              receiptNumber: receiptNum,
              approvedAt: approvedAtFormatted,
              approvedBy: officialReceipt.approvedBy,
              qrPayload,
            }
          : t
      )
    );

    // Update Student Profile
    const expiryDateFormatted = `${lastDayOfMonth.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}, 11:59 PM`;

    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === student.id) {
          const updated: StudentProfile = {
            ...s,
            studentShift: shift,
            monthlyFee: amount,
            subscriptionStatus: 'Active',
            subscriptionExpiryDate: expiryDateFormatted,
            subscriptionMonth: monthPeriod,
            lastApprovedReceipt: officialReceipt,
            tuitionPaid: s.tuitionPaid + amount,
            tuitionBalance: Math.max(0, s.tuitionBalance - amount),
          };
          if (currentStudent.id === s.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );

    addAuditLog(
      'Monthly Tuition Approved',
      `Payment #${tx.reference} (₦${amount.toLocaleString()}) approved for ${student.fullName}. Official Receipt ${receiptNum} generated.`
    );

    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#028D3B', '#25166B', '#FFC600', '#098CD0'],
      });
    } catch {
      // Ignore
    }

    showToast(
      'success',
      'Payment Approved & Cleared!',
      `Receipt ${receiptNum} generated for ${student.fullName}. Portal features unlocked!`
    );

    return officialReceipt;
  };

  const rejectTuitionPayment = (transactionId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'Failed' } : t))
    );

    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === tx.studentId) {
          const updated: StudentProfile = {
            ...s,
            subscriptionStatus: 'Unpaid',
          };
          if (currentStudent.id === s.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );

    addAuditLog('Payment Rejected', `Payment #${tx.reference} for student ID ${tx.studentId} was rejected. ${reason || ''}`);
    showToast('error', 'Payment Rejected', `Payment #${tx.reference} was rejected.`);
  };

  const updateStudentShift = (studentId: string, shift: StudentShift) => {
    const fee = shift === 'Morning' ? 20000 : 15000;
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = { ...s, studentShift: shift, monthlyFee: fee };
          if (currentStudent.id === s.id) {
            setCurrentStudent(updated);
          }
          return updated;
        }
        return s;
      })
    );
    showToast('info', 'Shift Updated', `Student assigned to ${shift} Shift (₦${fee.toLocaleString()}/month).`);
  };

  const isStudentSubscriptionActive = (student: StudentProfile): boolean => {
    if (!student) return false;
    if (student.subscriptionStatus !== 'Active') return false;
    const now = new Date();
    const currentMonthYear = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (student.subscriptionMonth && student.subscriptionMonth !== currentMonthYear) {
      return false;
    }
    return true;
  };

  // Official Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<OfficialReceipt | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const openReceiptModal = (receipt: OfficialReceipt) => {
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedReceipt(null);
  };

  const openPaymentModal = (amount: number, description: string, studentId?: string) => {
    setActivePaymentModal({
      isOpen: true,
      amount,
      description,
      studentId: studentId || currentStudent.id,
    });
  };

  const closePaymentModal = () => {
    setActivePaymentModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        navigateTo,
        studentTab,
        setStudentTab,
        adminTab,
        setAdminTab,
        userRole,
        setUserRole,

        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,

        isStudentLoggedIn,
        loginStudent,
        logoutStudent,

        currentStudent,
        setCurrentStudent,
        studentsList,
        addStudent,
        deleteStudent,
        switchStudent,

        applications,
        submitAdmission,
        updateApplicationStatus,

        lessons,
        addLesson,

        transactions,
        processPayment,

        // Monthly Tuition & Receipt Modal
        submitMonthlyTuition,
        approveTuitionPayment,
        rejectTuitionPayment,
        updateStudentShift,
        isStudentSubscriptionActive,
        selectedReceipt,
        isReceiptModalOpen,
        openReceiptModal,
        closeReceiptModal,

        announcements,
        addAnnouncement,

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

        monthlyPaymentSubmissions,
        submitMonthlyPayment,
        approveMonthlyPaymentSubmission,
        rejectMonthlyPaymentSubmission,

        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        galleryCategories,
        addGalleryCategory,
        deleteGalleryCategory,

        cbtExams,
        addCBTExam,
        cbtAttempts,
        recordCBTAttempt,

        attendanceSessions,
        saveAttendanceSession,
        recordIndividualStudentAttendance,

        auditLogs,
        addAuditLog,
        adminUsers,
        addAdminUser,
        deleteAdminUser,

        toasts,
        showToast,
        removeToast,
        activePaymentModal,
        openPaymentModal,
        closePaymentModal,
      }}
    >
      {children}
      <OfficialReceiptModal
        receipt={selectedReceipt}
        isOpen={isReceiptModalOpen}
        onClose={closeReceiptModal}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
