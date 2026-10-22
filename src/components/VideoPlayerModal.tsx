import React, { useState } from 'react';
import { VideoCourse } from '../types';
import { awardPoints } from '../utils/gamification';
import { isAllowedForTrack } from '../lib/strictFilter';
import {
  X,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  BookOpen,
  Clock,
  ListOrdered,
  Sparkles,
  Zap,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  ShieldCheck,
  Type,
  Sun,
  Layout,
  FileText,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface VideoPlayerModalProps {
  course: VideoCourse | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  course,
  onClose,
  isAdmin = false,
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [showEarnedToast, setShowEarnedToast] = useState(false);
  const [boardZoom, setBoardZoom] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reading Mode Specific States
  const [readerFontSize, setReaderFontSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('lg');
  const [enhanceInkContrast, setEnhanceInkContrast] = useState<boolean>(true);
  const [readerViewMode, setReaderViewMode] = useState<'text' | 'board' | 'dual'>('dual');
  const [copiedLesson, setCopiedLesson] = useState(false);

  // Video Mode Specific States (for non-reader courses)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(25);

  if (!course) return null;

  const isReader = course.format === 'reader' || course.id === 'course-english-masterclass';
  const myTrack = typeof window !== 'undefined' ? localStorage.getItem('EduZone_Track') || '' : '';
  const isAllowed =
    isAdmin ||
    course.track === 'general' ||
    course.track === 'free_courses' ||
    course.id === 'course-english-masterclass' ||
    !myTrack ||
    isAllowedForTrack(`${course.title} ${course.category || ''}`, myTrack);

  if (!isAllowed) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 text-right">
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fadeIn">
          <div className="text-red-400 font-bold text-sm">
            هذه المادة غير متاحة لشعبتك: {myTrack}
          </div>
          <p className="text-xs text-slate-400">
            تم حظر استعراض هذا المعسكر حفاظاً على مسار شعبتك المعتمد.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            إغلاق والعودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[selectedLessonIndex] || course.lessons[0];
  const isLessonCompleted = completedLessonIds.includes(currentLesson.id);

  const handleCompleteLesson = () => {
    if (isLessonCompleted) return;
    setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    awardPoints(80, `إتمام قراءة: ${currentLesson.title} (${course.title})`, 'course');
    setShowEarnedToast(true);
    setTimeout(() => {
      setShowEarnedToast(false);
    }, 4500);
  };

  const handlePrevLesson = () => {
    if (selectedLessonIndex > 0) {
      setSelectedLessonIndex(selectedLessonIndex - 1);
      setBoardZoom(1);
    }
  };

  const handleNextLesson = () => {
    if (selectedLessonIndex < course.lessons.length - 1) {
      setSelectedLessonIndex(selectedLessonIndex + 1);
      setBoardZoom(1);
    }
  };

  const handleCopyLessonText = () => {
    const textLines = [
      currentLesson.title,
      '',
      `ملخص المحاضرة: ${currentLesson.summary}`,
      '',
      ...(currentLesson.fullTranscription || []),
      '',
      'النقاط الجوهرية:',
      ...(currentLesson.keyTakeaways || []).map((k) => `• ${k}`),
      '',
      currentLesson.examTip ? `نصيحة الامتحان: ${currentLesson.examTip}` : '',
      '',
      'منصة EduZone التعليمية - المرجع التأسيسي الشامل'
    ].join('\n');

    navigator.clipboard.writeText(textLines).then(() => {
      setCopiedLesson(true);
      setTimeout(() => setCopiedLesson(false), 2000);
    });
  };

  // Font size mapping for clear reading
  const fontSizeClasses = {
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-loose',
    xl: 'text-lg sm:text-xl leading-loose font-normal',
    '2xl': 'text-xl sm:text-2xl leading-loose font-medium',
  }[readerFontSize];

  // Board contrast filter
  const boardFilterStyle = enhanceInkContrast
    ? 'contrast-[1.3] brightness-[1.03] saturate-[1.12]'
    : 'contrast-100';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 animate-fadeIn">
        <div className="bg-slate-950 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[95vh] text-right">
          {/* Top Bar Header */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                {isReader ? <BookOpen className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                    {course.title}
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {isReader ? 'مذكرة قراءة تفاعلية معتمدة' : 'معتمد رسمياً'}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                  <span className="text-emerald-400 font-bold">{course.instructor}</span>
                  <span aria-hidden="true">•</span>
                  <span>{course.lessonsCount} محاضرات مقروءة</span>
                  <span aria-hidden="true">•</span>
                  <span className="text-amber-400 font-bold">جميع الشعب ومجاني 100%</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reader Sub-Toolbar (Only for Reading Courses) */}
          {isReader && (
            <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Display Mode Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setReaderViewMode('dual')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    readerViewMode === 'dual'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="عرض السبورة والشرح المكتوب معاً جنباً إلى جنب"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">عرض متكامل (سبورة + شرح)</span>
                  <span className="sm:hidden">متكامل</span>
                </button>
                <button
                  onClick={() => setReaderViewMode('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    readerViewMode === 'text'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="قراءة الشرح المكتوب بخط واضح ومكبر فقط"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>الشرح المقروء المفرغ</span>
                </button>
                <button
                  onClick={() => setReaderViewMode('board')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    readerViewMode === 'board'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="عرض السبورة الأصلية فقط مع خيارات التكبير"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>السبورة الأصلية</span>
                </button>
              </div>

              {/* Font Size & Clarity Controls */}
              <div className="flex items-center gap-2">
                {/* Font Size Selector */}
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-slate-400 hidden sm:inline ml-1">توضيح الخط:</span>
                  {(['base', 'lg', 'xl', '2xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setReaderFontSize(sz)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                        readerFontSize === sz
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title={sz === '2xl' ? 'خط كبير عريض جداً' : sz === 'xl' ? 'خط كبير' : 'خط افتراضي'}
                    >
                      {sz === 'base' ? 'A' : sz === 'lg' ? 'A+' : sz === 'xl' ? 'A++' : 'ضخم'}
                    </button>
                  ))}
                </div>

                {/* Enhance Ink Contrast Toggle */}
                {currentLesson.imageUrl && (
                  <button
                    onClick={() => setEnhanceInkContrast(!enhanceInkContrast)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                      enhanceInkContrast
                        ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title="زيادة تباين الحبر ووضوح خط اليد على السبورة"
                  >
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>{enhanceInkContrast ? 'الخط موضح ✨' : 'توضيح السبورة'}</span>
                  </button>
                )}

                {/* Copy Text */}
                <button
                  onClick={handleCopyLessonText}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition cursor-pointer"
                  title="نسخ نص المحاضرة للمذاكرة"
                >
                  {copiedLesson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Main Reading Stage */}
          <div className={`flex-1 overflow-y-auto bg-slate-950 ${isReader ? 'p-3 sm:p-6' : 'grid grid-cols-1 lg:grid-cols-12'}`}>
            {/* Main Content Stage */}
            <div className={`${isReader ? 'w-full max-w-5xl mx-auto flex flex-col text-white' : 'lg:col-span-8 flex flex-col p-3 sm:p-6 text-white border-b lg:border-b-0 lg:border-l border-slate-800 overflow-y-auto'}`}>
              {/* Lecture Title Card */}
              <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                        المحاضرة {selectedLessonIndex + 1} من {course.lessons.length}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{currentLesson.duration}</span>
                      </span>
                    </div>
                    <h1 className="text-base sm:text-xl font-black text-white leading-snug">
                      {currentLesson.title}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isLessonCompleted ? (
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>تمت القراءة (+80 XP)</span>
                      </span>
                    ) : (
                      <button
                        onClick={handleCompleteLesson}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                      >
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>إتمام المحاضرة (+80 XP)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lesson Summary intro */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>موضوع وخلاصة المحاضرة:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentLesson.summary}
                  </p>
                </div>
              </div>

              {/* VIEW MODE 1: DUAL MODE (Board on one side or top, Text right under/beside) */}
              {isReader && readerViewMode === 'dual' && (
                <div className="space-y-6">
                  {/* The Enhanced Board Canvas */}
                  {currentLesson.imageUrl && (
                    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-md">
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white text-xs">
                            {currentLesson.boardTitle || 'سبورة الشرح اليدوية الأصلية'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setBoardZoom((prev) => Math.max(0.7, prev - 0.2))}
                            className="p-1 sm:px-2 sm:py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="تصغير"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">تصغير</span>
                          </button>
                          <button
                            onClick={() => setBoardZoom(1)}
                            className="p-1 sm:px-2 sm:py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="الحجم الطبيعي"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">100%</span>
                          </button>
                          <button
                            onClick={() => setBoardZoom((prev) => Math.min(2.5, prev + 0.2))}
                            className="p-1 sm:px-2 sm:py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="تكبير"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">تكبير</span>
                          </button>
                          <button
                            onClick={() => setIsLightboxOpen(true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                            title="عرض ملء الشاشة لقراءة الخط اليدوي بدقة"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>ملء الشاشة</span>
                          </button>
                        </div>
                      </div>

                      {/* Board Image Container with Zoom & Filter */}
                      <div className="relative min-h-[360px] sm:min-h-[460px] max-h-[620px] overflow-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                        <img
                          src={currentLesson.imageUrl}
                          alt={currentLesson.title}
                          style={{ transform: `scale(${boardZoom})`, transformOrigin: 'top center' }}
                          className={`max-w-full rounded-lg shadow-2xl transition-all duration-200 object-contain cursor-zoom-in ${boardFilterStyle}`}
                          onClick={() => setIsLightboxOpen(true)}
                        />
                      </div>
                      <div className="text-center mt-2 text-[11px] text-slate-400">
                        💡 اضغط على السبورة أو زر "ملء الشاشة" لتكبيرها، وتم تفعيل تحسين التباين التلقائي لتوضيح الخط.
                      </div>
                    </div>
                  )}

                  {/* Transcribed Text Section (Large, clear typography) */}
                  <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-md space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <h2 className="text-base sm:text-lg font-black text-white">
                          شرح وتفريغ المحاضرة بخط كبير وواضح جداً (EduZone Reader)
                        </h2>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                        خط عالي التباين
                      </span>
                    </div>

                    {/* Detailed Content Paragraphs */}
                    <div className="space-y-4">
                      {(currentLesson.fullTranscription || []).map((paragraph, pIdx) => (
                        <div
                          key={pIdx}
                          className={`p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-100 ${fontSizeClasses}`}
                        >
                          {paragraph}
                        </div>
                      ))}
                    </div>

                    {/* Examples Section */}
                    {currentLesson.examples && currentLesson.examples.length > 0 && (
                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                        <span className="text-xs sm:text-sm font-black text-amber-400 block">
                          📝 أمثلة وتطبيقات عملية على المحاضرة:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {currentLesson.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm font-medium text-slate-200"
                            >
                              <span className="text-emerald-400 font-bold ml-1.5">#{exIdx + 1}</span>
                              {ex}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5">
                      <span className="text-xs sm:text-sm font-black text-emerald-400 block">
                        ✅ أبرز النقاط والقواعد الجوهرية للحفظ:
                      </span>
                      {(currentLesson.keyTakeaways || []).map((point, kIdx) => (
                        <div key={kIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* Exam & Fluency Tip */}
                    {currentLesson.examTip && (
                      <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-black text-amber-300 block mb-1">
                            💡 سر ليلة الامتحان والطلاقة اللغوية:
                          </span>
                          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                            {currentLesson.examTip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: TEXT ONLY (Ultra clean reading layout) */}
              {isReader && readerViewMode === 'text' && (
                <div className="bg-slate-900 rounded-2xl p-4 sm:p-7 border border-slate-800 shadow-md space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-base sm:text-xl font-black text-white">
                        مذكرة المحاضرة المقروءة (Text Mode)
                      </h2>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      حجم الخط الحالي: {readerFontSize.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {(currentLesson.fullTranscription || []).map((paragraph, pIdx) => (
                      <div
                        key={pIdx}
                        className={`p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 ${fontSizeClasses}`}
                      >
                        {paragraph}
                      </div>
                    ))}
                  </div>

                  {/* Examples */}
                  {currentLesson.examples && currentLesson.examples.length > 0 && (
                    <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
                      <span className="text-sm font-black text-amber-400 block">
                        📝 أمثلة وتطبيقات عملية:
                      </span>
                      <div className="space-y-2">
                        {currentLesson.examples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-200"
                          >
                            <span className="text-emerald-400 font-bold ml-2">#{exIdx + 1}</span>
                            {ex}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
                    <span className="text-sm font-black text-emerald-400 block">
                      ✅ أبرز القواعد المستفادة:
                    </span>
                    {(currentLesson.keyTakeaways || []).map((point, kIdx) => (
                      <div key={kIdx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Exam Tip */}
                  {currentLesson.examTip && (
                    <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 sm:p-5 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs sm:text-sm font-black text-amber-300 block mb-1">
                          💡 سر التفوق والامتحان:
                        </span>
                        <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                          {currentLesson.examTip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW MODE 3: BOARD ONLY */}
              {isReader && readerViewMode === 'board' && currentLesson.imageUrl && (
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm">
                        {currentLesson.boardTitle || currentLesson.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBoardZoom((prev) => Math.max(0.7, prev - 0.2))}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                        <span>تصغير</span>
                      </button>
                      <button
                        onClick={() => setBoardZoom(1)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>100%</span>
                      </button>
                      <button
                        onClick={() => setBoardZoom((prev) => Math.min(2.5, prev + 0.2))}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>تكبير</span>
                      </button>
                      <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>ملء الشاشة</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative min-h-[480px] max-h-[720px] overflow-auto flex items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <img
                      src={currentLesson.imageUrl}
                      alt={currentLesson.title}
                      style={{ transform: `scale(${boardZoom})`, transformOrigin: 'top center' }}
                      className={`max-w-full rounded-lg shadow-2xl transition-all duration-200 object-contain cursor-zoom-in ${boardFilterStyle}`}
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  </div>
                </div>
              )}

              {/* NON-READER VIEW: Standard Video Player Canvas (For other video courses) */}
              {!isReader && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-between p-4 group">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="bg-slate-800/90 text-slate-200 px-2.5 py-1 rounded-md font-bold">
                        {currentLesson.title}
                      </span>
                      <span className="text-emerald-400 font-bold">EduZone 1080p HD</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white translate-x-0.5" />}
                      </button>
                    </div>

                    <div className="bg-slate-950/90 backdrop-blur-md rounded-lg p-2.5 space-y-2">
                      <div
                        className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer overflow-hidden"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const percent = Math.round((clickX / rect.width) * 100);
                          setProgressPercent(Math.min(100, Math.max(0, percent)));
                        }}
                      >
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white cursor-pointer">
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>
                          <span className="tabular-nums font-mono text-[11px]">
                            {Math.floor((progressPercent * 45) / 100)}:20 / {currentLesson.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (playbackSpeed === 1) setPlaybackSpeed(1.25);
                              else if (playbackSpeed === 1.25) setPlaybackSpeed(1.5);
                              else setPlaybackSpeed(1);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-bold tabular-nums cursor-pointer"
                          >
                            {playbackSpeed}x
                          </button>
                          <Volume2 className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation Toolbar (Prev / Next Lesson & Direct Numbers) */}
              <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 text-xs">
                <button
                  onClick={handlePrevLesson}
                  disabled={selectedLessonIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 font-bold cursor-pointer transition shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>المحاضرة السابقة</span>
                </button>

                {/* Quick Horizontal Lecture Number Pills */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-full">
                  {course.lessons.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedLessonIndex(idx);
                        setBoardZoom(1);
                      }}
                      className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                        idx === selectedLessonIndex
                          ? 'bg-emerald-600 text-white font-black shadow-md ring-2 ring-emerald-400/40'
                          : completedLessonIds.includes(course.lessons[idx].id)
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={`محاضرة ${idx + 1}: ${course.lessons[idx].title}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextLesson}
                  disabled={selectedLessonIndex === course.lessons.length - 1}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold cursor-pointer transition shadow-sm"
                >
                  <span>المحاضرة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Floating XP Reward Notification */}
              {showEarnedToast && (
                <div className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 p-3 rounded-xl text-center text-xs font-black shadow-lg flex items-center justify-center gap-2 mt-4 animate-bounce">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>تهانينا! حصلت على +80 نقطة خبرة (XP) لإتمام قراءة المحاضرة!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Board Reading */}
      {isLightboxOpen && currentLesson.imageUrl && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-fadeIn">
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                عرض بدقة عالية
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {currentLesson.boardTitle || currentLesson.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEnhanceInkContrast(!enhanceInkContrast)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  enhanceInkContrast
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{enhanceInkContrast ? 'الخط موضح ✨' : 'توضيح الخط'}</span>
              </button>
              <a
                href={currentLesson.imageUrl}
                download={`EduZone-${currentLesson.id}.jpg`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                فتح الصورة الأصلية
              </a>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <img
              src={currentLesson.imageUrl}
              alt={currentLesson.title}
              className={`max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl object-contain border border-slate-800 ${boardFilterStyle}`}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <button
              onClick={handlePrevLesson}
              disabled={selectedLessonIndex === 0}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-white font-bold"
            >
              <ChevronRight className="w-4 h-4" />
              <span>المحاضرة السابقة</span>
            </button>
            <span>
              محاضرة {selectedLessonIndex + 1} من {course.lessons.length}
            </span>
            <button
              onClick={handleNextLesson}
              disabled={selectedLessonIndex === course.lessons.length - 1}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 rounded-lg text-white font-bold"
            >
              <span>المحاضرة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
