import React, { useState, useMemo, useEffect } from 'react';
import { QUESTION_BANK, BankQuestion } from '../data/questionBankData';
import { filterQuestions } from '../lib/questionBankFilter';
import { awardPoints } from '../utils/gamification';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  Lock,
  Unlock,
  Check,
  Zap,
} from 'lucide-react';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricingModal?: () => void;
  currentUser?: any;
  onOpenAuthModal?: () => void;
  userRole?: string;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  onOpenPricingModal,
  currentUser,
}) => {
  const [studentTrack, setStudentTrack] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('EduZone_Track') ||
        localStorage.getItem('userBranch') ||
        ''
      );
    } catch {
      return '';
    }
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jumpInput, setJumpInput] = useState<string>('');
  const [xpBanner, setXpBanner] = useState<string | null>(null);

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

  const [savedResumeInfo, setSavedResumeInfo] = useState<{
    index: number;
    subject: string;
  } | null>(null);

  // Check for saved question progress on opening
  useEffect(() => {
    if (isOpen) {
      try {
        const savedIdxStr = localStorage.getItem('eduzone_quiz_last_index');
        const savedSub = localStorage.getItem('eduzone_quiz_last_subject') || 'all';
        if (savedIdxStr !== null) {
          const idx = parseInt(savedIdxStr, 10);
          if (!isNaN(idx) && idx > 0) {
            setSavedResumeInfo({ index: idx, subject: savedSub });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  // Persist current question position whenever it changes
  useEffect(() => {
    if (isOpen && currentIndex >= 0) {
      try {
        localStorage.setItem('eduzone_quiz_last_index', String(currentIndex));
        localStorage.setItem('eduzone_quiz_last_subject', selectedSubject);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, currentIndex, selectedSubject]);

  useEffect(() => {
    const handleTrackUpdate = () => {
      const trk =
        localStorage.getItem('EduZone_Track') ||
        localStorage.getItem('userBranch') ||
        '';
      setStudentTrack(trk);
    };
    window.addEventListener('storage', handleTrackUpdate);
    window.addEventListener('eduzone_track_changed', handleTrackUpdate);
    return () => {
      window.removeEventListener('storage', handleTrackUpdate);
      window.removeEventListener('eduzone_track_changed', handleTrackUpdate);
    };
  }, []);

  // Filter entire bank strictly by student track
  const trackQuestions: BankQuestion[] = useMemo(() => {
    return filterQuestions(QUESTION_BANK, studentTrack);
  }, [studentTrack]);

  // Distinct subjects available in the student track
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    trackQuestions.forEach((q) => {
      if (q.subject) set.add(q.subject);
    });
    return Array.from(set);
  }, [trackQuestions]);

  // Filter questions based on subject, free/paid, and search query
  const filteredQuestions = useMemo(() => {
    return trackQuestions.filter((q) => {
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
          q.options.some((o: string) => o.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [trackQuestions, selectedSubject, showOnlyFree, searchQuery]);

  // Active question
  const currentQuestion: BankQuestion | undefined = filteredQuestions[currentIndex];

  // User state on current question
  const isAnswered = currentQuestion ? userAnswers[currentQuestion.id] !== undefined : false;
  const userAnswerIndex = currentQuestion ? userAnswers[currentQuestion.id] : undefined;
  const isRevealed = currentQuestion ? revealedAnswers[currentQuestion.id] : false;

  // Track question IDs and scores
  const trackQuestionIds = useMemo(() => new Set(trackQuestions.map((q) => q.id)), [trackQuestions]);
  const solvedCount = Object.keys(userAnswers).filter((qId) => trackQuestionIds.has(qId)).length;
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    if (!trackQuestionIds.has(qId)) return false;
    const targetQ = QUESTION_BANK.find((q) => q.id === qId);
    return targetQ && targetQ.correctIndex === ans;
  }).length;

  const handleSelectOption = (index: number) => {
    if (!currentQuestion || isAnswered) return;

    const newAnswers = { ...userAnswers, [currentQuestion.id]: index };
    setUserAnswers(newAnswers);
    try {
      localStorage.setItem('eduzone_quiz_answers', JSON.stringify(newAnswers));
    } catch (e) {
      console.error(e);
    }

    if (index === currentQuestion.correctIndex) {
      awardPoints(10, `حل سؤال صحيح: ${currentQuestion.subject}`, 'quiz');
      setXpBanner('+10 XP إجابة صحيحة!');
      setTimeout(() => setXpBanner(null), 3000);
    }
  };

  const handleToggleReveal = () => {
    if (!currentQuestion) return;
    const newRevealed = {
      ...revealedAnswers,
      [currentQuestion.id]: !revealedAnswers[currentQuestion.id],
    };
    setRevealedAnswers(newRevealed);
    try {
      localStorage.setItem('eduzone_quiz_revealed', JSON.stringify(newRevealed));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(jumpInput.trim(), 10);
    if (isNaN(targetNum)) return;

    const targetIdx = filteredQuestions.findIndex((q) => q.num === targetNum);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
      setJumpInput('');
    } else if (targetNum >= 1 && targetNum <= filteredQuestions.length) {
      setCurrentIndex(targetNum - 1);
      setJumpInput('');
    }
  };

  const handleSelectSubject = (newSubject: string) => {
    setSelectedSubject(newSubject);
    setSearchQuery('');
    setCurrentIndex(0);
  };

  const handleResumeSavedProgress = () => {
    if (!savedResumeInfo) return;
    if (savedResumeInfo.subject && savedResumeInfo.subject !== selectedSubject) {
      setSelectedSubject(savedResumeInfo.subject);
    }
    const targetIdx = Math.min(savedResumeInfo.index, filteredQuestions.length - 1);
    setCurrentIndex(Math.max(0, targetIdx));
    setSavedResumeInfo(null);
  };

  const handleDismissAndRestart = () => {
    setCurrentIndex(0);
    setSavedResumeInfo(null);
    try {
      localStorage.setItem('eduzone_quiz_last_index', '0');
    } catch {}
  };

  const handleResetAnswers = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط إجابات هذا القسم؟')) {
      setUserAnswers({});
      setRevealedAnswers({});
      try {
        localStorage.removeItem('eduzone_quiz_answers');
        localStorage.removeItem('eduzone_quiz_revealed');
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 text-white font-sans text-right animate-fadeIn select-none">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 flex flex-col max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
              📝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  بنك الأسئلة الشامل
                </span>
                <span className="text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-md">
                  {trackQuestions.length} سؤال متاح
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                اختبار تفاعلي مع تصحيح فوري وشرح الإجابات النموذجية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAnswers}
              title="إعادة ضبط إجاباتي"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="إغلاق"
              className="p-1.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-lg transition cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track Banner */}
        {studentTrack && (
          <div className="bg-yellow-400 text-slate-950 px-3.5 py-1.5 text-xs font-black flex items-center justify-between shrink-0 border-b border-yellow-500/30">
            <span>📚 مسارك المعتمد: {studentTrack}</span>
            <div className="flex items-center gap-2 text-[11px]">
              <span>المحلول: {solvedCount}</span>
              <span>•</span>
              <span>الصحيح: {correctCount}</span>
            </div>
          </div>
        )}

        {/* Floating XP Toast */}
        {xpBanner && (
          <div className="bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 px-3 py-1.5 text-center text-xs font-black shadow-md flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>{xpBanner}</span>
          </div>
        )}

        {/* Subject Navigation Pills */}
        <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => handleSelectSubject('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-yellow-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-750'
            }`}
          >
            الكل ({trackQuestions.length})
          </button>
          {availableSubjects.map((sub) => {
            const count = trackQuestions.filter((q) => q.subject === sub).length;
            return (
              <button
                key={sub}
                onClick={() => handleSelectSubject(sub)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedSubject === sub
                    ? 'bg-yellow-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-750'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search & Free Filter */}
        <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="ابحث في الأسئلة أو الخيارات..."
              className="w-full pr-8 pl-3 py-1.5 bg-slate-950 text-white placeholder:text-slate-500 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <button
            onClick={() => {
              setShowOnlyFree(!showOnlyFree);
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
              showOnlyFree
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {showOnlyFree ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showOnlyFree ? 'المجاني فقط' : 'كل الأسئلة'}</span>
          </button>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950">
          {/* Resume Previous Session Banner */}
          {savedResumeInfo && (
            <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-slate-900 border border-yellow-400/50 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-fadeIn">
              <div className="flex items-center gap-3 text-right w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 font-bold shrink-0 text-base shadow-sm">
                  📍
                </div>
                <div>
                  <div className="text-xs font-black text-yellow-300">
                    لديك جلسة أسئلة سابقة متوقفة!
                  </div>
                  <div className="text-[11px] text-slate-300">
                    كنت متوقفاً عند السؤال رقم <span className="text-yellow-400 font-bold font-mono">#{savedResumeInfo.index + 1}</span> {savedResumeInfo.subject !== 'all' ? `(${savedResumeInfo.subject})` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  type="button"
                  onClick={handleResumeSavedProgress}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إكمال من حيث توقفت</span>
                </button>
                <button
                  type="button"
                  onClick={handleDismissAndRestart}
                  className="bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
                >
                  <span>إلغاء والبدء م الأول</span>
                </button>
              </div>
            </div>
          )}
          {!currentQuestion ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-bold">لا توجد أسئلة تطابق البحث المحدد في شعبتك.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('all');
                  setShowOnlyFree(false);
                }}
                className="px-4 py-2 bg-yellow-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
              >
                إلغاء الفلاتر وعرض الكل
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                    {currentQuestion.subject}
                  </span>
                  <span className="text-slate-400 font-bold">
                    سؤال {currentQuestion.num || currentIndex + 1} من {filteredQuestions.length}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    currentQuestion.isFree
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {currentQuestion.isFree ? 'مجاني' : 'VIP'}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-black text-white leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentQuestion.options.map((option, idx) => {
                  let optStyle =
                    'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800';

                  if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      optStyle =
                        'bg-emerald-950/80 text-emerald-300 border-emerald-500 font-bold shadow-md';
                    } else if (idx === userAnswerIndex) {
                      optStyle = 'bg-red-950/80 text-red-300 border-red-500';
                    } else {
                      optStyle = 'bg-slate-950 opacity-40 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mr-2" />
                      )}
                      {isAnswered && idx === userAnswerIndex && idx !== currentQuestion.correctIndex && (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mr-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Hint */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleToggleReveal}
                  className="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{isRevealed ? 'إخفاء الشرح النموذجي' : 'إظهار الشرح النموذجي'}</span>
                </button>
              </div>

              {isRevealed && (
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200 leading-relaxed animate-fadeIn">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>التوضيح والتعليل الوزاري:</span>
                  </div>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
              currentIndex === 0
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          {/* Jump Form & Restart */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleJumpToQuestion} className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-mono">
                {currentIndex + 1} / {filteredQuestions.length || 1}
              </span>
              <input
                type="number"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                placeholder="#"
                title="انتقال لرقم سؤال"
                className="w-11 px-1.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-center text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </form>
            <button
              type="button"
              onClick={handleDismissAndRestart}
              title="إعادة البدء من السؤال الأول"
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 hover:text-yellow-400 border border-slate-800 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-yellow-400" />
              <span className="hidden sm:inline">من الأول</span>
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredQuestions.length - 1}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
              currentIndex >= filteredQuestions.length - 1
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black shadow-md'
            }`}
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
