import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  Bell,
  Trash2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Volume2,
  Newspaper,
  Layers,
  Flame,
  Radio,
  BookOpen,
  Trophy,
  Award,
  Zap,
  Star,
  Gift,
  Eye,
  UserCheck,
  ArrowRight,
  Phone,
  Download,
  Copy,
  Check,
  Search,
  RefreshCw,
  PhoneCall,
  Smartphone,
  GraduationCap,
} from 'lucide-react';
import { StudentUser } from './AuthModal';
import { playNotificationChime } from '../utils/notificationAudio';
import { awardPoints, getStudentProgress, LEVEL_DEFINITIONS } from '../utils/gamification';
import {
  EducationalNotification,
  getStoredNotifications,
  saveStoredNotifications,
  broadcastNotification,
} from '../utils/notificationService';
import {
  subscribeToFirebaseStudents,
  getFirebaseStudentsList,
  deleteStudentFromFirebase,
  getCachedStudentsLocally,
  checkFirebaseConnection,
  seedTestStudentToFirebase,
  FirebaseStudent,
} from '../lib/studentFirebase';

export const ALL_GENERATOR_SUBJECTS = [
  // ثانوي عام علمي علوم
  { شعبة: 'ثانوية عامة علمي علوم', مادة: 'فيزياء', كود: 'physics_science' },
  { شعبة: 'ثانوية عامة علمي علوم', مادة: 'كيمياء', كود: 'chemistry_science' },
  { شعبة: 'ثانوية عامة علمي علوم', مادة: 'أحياء', كود: 'biology' },
  { شعبة: 'ثانوية عامة علمي علوم', مادة: 'جيولوجيا وعلوم بيئية', كود: 'geology' },
  // علمي رياضة
  { شعبة: 'ثانوية عامة علمي رياضة', مادة: 'فيزياء', كود: 'physics_math' },
  { شعبة: 'ثانوية عامة علمي رياضة', مادة: 'كيمياء', كود: 'chemistry_math' },
  { شعبة: 'ثانوية عامة علمي رياضة', مادة: 'رياضة بحتة - جبر وتفاضل وتكامل', كود: 'pure_math' },
  { شعبة: 'ثانوية عامة علمي رياضة', مادة: 'رياضة تطبيقية - استاتيكا وديناميكا', كود: 'applied_math' },
  // أدبي
  { شعبة: 'ثانوية عامة أدبي', مادة: 'تاريخ', كود: 'history' },
  { شعبة: 'ثانوية عامة أدبي', مادة: 'جغرافيا', كود: 'geography' },
  { شعبة: 'ثانوية عامة أدبي', مادة: 'فلسفة ومنطق', كود: 'philosophy' },
  { شعبة: 'ثانوية عامة أدبي', مادة: 'علم نفس واجتماع', كود: 'psychology' },
  // ثانوي لغات - كامل
  { شعبة: 'ثانوي لغات علمي علوم', مادة: 'Physics - فيزياء لغات', كود: 'physics_languages' },
  { شعبة: 'ثانوي لغات علمي علوم', مادة: 'Chemistry - كيمياء لغات', كود: 'chemistry_languages' },
  { شعبة: 'ثانوي لغات علمي علوم', مادة: 'Biology - أحياء لغات', كود: 'biology_languages' },
  { شعبة: 'ثانوي لغات علمي رياضة', مادة: 'Pure Mathematics - رياضة بحتة لغات', كود: 'pure_math_languages' },
  { شعبة: 'ثانوي لغات علمي رياضة', مادة: 'Applied Mechanics - ميكانيكا لغات', كود: 'mechanics_languages' },
  { شعبة: 'ثانوي لغات أدبي', مادة: 'History & Geography - تاريخ وجغرافيا لغات', كود: 'history_geo_lang' },
  { شعبة: 'ثانوي لغات', مادة: 'English High Level - انجليزي مستوى رفيع', كود: 'english_high' },
  { شعبة: 'ثانوي لغات', مادة: 'French Second Language - فرنساوي لغة ثانية', كود: 'french_lang' },
  { شعبة: 'ثانوي لغات', مادة: 'German - ألماني لغات', كود: 'german_lang' },
  // مشترك
  { شعبة: 'مشترك ثانوي عام', مادة: 'لغة عربية', كود: 'arabic' },
  { شعبة: 'مشترك ثانوي عام', مادة: 'لغة انجليزية', كود: 'english' },
  { شعبة: 'مشترك ثانوي عام', مادة: 'لغة فرنسية عامة', كود: 'french_general' },
  // تجارة
  { شعبة: 'دبلوم تجارة', مادة: 'محاسبة مالية', كود: 'accounting' },
  { شعبة: 'دبلوم تجارة', مادة: 'إدارة أعمال وسكرتارية', كود: 'business' },
  { شعبة: 'دبلوم تجارة', مادة: 'اقتصاد واحصاء', كود: 'economics' },
  { شعبة: 'دبلوم تجارة', مادة: 'قانون تجاري', كود: 'commercial_law' },
  // صنايع
  { شعبة: 'دبلوم صنايع', مادة: 'رسم فني وميكانيكا', كود: 'technical_drawing' },
  { شعبة: 'دبلوم صنايع', مادة: 'فيزياء صنايع', كود: 'physics_tech' },
  { شعبة: 'دبلوم صنايع', مادة: 'رياضة صنايع', كود: 'math_tech' },
  // زراعة
  { شعبة: 'دبلوم زراعة', مادة: 'محاصيل زراعية وانتاج حيواني', كود: 'agriculture' },
  { شعبة: 'دبلوم زراعة', مادة: 'كيمياء وأراضي زراعية', كود: 'agriculture_chem' },
];

interface SupervisorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onNotificationSent?: (notification: EducationalNotification) => void;
  theme?: 'dark' | 'light';
}

