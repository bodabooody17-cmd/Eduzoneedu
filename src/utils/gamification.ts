// Student Points, Levels & Gamification System for EduZone
export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or Lucide identifier
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  points: number;
  date: string;
  type: 'summary' | 'course' | 'quiz' | 'bonus' | 'login';
}

export interface StudentProgress {
  totalPoints: number;
  level: number;
  levelTitle: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  completedSummariesCount: number;
  completedLessonsCount: number;
  solvedQuizzesCount: number;
  badges: StudentBadge[];
  history: ActivityLog[];
}

export const LEVEL_DEFINITIONS = [
  { level: 1, title: 'طالب مبتدئ', minXp: 0, maxXp: 150 },
  { level: 2, title: 'طالب مجتهد', minXp: 151, maxXp: 400 },
  { level: 3, title: 'طالب متفوق', minXp: 401, maxXp: 850 },
  { level: 4, title: 'عبقري EduZone', minXp: 851, maxXp: 1600 },
  { level: 5, title: 'أسطورة الثانوية', minXp: 1601, maxXp: 3000 },
];

export const DEFAULT_BADGES: StudentBadge[] = [
  {
    id: 'badge-first-read',
    name: 'قارئ نشط',
    description: 'قراءة أول ملخص دراسي كاملاً',
    icon: '📖',
    unlocked: false,
  },
  {
    id: 'badge-pdf-downloader',
    name: 'جامع المذكرات',
    description: 'تحميل 3 مذكرات بصيغة PDF',
    icon: '📑',
    unlocked: false,
  },
  {
    id: 'badge-course-explorer',
    name: 'مستكشف الكورسات',
    description: 'إكمال أول محاضرة فيديو تعليمية',
    icon: '🎥',
    unlocked: false,
  },
  {
    id: 'badge-quiz-master',
    name: 'فارس الاختبارات',
    description: 'حل 5 أسئلة صحيحة في بنك الأسئلة',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'badge-top-scholar',
    name: 'صانع الأوائل',
    description: 'الوصول إلى 500 نقطة خبرة',
    icon: '🏆',
    unlocked: false,
  },
];

export function getStudentProgress(): StudentProgress {
  if (typeof window === 'undefined') {
    return createDefaultProgress(0);
  }
  try {
    const raw = localStorage.getItem('eduzone_student_progress');
    if (!raw) {
      // Default starting progress with 50 welcome points
      const defaultState = createDefaultProgress(50);
      defaultState.history = [
        {
          id: 'welcome-bonus',
          title: 'مكافأة الانضمام لمنصة EduZone',
          points: 50,
          date: 'اليوم',
          type: 'bonus',
        },
      ];
      saveStudentProgress(defaultState);
      return defaultState;
    }
    const parsed = JSON.parse(raw);
    return computeLevelMetrics(parsed);
  } catch {
    return createDefaultProgress(50);
  }
}

export function saveStudentProgress(progress: StudentProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('eduzone_student_progress', JSON.stringify(progress));
    window.dispatchEvent(
      new CustomEvent('eduzone_progress_updated', { detail: progress })
    );
  } catch (err) {
    console.error(err);
  }
}

function createDefaultProgress(initialPoints = 0): StudentProgress {
  const base = {
    totalPoints: initialPoints,
    level: 1,
    levelTitle: LEVEL_DEFINITIONS[0].title,
    currentLevelXp: initialPoints,
    nextLevelXp: LEVEL_DEFINITIONS[0].maxXp,
    progressPercent: Math.min(
      100,
      Math.round((initialPoints / LEVEL_DEFINITIONS[0].maxXp) * 100)
    ),
    completedSummariesCount: 0,
    completedLessonsCount: 0,
    solvedQuizzesCount: 0,
    badges: DEFAULT_BADGES,
    history: [],
  };
  return computeLevelMetrics(base);
}

function computeLevelMetrics(progress: any): StudentProgress {
  const points = Math.max(0, Number(progress.totalPoints) || 0);
  let currentLevel = LEVEL_DEFINITIONS[0];
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_DEFINITIONS[i].minXp) {
      currentLevel = LEVEL_DEFINITIONS[i];
      break;
    }
  }

  const rangeSpan = Math.max(1, currentLevel.maxXp - currentLevel.minXp);
  const earnedInRange = points - currentLevel.minXp;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((earnedInRange / rangeSpan) * 100))
  );

  // Check auto-unlocking badges
  const badges: StudentBadge[] = (progress.badges || DEFAULT_BADGES).map(
    (b: StudentBadge) => {
      let unlocked = b.unlocked;
      if (
        b.id === 'badge-first-read' &&
        (progress.completedSummariesCount || 0) >= 1
      ) {
        unlocked = true;
      }
      if (
        b.id === 'badge-pdf-downloader' &&
        (progress.completedSummariesCount || 0) >= 3
      ) {
        unlocked = true;
      }
      if (
        b.id === 'badge-course-explorer' &&
        (progress.completedLessonsCount || 0) >= 1
      ) {
        unlocked = true;
      }
      if (
        b.id === 'badge-quiz-master' &&
        (progress.solvedQuizzesCount || 0) >= 5
      ) {
        unlocked = true;
      }
      if (b.id === 'badge-top-scholar' && points >= 500) {
        unlocked = true;
      }
      return {
        ...b,
        unlocked,
        unlockedAt:
          unlocked && !b.unlockedAt
            ? new Date().toLocaleDateString('ar-EG')
            : b.unlockedAt,
      };
    }
  );

  return {
    totalPoints: points,
    level: currentLevel.level,
    levelTitle: currentLevel.title,
    currentLevelXp: points,
    nextLevelXp: currentLevel.maxXp,
    progressPercent,
    completedSummariesCount: progress.completedSummariesCount || 0,
    completedLessonsCount: progress.completedLessonsCount || 0,
    solvedQuizzesCount: progress.solvedQuizzesCount || 0,
    badges,
    history: progress.history || [],
  };
}

export function awardPoints(
  amount: number,
  title: string,
  type: 'summary' | 'course' | 'quiz' | 'bonus' | 'login'
): { progress: StudentProgress; leveledUp: boolean; newBadges: StudentBadge[] } {
  const current = getStudentProgress();
  const oldLevel = current.level;
  const newTotal = current.totalPoints + amount;

  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title,
    points: amount,
    date: 'اليوم',
    type,
  };

  const updatedCounts = {
    completedSummariesCount:
      type === 'summary'
        ? current.completedSummariesCount + 1
        : current.completedSummariesCount,
    completedLessonsCount:
      type === 'course'
        ? current.completedLessonsCount + 1
        : current.completedLessonsCount,
    solvedQuizzesCount:
      type === 'quiz'
        ? current.solvedQuizzesCount + 1
        : current.solvedQuizzesCount,
  };

  const updatedProgress = computeLevelMetrics({
    ...current,
    ...updatedCounts,
    totalPoints: newTotal,
    history: [newLog, ...(current.history || []).slice(0, 19)], // Keep latest 20 activities
  });

  saveStudentProgress(updatedProgress);

  const leveledUp = updatedProgress.level > oldLevel;
  const newBadges = updatedProgress.badges.filter(
    (b) => b.unlocked && !current.badges.find((cb) => cb.id === b.id && cb.unlocked)
  );

  // Dispatch custom toast notification
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('eduzone_xp_awarded', {
        detail: {
          points: amount,
          title,
          leveledUp,
          newLevel: updatedProgress.level,
          newLevelTitle: updatedProgress.levelTitle,
          newBadges,
        },
      })
    );
  }

  return { progress: updatedProgress, leveledUp, newBadges };
}
