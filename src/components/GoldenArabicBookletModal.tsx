import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  BookOpen,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { SUMMARY_ITEMS } from '../data/coursesData';
import { SummaryItem } from '../types';
import { downloadSummaryAsDocument } from '../utils/downloadHelper';

interface GoldenArabicBookletModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: SummaryItem | null;
}

export const GoldenArabicBookletModal: React.FC<GoldenArabicBookletModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const currentItem = item || SUMMARY_ITEMS.find((s) => s.id === 'arab-01') || SUMMARY_ITEMS[0];
  const subjectName = currentItem.subject || 'اللغة العربية';
  const bookletTitle = currentItem.title || `مذكرة ${subjectName} الذهبية`;
  const storageKey = `eduzone_booklet_${currentItem.id}_pages`;

  // Pre-load pages from currentItem if available
  const defaultPages = useMemo(() => {
    if (currentItem && currentItem.pages && currentItem.pages.length > 0) {
      return currentItem.pages.map((p: any) => {
        const titleLine = `📌 [${p.title}]`;
        const contentLines = p.content.join('\n\n');
        const formulas = p.keyFormulas && p.keyFormulas.length > 0
          ? `\n\n⚡ القوانين الذهبية:\n${p.keyFormulas.map((f: string) => `• ${f}`).join('\n')}`
          : '';
        const tip = p.examTip ? `\n\n💡 نصيحة ليلة الامتحان: ${p.examTip}` : '';
        return `${titleLine}\n\n${contentLines}${formulas}${tip}`;
      });
    }
    return [];
  }, [currentItem]);

  const [allPages, setAllPages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return defaultPages;
  });

  const [current, setCurrent] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderText, setLoaderText] = useState('');
  const [genBtnText, setGenBtnText] = useState('توليد 24 صفحة بالذكاء الاصطناعي (8 دفعات)');
  const [showGeneratorPanel, setShowGeneratorPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (allPages.length === 0 && defaultPages.length > 0) {
      setAllPages(defaultPages);
    }
  }, [defaultPages, allPages.length]);

  if (!isOpen) return null;

  function getTopicForBatch(sub: string, b: number): string {
    const norm = (sub || '').trim();
    if (norm.includes('فيزياء') || norm.includes('Physics')) {
      const list = [
        '1-3: التيار الكهربي وقانون أوم وتوصيل المقاومات',
        '4-6: قانونا كيرشوف وتحليل المسارات المعقدة',
        '7-9: التأثير المغناطيسي للتيار الكهربي',
        '10-12: القوة المغناطيسية وعزم الازدواج وأجهزة القياس',
        '13-15: الحث الكهرومغناطيسي وقانون فاراداي ولنز',
        '16-18: الدينامو ومولد التيار المتردد والمحول الكهربي',
        '19-21: دوائر التيار المتردد والرنين',
        '22-24: فيزياء حديثة وازدواجية الموجة والجسيم والليزر',
      ];
      return list[b - 1] || 'الفيزياء الحديثة والكهرومغناطيسية';
    }
    if (norm.includes('كيمياء') || norm.includes('Chemistry')) {
      const list = [
        '1-3: العناصر الانتقالية والسلسلة الأولى وحالات التأكسد',
        '4-6: خامات الحديد وتفاعلات أكاسيد الحديد والسبائك',
        '7-9: التحليل الكيميائي الوصفي والأنيونات والكاتيونات',
        '10-12: التحليل الحجمي وقوانين المعايرة والتطاير والترسيب',
        '13-15: الاتزان الكيميائي والأيوني وقاعدة لوشاتيليه',
        '16-18: الكيمياء الكهربية والخلايا الجلفانية وفاراداي',
        '19-21: الكيمياء العضوية: الهيدروكربونات الأليفاتية',
        '22-24: مشتقات الهيدروكربونات (كحولات، فينولات، أحماض، أسترات)',
      ];
      return list[b - 1] || 'الكيمياء العامة والعضوية';
    }
    if (norm.includes('أحياء') || norm.includes('احياء')) {
      const list = [
        '1-3: الدعامة والحركة في النبات والإنسان',
        '4-6: التنسيق الهرموني والغدد الصماء ووظائف الهرمونات',
        '7-9: التكاثر في الكائنات الحية والنباتات الزهرية',
        '10-12: التكاثر في الإنسان والإخصاب والحمل',
        '13-15: المناعة في النبات والتركيب المناعي للإنسان',
        '16-18: آليات الاستجابة المناعية الخلطية والخلوية',
        '19-21: الحمض النووي DNA وتضاعفه وإصلاح عيوبه',
        '22-24: الحمض النووي RNA وتخليق البروتين والهندسة الوراثية',
      ];
      return list[b - 1] || 'الأحياء والوراثة';
    }
    if (norm.includes('جيولوجيا')) {
      const list = [
        '1-3: كوكب الأرض ومكوناته وأغلفته',
        '4-6: الطيات والفوالق والفواصل وأسطح عدم التوافق',
        '7-9: المعادن والأنظمة البلورية والخواص الفيزيائية',
        '10-12: دورة الصخور وأنواع الصخور والبراكين',
        '13-15: الحركات الأرضية وتكتونية الألواح والزلازل',
        '16-18: التجوية وعوامل النقل والتفتيت والترسيب',
        '19-21: مفاهيم البيئة والنظم البيئية البحرية والصحراوية',
        '22-24: استنزاف الموارد الطبيعية وحماية البيئة',
      ];
      return list[b - 1] || 'الجيولوجيا وعلوم البيئة';
    }
    if (norm.includes('بحتة') || norm.includes('تفاضل') || norm.includes('تكامل') || norm.includes('جبر')) {
      const list = [
        '1-3: اشتقاق الدوال المثلثية والاشتقاق الضمني والبارامتري',
        '4-6: تطبيقات التفاضل والمعدلات الزمنية والقيم العظمى والصغرى',
        '7-9: تفاضل وتكامل الدوال الأسية واللوغاريتمية الطبيعية',
        '10-12: سلوك الدالة وفترات التحدب ونقاط الانقلاب',
        '13-15: طرق التكامل بالتجزيء والتعويض والمساحات والحجوم',
        '16-18: الجبر: مبدأ العد، التباديل والتوافيق، وذات الحدين',
        '19-21: الأعداد المركبة ونظرية دي موافر والصورة المثلثية',
        '22-24: المحددات والمصفوفات ومعادلة المستقيم والمستوى في الفراغ',
      ];
      return list[b - 1] || 'الرياضيات البحتة';
    }
    if (norm.includes('تطبيقية') || norm.includes('استاتيكا') || norm.includes('ديناميكا')) {
      const list = [
        '1-3: الاحتكاك على مستوى أفقي ومستوى مائل خشن',
        '4-6: عزوم القوى في المستوى ثنائي وثلاثي الأبعاد',
        '7-9: القوى المتوازية المستوية والاتزان العام للأجسام',
        '10-12: الازدواجات ومركز الثقل وطريقة الكتل السالبة',
        '13-15: تفاضل وتكامل الدوال المتجهة والسرعة والعجلة',
        '16-18: كمية الحركة وقوانين نيوتن الثلاثة للحركة',
        '19-21: حركة المصاعد وحركة الأجسام على البكرات والمستويات',
        '22-24: الدفع والتصادم والشغل وطاقة الحركة والوضع والقدرة',
      ];
      return list[b - 1] || 'الرياضيات التطبيقية';
    }
    if (norm.includes('تاريخ')) {
      const list = [
        '1-3: الحملة الفرنسية على مصر والشام ومقاومة المصريين',
        '4-6: خروج الفرنسيين وتولية محمد علي حكم مصر',
        '7-9: بناء الدولة الحديثة ونظام الاحتكار الاقتصادي',
        '10-12: سياسة مصر الخارجية وخلفاء محمد علي والأزمة المالية',
        '13-15: الثورة العرابية والاحتلال البريطاني وكفاح مصطفى كامل',
        '16-18: ثورة 1919 وتصريح 28 فبراير ومعاهدة 1936',
        '19-21: ثورة 23 يوليو 1952 وإنجازاتها الشاملة',
        '22-24: القضية الفلسطينية والحروب العربية الإسرائيلية وثورات مصر',
      ];
      return list[b - 1] || 'التاريخ الحديث';
    }
    if (norm.includes('جغرافيا')) {
      const list = [
        '1-3: مدخل لدراسة الجغرافيا السياسية والدولة ومفاهيمها',
        '4-6: المقومات الطبيعية لقوة الدولة وموقعها وتضاريسها',
        '7-9: المقومات البشرية لقوة الدولة والسكان والتكنولوجيا',
        '10-12: النظام السياسي والانتخابي والحدود السياسية وتطورها',
        '13-15: أنواع الحدود السياسية الطبيعية والهندسية والبشرية',
        '16-18: المشكلات السياسية والاقتصادية والنزاعات المائية والدولية',
        '19-21: التكتلات الاقتصادية الكبرى والأحلاف العسكرية العالمية',
        '22-24: النظام العالمي الجديد وتأثيراته ونواتج التعلم',
      ];
      return list[b - 1] || 'الجغرافيا السياسية';
    }
    if (norm.includes('فلسفة') || norm.includes('منطق')) {
      const list = [
        '1-3: الفلسفة وقضايا البيئة ومراحل علاقة الإنسان بالبيئة',
        '4-6: الأخلاق البيولوجية والطبية (البيوتيقا) وتطبيقاتها',
        '7-9: الأخلاق المهنية والمسؤولية وأخلاقيات العمل',
        '10-12: التفلسف وعلاقته بالقيم والحرية الإنسانية',
        '13-15: الاستدلال الاستقرائي وتطبيقه في العلوم الطبيعية',
        '16-18: الاستنباط والنسق الرياضي وصياغة الحجج المنطقية',
        '19-21: التكامل بين الاستقراء والاستنباط في المنهج المعاصر',
        '22-24: المنطق وتكنولوجيا الاتصال والذكاء الاصطناعي والمغالطات',
      ];
      return list[b - 1] || 'الفلسفة والمنطق';
    }

    // Default Arabic
    const topics = [
      '1-3: المشتقات اسم الفاعل واسم المفعول وصيغ المبالغة',
      '4-6: المصادر كلها الميمي والصناعي والمرة والهيئة',
      '7-9: البلاغة التشبيه وأنواعه وصور الجمال',
      '10-12: الاستعارة والكناية والمجاز المرسل',
      '13-15: المحسنات البديعية والأساليب الإنشائية والخبرية',
      '16-18: النحو المبتدأ والخبر والنواسخ',
      '19-21: التوابع والمنصوبات والمجرورات',
      '22-24: أسئلة متوقعة وإعراب الثوابت ونصائح ليلة الامتحان',
    ];
    return topics[b - 1] || `مذكرة ${sub} الذهبية`;
  }

  // AI 24-Page Batch Generator (8 batches, 3 pages each)
  const generate24 = async () => {
    setIsGenerating(true);
    const newPages: string[] = [];

    for (let batch = 1; batch <= 8; batch++) {
      const startPage = (batch - 1) * 3 + 1;
      const endPage = batch * 3;

      setLoaderText(`⏳ بولد صفحات ${startPage} لـ ${endPage} من 24 لمادة ${subjectName}...`);
      setGenBtnText(`جاري ${endPage} / 24`);

      const topic = getTopicForBatch(subjectName, batch);
      const prompt = `اكتب صفحات ${startPage} الى ${endPage} فقط من ${bookletTitle} - ثانوية عامة / شهادات معتمدة
كل صفحة 500 كلمة كاملة بالتفصيل
التزم بهذا الشكل بالحرف:
[بداية صفحة ${startPage}] محتوى صفحة ${startPage} 500 كلمة [نهاية صفحة ${startPage}]
[بداية صفحة ${startPage + 1}] محتوى صفحة ${startPage + 1} 500 كلمة [نهاية صفحة ${startPage + 1}]
[بداية صفحة ${endPage}] محتوى صفحة ${endPage} 500 كلمة [نهاية صفحة ${endPage}]
الموضوع: ${topic}`;

      try {
        let extracted: string[] = [];

        // Check if user provided direct client API key or use server route
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
          // Use server route proxy
          const res = await fetch('/api/ai/generate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              batch,
              subject: subjectName,
              subjectTitle: bookletTitle,
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
          setAllPages([...newPages]);
        }
      } catch (e) {
        console.error('Error generating batch:', e);
      }

      // Rest 800ms between batches
      await new Promise((r) => setTimeout(r, 800));
    }

    setLoaderText(`✅ خلصت 24 صفحة كاملة لمادة ${subjectName}`);
    setGenBtnText('✅ تم - 24 صفحة جاهزة');
    setIsGenerating(false);
    setCurrent(0);

    if (newPages.length > 0) {
      setAllPages(newPages);
      try {
        localStorage.setItem(storageKey, JSON.stringify(newPages));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetDefault = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setAllPages(defaultPages);
    setCurrent(0);
    setLoaderText(`تمت استعادة النسخة المعتمدة لمادة ${subjectName}`);
  };

  const handleDownload = () => {
    if (allPages && allPages.length > 0) {
      const tempItem: any = {
        ...currentItem,
        pagesCount: allPages.length,
        pages: allPages.map((pText, idx) => ({
          pageNumber: idx + 1,
          title: `صفحة ${idx + 1} - ${subjectName}`,
          content: pText.split('\n').filter((l) => l.trim().length > 0),
        })),
      };
      downloadSummaryAsDocument(tempItem);
    } else {
      downloadSummaryAsDocument(currentItem);
    }
  };

  const handleCopyPage = () => {
    if (!allPages[current]) return;
    navigator.clipboard.writeText(allPages[current]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentPageText = allPages[current] || 'جاري تحميل محتوى الصفحة...';
  const pageLines = currentPageText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const currentBatchNum = Math.min(8, Math.floor(current / 3) + 1);
  const currentBatchTopic = getTopicForBatch(subjectName, currentBatchNum);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0f1220]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 text-white font-sans text-right animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0f1220] border border-[#2a2d45] rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2d45] flex items-center justify-between shrink-0 bg-[#0f1220]/90">
          <div className="flex items-center gap-3">
            <div className="bg-[#1a1d2f] border border-[#2a2d45] p-2.5 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              <span>📖</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-900/60 text-blue-200 border border-blue-700/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {currentItem.trackLabel || 'ثانوية عامة (علمي / أدبي)'}
                </span>
                <span className="bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  24 صفحة كاملة
                </span>
              </div>
              <h1 className="font-black text-sm sm:text-base text-white mt-1">
                {bookletTitle} (24 صفحة)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGeneratorPanel(!showGeneratorPanel)}
              title="إعدادات المولد بالذكاء الاصطناعي"
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                showGeneratorPanel
                  ? 'bg-[#fbbf24] text-slate-950 border-[#fbbf24]'
                  : 'bg-[#1a1d2f] text-gray-300 border-[#2a2d45] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="تحميل المذكرة كاملة PDF"
              className="bg-[#2a2d45] hover:bg-[#383d5e] text-white p-2 rounded-xl transition-colors cursor-pointer border border-[#3b3f63]"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="إغلاق"
              className="bg-[#1a1d2f] hover:bg-red-500/20 hover:text-red-400 p-2 rounded-xl text-gray-400 transition-colors cursor-pointer border border-[#2a2d45]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Page Indicator */}
        <div className="px-4 py-2.5 bg-[#14172a] border-b border-[#2a2d45] flex items-center gap-3 shrink-0">
          <div className="bg-yellow-400 text-black text-[10px] sm:text-xs px-3 py-1 rounded-full font-black shadow-xs shrink-0">
            صفحة {current + 1} من {allPages.length || 24}
          </div>
          <div className="flex-1 h-2 bg-[#1a1d2f] rounded-full overflow-hidden border border-[#2a2d45]">
            <div
              className="h-full bg-[#fbbf24] transition-all duration-300"
              style={{
                width: `${allPages.length > 0 ? ((current + 1) / allPages.length) * 100 : 4}%`,
              }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-yellow-400 shrink-0">
            {Math.round(((current + 1) / (allPages.length || 24)) * 100)}%
          </span>
        </div>

        {/* Topic Title Badge */}
        <div className="bg-[#1a1d2f]/70 border-b border-[#2a2d45] px-4 py-1.5 flex items-center justify-between text-[11px] text-gray-300 shrink-0">
          <span className="font-bold text-yellow-400/90 truncate">
            📌 {currentBatchTopic}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPage}
              className="hover:text-yellow-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
        </div>

        {/* AI Generator Panel (Optional Accordion) */}
        {showGeneratorPanel && (
          <div className="p-3.5 bg-[#14172a] border-b border-[#2a2d45] text-xs space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#fbbf24] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                المولد الذاتي بالذكاء الاصطناعي (Gemini 24 صفحة)
              </span>
              <button
                onClick={handleResetDefault}
                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer underline"
              >
                <RefreshCw className="w-3 h-3" />
                استعادة النسخة الوزارية المعتمدة
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="حط مفتاح Gemini API هنا (أو اتركه فارغاً للاعتماد على السيرفر)"
                className="flex-1 p-2.5 rounded-xl bg-[#1a1d2f] text-white border border-[#2a2d45] text-xs focus:outline-none focus:border-[#fbbf24]"
              />
              <button
                onClick={generate24}
                disabled={isGenerating}
                className={`px-4 py-2.5 rounded-xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  isGenerating
                    ? 'bg-amber-600 text-white cursor-wait'
                    : 'bg-[#fbbf24] hover:bg-yellow-400 text-slate-950 shadow-md'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{genBtnText}</span>
              </button>
            </div>

            {loaderText && (
              <div className="text-[11px] font-bold text-yellow-300 flex items-center gap-1.5 bg-[#1a1d2f] p-2 rounded-lg border border-[#2a2d45]">
                <span className="animate-spin text-xs">⏳</span>
                <span>{loaderText}</span>
              </div>
            )}
          </div>
        )}

        {/* Main Content Viewer (Lines displayed inside card rounded-2xl p-4) */}
        <div
          id="pageContent"
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#0f1220]"
        >
          {pageLines.map((line, idx) => {
            const isHeader = line.startsWith('📌') || line.startsWith('الوحدة') || line.startsWith('البلاغة');
            const isFormula = line.startsWith('⚡') || line.includes('->') || line.includes('=');
            const isTip = line.startsWith('💡');

            return (
              <div
                key={idx}
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all shadow-md ${
                  isHeader
                    ? 'bg-gradient-to-r from-blue-950/70 to-[#1a1d2f] border border-blue-500/40 text-yellow-300 font-black text-sm sm:text-base'
                    : isTip
                    ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                    : isFormula
                    ? 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 font-mono'
                    : 'bg-[#1a1d2f] border border-[#2a2d45] text-gray-200 font-normal'
                }`}
              >
                {line}
              </div>
            );
          })}
        </div>

        {/* Quick Page Jump Selector */}
        <div className="px-4 py-2 bg-[#14172a] border-t border-[#2a2d45] overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
          {Array.from({ length: allPages.length || 24 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer flex items-center justify-center ${
                current === idx
                  ? 'bg-[#fbbf24] text-slate-950 font-black shadow-sm'
                  : 'bg-[#1a1d2f] text-gray-400 hover:text-white border border-[#2a2d45]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Bottom Footer Navigation */}
        <div className="p-3 sm:p-4 bg-[#0f1220] border-t border-[#2a2d45] flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
            disabled={current === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              current === 0
                ? 'bg-[#1a1d2f] text-gray-600 cursor-not-allowed border border-[#2a2d45]'
                : 'bg-[#1a1d2f] hover:bg-[#252a42] text-white border border-[#2a2d45]'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة السابقة</span>
          </button>

          <div
            id="bottomCounter"
            className="text-xs sm:text-sm font-bold text-gray-300 font-mono"
          >
            {current + 1} / {allPages.length || 24}
          </div>

          <button
            onClick={() => setCurrent((prev) => Math.min(allPages.length - 1, prev + 1))}
            disabled={current >= (allPages.length || 24) - 1}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              current >= (allPages.length || 24) - 1
                ? 'bg-[#1a1d2f] text-gray-600 cursor-not-allowed border border-[#2a2d45]'
                : 'bg-[#fbbf24] hover:bg-yellow-400 text-slate-950 font-black shadow-md'
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