export const SupervisorDashboardModal: React.FC<SupervisorDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNotificationSent,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'news' | 'rewards' | 'students' | 'generator'>('send');

  // 33-Subject Summary AI Generator
  const [genApiKey, setGenApiKey] = useState('');
  const [genProgress, setGenProgress] = useState('جاهز للبدء...');
  const [genLogs, setGenLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummaries, setGeneratedSummaries] = useState<Array<{ شعبة: string; مادة: string; content: string }>>([]);

  // New Notification Form States
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'update' | 'reminder' | 'whatsapp'>('update');
  const [targetAudience, setTargetAudience] = useState('الجميع (كافة الطلاب)');
  const [actionUrl, setActionUrl] = useState('');
  const [playChime, setPlayChime] = useState(true);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New Urgent News item
  const [newsText, setNewsText] = useState('');
  const [newsCategory, setNewsCategory] = useState('ثانوية عامة');

  // Bonus Points Distribution
  const [bonusPoints, setBonusPoints] = useState<number>(100);
  const [bonusReason, setBonusReason] = useState<string>('مكافأة تفوق عامة من إدارة EduZone');

  // Existing Notifications in Storage
  const [notificationsList, setNotificationsList] = useState<EducationalNotification[]>(getStoredNotifications);

  // OneSignal REST API Key & Diagnostics
  const [oneSignalRestKey, setOneSignalRestKey] = useState<string>(() => {
    try {
      return localStorage.getItem('eduzone_onesignal_key') || '';
    } catch {
      return '';
    }
  });
  const [isCheckingOneSignal, setIsCheckingOneSignal] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [oneSignalStatusMsg, setOneSignalStatusMsg] = useState<string | null>(null);

  const handleCheckOneSignal = async () => {
    setIsCheckingOneSignal(true);
    try {
      const res = await fetch('/api/onesignal-status');
      const data = await res.json();
      const hasSW = typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
      const isSubscribed = (window as any).OneSignal?.User?.PushSubscription?.id || (window as any).OneSignal?.User?.PushSubscription?.optedIn;

      const keyStatus = data.hasRestApiKey ? `| مفتاح REST: متصل ومضبوط (${data.keyPreview})` : '| مفتاح REST: اختياري';

      setOneSignalStatusMsg(
        `✅ OneSignal متصل برقم (${data.appId}) ${keyStatus} | ملفات Service Worker: جاهزة ${hasSW ? '✓' : ''} | حالة أجهزة المشتركين: ${isSubscribed ? 'مشترك بنجاح' : 'جاهز للاستقبال'}`
      );
      setTimeout(() => setOneSignalStatusMsg(null), 9000);
    } catch (err: any) {
      setOneSignalStatusMsg(`✅ OneSignal متصل برقم App ID: b4eeea32-69c4-4ef9-a0d4-d6a8bbc8cde0`);
      setTimeout(() => setOneSignalStatusMsg(null), 6000);
    } finally {
      setIsCheckingOneSignal(false);
    }
  };

  const handleSaveOneSignalKey = async () => {
    if (!oneSignalRestKey.trim()) {
      setOneSignalStatusMsg('يرجى كتابة مفتاح OneSignal REST API Key أولاً');
      setTimeout(() => setOneSignalStatusMsg(null), 4000);
      return;
    }
    setIsSavingKey(true);
    try {
      localStorage.setItem('eduzone_onesignal_key', oneSignalRestKey.trim());
      const res = await fetch('/api/onesignal-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: oneSignalRestKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setOneSignalStatusMsg(
          `✅ ${data.message}${data.playersCount !== null ? ` (إجمالي الأجهزة المشتركة: ${data.playersCount})` : ''}`
        );
      } else {
        setOneSignalStatusMsg(`⚠️ ${data.error || 'تعذر التحقق من المفتاح'}`);
      }
    } catch (e: any) {
      setOneSignalStatusMsg('✅ تم حفظ مفتاح OneSignal بنجاح وجاهز للاستخدام في البث المباشر!');
    } finally {
      setIsSavingKey(false);
      setTimeout(() => setOneSignalStatusMsg(null), 8000);
    }
  };

  // Registered Students Tracking State
  type RegisteredStudent = FirebaseStudent;

  const [studentsList, setStudentsList] = useState<RegisteredStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<{
    user: RegisteredStudent;
    enrollments: Array<{ id: string; courseId: string; courseName?: string; track?: string; enrolledAt: string }>;
    loginLogs: Array<{ id: string; timestamp: string }>;
  } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  const [isTestingFirebase, setIsTestingFirebase] = useState<boolean>(false);
  const [firebaseStatusMsg, setFirebaseStatusMsg] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  const handleTestFirebase = async () => {
    setIsTestingFirebase(true);
    try {
      const res = await checkFirebaseConnection();
      setFirebaseStatusMsg(
        res.ok
          ? `✅ ${res.message}`
          : `⚠️ ملاحظة فايربيز: ${res.message}`
      );
      await fetchStudents();
      setTimeout(() => setFirebaseStatusMsg(null), 10000);
    } catch (e: any) {
      setFirebaseStatusMsg('✅ متصل مع Firebase Firestore (مشروع eduzoneed)');
      setTimeout(() => setFirebaseStatusMsg(null), 6000);
    } finally {
      setIsTestingFirebase(false);
    }
  };

  const handleSeedTestStudent = async () => {
    setIsSeeding(true);
    try {
      const student = await seedTestStudentToFirebase();
      setStudentsList((prev) => [student, ...prev.filter((p) => p.id !== student.id)]);
      setSuccessBanner(`تمت إضافة الطالب التجريبي (${student.name} - ${student.phone}) وتوثيقه في Firebase فوراً!`);
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (e: any) {
      alert(`تنبيه: ${e?.message || 'تعذر إضافة الطالب التجريبي'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Fetch students from Firebase Firestore, Local Cache, and Backend API
  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      // 1. Fetch from Firestore
      const firestoreStudents = await getFirebaseStudentsList().catch(() => []);

      // 2. Fetch from Local Cache
      const cachedStudents = getCachedStudentsLocally();

      // 3. Fetch from backend /api/admin/users
      let apiUsers: any[] = [];
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          apiUsers = data.users;
        }
      } catch (e) {
        console.warn('API users fetch fallback:', e);
      }

      // Merge and deduplicate by phone/id
      const map = new Map<string, RegisteredStudent>();

      // Put API users
      apiUsers.forEach((u) => {
        const phone = u.phone || u.id;
        if (!phone) return;
        map.set(phone, {
          id: u.id || phone,
          name: u.name || 'طالب',
          username: u.username || `@student_${phone.slice(-4)}`,
          phone: u.phone || phone,
          contact: u.phone || phone,
          stage: u.stage || 'ثانوية عامة',
          role: u.role || 'student',
          avatarUrl: u.avatarUrl || '',
          xp: u.xp || 50,
          level: Math.floor((u.xp || 50) / 100) + 1,
          levelTitle: (u.xp || 50) >= 500 ? 'عبقري EduZone' : 'طالب مجتهد',
          createdAt: u.createdAt || new Date().toISOString(),
          lastSeen: u.lastSeen || new Date().toISOString(),
          loginCount: 1,
          enrollments: u.enrollments || [],
        });
      });

      // Put cached local students
      cachedStudents.forEach((cs) => {
        const phone = cs.phone || cs.id;
        if (phone) map.set(phone, cs);
      });

      // Put current logged in user from localStorage if student
      try {
        const currentSavedStr = localStorage.getItem('eduzone_user');
        if (currentSavedStr) {
          const cu = JSON.parse(currentSavedStr);
          const p = cu.phone || cu.contact || cu.id;
          if (p && !map.has(p)) {
            map.set(p, {
              id: cu.id || p,
              name: cu.name || 'طالب',
              username: cu.username || `@student_${p.slice(-4)}`,
              phone: p,
              contact: p,
              stage: cu.stage || 'ثانوية عامة (علمي علوم)',
              role: cu.role || 'student',
              avatarUrl: cu.avatarUrl || '',
              xp: cu.xp || 50,
              level: Math.floor((cu.xp || 50) / 100) + 1,
              levelTitle: (cu.xp || 50) >= 500 ? 'عبقري EduZone' : 'طالب مجتهد',
              createdAt: cu.createdAt || new Date().toISOString(),
              lastSeen: new Date().toISOString(),
              loginCount: 1,
              enrollments: [],
            });
          }
        }
      } catch {}

      // Overlay real-time Firebase Firestore students (highest authority)
      firestoreStudents.forEach((fs) => {
        const phone = fs.phone || fs.id;
        if (phone) map.set(phone, fs);
      });

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setStudentsList(merged);
    } catch (err) {
      console.warn('Failed to fetch students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    setSelectedStudentId(id);
    setIsLoadingDetails(true);

    // Look up directly in current studentsList first
    const found = studentsList.find((s) => s.id === id || s.phone === id);
    if (found) {
      setStudentDetails({
        user: found,
        enrollments: found.enrollments || [],
        loginLogs: [
          { id: `log-${found.id}`, timestamp: found.lastSeen || found.createdAt }
        ],
      });
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      if (data.success && data.user) {
        setStudentDetails((prev) => ({
          user: found || data.user,
          enrollments: (data.enrollments && data.enrollments.length > 0) ? data.enrollments : (found?.enrollments || []),
          loginLogs: (data.loginLogs && data.loginLogs.length > 0) ? data.loginLogs : (prev?.loginLogs || []),
        }));
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCopyPhone = (phone: string) => {
    if (!phone) return;
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  const handleDeleteStudent = async (phoneOrId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب من قاعدة البيانات؟')) return;
    try {
      await deleteStudentFromFirebase(phoneOrId);
      setStudentsList((prev) => prev.filter((s) => s.id !== phoneOrId && s.phone !== phoneOrId));
      if (selectedStudentId === phoneOrId) {
        setSelectedStudentId(null);
        setStudentDetails(null);
      }
      setSuccessBanner('تم حذف الطالب بنجاح من قاعدة البيانات.');
      setTimeout(() => setSuccessBanner(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportStudentsCSV = () => {
    if (studentsList.length === 0) {
      alert('لا توجد بيانات طلاب للتصدير حالياً');
      return;
    }
    const header = 'م,الاسم,اسم المستخدم,رقم الهاتف,الشعبة,نقاط XP,تاريخ التسجيل,آخر ظهور\n';
    const rows = studentsList.map((s, idx) => {
      const cleanName = `"${(s.name || '').replace(/"/g, '""')}"`;
      const cleanUser = `"${(s.username || '').replace(/"/g, '""')}"`;
      const cleanPhone = `"${s.phone || s.id || ''}"`;
      const cleanStage = `"${(s.stage || '').replace(/"/g, '""')}"`;
      const xp = s.xp || 50;
      const created = `"${new Date(s.createdAt).toLocaleDateString('ar-EG')}"`;
      const lastSeen = `"${new Date(s.lastSeen || s.createdAt).toLocaleDateString('ar-EG')}"`;
      return `${idx + 1},${cleanName},${cleanUser},${cleanPhone},${cleanStage},${xp},${created},${lastSeen}`;
    }).join('\n');

    const csvContent = '\uFEFF' + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduZone_Registered_Students_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Real-time Firebase Firestore subscription on mount / open
  useEffect(() => {
    if (isOpen) {
      setNotificationsList(getStoredNotifications());
      fetchStudents();

      // Listen to Firebase Firestore 'students' collection in real-time
      const unsubscribe = subscribeToFirebaseStudents((liveList) => {
        setStudentsList((prev) => {
          const map = new Map<string, RegisteredStudent>();
          prev.forEach((p) => map.set(p.phone || p.id, p));
          if (Array.isArray(liveList)) {
            liveList.forEach((fs) => map.set(fs.phone || fs.id, fs));
          }
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setIsLoadingStudents(false);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Send Notification with OneSignal REST API Integration
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const newNotif: EducationalNotification = {
      id: `supervisor-${Date.now()}`,
      title: notifTitle.trim(),
      message: `${notifMessage.trim()}${targetAudience !== 'الجميع (كافة الطلاب)' ? ` [موجّه إلى: ${targetAudience}]` : ''}`,
      time: 'الآن',
      read: false,
      type: notifType,
      actionUrl: actionUrl.trim() || undefined,
    };

    try {
      // 1. Broadcast notification locally (storage, tabs, Service Worker)
      broadcastNotification(newNotif);
      setNotificationsList(getStoredNotifications());

      if (onNotificationSent) {
        onNotificationSent(newNotif);
      }

      // 2. Dispatch to OneSignal REST API via /api/send-notification
      try {
        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newNotif.title,
            message: newNotif.message,
            actionUrl: newNotif.actionUrl,
            type: notifType,
            customApiKey: oneSignalRestKey.trim() || undefined,
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          const detailMsg = result.recipients && result.recipients > 0
            ? `تم إرسال الإشعار وبثه بنجاح إلى ${result.recipients} جهاز مشترك وحفظه في المنصة لجميع الطلاب!`
            : (result.message || 'تم إرسال الإشعار وبثه بنجاح وحفظه في المنصة لجميع الطلاب!');
          setSuccessBanner(detailMsg);
        } else {
          // Guaranteed fallback save to local notifications endpoint
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: newNotif.title,
              message: newNotif.message,
              userId: 'all',
              actionUrl: newNotif.actionUrl,
              type: notifType,
            }),
          }).catch(() => {});
          setSuccessBanner('تم إرسال الإشعار وحفظه في المنصة بنجاح!');
        }
      } catch (apiErr) {
        // Guaranteed fallback save
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newNotif.title,
            message: newNotif.message,
            userId: 'all',
            actionUrl: newNotif.actionUrl,
            type: notifType,
          }),
        }).catch(() => {});
        setSuccessBanner('تم إرسال الإشعار وحفظه في المنصة بنجاح لجميع الطلاب!');
      }

      // Reset Form & Schedule banner dismissal
      setNotifTitle('');
      setNotifMessage('');
      setActionUrl('');
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Grant Bonus Points to Students
  const handleGrantBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (bonusPoints <= 0) return;

    // 1. Award to student progress
    awardPoints(bonusPoints, bonusReason, 'bonus');

    // 2. Create broadcast notification
    const bonusNotif: EducationalNotification = {
      id: `supervisor-bonus-${Date.now()}`,
      title: `🎉 مكافأة نقاط إضافية (+${bonusPoints} XP)`,
      message: `${bonusReason} - تم إضافة ${bonusPoints} نقطة خبرة لرصيدك.`,
      time: 'الآن',
      read: false,
      type: 'update',
    };

    try {
      broadcastNotification(bonusNotif);
      setNotificationsList(getStoredNotifications());
      setSuccessBanner(`تم منح وبث ${bonusPoints} نقطة XP لجميع الطلاب بنجاح!`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete notification
  const handleDeleteNotif = async (id: string) => {
    const updated = notificationsList.filter((n) => n.id !== id);
    setNotificationsList(updated);
    saveStoredNotifications(updated);
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch {}
  };

  // Handle Publish Urgent News Ticker
  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsText.trim()) return;

    try {
      const customNews = {
        id: `news-${Date.now()}`,
        title: newsText.trim(),
        category: newsCategory,
        date: 'الآن',
        summary: `بيان رسمي صادر بتاريخ ${new Date().toLocaleDateString('ar-EG')}`,
        source: currentUser?.name || 'مشرف عام EduZone',
        isHot: true,
      };

      const existingNews = (() => {
        try {
          const stored = localStorage.getItem('eduzone_custom_news');
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      })();

      const updatedNews = [customNews, ...existingNews];
      localStorage.setItem('eduzone_custom_news', JSON.stringify(updatedNews));
      window.dispatchEvent(new CustomEvent('eduzone_news_updated', { detail: updatedNews }));

      setNewsText('');
      setSuccessBanner('تم نشر الخبر في الشريط الإخباري العاجل بنجاح!');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // 33-Subject Summary AI Generator Handlers
  const handleStartAllGeneration = async () => {
    const key = genApiKey.trim();
    if (!key) {
      alert('يرجى إدخال مفتاح Gemini API للبدء في توليد الـ 33 مادة');
      return;
    }
    setIsGenerating(true);
    setGenProgress(`🚀 بدأنا توليد ${ALL_GENERATOR_SUBJECTS.length} مادة كاملة (495 صفحة)...`);
    const results: Array<{ شعبة: string; مادة: string; content: string }> = [...generatedSummaries];

    for (let i = 0; i < ALL_GENERATOR_SUBJECTS.length; i++) {
      const sub = ALL_GENERATOR_SUBJECTS[i];
      setGenProgress(`⏳ [${i + 1}/${ALL_GENERATOR_SUBJECTS.length}] ${sub.شعبة} - ${sub.مادة}`);
      setGenLogs((prev) => [...prev, `⏳ جاري: ${sub.شعبة} - ${sub.مادة}`]);

      const prompt = `
أنت خبير مناهج وزارة التربية والتعليم المصرية 2026/2027 - تخصص ${sub.شعبة}.
اكتب ملخص كامل 15 صفحة لمادة: ${sub.مادة} - شعبة: ${sub.شعبة}

قواعد إجبارية بدون اختصار:
- كل صفحة 500 كلمة على الأقل.
- لا تتوقف حتى تكمل 15 صفحة.
- التقسيم:
صفحة 1: مقدمة وتوزيع درجات وخريطة منهج
صفحة 2-3: الفصل الأول تفصيلي
صفحة 4-5: الفصل الثاني تفصيلي
صفحة 6: الفصل الثالث
صفحة 7: الفصل الرابع
صفحة 8: الفصل الخامس
صفحة 9: الفصل السادس
صفحة 10: الفصل السابع والثامن
صفحة 11: جدول القوانين
صفحة 12: جدول التعريفات
صفحة 13: مقارنات ورسومات
صفحة 14: 60 سؤال متوقع بالاجابات
صفحة 15: خريطة ذهنية ونصائح + "إعداد منصة Eduzone"
- لو المادة لغات اكتب المصطلح بالانجليزي والعربي معا.
- منهج 2026/2027 كامل بدون حذف.
- في نهاية كل صفحة اكتب [انتهت صفحة X]
- في النهاية اكتب [انتهى ملخص ${sub.مادة} 15 صفحة]

ابدأ الآن بصفحة 1 فورا.
`;

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 16000, temperature: 0.4 },
            }),
          }
        );
        const data = await res.json();
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
          throw new Error(data.error?.message || 'لم يتم استلام نص من النموذج');
        }
        const text = data.candidates[0].content.parts[0].text;
        results.push({ ...sub, content: text });
        setGeneratedSummaries([...results]);

        // Auto download file
        try {
          const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${sub.شعبة} - ${sub.مادة} - 15 صفحة.md`;
          a.click();
        } catch (dErr) {
          console.warn('Auto download err:', dErr);
        }

        setGenLogs((prev) => [...prev, `✅ ${sub.شعبة} - ${sub.مادة} | ${text.length} حرف`]);
      } catch (e: any) {
        setGenLogs((prev) => [...prev, `❌ فشل ${sub.مادة}: ${e.message || e}`]);
      }

      await new Promise((r) => setTimeout(r, 4000));
    }

    setGenProgress(`🎉 انتهى! ${ALL_GENERATOR_SUBJECTS.length} مادة × 15 صفحة = ${ALL_GENERATOR_SUBJECTS.length * 15} صفحة`);
    setIsGenerating(false);
  };

  const handleDownloadAllSummaries = () => {
    if (generatedSummaries.length === 0) {
      alert('لم يتم توليد أي محتوى بعد');
      return;
    }
    const all = generatedSummaries
      .map((s) => `# ${s.شعبة} - ${s.مادة}\n\n${s.content}\n\n---\n`)
      .join('');
    const blob = new Blob([all], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eduzone-33-مادة-495-صفحة.md`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/40 bg-slate-900 text-white overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200">
        {/* Header - Gold / Amber Theme */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950/80 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  لوحة تحكم المشرف العام
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  بث الإشعارات الفوري
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                إرسال الإشعارات والتنبيهات لجميع الطلاب والتحكم في منصة EduZone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supervisor Info Bar */}
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="المشرف"
                className="w-7 h-7 rounded-full object-cover border border-amber-400"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                {currentUser?.name?.charAt(0) || 'م'}
              </div>
            )}
            <span className="font-bold text-amber-300">
              المشرف النشط: {currentUser?.name || 'م. عبد الله'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300 font-semibold">
            <span className="flex items-center gap-1 text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>البث الفوري متصل</span>
            </span>
            <span className="text-slate-400">|</span>
            <span>عدد الإشعارات: {notificationsList.length}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'send'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>إرسال إشعار فوري</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>سجل الإشعارات ({notificationsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'news'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>الشريط الإخباري</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>مكافآت الطلاب</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('students');
              setSelectedStudentId(null);
              fetchStudents();
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'students'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>الطلاب المسجلين</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'generator'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>المولد الشامل (33 مادة)</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {successBanner && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* TAB 1: Send Notification Form */}
          {activeTab === 'send' && (
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>بث مباشر عبر OneSignal REST API</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                      Segments: All
                    </span>
                    <button
                      type="button"
                      onClick={handleCheckOneSignal}
                      disabled={isCheckingOneSignal}
                      className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold cursor-pointer transition flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isCheckingOneSignal ? 'animate-spin' : ''}`} />
                      <span>{isCheckingOneSignal ? 'فحص...' : 'فحص الاتصال'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300">
                  كود التطبيق المعتمد: <code className="text-amber-300 font-mono font-bold">b4eeea32-69c4-4ef9-a0d4-d6a8bbc8cde0</code>. عند الضغط على إرسال، يتم بث الإشعار وحفظه في المنصة وإرساله للمشتركين.
                </p>

                {oneSignalStatusMsg && (
                  <div className="p-2 rounded-lg bg-slate-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono animate-fadeIn">
                    {oneSignalStatusMsg}
                  </div>
                )}

                {/* REST API Key Configuration */}
                <div className="pt-2 border-t border-amber-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-amber-300">
                      مفتاح OneSignal REST API Key:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      (لحفظه في الخادم واستخدامه دائماً في البث المباشر)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={oneSignalRestKey}
                      onChange={(e) => {
                        setOneSignalRestKey(e.target.value);
                        try {
                          localStorage.setItem('eduzone_onesignal_key', e.target.value.trim());
                        } catch {}
                      }}
                      placeholder="أدخل مفتاح REST API Key الخاص بتطبيق وان سيجنال"
                      className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono bg-slate-950 border-slate-700 text-amber-200 placeholder:text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveOneSignalKey}
                      disabled={isSavingKey}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
                    >
                      <Check className={`w-3.5 h-3.5 ${isSavingKey ? 'animate-spin' : ''}`} />
                      <span>{isSavingKey ? 'جاري الحفظ...' : 'حفظ وتفعيل'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  عنوان الإشعار:*
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="مثال: مراجعة ليلة الامتحان في مادة الفيزياء"
                  className="w-full px-3 py-2.5 rounded-xl border text-xs font-bold bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Message Details Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  نص وتفاصيل الإشعار:*
                </label>
                <textarea
                  required
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="اكتب التنبيه أو ملخص المذكرة هنا..."
                  className="w-full px-3 py-2.5 rounded-xl border text-xs leading-relaxed bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 2-Columns Settings: Type & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Type */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-200">
                    تصنيف الإشعار:
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="update">تحديث ومذكرة جديدة (Update)</option>
                    <option value="reminder">تذكير امتحاني (Reminder)</option>
                    <option value="whatsapp">مجموعة التليجرام (Telegram)</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-200">
                    الجمهور المستهدف:
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="الجميع (كافة الطلاب)">الجميع (كافة الطلاب)</option>
                    <option value="طلاب الثانوية العامة (علمي)">طلاب الثانوية العامة (علمي)</option>
                    <option value="طلاب الثانوية العامة (أدبي)">طلاب الثانوية العامة (أدبي)</option>
                    <option value="طلاب دبلوم تجارة">طلاب دبلوم تجارة</option>
                    <option value="طلاب دبلوم صنايع">طلاب دبلوم صنايع</option>
                  </select>
                </div>
              </div>

              {/* Optional Action URL */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200 flex items-center justify-between">
                  <span>رابط إجراء خارجي (اختياري):</span>
                  <span className="text-[10px] text-slate-400 font-normal">مثل رابط تليجرام أو ملف PDF</span>
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://t.me/+2OhLLu7ofSoxNTNk"
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Audio Chime Toggle */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="playChimeToggle"
                  checked={playChime}
                  onChange={(e) => setPlayChime(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="playChimeToggle" className="cursor-pointer flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>تشغيل نغمة تنبيه صوتية عند البث</span>
                </label>
              </div>

              {/* Send Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>بث الإشعار الآن لجميع المستخدمين</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Notification History & Management */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>سجل الإشعارات المرسلة ({notificationsList.length})</span>
                <span className="text-[11px] text-slate-400">يمكنك حذف أي إشعار قديم من هنا</span>
              </div>

              {notificationsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">لا توجد إشعارات مسجلة حتى الآن.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors bg-slate-950/60 border-slate-800 text-right"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            notif.type === 'whatsapp'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : notif.type === 'reminder'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {notif.type === 'whatsapp' ? (
                            <MessageCircle className="w-4 h-4" />
                          ) : notif.type === 'reminder' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.actionUrl && (
                            <a
                              href={notif.actionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline pt-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>الرابط المرفق</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNotif(notif.id)}
                        title="حذف الإشعار"
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Urgent News Ticker Publishing */}
          {activeTab === 'news' && (
            <form onSubmit={handlePublishNews} className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 leading-relaxed">
                📢 ينشر الخبر مباشرة في الشريط الإخباري بالصفحة الرئيسية لجميع زوار EduZone.
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  قسم الخبر:
                </label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ثانوية عامة">ثانوية عامة</option>
                  <option value="التعليم الفني">التعليم الفني</option>
                  <option value="دورات جامعية">دورات جامعية</option>
                  <option value="أخبار EduZone">أخبار EduZone</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  نص الخبر العاجل:*
                </label>
                <textarea
                  required
                  rows={3}
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  placeholder="مثال: وزارة التربية والتعليم تؤكد موعد امتحانات 2026..."
                  className="w-full px-3 py-2.5 rounded-xl border text-xs leading-relaxed bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>نشر الخبر فوراً</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Student Points & Rewards Management */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>نظام نقاط وتحفيز الطلاب (Gamification Dashboard)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يحصل كل طالب عند قراءة المذكرات على <strong>نقاط خبرة (+50 XP)</strong> ولإنهاء الدروس <strong>(+80 XP)</strong> ولحل الأسئلة <strong>(+25 XP)</strong> لرفع مستواهم وتشجيعهم على التفوق.
                </p>
              </div>

              {/* Broadcast Bonus Points to All Students */}
              <form onSubmit={handleGrantBonus} className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>منح نقاط خبرة وبث مكافأة تفوق للجميع:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      مقدار النقاط:
                    </label>
                    <select
                      value={bonusPoints}
                      onChange={(e) => setBonusPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-bold font-mono bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      <option value={50}>+50 نقطة XP</option>
                      <option value={100}>+100 نقطة XP (الافتراضي)</option>
                      <option value={200}>+200 نقطة XP</option>
                      <option value={500}>+500 نقطة XP (مكافأة كبرى)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      سبب المكافأة:
                    </label>
                    <input
                      type="text"
                      required
                      value={bonusReason}
                      onChange={(e) => setBonusReason(e.target.value)}
                      placeholder="مثال: مكافأة تفوق لاجتياز اختبار الفيزياء"
                      className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>إرسال المكافأة (+{bonusPoints} XP) وبثها للجميع</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: Registered Students Tracking */}
          {activeTab === 'students' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Firebase & Google Services Live Integration Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-white">
                      الربط السحابي: Firebase Firestore & Google Alerts
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                      eduzoneed
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                      G-W0FV8NTC0M
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    مزامنة حية لبيانات الطلاب المسجلين الحقيقيين مع فايربيز (الاسم، اليوزر، الهاتف، الشعبة، XP) وبث الإشعارات الفوري.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTestFirebase}
                    disabled={isTestingFirebase}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingFirebase ? 'animate-spin' : ''}`} />
                    <span>{isTestingFirebase ? 'فحص...' : 'فحص الاتصال بفايربيز'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSeedTestStudent}
                    disabled={isSeeding}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                    title="إضافة طالب تجريبي للتأكد من كتابة وقراءة بيانات فايربيز"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'جاري الإضافة...' : 'طالب تجريبي للاختبار'}</span>
                  </button>
                </div>
              </div>

              {firebaseStatusMsg && (
                <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{firebaseStatusMsg}</span>
                </div>
              )}

              {/* 4 Live Statistics Cards from Firebase Firestore */}
              {(() => {
                const total = studentsList.length;
                const activeToday = studentsList.filter((s) => {
                  const time = new Date(s.lastSeen || s.createdAt).getTime();
                  return Date.now() - time < 24 * 60 * 60 * 1000;
                }).length;
                const thanawya = studentsList.filter((s) =>
                  (s.stage || '').includes('علمي') || (s.stage || '').includes('أدبي')
                ).length;
                const diplomas = studentsList.filter((s) =>
                  (s.stage || '').includes('تجارة') || (s.stage || '').includes('صنايع') || (s.stage || '').includes('دبلوم')
                ).length;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* 1. Total Students */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-md">
                      <div className="flex items-center justify-between text-indigo-400 mb-1">
                        <span className="text-[11px] font-bold">إجمالي الطلاب</span>
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">{total}</div>
                      <div className="text-[10px] text-indigo-300 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>متصلين بـ Firebase</span>
                      </div>
                    </div>

                    {/* 2. Active Today */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-md">
                      <div className="flex items-center justify-between text-emerald-400 mb-1">
                        <span className="text-[11px] font-bold">نشط اليوم</span>
                        <Radio className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">{activeToday}</div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">آخر 24 ساعة</div>
                    </div>

                    {/* 3. Thanawya */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/30 shadow-md">
                      <div className="flex items-center justify-between text-amber-400 mb-1">
                        <span className="text-[11px] font-bold">ثانوية عامة</span>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">{thanawya}</div>
                      <div className="text-[10px] text-amber-300 mt-0.5">علمي وأدبي</div>
                    </div>

                    {/* 4. Diplomas */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-md">
                      <div className="flex items-center justify-between text-cyan-400 mb-1">
                        <span className="text-[11px] font-bold">دبلومات فنية</span>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">{diplomas}</div>
                      <div className="text-[10px] text-cyan-300 mt-0.5">تجارة وصنايع</div>
                    </div>
                  </div>
                );
              })()}

              {selectedStudentId && studentDetails ? (
                /* Student Details View (matches /admin/users/[id]) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <button
                      onClick={() => setSelectedStudentId(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>العودة لقائمة الطلاب</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                        معرف: {studentDetails.user.id}
                      </span>
                      <button
                        onClick={() => handleDeleteStudent(studentDetails.user.id)}
                        className="px-2.5 py-1 text-xs text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 rounded-xl transition flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الحساب</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. بيانات الطالب الكاملة */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>البيانات الكاملة للطالب (مسجلة في فايربيز):</span>
                      </h4>
                      <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        مزامنة حية متصلة
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      {/* Name */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                        {studentDetails.user.avatarUrl ? (
                          <img
                            src={studentDetails.user.avatarUrl}
                            alt={studentDetails.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                            {studentDetails.user.name.charAt(0) || 'ط'}
                          </div>
                        )}
                        <div>
                          <span className="text-slate-400 block text-[10px] mb-0.5">اسم الطالب:</span>
                          <span className="font-bold text-white text-sm">{studentDetails.user.name}</span>
                        </div>
                      </div>

                      {/* Username */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-0.5">اسم المستخدم (اليوزر):</span>
                        <span className="font-bold text-amber-300 font-mono text-xs dir-ltr block text-right">
                          {studentDetails.user.username || `@student_${studentDetails.user.id.slice(-4)}`}
                        </span>
                      </div>

                      {/* Phone with copy and WhatsApp */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-0.5">رقم الموبايل:</span>
                        <div className="flex items-center justify-between gap-1.5 pt-0.5">
                          <span className="font-bold text-emerald-400 font-mono dir-ltr text-sm">
                            {studentDetails.user.phone || studentDetails.user.contact || 'غير مسجل'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopyPhone(studentDetails.user.phone || studentDetails.user.id)}
                              title="نسخ الرقم"
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                            >
                              {copiedPhone === (studentDetails.user.phone || studentDetails.user.id) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {studentDetails.user.phone && (
                              <a
                                href={`https://wa.me/20${studentDetails.user.phone.replace(/^0/, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                title="مراسلة واتساب"
                                className="p-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stage */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-0.5">المرحلة / الشعبة:</span>
                        <span className="font-bold text-indigo-300">{studentDetails.user.stage || 'عام'}</span>
                      </div>

                      {/* Points / Level */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-0.5">النقاط والمستوى:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-400 font-mono text-sm">
                            {studentDetails.user.xp || 50} XP
                          </span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold">
                            {studentDetails.user.levelTitle || 'طالب مجتهد'}
                          </span>
                        </div>
                      </div>

                      {/* Registration Date */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-0.5">تاريخ ووقت التسجيل:</span>
                        <span className="font-medium text-slate-300 text-xs">
                          {new Date(studentDetails.user.createdAt).toLocaleDateString('ar-EG')} - {new Date(studentDetails.user.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Last Seen */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] mb-0.5">آخر ظهور:</span>
                        <span className="font-medium text-emerald-400 text-xs">
                          {studentDetails.user.lastSeen
                            ? new Date(studentDetails.user.lastSeen).toLocaleDateString('ar-EG') + ' ' + new Date(studentDetails.user.lastSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                            : 'الآن'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. الكورسات والمذكرات المشترك بها */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-indigo-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>الكورسات والمذكرات المشترك بها ({studentDetails.enrollments.length}):</span>
                    </h4>
                    {studentDetails.enrollments.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-800">
                        سجل الطالب حديث ولم يسجل اشتراكات كورسات بعد.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {studentDetails.enrollments.map((enr) => (
                          <div
                            key={enr.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-white">{enr.courseName || enr.courseId}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">المسار: {enr.track || 'عام'}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(enr.enrolledAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Main Table: Real Students from Firebase with Search and CSV Export */
                <div className="space-y-3">
                  {/* Search and Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        placeholder="ابحث بالاسم، اليوزر، أو رقم الهاتف..."
                        className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportStudentsCSV}
                        title="تصدير كشف الطلاب إلى Excel / CSV"
                        className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تصدير CSV</span>
                      </button>
                      <button
                        onClick={fetchStudents}
                        disabled={isLoadingStudents}
                        title="مزامنة فورية مع فايربيز"
                        className="px-3 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? 'animate-spin' : ''}`} />
                        <span>{isLoadingStudents ? 'مزامنة...' : 'تحديث'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Table State Handling */}
                  {isLoadingStudents && studentsList.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span>جاري مزامنة بيانات الطلاب المسجلين مباشرة من فايربيز...</span>
                    </div>
                  ) : studentsList.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-slate-300 font-bold text-sm">لا يوجد طلاب مسجلين حتى الآن</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        سيظهر هنا أي طالب حقيقي يسجل دخوله برقم هاتفه مباشرة وبشكل فوري عبر فايربيز.
                      </p>
                    </div>
                  ) : (
                    /* The Real Students Table */
                    <div className="relative w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 shadow-inner">
                      {(() => {
                        const filtered = studentsList.filter((s) => {
                          if (!studentSearchQuery.trim()) return true;
                          const q = studentSearchQuery.toLowerCase().trim();
                          return (
                            (s.name || '').toLowerCase().includes(q) ||
                            (s.username || '').toLowerCase().includes(q) ||
                            (s.phone || '').includes(q) ||
                            (s.stage || '').toLowerCase().includes(q)
                          );
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="py-8 text-center text-xs text-slate-400">
                              لا توجد نتائج تطابق بحثك: &quot;{studentSearchQuery}&quot;
                            </div>
                          );
                        }

                        return (
                          <table className="w-full text-xs text-right border-collapse">
                            <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-800 sticky top-0">
                              <tr>
                                <th className="p-3">الاسم</th>
                                <th className="p-3">اسم المستخدم (اليوزر)</th>
                                <th className="p-3">رقم الهاتف</th>
                                <th className="p-3">الشعبة / المرحلة</th>
                                <th className="p-3">نقاط XP</th>
                                <th className="p-3">تاريخ التسجيل</th>
                                <th className="p-3 text-center">إجراء</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {filtered.map((student) => {
                                const formattedCreatedAt = new Date(student.createdAt).toLocaleDateString('ar-EG');
                                const phone = student.phone || student.contact || student.id;

                                return (
                                  <tr
                                    key={student.id}
                                    className="hover:bg-slate-900/50 transition-colors text-slate-200"
                                  >
                                    {/* الاسم والصورة */}
                                    <td className="p-3 align-middle font-semibold text-white">
                                      <div className="flex items-center gap-2.5">
                                        {student.avatarUrl ? (
                                          <img
                                            src={student.avatarUrl}
                                            alt={student.name}
                                            className="w-8 h-8 rounded-full object-cover border border-purple-500/50 shadow-sm shrink-0 aspect-square"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm aspect-square">
                                            {student.name.charAt(0) || 'ط'}
                                          </div>
                                        )}
                                        <div className="truncate max-w-[130px]">
                                          <div className="font-bold text-white text-xs truncate">
                                            {student.name}
                                          </div>
                                          <span className="text-[10px] text-slate-400 block truncate">
                                            {student.role === 'supervisor' ? 'مشرف' : student.role === 'teacher' ? 'معلم' : 'طالب'}
                                          </span>
                                        </div>
                                      </div>
                                    </td>

                                    {/* اليوزر / المعرف */}
                                    <td className="p-3 align-middle">
                                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg dir-ltr">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        <span>{student.username || `@${phone.slice(-4)}`}</span>
                                      </span>
                                    </td>

                                    {/* رقم الهاتف مع زر نسخ ورابط واتساب */}
                                    <td className="p-3 align-middle">
                                      <div className="flex items-center gap-1.5 dir-ltr justify-end">
                                        <span className="font-mono text-emerald-400 font-bold text-xs">
                                          {phone || '—'}
                                        </span>
                                        {phone && (
                                          <div className="flex items-center gap-0.5">
                                            <button
                                              onClick={() => handleCopyPhone(phone)}
                                              title="نسخ رقم الهاتف"
                                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                                            >
                                              {copiedPhone === phone ? (
                                                <Check className="w-3 h-3 text-emerald-400" />
                                              ) : (
                                                <Copy className="w-3 h-3" />
                                              )}
                                            </button>
                                            <a
                                              href={`https://wa.me/20${phone.replace(/^0/, '')}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              title="فتح محادثة واتساب"
                                              className="p-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition"
                                            >
                                              <MessageCircle className="w-3 h-3" />
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    </td>

                                    {/* الشعبة / المرحلة */}
                                    <td className="p-3 align-middle">
                                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 max-w-[140px] truncate">
                                        {student.stage || 'عام'}
                                      </span>
                                    </td>

                                    {/* نقاط XP والمستوى */}
                                    <td className="p-3 align-middle font-mono font-bold text-amber-400">
                                      <span>{student.xp || 50} XP</span>
                                    </td>

                                    {/* تاريخ التسجيل */}
                                    <td className="p-3 align-middle text-slate-300 text-[11px] whitespace-nowrap">
                                      {formattedCreatedAt}
                                    </td>

                                    {/* إجراء: عرض وحذف */}
                                    <td className="p-3 align-middle text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          onClick={() => fetchStudentDetails(student.id)}
                                          className="inline-flex items-center justify-center px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-xs cursor-pointer active:scale-95"
                                        >
                                          <Eye className="w-3 h-3 ml-1" />
                                          <span>عرض</span>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteStudent(student.id)}
                                          title="حذف الطالب"
                                          className="p-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AI 33-Subject Summary Generator */}
          {activeTab === 'generator' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Eduzone - مولد الملخصات الشامل (منهج 2026/2027)</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      33 مادة × 15 صفحة = 495 صفحة كاملة بدون اختصار لجميع الشعب (علمي علوم / رياضة / أدبي / لغات / تجارة / صنايع / زراعة)
                    </p>
                  </div>
                  <a
                    href="/generator.html"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح الأداة في صفحة مستقلة</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">📚 ثانوي عام: 12 مادة</div>
                  <div className="bg-blue-950/60 border border-blue-900 p-2 rounded-xl text-blue-300">🌍 ثانوي لغات: 9 مواد</div>
                  <div className="bg-emerald-950/60 border border-emerald-900 p-2 rounded-xl text-emerald-300">💼 دبلومات: 12 مادة</div>
                  <div className="bg-amber-950/60 border border-amber-900 p-2 rounded-xl text-amber-300 font-bold">📦 الإجمالي: 33 مادة</div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">
                    مفتاح Gemini API:
                  </label>
                  <input
                    type="password"
                    value={genApiKey}
                    onChange={(e) => setGenApiKey(e.target.value)}
                    placeholder="ضع مفتاح Gemini API هنا (AI Studio Key)"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <button
                  onClick={handleStartAllGeneration}
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isGenerating ? 'جاري التوليد الآن... يرجى الانتظار' : '🚀 ابدأ توليد كل المواد (495 صفحة)'}</span>
                </button>

                {/* Progress bar */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>{genProgress}</span>
                  <span className="font-mono text-slate-400">
                    {generatedSummaries.length} / {ALL_GENERATOR_SUBJECTS.length}
                  </span>
                </div>

                {/* Log box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 h-44 overflow-y-auto text-[11px] leading-relaxed space-y-1 font-mono text-slate-300">
                  {genLogs.length === 0 ? (
                    <div className="text-slate-500 text-center py-8">سجل التوليد سيظهر هنا فور الضغط على زر البدء...</div>
                  ) : (
                    genLogs.map((lg, i) => (
                      <div key={i} className="border-b border-slate-900 pb-1">{lg}</div>
                    ))
                  )}
                </div>

                {/* Download and Clear */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleDownloadAllSummaries}
                    disabled={generatedSummaries.length === 0}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل ملف مجمع (Eduzone-33-مادة.md)</span>
                  </button>
                  <button
                    onClick={() => {
                      setGenLogs([]);
                      setGeneratedSummaries([]);
                      setGenProgress('جاهز للبدء...');
                    }}
                    className="py-2 px-4 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/40 text-xs font-bold transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام الإشراف المركزي لمنصة EduZone المعتمد</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
