import React, { useState, useMemo, useEffect } from 'react';
import { EducationalTrack, PlanFilter, SummaryItem, VideoCourse } from './types';
import { SUMMARY_ITEMS, VIDEO_COURSES } from './data/coursesData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrackTabs } from './components/TrackTabs';
import { PricingModal } from './components/PricingModal';
import { SummaryCard } from './components/SummaryCard';
import { VideoCard } from './components/VideoCard';
import { SummaryViewerModal } from './components/SummaryViewerModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AccountingSandbox } from './components/AccountingSandbox';
import { FormulaHelper } from './components/FormulaHelper';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { StudyTimerModal } from './components/StudyTimerModal';
import { ContactModal } from './components/ContactModal';
import { SavedModal } from './components/SavedModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Footer } from './components/Footer';
import AdsterraAd from './components/AdsterraAd';
import { AuthModal, StudentUser, UserRole } from './components/AuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { SupervisorDashboardModal } from './components/SupervisorDashboardModal';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { ApkInstallModal } from './components/ApkInstallModal';
import { OnboardingModal } from './components/OnboardingModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AndroidFrame } from './components/AndroidFrame';
import { GoldenArabicBookletModal } from './components/GoldenArabicBookletModal';
import { ChangeTrackModal } from './components/ChangeTrackModal';
import { downloadSummaryAsDocument } from './utils/downloadHelper';
import { getStudentProgress, StudentProgress } from './utils/gamification';
import {
  registerServiceWorker,
  subscribeToNotificationBroadcast,
  getStoredNotifications,
  EducationalNotification,
} from './utils/notificationService';
import { getMyTrackData, TRACKS_CONFIG } from './lib/tracks';
import { isAllowedForTrack } from './lib/strictFilter';
import {
  BookOpen,
  GraduationCap,
  Video,
  Sparkles,
  Wrench,
  X,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const [activeTrack, setActiveTrack] = useState<EducationalTrack>('all');
  const [activePlanFilter, setActivePlanFilter] = useState<PlanFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'summaries' | 'courses' | 'profile'>('home');
  const [myTrack, setMyTrack] = useState<any>(() => getMyTrackData());
  const trackStorageName =
    typeof window !== 'undefined'
      ? localStorage.getItem('EduZone_Track') || (myTrack?.name || '')
      : (myTrack?.name || '');

  // Gamification & Student Progress
  const [studentProgress, setStudentProgress] = useState<StudentProgress>(getStudentProgress);
  const [xpAwardToast, setXpAwardToast] = useState<{
    points: number;
    title: string;
    leveledUp?: boolean;
    newLevel?: number;
    newLevelTitle?: string;
  } | null>(null);

  // Student Authentication State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem('eduzone_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('student');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [authActionPrompt, setAuthActionPrompt] = useState<string>('تسجيل الدخول للاستفادة من مميزات المنصة');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // First-time Visitor Onboarding (Step 1 -> 2 -> 3)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const completed = localStorage.getItem('eduzone_onboarding_completed');
      return completed !== 'true';
    } catch {
      return true;
    }
  });

  // Live Toast for new supervisor notifications
  const [liveNotificationToast, setLiveNotificationToast] = useState<{
    id: string;
    title: string;
    message: string;
    actionUrl?: string;
  } | null>(null);

  // Unread notifications counter
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(() => {
    try {
      const list = getStoredNotifications();
      return list.filter((n) => !n.read).length;
    } catch {
      return 3;
    }
  });

  // Saved Bookmarks
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('saved_summaries');
      return stored ? JSON.parse(stored) : ['phys-01', 'com-acc-01', 'uni-icdl-01'];
    } catch {
      return ['phys-01', 'com-acc-01', 'uni-icdl-01'];
    }
  });

  // Modals state
  const [viewingSummary, setViewingSummary] = useState<SummaryItem | null>(null);
  const [viewingCourse, setViewingCourse] = useState<VideoCourse | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/notifications');
  });
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isGoldenArabicModalOpen, setIsGoldenArabicModalOpen] = useState(false);
  const [selectedBookletItem, setSelectedBookletItem] = useState<SummaryItem | null>(null);
  const [isChangeTrackModalOpen, setIsChangeTrackModalOpen] = useState(false);

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
    if (typeof window !== 'undefined' && window.location.pathname !== '/notifications') {
      window.history.pushState(null, '', '/notifications');
    }
  };

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/notifications')) {
      window.history.replaceState(null, '', '/');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePop = () => {
        if (window.location.pathname.startsWith('/notifications')) {
          setIsNotificationsOpen(true);
        } else if (window.location.pathname.startsWith('/admin')) {
          setIsSupervisorModalOpen(true);
        } else {
          setIsNotificationsOpen(false);
        }
      };
      if (window.location.pathname.startsWith('/admin')) {
        setIsSupervisorModalOpen(true);
      }
      window.addEventListener('popstate', handlePop);
      return () => window.removeEventListener('popstate', handlePop);
    }
  }, []);

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saved_summaries', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  // Register Service Worker and subscribe to real-time notification broadcasts & 30s API polling
  useEffect(() => {
    registerServiceWorker();

    const fetchUnreadCount = async () => {
      try {
        let userId = 'all';
        try {
          const stored = localStorage.getItem('eduzone_student_user');
          if (stored) {
            const user = JSON.parse(stored);
            if (user?.contact) userId = user.contact;
          }
        } catch {}
        const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        if (data?.success && typeof data.unreadCount === 'number') {
          setUnreadNotificationsCount(data.unreadCount);
        }
      } catch (err) {
        console.warn('Failed to poll unread count:', err);
      }
    };

    fetchUnreadCount();
    const pollInterval = setInterval(fetchUnreadCount, 30000);

    const unsubscribe = subscribeToNotificationBroadcast(
      (newNotif: EducationalNotification) => {
        setLiveNotificationToast({
          id: newNotif.id,
          title: newNotif.title,
          message: newNotif.message,
          actionUrl: newNotif.actionUrl,
        });
        setUnreadNotificationsCount((prev) => prev + 1);

        setTimeout(() => {
          setLiveNotificationToast((current) => (current?.id === newNotif.id ? null : current));
        }, 7000);
      },
      (updatedList: EducationalNotification[]) => {
        setUnreadNotificationsCount(updatedList.filter((n) => !n.read).length);
      }
    );

    const handleProgressUpdated = (e: any) => {
      if (e.detail) {
        setStudentProgress(e.detail);
      } else {
        setStudentProgress(getStudentProgress());
      }
    };

    const handleXpAwarded = (e: any) => {
      if (e.detail) {
        setXpAwardToast(e.detail);
        setStudentProgress(getStudentProgress());
        setTimeout(() => {
          setXpAwardToast(null);
        }, 5500);
      }
    };

    window.addEventListener('eduzone_progress_updated', handleProgressUpdated);
    window.addEventListener('eduzone_xp_awarded', handleXpAwarded);

    const handleTrackSync = () => {
      setMyTrack(getMyTrackData());
    };
    window.addEventListener('storage', handleTrackSync);
    window.addEventListener('eduzone_track_changed', handleTrackSync);

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
      window.removeEventListener('eduzone_progress_updated', handleProgressUpdated);
      window.removeEventListener('eduzone_xp_awarded', handleXpAwarded);
      window.removeEventListener('storage', handleTrackSync);
      window.removeEventListener('eduzone_track_changed', handleTrackSync);
    };
  }, []);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const requireAuth = (prompt: string, callback: () => void) => {
    if (currentUser) {
      callback();
    } else {
      setAuthActionPrompt(prompt);
      setPendingAction(() => callback);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    setMyTrack(getMyTrackData());
    setIsAuthModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('eduzone_user');
      localStorage.removeItem('EduZone_Track');
      localStorage.removeItem('userBranch');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setMyTrack(null);
    setIsProfileModalOpen(false);
    window.dispatchEvent(new Event('eduzone_track_changed'));
  };

  const handleOnboardingFinish = (action: 'register' | 'guest') => {
    try {
      localStorage.setItem('eduzone_onboarding_completed', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsOnboardingOpen(false);

    if (action === 'register') {
      setAuthActionPrompt('سجل برقم موبايلك عشان نحفظ تقدمك ونقاطك');
      setIsAuthModalOpen(true);
    }
  };

  const handleDownloadPdf = (item: SummaryItem) => {
    const track = trackStorageName || (myTrack?.name || '');
    if (track && !isAllowedForTrack(`${item.title} ${item.subject}`, track)) {
      alert(`هذه المادة غير متاحة لشعبتك: ${track}`);
      return;
    }
    requireAuth(`تحميل مذكرة ${item.title}`, () => {
      downloadSummaryAsDocument(item);
    });
  };

  const handleReadOnline = (item: SummaryItem) => {
    const track = trackStorageName || (myTrack?.name || '');
    if (track && !isAllowedForTrack(`${item.title} ${item.subject}`, track)) {
      alert(`هذه المادة غير متاحة لشعبتك: ${track}`);
      return;
    }
    requireAuth(`قراءة مذكرة ${item.title}`, () => {
      setViewingSummary(item);
    });
  };

  const handleOpenBooklet = (item: SummaryItem) => {
    const track = trackStorageName || (myTrack?.name || '');
    if (track && !isAllowedForTrack(`${item.title} ${item.subject}`, track)) {
      alert(`هذه المادة غير متاحة لشعبتك: ${track}`);
      return;
    }
    requireAuth(`فتح مذكرة الـ 24 صفحة لمادة ${item.subject}`, () => {
      setSelectedBookletItem(item);
      setIsGoldenArabicModalOpen(true);
    });
  };

  const handleWatchCourse = (course: VideoCourse) => {
    const track = trackStorageName || (myTrack?.name || '');
    if (track && !isAllowedForTrack(`${course.title} ${course.category || ''}`, track)) {
      alert(`هذه المادة غير متاحة لشعبتك: ${track}`);
      return;
    }
    requireAuth(`مشاهدة كورس ${course.title}`, () => {
      setViewingCourse(course);
    });
  };

  const handleOpenTelegramGroup = () => {
    window.open('https://t.me/+2OhLLu7ofSoxNTNk', '_blank');
  };

  // Question bank login gate handler
  const handleOpenQuiz = () => {
    if (!currentUser) {
      setAuthActionPrompt('دخول بنك الأسئلة الشامل (1600+ سؤال)');
      setPendingAction(() => () => setIsQuizModalOpen(true));
      setIsAuthModalOpen(true);
      return;
    }
    setIsQuizModalOpen(true);
  };

  const handleSelectNavTab = (tab: 'home' | 'summaries' | 'courses' | 'quiz' | 'profile') => {
    if (tab !== 'quiz') {
      setActiveNavTab(tab);
    }
    if (tab === 'home') {
      setActiveTrack('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'summaries') {
      setActiveTrack('thanawya_science');
      const el = document.getElementById('browse-sections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'courses') {
      setActiveTrack('free_courses');
      const el = document.getElementById('browse-sections');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'quiz') {
      handleOpenQuiz();
    } else if (tab === 'profile') {
      if (currentUser) {
        setIsProfileModalOpen(true);
      } else {
        setAuthActionPrompt('تسجيل الدخول لمتابعة حسابك ونقاطك');
        setIsAuthModalOpen(true);
      }
    }
  };

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    const trackToTest = trackStorageName || (myTrack?.name || '');
    return SUMMARY_ITEMS.filter((item) => {
      // 0. Strict Stream Filter: Block any unauthorized materials for track
      if (trackToTest && !isAllowedForTrack(`${item.title} ${item.subject} ${item.trackLabel || ''}`, trackToTest)) {
        return false;
      }

      // 1. Strict Track Filter based on student's registered stream
      if (myTrack && myTrack.subjects) {
        const matchesTrack =
          myTrack.subjects.some(
            (sub: string) =>
              item.title?.toLowerCase().includes(sub.toLowerCase()) ||
              item.subject?.toLowerCase().includes(sub.toLowerCase()) ||
              item.trackLabel?.toLowerCase().includes(sub.toLowerCase())
          ) ||
          myTrack.keywords.some(
            (k: string) =>
              item.title?.toLowerCase().includes(k.toLowerCase()) ||
              item.tags?.some((t: string) => t.toLowerCase().includes(k.toLowerCase()))
          );
        if (!matchesTrack) return false;
      }

      // 2. Tab Track match
      if (activeTrack !== 'all' && activeTrack !== 'free_courses') {
        if (activeTrack === 'thanawya_science') {
          if (item.track !== 'thanawya_science' && item.track !== 'thanawya_arts' && item.track !== 'languages') return false;
        } else if (activeTrack === 'technical_industrial') {
          if (item.track !== 'technical_industrial' && item.track !== 'commerce_diploma') return false;
        } else if (item.track !== activeTrack) {
          return false;
        }
      }
      // Plan filter match
      if (activePlanFilter === 'free' && item.planType === 'paid') return false;
      if (activePlanFilter === 'paid' && item.planType !== 'paid') return false;
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inSubject = item.subject.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
        return inTitle || inSubject || inDesc || inTags;
      }
      return true;
    });
  }, [activeTrack, activePlanFilter, searchQuery, myTrack, trackStorageName]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (
      activeTrack !== 'all' &&
      activeTrack !== 'free_courses' &&
      activeTrack !== 'university_courses'
    ) {
      return [];
    }
    const trackToTest = trackStorageName || (myTrack?.name || '');
    return VIDEO_COURSES.filter((course) => {
      // Strict Stream Filter
      if (trackToTest && !isAllowedForTrack(`${course.title} ${course.category || ''}`, trackToTest)) {
        return false;
      }
      if (activeTrack === 'university_courses' && course.track !== 'university') return false;
      if (activePlanFilter === 'free' && course.planType === 'paid') return false;
      if (activePlanFilter === 'paid' && course.planType !== 'paid') return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeTrack, activePlanFilter, searchQuery, trackStorageName]);

  const savedItems = useMemo(() => {
    return SUMMARY_ITEMS.filter((item) => savedIds.includes(item.id));
  }, [savedIds]);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: SUMMARY_ITEMS.length + VIDEO_COURSES.length,
      thanawya_science: SUMMARY_ITEMS.filter((s) => s.track === 'thanawya_science').length,
      thanawya_arts: SUMMARY_ITEMS.filter((s) => s.track === 'thanawya_arts').length,
      languages: SUMMARY_ITEMS.filter((s) => s.track === 'languages').length,
      commerce_diploma: SUMMARY_ITEMS.filter((s) => s.track === 'commerce_diploma').length,
      technical_industrial:
        SUMMARY_ITEMS.filter((s) => s.track === 'technical_industrial').length +
        VIDEO_COURSES.filter((c) => c.category === 'تعليم فني صناعي').length,
      university_courses:
        SUMMARY_ITEMS.filter((s) => s.track === 'university_courses').length +
        VIDEO_COURSES.filter((c) => c.track === 'university').length,
      free_courses: VIDEO_COURSES.length,
    };
  }, []);

  // Section Navigation Hub Cards Configuration
  const sections = [
    {
      id: 1,
      title: 'الثانوية العامة (علمي وأدبي)',
      count: 12,
      type: 'ثانوية عامة',
      description: 'مذكرات كبسولة الإنقاذ، قوانين الفيزياء، الكيمياء العضوية، والنحو الشامل لعام 2026/2027.',
      targetTrack: 'thanawya_science' as EducationalTrack,
      actionText: 'تصفح مذكرات الثانوية',
      colorClass: 'bg-indigo-600',
      badgeColorClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      hoverColorClass: 'group-hover:text-amber-300',
      footerColorClass: 'text-amber-300',
      iconType: 'book' as const,
    },
    {
      id: 2,
      title: 'الدبلومات الفنية والتجارية',
      count: 5,
      type: 'دبلومات فنية',
      description: 'المحاسبة المالية، الرسم الفني، والتطبيقات الصناعية والتجارية الحديثة.',
      targetTrack: 'technical_industrial' as EducationalTrack,
      actionText: 'تصفح مواد الدبلومات',
      colorClass: 'bg-teal-600',
      badgeColorClass: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      hoverColorClass: 'group-hover:text-teal-300',
      footerColorClass: 'text-teal-300',
      iconType: 'wrench' as const,
    },
    {
      id: 3,
      title: 'دورات ICDL',
      count: 3,
      type: 'دورات',
      description: 'دورات احتراف برامج الأوفيس، الإكسيل المالي، ومهارات الحاسب الآلي لسوق العمل.',
      targetTrack: 'university_courses' as EducationalTrack,
      actionText: 'تصفح الكورسات الجامعية',
      colorClass: 'bg-amber-600',
      badgeColorClass: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      hoverColorClass: 'group-hover:text-amber-300',
      footerColorClass: 'text-amber-300',
      iconType: 'grad' as const,
    },
  ];

  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      if (!trackStorageName) return true;
      if (trackStorageName.includes('علمي') || trackStorageName.includes('أدبي')) {
        // طالب ثانوية عامة، اخفي الدبلومات
        return sec.type.includes('ثانوية عامة');
      }
      if (trackStorageName.includes('تجارة') || trackStorageName.includes('صنايع')) {
        return sec.type.includes('دبلومات فنية');
      }
      if (trackStorageName.includes('ICDL')) {
        return sec.type.includes('دورات');
      }
      return true;
    });
  }, [trackStorageName, myTrack]);

  const filteredSectionsTotalCount = useMemo(() => {
    return filteredSections.reduce((a, b) => a + b.count, 0);
  }, [filteredSections]);

  // Distinct groups
  const thanawyaSummaries = useMemo(
    () =>
      filteredSummaries.filter(
        (s) =>
          s.track === 'thanawya_science' ||
          s.track === 'thanawya_arts' ||
          s.track === 'languages'
      ),
    [filteredSummaries]
  );

  const technicalAndCommerceSummaries = useMemo(
    () =>
      filteredSummaries.filter(
        (s) => s.track === 'technical_industrial' || s.track === 'commerce_diploma'
      ),
    [filteredSummaries]
  );

  const universitySummaries = useMemo(
    () => filteredSummaries.filter((s) => s.track === 'university_courses'),
    [filteredSummaries]
  );

  return (
    <AndroidFrame>
      <div className="min-h-0 bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
        {/* Floating XP Award Toast */}
        {xpAwardToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-2xl shadow-lg border border-amber-300 flex items-center gap-2.5 animate-bounce text-right">
            <span className="text-xl">🏆</span>
            <div className="leading-tight">
              <div className="text-xs font-black">
                +{xpAwardToast.points} نقطة خبرة (XP) جديدة!
              </div>
              <div className="text-[11px] font-bold text-slate-900">
                {xpAwardToast.title}
              </div>
            </div>
            <span className="text-[10px] bg-slate-950 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full mr-1">
              {studentProgress.levelTitle}
            </span>
          </div>
        )}

        {/* Mobile Header */}
        <Header
          activeTrack={activeTrack}
          onSelectTrack={(track) => {
            if ((track as string) === 'quiz_bank') {
              handleOpenQuiz();
              return;
            }
            setActiveTrack(track);
            const el = document.getElementById('browse-sections');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          savedCount={savedIds.length}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          onOpenTimerModal={() => setIsTimerModalOpen(true)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenQuizModal={handleOpenQuiz}
          onOpenNotifications={handleOpenNotifications}
          currentUser={currentUser}
          studentProgress={studentProgress}
          onOpenAuthModal={(role = 'student') => {
            setAuthInitialRole(role);
            setAuthActionPrompt(
              role === 'supervisor'
                ? 'تسجيل دخول المشرف العام لإدارة المنصة'
                : 'تسجيل الدخول برقم الهاتف'
            );
            setIsAuthModalOpen(true);
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSupervisorDashboard={() => setIsSupervisorModalOpen(true)}
          onOpenCreatorProfile={() => setIsCreatorModalOpen(true)}
          onLogout={handleLogout}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Main Content Area - Full Screen Mobile 100% */}
        <main className="min-h-0 w-full">
          {/* Mobile Hero */}
          <Hero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onExploreClick={() => {
              const el = document.getElementById('browse-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenQuizClick={handleOpenQuiz}
            onOpenTechnicalClick={() => {
              setActiveTrack('technical_industrial');
              const el = document.getElementById('browse-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenUniversityCourses={() => {
              setActiveTrack('university_courses');
              const el = document.getElementById('browse-sections');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPricingModal={() => setIsPricingModalOpen(true)}
            onOpenCreatorProfile={() => setIsCreatorModalOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />

          <div id="browse-sections" className="w-full px-3 space-y-6 pb-6">
            {/* بنر الشعبة الدراسية المسجلة مع زر تغيير الشعبة */}
            {myTrack && (
              <div className="bg-yellow-400 text-black p-3.5 rounded-2xl m-3 flex items-center justify-between font-bold shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span>موادك: {myTrack?.name || trackStorageName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangeTrackModalOpen(true)}
                  className="bg-slate-950 hover:bg-black text-yellow-400 px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تغيير الشعبة</span>
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <TrackTabs
              activeTrack={activeTrack}
              onSelectTrack={(track) => {
                if ((track as string) === 'quiz_bank') {
                  handleOpenQuiz();
                  return;
                }
                setActiveTrack(track);
              }}
              activePlanFilter={activePlanFilter}
              onSelectPlanFilter={setActivePlanFilter}
              onOpenPricingModal={() => setIsPricingModalOpen(true)}
              counts={counts}
              myTrackName={trackStorageName || undefined}
              myTrackCount={filteredSectionsTotalCount}
            />

            {/* User Login Banner if Guest */}
            {!currentUser && (
              <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-md shadow-black/25 border border-slate-800 flex items-center justify-between gap-3 text-right">
                <div className="space-y-0.5">
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full inline-block">
                    تسجيل دخول سريع
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    سجل برقم هاتفك لحفظ مذكراتك ونقاطك
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    رقم هاتف مصري صحيح (11 رقم) مع كود تحقق OTP فوري
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAuthActionPrompt('تسجيل الدخول برقم الهاتف');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shrink-0 shadow-xs transition-colors cursor-pointer"
                >
                  تسجيل الدخول
                </button>
              </div>
            )}

            {/* ========================================================= */}
            {/* 0. الرئيسية (Section Navigation Hub & Overview)            */}
            {/* ========================================================= */}
            {activeTrack === 'all' && (
              <div className="space-y-6">
                {/* 4 Dedicated Section Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-r-4 border-indigo-500 pr-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        الأقسام والمراحل التعليمية
                      </h2>
                      <p className="text-xs text-slate-400">
                        اختر مسارك للوصول المباشر للمذكرات المعتمدة والامتحانات
                      </p>
                    </div>
                  </div>

                  {/* 1 Column Mobile Cards Stack */}
                  <div className="flex flex-col gap-3 w-full">
                    {filteredSections.map((sec) => (
                      <div
                        key={sec.id}
                        onClick={() => {
                          setActiveTrack(sec.targetTrack);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="bg-slate-900 text-white rounded-2xl p-4 shadow-md shadow-black/25 border border-slate-800 transition-all duration-150 active:scale-[0.99] cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-10 h-10 rounded-xl ${sec.colorClass} text-white flex items-center justify-center font-black group-hover:scale-105 transition-transform`}
                            >
                              {sec.iconType === 'book' ? (
                                <BookOpen className="w-5 h-5" />
                              ) : sec.iconType === 'wrench' ? (
                                <Wrench className="w-5 h-5" />
                              ) : (
                                <GraduationCap className="w-5 h-5" />
                              )}
                            </div>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sec.badgeColorClass}`}
                            >
                              {sec.count} مذكرات
                            </span>
                          </div>
                          <h3
                            className={`text-base font-black text-white ${sec.hoverColorClass} transition-colors`}
                          >
                            {sec.title}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {sec.description}
                          </p>
                        </div>
                        <div
                          className={`mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold ${sec.footerColorClass}`}
                        >
                          <span>{sec.actionText}</span>
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}

                    {/* Show Video Lessons card only if visitor has no specific track set */}
                    {!trackStorageName && (
                      <div
                        onClick={() => {
                          setActiveTrack('free_courses');
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="bg-slate-900 text-white rounded-2xl p-4 shadow-md shadow-black/25 border border-slate-800 transition-all duration-150 active:scale-[0.99] cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                              <Video className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full border border-red-400/30">
                              {counts.free_courses} معسكرات
                            </span>
                          </div>
                          <h3 className="text-base font-black text-white group-hover:text-red-300 transition-colors">
                            المحاضرات ومعسكرات الفيديو HD
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            معسكرات إنقاذ كاملة بجودة 1080p Full HD مع تحصيل +80 XP لكل درس تشاهده.
                          </p>
                        </div>
                        <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-red-300">
                          <span>مشاهدة معسكرات الفيديو</span>
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adsterra Fixed Banner */}
                <AdsterraAd />

                {/* Top Picks Preview */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>المذكرات الأكثر قراءة وتحميلاً</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">
                      مراجعات 2026 / 2027
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    {(myTrack ? filteredSummaries : SUMMARY_ITEMS.slice(0, 4)).map((item) => (
                      <SummaryCard
                        key={item.id}
                        item={item}
                        onReadOnline={handleReadOnline}
                        onDownloadPdf={handleDownloadPdf}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={handleToggleSave}
                        isCommerce={false}
                        onOpenVipPayment={() => setIsPricingModalOpen(true)}
                        onOpenBooklet={handleOpenBooklet}
                      />
                    ))}
                    {myTrack && filteredSummaries.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
                        لا توجد مذكرات مضافة حالياً تطابق شعبتك ({myTrack.name})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. الثانوية العامة                                         */}
            {/* ========================================================= */}
            {activeTrack === 'thanawya_science' && (
              <section className="space-y-3 pt-1 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5 text-white shadow-md shadow-black/25">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                        مرحلة الثانوية
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        مذكرات وكبسولات الثانوية العامة
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      ملخصات شاملة لشعبتي علمي وأدبي مع القوانين ونواتج التعلم لعام 2026 / 2027.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-bold hover:bg-slate-750 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة للرئيسية</span>
                  </button>
                </div>

                {/* Summaries List - 1 Column */}
                <div className="flex flex-col gap-3 w-full">
                  {thanawyaSummaries.map((item) => (
                    <SummaryCard
                      key={item.id}
                      item={item}
                      onReadOnline={handleReadOnline}
                      onDownloadPdf={handleDownloadPdf}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={handleToggleSave}
                      isCommerce={false}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                      onOpenBooklet={handleOpenBooklet}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 2. الدبلومات الفنية والتجارية                             */}
            {/* ========================================================= */}
            {activeTrack === 'technical_industrial' && (
              <section className="space-y-3 pt-1 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5 text-white shadow-md shadow-black/25">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-teal-600 text-white px-2 py-0.5 rounded-md">
                        التعليم الفني
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        الدبلومات التجارية والصناعية والتكنولوجية
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      المحاسبة المالية، قيود اليومية، والرسم الفني الصناعي (نظام 3 و 5 سنوات والجدارات).
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-teal-300 text-xs font-bold hover:bg-slate-750 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة للرئيسية</span>
                  </button>
                </div>

                {/* Cards List - 1 Column */}
                <div className="flex flex-col gap-3 w-full">
                  {technicalAndCommerceSummaries.map((item) => (
                    <SummaryCard
                      key={item.id}
                      item={item}
                      onReadOnline={handleReadOnline}
                      onDownloadPdf={handleDownloadPdf}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={handleToggleSave}
                      isCommerce={item.track === 'commerce_diploma'}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                      onOpenBooklet={handleOpenBooklet}
                    />
                  ))}
                </div>

                {/* Interactive Accounting Sandbox Tool */}
                <div className="pt-2">
                  <AccountingSandbox />
                </div>

                {/* Formula Quick Sheet */}
                <div className="pt-1">
                  <FormulaHelper />
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 3. الدورات الجامعية                                        */}
            {/* ========================================================= */}
            {activeTrack === 'university_courses' && (
              <section className="space-y-3 pt-1 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5 text-white shadow-md shadow-black/25">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded-md">
                        الدورات المعتمدة
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        الكورسات الجامعية والـ ICDL
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      برامج الأوفيس، التحليل المالي، والإكسيل المتقدم لطلاب الجامعات وسوق العمل 2026/2027.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold hover:bg-slate-750 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة للرئيسية</span>
                  </button>
                </div>

                {/* University Summaries - 1 Column */}
                {universitySummaries.length > 0 && (
                  <div className="flex flex-col gap-3 w-full">
                    {universitySummaries.map((item) => (
                      <SummaryCard
                        key={item.id}
                        item={item}
                        onReadOnline={handleReadOnline}
                        onDownloadPdf={handleDownloadPdf}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={handleToggleSave}
                        isCommerce={false}
                        onOpenVipPayment={() => setIsPricingModalOpen(true)}
                        onOpenBooklet={handleOpenBooklet}
                      />
                    ))}
                  </div>
                )}

                {/* University Video Courses - 1 Column */}
                <div className="flex flex-col gap-3 w-full pt-1">
                  {VIDEO_COURSES.filter((c) => c.track === 'university').map((course) => (
                    <VideoCard
                      key={course.id}
                      course={course}
                      onWatchCourse={handleWatchCourse}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 4. معسكرات الفيديو HD                                     */}
            {/* ========================================================= */}
            {activeTrack === 'free_courses' && (
              <section className="space-y-3 pt-1 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5 text-white shadow-md shadow-black/25">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-md">
                        معسكرات الفيديو
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-white">
                        محاضرات الشرح والإنقاذ بالفيديو
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      شروحات تفاعلية عالية الدقة (1080p HD) مع تحصيل 80 نقطة خبرة لكل درس.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTrack('all')}
                    className="self-start px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-red-300 text-xs font-bold hover:bg-slate-750 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>العودة للرئيسية</span>
                  </button>
                </div>

                {/* Video Cards List - 1 Column */}
                <div className="flex flex-col gap-3 w-full">
                  {filteredCourses.map((course) => (
                    <VideoCard
                      key={course.id}
                      course={course}
                      onWatchCourse={handleWatchCourse}
                      onOpenVipPayment={() => setIsPricingModalOpen(true)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state if nothing matches */}
            {filteredSummaries.length === 0 && filteredCourses.length === 0 && (
              <div className="text-center py-12 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-2 text-white">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  لا توجد مذكرات مطابقة لبحثك
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  جرب تغيير كلمات البحث أو اختيار قسم دراسي آخر
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTrack('all');
                    setActivePlanFilter('all');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer
          onSelectTrack={(t) => {
            setActiveTrack(t);
            const el = document.getElementById('browse-sections');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenContact={() => setIsContactModalOpen(true)}
          onOpenTimer={() => setIsTimerModalOpen(true)}
          onOpenCreatorProfile={() => setIsCreatorModalOpen(true)}
        />

        {/* Mobile Android Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeNavTab}
          onSelectNavTab={handleSelectNavTab}
          currentUser={currentUser}
          savedCount={savedIds.length}
        />

        {/* Floating Live Notification Toast Banner for All Students */}
        {liveNotificationToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[92%] bg-amber-500 text-slate-950 p-3 sm:p-4 rounded-2xl shadow-xl border border-amber-400 flex items-start justify-between gap-3 animate-bounce">
            <div className="flex items-start gap-2.5 flex-1">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-0.5 flex-1 text-right">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded">
                    إشعار عاجل من الإدارة
                  </span>
                  <h4 className="text-xs font-black text-slate-950">
                    {liveNotificationToast.title}
                  </h4>
                </div>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {liveNotificationToast.message}
                </p>
                {liveNotificationToast.actionUrl && (
                  <a
                    href={liveNotificationToast.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[11px] font-extrabold text-slate-950 underline pt-1"
                  >
                    اضغط هنا لفتح الرابط
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => setLiveNotificationToast(null)}
              className="p-1 text-slate-950 hover:bg-black/10 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Student Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
          intendedActionLabel={authActionPrompt}
          initialRole={authInitialRole}
        />

        {/* Student Profile & Digital ID Modal */}
        <StudentProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setIsProfileModalOpen(false);
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
          savedCount={savedIds.length}
          onOpenSavedModal={() => setIsSavedModalOpen(true)}
          onOpenTelegram={handleOpenTelegramGroup}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          onOpenSupervisorDashboard={() => {
            setIsProfileModalOpen(false);
            setIsSupervisorModalOpen(true);
          }}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onOpenChangeTrack={() => setIsChangeTrackModalOpen(true)}
        />

        {/* Supervisor Control Panel & Broadcast Dashboard */}
        <SupervisorDashboardModal
          isOpen={isSupervisorModalOpen}
          onClose={() => setIsSupervisorModalOpen(false)}
          currentUser={currentUser}
          onNotificationSent={() => {
            setUnreadNotificationsCount((prev) => prev + 1);
          }}
        />

        {/* Modal Viewers & Tools */}
        <SummaryViewerModal
          item={viewingSummary}
          onClose={() => setViewingSummary(null)}
          onDownloadPdf={handleDownloadPdf}
          onOpenGoldenBooklet={() => {
            setSelectedBookletItem(viewingSummary);
            setIsGoldenArabicModalOpen(true);
          }}
        />

        <GoldenArabicBookletModal
          isOpen={isGoldenArabicModalOpen}
          onClose={() => {
            setIsGoldenArabicModalOpen(false);
            setSelectedBookletItem(null);
          }}
          item={selectedBookletItem}
        />

        <ChangeTrackModal
          isOpen={isChangeTrackModalOpen}
          onClose={() => setIsChangeTrackModalOpen(false)}
          currentTrackName={trackStorageName || myTrack?.name || ''}
          onSelectTrack={() => {
            setMyTrack(getMyTrackData());
          }}
        />

        <VideoPlayerModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
          isAdmin={currentUser?.role === 'supervisor' || (currentUser as any)?.role === 'admin'}
        />

        <InteractiveQuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          onOpenPricingModal={() => setIsPricingModalOpen(true)}
          userRole={currentUser?.role}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setAuthActionPrompt('دخول بنك الأسئلة الشامل (1600+ سؤال)');
            setPendingAction(() => () => setIsQuizModalOpen(true));
            setIsAuthModalOpen(true);
          }}
        />

        <StudyTimerModal
          isOpen={isTimerModalOpen}
          onClose={() => setIsTimerModalOpen(false)}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        <SavedModal
          isOpen={isSavedModalOpen}
          onClose={() => setIsSavedModalOpen(false)}
          savedItems={savedItems}
          onRemoveSave={handleToggleSave}
          onReadOnline={handleReadOnline}
          onDownloadPdf={handleDownloadPdf}
        />

        {/* VIP Pricing & Subscription Modal */}
        <PricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          onOpenTelegram={() => {
            setIsPricingModalOpen(false);
            handleOpenTelegramGroup();
          }}
        />

        {/* Notification Center Modal */}
        <NotificationCenter
          isOpen={isNotificationsOpen}
          onClose={handleCloseNotifications}
          onOpenTelegram={() => {
            setIsNotificationsOpen(false);
            handleOpenTelegramGroup();
          }}
          onOpenSupervisorDashboard={() => {
            setIsNotificationsOpen(false);
            setIsSupervisorModalOpen(true);
          }}
          isSupervisor={currentUser?.role === 'supervisor'}
        />

        {/* Founder & Lead Developer Profile Modal */}
        <CreatorProfileModal
          isOpen={isCreatorModalOpen}
          onClose={() => setIsCreatorModalOpen(false)}
        />

        {/* 3-Step Onboarding Modal for First-time Visitors */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onFinish={handleOnboardingFinish}
        />

        {/* Mobile APK and PWA Install Modal */}
        <ApkInstallModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
        />
      </div>
    </AndroidFrame>
  );
}
