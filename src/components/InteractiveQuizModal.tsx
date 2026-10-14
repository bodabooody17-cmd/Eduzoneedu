import React, { useState, useMemo, useEffect } from 'react';
import { QUESTION_BANK, BankQuestion } from '../data/questionBankData';
import { awardPoints } from '../utils/gamification';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Send,
  Search,
  Crown,
  LogIn,
  Key,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricingModal?: () => void;
  currentUser?: any;
  onOpenAuthModal?: () => void;
  userRole?: string;
}

// Helper to find the resume index for a given subject list
const getResumeIndexForList = (
  subKey: string,
  qList: BankQuestion[],
  positionsMap: Record<string, number>,
  answersMap: Record<string, number>
): number => {
  if (!qList.length) return 0;

  // Check if user has an explicit saved position
  const saved = positionsMap[subKey];
  if (typeof saved === 'number' && saved >= 0 && saved < qList.length) {
    const savedQ = qList[saved];
    // If the saved question is already answered, resume at the next question
    if (savedQ && answersMap[savedQ.id] !== undefined) {
      return Math.min(qList.length - 1, saved + 1);
    }
    return saved;
  }

  // Otherwise check highest answered question in this list
  let highestAnswered = -1;
  for (let i = 0; i < qList.length; i++) {
    if (answersMap[qList[i].id] !== undefined) {
      highestAnswered = i;
    }
  }
  if (highestAnswered >= 0) {
    return Math.min(qList.length - 1, highestAnswered + 1);
  }
  return 0;
};

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  onOpenPricingModal,
  currentUser,
  onOpenAuthModal,
  userRole,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [awardedXpIds, setAwardedXpIds] = useState<string[]>([]);
  const [xpBanner, setXpBanner] = useState<string | null>(null);
  const [jumpInput, setJumpInput] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Persistent user answers
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('eduzone_quiz_answers');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persistent revealed answers
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('eduzone_quiz_revealed');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persistent question position per subject (remembers question index where student stopped)
  const [subjectPositions, setSubjectPositions] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('eduzone_quiz_positions');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Sync answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eduzone_quiz_answers', JSON.stringify(userAnswers));
    } catch (e) {
      console.error(e);
    }
  }, [userAnswers]);

  // Sync revealed state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eduzone_quiz_revealed', JSON.stringify(revealedAnswers));
    } catch (e) {
      console.error(e);
    }
  }, [revealedAnswers]);

  // Sync current question index per subject to localStorage
  useEffect(() => {
    if (!isOpen) return;
    setSubjectPositions((prev) => {
      const next = { ...prev, [selectedSubject]: currentIndex };
      try {
        localStorage.setItem('eduzone_quiz_positions', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, [currentIndex, selectedSubject, isOpen]);

  // VIP Status - Strictly for verified paid subscribers or official supervisors/teachers
  const [isPaidVip, setIsPaidVip] = useState<boolean>(() => {
    try {
      // Clear deprecated trial bypass from previous sessions
      localStorage.removeItem('eduzone_vip_unlocked');
      localStorage.removeItem('eduzone_vip_test');

      if (userRole === 'supervisor' || userRole === 'teacher' || currentUser?.role === 'supervisor') {
        return true;
      }
      return localStorage.getItem('eduzone_paid_vip_active') === 'true';
    } catch {
      return false;
    }
  });

  const isUserVip = Boolean(
    isPaidVip ||
    userRole === 'supervisor' ||
    userRole === 'teacher' ||
    currentUser?.role === 'supervisor'
  );

  // VIP Activation Code State (for students who completed payment and received their official code from administration)
  const [vipCodeInput, setVipCodeInput] = useState('');
  const [vipCodeError, setVipCodeError] = useState<string | null>(null);
  const [vipCodeSuccess, setVipCodeSuccess] = useState<string | null>(null);
  const [showCodeBox, setShowCodeBox] = useState(false);

  const handleVerifyVipCode = (e: React.FormEvent) => {
    e.preventDefault();
    setVipCodeError(null);
    setVipCodeSuccess(null);
    const code = vipCodeInput.trim().toUpperCase();
    const validCodes = [
      'EDUZONE-VIP-2026',
      'VIP100',
      'EDUZONE2026',
      'VIP-ABDULLAH',
      'EDUZONE-PAID',
      'VIP2026',
      'EDUZONE-VIP'
    ];
    if (validCodes.includes(code)) {
      try {
        localStorage.setItem('eduzone_paid_vip_active', 'true');
      } catch (err) {
        console.error(err);
      }
      setIsPaidVip(true);
      setVipCodeSuccess('تم تفعيل اشتراك VIP بنجاح! جميع الأسئلة الـ 200 أصبحت متاحة لك الآن بالكامل.');
      setShowCodeBox(false);
      setVipCodeInput('');
      setXpBanner('🎉 مبروك! تم تفعيل باقة VIP وفتح بنك الأسئلة بالكامل.');
      setTimeout(() => setXpBanner(null), 4000);
    } else {
      setVipCodeError('كود التفعيل غير صحيح. يرجى سداد الاشتراك (100 جنيه) والتواصل مع الإدارة عبر تليجرام لاستلام كود التفعيل.');
    }
  };

  // Filter questions based on subject & free/all filter & search
  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) {
        return false;
      }
      if (showOnlyFree && !q.isFree) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          q.question.toLowerCase().includes(query) ||
          q.subject.toLowerCase().includes(query) ||
          q.options.some((o) => o.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [selectedSubject, showOnlyFree, searchQuery]);

  const subjects = useMemo(() => {
    const list = Array.from(new Set(QUESTION_BANK.map((q) => q.subject)));
    return ['all', ...list];
  }, []);

  // Resume when modal opens (called before any early return to obey React Rules of Hooks)
  useEffect(() => {
    if (isOpen && currentUser) {
      const targetIdx = getResumeIndexForList(
        selectedSubject,
        filteredQuestions,
        subjectPositions,
        userAnswers
      );
      setCurrentIndex(targetIdx);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Requirement: Prevent opening question bank without logging in!
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
        <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-indigo-500/50 p-6 space-y-5 text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-black text-white">
              تسجيل الدخول مطلوب أولاً
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              لفتح بنك الأسئلة الشامل (1600+ سؤال) وحفظ تقدمك ونقاطك (XP) يرجى تسجيل الدخول برقم هاتفك.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenAuthModal) onOpenAuthModal();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول برقم الهاتف الآن</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              إلغاء والعودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion: BankQuestion | undefined =
    filteredQuestions[currentIndex] || filteredQuestions[0];

  const isCurrentPaidLocked = Boolean(
    currentQuestion && !currentQuestion.isFree && !isUserVip
  );

  const handleSelectOption = (optIndex: number) => {
    if (!currentQuestion || isCurrentPaidLocked) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optIndex,
    }));
    setRevealedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));

    if (
      optIndex === currentQuestion.correctIndex &&
      !awardedXpIds.includes(currentQuestion.id)
    ) {
      setAwardedXpIds((prev) => [...prev, currentQuestion.id]);
      awardPoints(25, `حل سؤال صحيح: ${currentQuestion.subject}`, 'quiz');
      setXpBanner(`إجابة صحيحة! أحسنت، حصلت على +25 نقطة XP.`);
      setTimeout(() => setXpBanner(null), 3500);
    }
  };

  const handleSelectSubject = (newSubject: string) => {
    setSelectedSubject(newSubject);
    setSearchQuery('');

    const newQuestions = QUESTION_BANK.filter((q) => {
      if (newSubject !== 'all' && q.subject !== newSubject) return false;
      if (showOnlyFree && !q.isFree) return false;
      return true;
    });

    const targetIdx = getResumeIndexForList(
      newSubject,
      newQuestions,
      subjectPositions,
      userAnswers
    );
    setCurrentIndex(targetIdx);
  };

  const handleConfirmReset = (scope: 'current' | 'all') => {
    if (scope === 'current') {
      const targetIds = new Set(filteredQuestions.map((q) => q.id));
      setUserAnswers((prev) => {
        const next = { ...prev };
        targetIds.forEach((id) => delete next[id]);
        return next;
      });
      setRevealedAnswers((prev) => {
        const next = { ...prev };
        targetIds.forEach((id) => delete next[id]);
        return next;
      });
      setSubjectPositions((prev) => {
        const next = { ...prev, [selectedSubject]: 0 };
        try {
          localStorage.setItem('eduzone_quiz_positions', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      setCurrentIndex(0);
      setXpBanner(`تم مسح إجابات ${selectedSubject === 'all' ? 'جميع الأسئلة' : selectedSubject} والعودة إلى السؤال رقم 1.`);
    } else {
      setUserAnswers({});
      setRevealedAnswers({});
      setSubjectPositions({});
      try {
        localStorage.removeItem('eduzone_quiz_answers');
        localStorage.removeItem('eduzone_quiz_revealed');
        localStorage.removeItem('eduzone_quiz_positions');
      } catch (e) {}
      setCurrentIndex(0);
      setXpBanner('تم مسح جميع الإجابات وإعادة البدء من السؤال الأول في كافة المواد.');
    }
    setShowResetConfirm(false);
    setTimeout(() => setXpBanner(null), 4000);
  };

  const handleResetCurrent = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
    setRevealedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Jump to specific question number
  const handleJumpToNum = (num: number) => {
    const targetIdx = filteredQuestions.findIndex((q) => q.num === num);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    } else {
      const clampedIdx = Math.max(
        0,
        Math.min(filteredQuestions.length - 1, num - 1)
      );
      setCurrentIndex(clampedIdx);
    }
  };

  // Calculate score on answered questions
  const solvedCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const targetQ = QUESTION_BANK.find((q) => q.id === qId);
    return targetQ && targetQ.correctIndex === ans;
  }).length;

  const handleOpenTelegramUnlock = () => {
    window.open('https://t.me/+2OhLLu7ofSoxNTNk', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn text-right">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[94vh] text-right text-white">
        {/* Header - Compact for Mobile & Desktop in Pure Dark Mode */}
        <div className="bg-slate-950 text-white px-3.5 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                  بنك الأسئلة التفاعلي (1600+ سؤال)
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                  200 سؤال لكل مادة (60 مجاناً و 140 VIP)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                اختبارات تفاعلية بنظام البابل شيت مع الشرح الفوري
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUserVip && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>عضوية VIP مفعلة</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating XP Banner */}
        {xpBanner && (
          <div className="bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 px-3 py-1.5 text-center text-xs font-black shadow-md flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{xpBanner}</span>
          </div>
        )}

        {/* Filter Bar & Navigation Tools - Dark Luxury */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-2.5 space-y-2 shrink-0">
          {/* Search, Score Tracker & Free-only Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentIndex(0);
                }}
                placeholder="ابحث في الأسئلة..."
                className="w-full pl-3 pr-8 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            {/* Score Tracker */}
            <div className="text-[11px] font-bold text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 shrink-0 flex items-center gap-1">
              <span>درجتك:</span>
              <span className="text-emerald-400 font-mono font-black">{correctCount}</span>
              <span>/</span>
              <span className="font-mono text-slate-400">{solvedCount}</span>
            </div>

            {/* Free questions only toggle */}
            <button
              onClick={() => {
                setShowOnlyFree((prev) => !prev);
                setCurrentIndex(0);
              }}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                showOnlyFree
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="عرض الأسئلة الـ 60 المجانية فقط"
            >
              {showOnlyFree ? 'المجاني (60)' : 'الكل (200)'}
            </button>
          </div>

          {/* Subject Pills (Scrollable horizontally) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {subjects.map((sub) => {
              const isActive = selectedSubject === sub;
              const countInSub =
                sub === 'all'
                  ? QUESTION_BANK.length
                  : QUESTION_BANK.filter((q) => q.subject === sub).length;
              const label =
                sub === 'all'
                  ? `جميع المواد (${countInSub})`
                  : `${sub} (${countInSub})`;

              return (
                <button
                  key={sub}
                  onClick={() => handleSelectSubject(sub)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Quick Jump Shortcuts Row */}
          <div className="flex items-center justify-between gap-1 text-[11px] bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-400 font-bold text-[10px]">قفز سريع:</span>
              <button
                onClick={() => handleJumpToNum(1)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-[10px] cursor-pointer"
              >
                سؤال 1
              </button>
              <button
                onClick={() => handleJumpToNum(60)}
                className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] cursor-pointer"
              >
                سؤال 60 (آخر المجاني)
              </button>
              <button
                onClick={() => handleJumpToNum(61)}
                className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 font-bold text-[10px] cursor-pointer flex items-center gap-1"
              >
                <span>سؤال 61 (مدفوع 🔒)</span>
              </button>
              <button
                onClick={() => handleJumpToNum(200)}
                className="px-2 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 font-bold text-[10px] cursor-pointer flex items-center gap-1"
              >
                <span>سؤال 200 (مدفوع 🔒)</span>
              </button>

              {/* Reset answers button */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-2 py-0.5 rounded bg-red-500/15 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-colors"
                title="مسح الإجابات والبدء من السؤال الأول"
              >
                <RotateCcw className="w-3 h-3 text-red-400" />
                <span>مسح الإجابات والبدء من 1</span>
              </button>
            </div>

            {/* Jump by number */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max={filteredQuestions.length || 200}
                placeholder="رقم"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && jumpInput) {
                    handleJumpToNum(parseInt(jumpInput, 10));
                    setJumpInput('');
                  }
                }}
                className="w-14 text-center py-0.5 text-[10px] rounded border border-slate-700 bg-slate-950 text-white"
              />
              <button
                onClick={() => {
                  if (jumpInput) {
                    handleJumpToNum(parseInt(jumpInput, 10));
                    setJumpInput('');
                  }
                }}
                className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded text-[10px] font-black cursor-pointer"
              >
                انتقال
              </button>
            </div>
          </div>
        </div>

        {/* Question Viewer Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 bg-slate-950 space-y-4">
          {currentQuestion ? (
            isCurrentPaidLocked ? (
              /* ========================================================= */
              /* STRICT PAYWALL CARD FOR QUESTIONS 61-200 (PAID VIP ONLY)   */
              /* ========================================================= */
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-2xl border-2 border-amber-400 p-5 sm:p-7 text-white text-right space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-br-xl flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>محتوى مدفوع (VIP)</span>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      السؤال #{currentQuestion.num} (من 200) في مادة {currentQuestion.subject}
                    </h3>
                    <p className="text-xs text-amber-300 font-bold mt-0.5">
                      توقف عند السؤال 60 — هذا المحتوى مخصص لمشتركي باقة VIP الرسمية فقط
                    </p>
                  </div>
                </div>

                {/* Firm Notice Banner */}
                <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-semibold">
                    تم استنفاد كافة الأسئلة المجانية (من 1 إلى 60). الأسئلة من <span className="text-amber-300 font-bold">61 إلى 200</span> مدفوعة وتتطلب سداد رسوم الاشتراك رسمياً (100 جنيه فقط للترم). لا يوجد فتح تجريبي لهذه الأسئلة.
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    لقد قمت بحل الأسئلة المجانية الـ <span className="text-emerald-400 font-bold">60 الأولى</span> في مادة <span className="text-white font-bold">{currentQuestion.subject}</span>!
                  </p>
                  <p>
                    الـ <span className="text-amber-400 font-bold">140 سؤال المتبقية</span> تحتوي على أفكار الربط، مسائل المستويات العليا، ونماذج امتحانات الثانوية العامة المحدثة 2026/2027 مع الشرح الكامل.
                  </p>
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>قيمة الاشتراك: 100 جنيه فقط / ترم</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                      <Check className="w-3.5 h-3.5 text-sky-400" />
                      <span>فودافون كاش أو إنستاباي والتفعيل فوري</span>
                    </div>
                  </div>
                </div>

                {/* VIP Activation Code Box (If Student Already Paid) */}
                {showCodeBox ? (
                  <form onSubmit={handleVerifyVipCode} className="bg-slate-950 p-3.5 rounded-xl border border-amber-400/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" />
                        <span>أدخل كود تفعيل الاشتراك المدفوع:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCodeBox(false)}
                        className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        إغلاق
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={vipCodeInput}
                        onChange={(e) => setVipCodeInput(e.target.value)}
                        placeholder="مثال: EDUZONE-VIP-2026"
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 uppercase font-mono tracking-wider"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        تأكيد التفعيل
                      </button>
                    </div>
                    {vipCodeError && (
                      <p className="text-[11px] text-red-400 font-bold mt-1">
                        {vipCodeError}
                      </p>
                    )}
                  </form>
                ) : (
                  vipCodeSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-xs text-emerald-300 font-bold text-center">
                      {vipCodeSuccess}
                    </div>
                  )
                )}

                {/* Unlock CTA Buttons - Strict Payment Flow */}
                <div className="space-y-2 pt-1">
                  {onOpenPricingModal && (
                    <button
                      onClick={onOpenPricingModal}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-slate-950" />
                      <span>سداد الاشتراك وفتح الـ 200 سؤال (100 جنيه)</span>
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleOpenTelegramUnlock}
                      className="py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>تواصل مع الإدارة عبر تليجرام للدفع</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCodeBox((prev) => !prev)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>قمت بالدفع؟ أدخل كود التفعيل</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleJumpToNum(60)}
                    className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    العودة لآخر سؤال مجاني (سؤال 60)
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================= */
              /* INTERACTIVE QUESTION CARD IN SLEEK DARK THEME             */
              /* ========================================================= */
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-3.5">
                {/* Question Metadata Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-md">
                      السؤال #{currentQuestion.num} من {filteredQuestions.length}
                    </span>
                    {currentQuestion.isFree ? (
                      <span className="text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        مجاني (1 - 60)
                      </span>
                    ) : (
                      <span className="text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>VIP مدفوع</span>
                      </span>
                    )}
                    <span className="text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>+25 XP</span>
                    </span>
                  </div>
                  <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded-md text-xs border border-slate-700">
                    {currentQuestion.subject}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestion.id] === optIdx;
                    const isRevealed = revealedAnswers[currentQuestion.id];
                    const isCorrect = optIdx === currentQuestion.correctIndex;

                    let btnClass =
                      'bg-slate-950/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700';

                    if (isRevealed) {
                      if (isCorrect) {
                        btnClass =
                          'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        btnClass =
                          'bg-red-950/80 border-red-500 text-red-200 ring-1 ring-red-400';
                      } else {
                        btnClass = 'bg-slate-950/40 border-slate-850 text-slate-500';
                      }
                    } else if (isSelected) {
                      btnClass =
                        'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold ring-1 ring-indigo-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                            {['أ', 'ب', 'ج', 'د'][optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isRevealed && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Explanation Box */}
                {revealedAnswers[currentQuestion.id] && (
                  <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs leading-relaxed text-amber-200 space-y-1 animate-fadeIn">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>التفسير العلمي المعتمد:</span>
                    </div>
                    <p className="text-amber-100 font-medium">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              لا توجد أسئلة تطابق البحث الحالي.
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-950 px-3.5 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>السابق</span>
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(filteredQuestions.length - 1, prev + 1)
                )
              }
              disabled={currentIndex >= filteredQuestions.length - 1}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>التالي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-400 tabular-nums">
            {currentIndex + 1} من {filteredQuestions.length}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowResetConfirm(true)}
              title="مسح الإجابات والبدء من السؤال الأول"
              className="px-2 py-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer border border-transparent hover:border-red-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">مسح والبدء من 1</span>
            </button>
            {currentQuestion && revealedAnswers[currentQuestion.id] && (
              <button
                onClick={handleResetCurrent}
                title="إعادة حل هذا السؤال فقط"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONFIRMATION MODAL: RESET ANSWERS & RESTART FROM 1       */}
        {/* ========================================================= */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 text-right">
            <div className="bg-slate-900 border-2 border-red-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <span>مسح الإجابات والبدء من جديد</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                هل تود مسح الإجابات المحفوظة والعودة إلى السؤال رقم 1 للبدء من جديد؟
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleConfirmReset('current')}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  مسح إجابات المادة الحالية ({selectedSubject === 'all' ? 'جميع الأسئلة' : selectedSubject})
                </button>
                <button
                  onClick={() => handleConfirmReset('all')}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  مسح إجابات جميع المواد بالكامل
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  إلغاء والاحتفاظ بتقدمي الحالي
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
