import React, { useState, useEffect, useMemo } from 'react';
import { SummaryItem, SummaryPage } from '../types';
import { awardPoints } from '../utils/gamification';
import { isAllowedForTrack } from '../lib/strictFilter';
import { downloadSummaryAsDocument } from '../utils/downloadHelper';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Zap,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface SummaryViewerModalProps {
  item: SummaryItem | null;
  onClose: () => void;
  onDownloadPdf: (item: SummaryItem) => void;
  onOpenGoldenBooklet?: () => void;
}

export const SummaryViewerModal: React.FC<SummaryViewerModalProps> = ({
  item,
  onClose,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showEarnedToast, setShowEarnedToast] = useState(false);

  // AI 24-page Generator states
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderText, setLoaderText] = useState('');
  const [genBtnText, setGenBtnText] = useState('🚀 ولد المذكرة 24 صفحة كاملة (8 دفعات)');
  const [showGeneratorPanel, setShowGeneratorPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  // Custom generated 24 pages for this specific summary
  const [generatedPages, setGeneratedPages] = useState<string[] | null>(null);

  useEffect(() => {
    setCurrentPageIndex(0);
    setHasCompleted(false);
    setShowEarnedToast(false);
    setIsGenerating(false);
    setLoaderText('');

    if (item) {
      try {
        const saved = localStorage.getItem(`eduzone_summary_24_${item.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGeneratedPages(parsed);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setGeneratedPages(null);
    }
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

  // Active pages list
  const totalPages = generatedPages ? generatedPages.length : (item.pages?.length || 1);
  const isUsingGeneratedPages = Boolean(generatedPages && generatedPages.length > 0);

  const currentGeneratedContent = isUsingGeneratedPages && generatedPages ? generatedPages[currentPageIndex] : null;
  const currentStructuredPage: SummaryPage = (!isUsingGeneratedPages && item.pages && item.pages[currentPageIndex])
    ? item.pages[currentPageIndex]
    : {
        pageNumber: currentPageIndex + 1,
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

  // 8-Batch 24-Page AI Generation
  const generate24Pages = async () => {
    setIsGenerating(true);
    const newPages: string[] = [];
    const targetSubject = item.subject || item.title;
    const targetBranch = item.trackLabel || 'ثانوية عامة';

    for (let batch = 1; batch <= 8; batch++) {
      const startPage = (batch - 1) * 3 + 1;
      const endPage = batch * 3;

      setLoaderText(
        `⏳ بولد صفحات ${startPage}-${endPage} من 24 لمادة ${targetSubject} شعبة ${targetBranch}...`
      );
      setGenBtnText(`جاري ${endPage} / 24`);

      const prompt = `اكتب صفحات ${startPage} الى ${endPage} فقط من مذكرة ${targetSubject} للثانوية العامة شعبة ${targetBranch} منهج 2026/2027 كل صفحة 500 كلمة كاملة بالتفصيل.
التزم بهذا الشكل بالحرف:
[بداية صفحة ${startPage}] محتوى صفحة ${startPage} 500 كلمة [نهاية صفحة ${startPage}]
[بداية صفحة ${startPage + 1}] محتوى صفحة ${startPage + 1} 500 كلمة [نهاية صفحة ${startPage + 1}]
[بداية صفحة ${endPage}] محتوى صفحة ${endPage} 500 كلمة [نهاية صفحة ${endPage}]
الموضوع: مراجعة شاملة للوحدات والدروس ونواتج التعلم الوزارية في ${targetSubject}`;

      try {
        let extracted: string[] = [];

        if (apiKey.trim()) {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 8000, temperature: 0.5 },
              }),
            }
          );
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const regex = /\[بداية صفحة \d+\]([\s\S]*?)\[نهاية صفحة \d+\]/g;
          let m;
          while ((m = regex.exec(text)) !== null) {
            extracted.push(m[1].trim());
          }
          if (extracted.length === 0 && text.trim()) {
            extracted.push(text.trim());
          }
        } else {
          const res = await fetch('/api/ai/generate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              batch,
              subject: targetSubject,
              subjectTitle: item.title,
              customPrompt: prompt,
            }),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.pages)) {
            extracted = data.pages.map((p: any) => p.content || p);
          }
        }

        if (extracted.length > 0) {
          newPages.push(...extracted);
          setGeneratedPages([...newPages]);
        }
      } catch (err) {
        console.error('Error generating batch in summary viewer:', err);
      }

      await new Promise((r) => setTimeout(r, 800));
    }

    setLoaderText('✅ خلصت 24 صفحة كاملة للمادة!');
    setGenBtnText('✅ تم - 24 صفحة جاهزة');
    setIsGenerating(false);
    setCurrentPageIndex(0);

    if (newPages.length > 0) {
      setGeneratedPages(newPages);
      try {
        localStorage.setItem(`eduzone_summary_24_${item.id}`, JSON.stringify(newPages));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem(`eduzone_summary_24_${item.id}`);
    } catch {}
    setGeneratedPages(null);
    setCurrentPageIndex(0);
    setLoaderText('تمت استعادة النسخة المعتمدة مسبقاً للمادة');
  };

  const handleDownloadPdfDocument = () => {
    if (isUsingGeneratedPages && generatedPages) {
      // Build temporary SummaryItem with all 24 generated pages
      const tempItem: SummaryItem = {
        ...item,
        pagesCount: generatedPages.length,
        pages: generatedPages.map((pText, idx) => ({
          pageNumber: idx + 1,
          title: `صفحة ${idx + 1} - ${item.subject}`,
          content: pText.split('\n').filter((l) => l.trim().length > 0),
        })),
      };
      downloadSummaryAsDocument(tempItem);
    } else {
      downloadSummaryAsDocument(item);
    }
  };

  const handleCopyCurrentPage = () => {
    let textToCopy = '';
    if (isUsingGeneratedPages && currentGeneratedContent) {
      textToCopy = currentGeneratedContent;
    } else {
      textToCopy = `${currentStructuredPage.title}\n\n${currentStructuredPage.content.join('\n\n')}`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0f1220]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn text-right text-white font-sans">
      <div className="bg-[#0f1220] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#2a2d45] overflow-hidden flex flex-col max-h-[96vh]">
        {/* Header */}
        <div className="bg-[#0f1220] p-4 flex items-center justify-between border-b border-[#2a2d45] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a1d2f] border border-[#2a2d45] text-yellow-400 flex items-center justify-center text-xl shrink-0 shadow-inner">
              <BookOpen className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-[#1a1d2f] text-yellow-300 border border-yellow-400/30 px-2.5 py-0.5 rounded-full">
                  {item.trackLabel}
                </span>
                <span className="text-[10px] font-bold text-yellow-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  +50 XP
                </span>
                {isUsingGeneratedPages && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    مذكرة 24 صفحة (AI)
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                {item.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGeneratorPanel(!showGeneratorPanel)}
              title="توليد المذكرة 24 صفحة كاملة بالذكاء الاصطناعي"
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer border ${
                showGeneratorPanel
                  ? 'bg-yellow-400 text-slate-950 border-yellow-400 shadow-md'
                  : 'bg-[#1a1d2f] text-yellow-300 border-yellow-400/30 hover:bg-[#252840]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مولد 24 صفحة</span>
            </button>

            <button
              onClick={handleDownloadPdfDocument}
              title="تحميل المذكرة كاملة PDF"
              className="px-3 py-1.5 bg-[#2a2d45] hover:bg-[#383d5e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-[#3b3f63]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تحميل PDF</span>
            </button>

            <button
              onClick={onClose}
              title="إغلاق"
              className="p-1.5 bg-[#1a1d2f] text-gray-400 hover:text-white rounded-xl border border-[#2a2d45] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Generator Panel */}
        {showGeneratorPanel && (
          <div className="p-4 bg-[#14172a] border-b border-[#2a2d45] space-y-3 animate-fadeIn text-xs shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-black text-yellow-300 flex items-center gap-1.5 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                توليد مذكرة 24 صفحة كاملة على 8 دفعات لمادة ({item.subject})
              </span>
              {isUsingGeneratedPages && (
                <button
                  onClick={handleResetToDefault}
                  className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  استعادة المذكرة الأصلية
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-300">
              يتم توليد 8 دفعات متتالية (كل دفعة 3 صفحات = 24 صفحة كاملة بمعدل 500 كلمة لكل صفحة) مخصصة لمسارك الدراسي ومنهج 2026/2027.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="مفتاح Gemini API (اختياري - اتركه فارغاً للاعتماد على السيرفر المدمج)"
                className="flex-1 p-2.5 rounded-xl bg-[#1a1d2f] text-white border border-[#2a2d45] text-xs focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={generate24Pages}
                disabled={isGenerating}
                className={`px-4 py-2.5 rounded-xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  isGenerating
                    ? 'bg-amber-600 text-white cursor-wait'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-md'
                }`}
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{genBtnText}</span>
              </button>
            </div>

            {loaderText && (
              <div className="text-[11px] font-bold text-yellow-300 bg-[#1a1d2f] p-2.5 rounded-xl border border-[#2a2d45] flex items-center gap-2">
                <span className="animate-spin text-sm">⏳</span>
                <span>{loaderText}</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar & Page Indicator */}
        <div className="bg-[#14172a] border-b border-[#2a2d45] px-4 py-2.5 flex items-center justify-between text-xs text-gray-300 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <span className="bg-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] shrink-0">
              صفحة {currentPageIndex + 1} من {totalPages}
            </span>
            <div className="flex-1 h-2 bg-[#1a1d2f] rounded-full overflow-hidden border border-[#2a2d45]">
              <div
                className="h-full bg-[#fbbf24] transition-all duration-300 rounded-full"
                style={{ width: `${Math.round(((currentPageIndex + 1) / totalPages) * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[11px] font-bold text-yellow-400 shrink-0">
              {Math.round(((currentPageIndex + 1) / totalPages) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrentPage}
              className="text-xs text-gray-300 hover:text-yellow-400 flex items-center gap-1 cursor-pointer transition mr-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الصفحة'}</span>
            </button>

            {hasCompleted ? (
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                مكتمل +50 XP
              </span>
            ) : (
              <button
                onClick={handleCompleteReading}
                className="text-[11px] font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer shadow-xs transition"
              >
                <Zap className="w-3 h-3 fill-slate-950" />
                <span>إنهاء (+50 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {showEarnedToast && (
          <div className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 p-2.5 text-center text-xs font-black shadow-md flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>تهانينا! حصلت على 50 نقطة خبرة (XP) لإكمال قراءة المذكرة!</span>
          </div>
        )}

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f1220] space-y-4">
          {isUsingGeneratedPages && currentGeneratedContent ? (
            /* Render AI 24-page format with line cards */
            <div className="space-y-3.5">
              <div className="bg-[#1a1d2f] border border-yellow-400/30 rounded-2xl p-4 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-yellow-300">
                  صفحة {currentPageIndex + 1} - مذكرة {item.subject} الشاملة
                </h3>
                <span className="text-xs text-gray-400 font-bold">
                  منهج الثانوية العامة 2026/2027
                </span>
              </div>

              {currentGeneratedContent
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.length > 0)
                .map((line, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1a1d2f] border border-[#2a2d45] rounded-2xl p-4 text-xs sm:text-sm leading-7 text-gray-200 shadow-sm"
                  >
                    {line}
                  </div>
                ))}
            </div>
          ) : (
            /* Render standard curated structured page */
            <div className="space-y-4">
              <div className="bg-[#1a1d2f] border border-[#2a2d45] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-yellow-300">
                  {currentStructuredPage.title}
                </h3>
                <span className="text-xs text-gray-400 font-bold">
                  إعداد: {item.author}
                </span>
              </div>

              {/* Content Paragraphs */}
              <div className="space-y-3">
                {currentStructuredPage.content.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1a1d2f] border border-[#2a2d45] p-4 rounded-2xl text-xs sm:text-sm leading-7 text-gray-200 shadow-sm"
                  >
                    {p}
                  </div>
                ))}
              </div>

              {/* Key Formulas */}
              {currentStructuredPage.keyFormulas && currentStructuredPage.keyFormulas.length > 0 && (
                <div className="bg-[#14172a] border border-yellow-400/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400 font-black text-xs sm:text-sm">
                    <Zap className="w-4 h-4 fill-yellow-400" />
                    <span>القوانين والمعادلات الذهبية:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentStructuredPage.keyFormulas.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        className="bg-[#1a1d2f] p-3 rounded-xl border border-[#2a2d45] text-xs font-mono font-bold text-yellow-300 text-center"
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Tip */}
              {currentStructuredPage.examTip && (
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-amber-200">
                  <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-black block text-yellow-300 mb-0.5">
                      نصيحة ذهبية ليلة الامتحان:
                    </strong>
                    <span>{currentStructuredPage.examTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Page Jump Selector */}
        {totalPages > 1 && (
          <div className="px-4 py-2 bg-[#14172a] border-t border-[#2a2d45] overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer flex items-center justify-center ${
                  currentPageIndex === idx
                    ? 'bg-yellow-400 text-slate-950 font-black shadow-sm'
                    : 'bg-[#1a1d2f] text-gray-400 hover:text-white border border-[#2a2d45]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="bg-[#0f1220] border-t border-[#2a2d45] p-3 sm:p-4 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              currentPageIndex === 0
                ? 'bg-[#1a1d2f] text-gray-600 cursor-not-allowed border border-[#2a2d45]'
                : 'bg-[#1a1d2f] hover:bg-[#252840] text-gray-200 border border-[#2a2d45]'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>

          <span className="text-xs text-gray-300 font-bold font-mono">
            {currentPageIndex + 1} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              currentPageIndex === totalPages - 1
                ? 'bg-[#1a1d2f] text-gray-600 cursor-not-allowed border border-[#2a2d45]'
                : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black shadow-md'
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
