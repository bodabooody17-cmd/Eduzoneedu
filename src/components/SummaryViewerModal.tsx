import React, { useState, useEffect } from 'react';
import { SummaryItem } from '../types';
import { awardPoints } from '../utils/gamification';
import { isAllowedForTrack } from '../lib/strictFilter';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Zap,
} from 'lucide-react';

interface SummaryViewerModalProps {
  item: SummaryItem | null;
  onClose: () => void;
  onDownloadPdf: (item: SummaryItem) => void;
}

export const SummaryViewerModal: React.FC<SummaryViewerModalProps> = ({
  item,
  onClose,
  onDownloadPdf,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showEarnedToast, setShowEarnedToast] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    setCurrentPageIndex(0);
    setHasCompleted(false);
    setShowEarnedToast(false);
  }, [item]);

  if (!item) return null;

  const myTrack = typeof window !== 'undefined' ? localStorage.getItem('EduZone_Track') || '' : '';
  const isAllowed = !myTrack || isAllowedForTrack(`${item.title} ${item.subject || ''}`, myTrack);

  if (!isAllowed) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 text-right">
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fadeIn">
          <div className="text-red-400 font-bold text-sm">
            هذه المادة غير متاحة لشعبتك: {myTrack}
          </div>
          <p className="text-xs text-slate-400">
            تم حظر استعراض هذه المذكرة حفاظاً على مسار شعبتك المعتمد.
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

  const totalPages = item.pages?.length || 1;
  const currentPage = item.pages?.[currentPageIndex] || {
    pageNumber: 1,
    title: item.title,
    content: [item.description],
    keyFormulas: [],
    examTip: '',
  };

  const handleCompleteReading = () => {
    if (hasCompleted) return;
    awardPoints(50, `إنهاء قراءة مذكرة: ${item.title}`, 'summary');
    setHasCompleted(true);
    setShowEarnedToast(true);
    setTimeout(() => {
      setShowEarnedToast(false);
    }, 4500);
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      if (nextIdx === totalPages - 1 && !hasCompleted) {
        handleCompleteReading();
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn text-right">
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[95vh] text-white">
        {/* Header */}
        <div className="bg-slate-950 text-white p-3.5 sm:p-4.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-md">
                  {item.trackLabel}
                </span>
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  +50 نقطة
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                {item.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDownloadPdf(item)}
              title="تحميل المذكرة PDF"
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تحميل PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Progress */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              صفحة {currentPageIndex + 1} من {totalPages}
            </span>
            <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-750">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((currentPageIndex + 1) / totalPages) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(zoomLevel === 'normal' ? 'large' : 'normal')}
              className="p-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 text-slate-200 cursor-pointer"
              title="تكبير / تصغير الخط"
            >
              {zoomLevel === 'normal' ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
            </button>
            {hasCompleted ? (
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                مكتمل +50 XP
              </span>
            ) : (
              <button
                onClick={handleCompleteReading}
                className="text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
              >
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>إنهاء القراءة (+50 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating XP Reward Notification */}
        {showEarnedToast && (
          <div className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 p-2.5 text-center text-xs font-black shadow-md flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>تهانينا! حصلت على 50 نقطة خبرة (XP) لإكمال قراءة المذكرة!</span>
          </div>
        )}

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-7 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-amber-300">
                {currentPage.title}
              </h3>
              <span className="text-xs text-slate-400 font-bold">
                إعداد المعلم: {item.author}
              </span>
            </div>

            {/* Paragraphs */}
            <div className={`space-y-3 ${zoomLevel === 'large' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'} text-slate-200 leading-relaxed font-normal`}>
              {currentPage.content.map((p, idx) => (
                <p key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {p}
                </p>
              ))}
            </div>

            {/* Key Formulas */}
            {currentPage.keyFormulas && currentPage.keyFormulas.length > 0 && (
              <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-black text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>القوانين الهامة:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentPage.keyFormulas.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono font-bold text-amber-300 dir-ltr text-center"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Tip */}
            {currentPage.examTip && (
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black block text-amber-300">
                    نصيحة ذهبية للامتحان:
                  </strong>
                  <span>{currentPage.examTip}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              currentPageIndex === 0
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>
          <span className="text-xs text-slate-400 font-bold tabular-nums">
            {currentPageIndex + 1} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              currentPageIndex === totalPages - 1
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <span>الصفحة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
