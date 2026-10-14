import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  FileDown,
  Trophy,
  UserCheck,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: (action: 'register' | 'guest') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handleSkip = () => {
    setCurrentStep(3);
  };

  const handleRegister = () => {
    onFinish('register');
  };

  const handleGuest = () => {
    onFinish('guest');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white shadow-2xl overflow-hidden flex flex-col relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Progress Dots & Step Count */}
        <div className="p-4 sm:p-5 pb-2 flex items-center justify-between border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">
              الخطوة {currentStep} من 3
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === stepNum
                    ? 'w-7 bg-amber-400 shadow-xs'
                    : currentStep > stepNum
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 relative z-10">
          {/* ========================================================= */}
          {/* STEP 1: WELCOME MESSAGE                                   */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 text-center animate-fadeIn">
              {/* Emblem / Logo */}
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-amber-400 shadow-xl flex items-center justify-center p-1.5 ring-4 ring-amber-500/20">
                  <img
                    src="/images/eduzone_logo.jpg"
                    alt="EduZone Logo"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = '/images/eduzone_logo.png';
                    }}
                  />
                </div>
                <span className="absolute -bottom-2 -left-2 bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>2026</span>
                </span>
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  أهلاً بيك في Eduzone التعليميه 👋
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto font-medium">
                  منصة بتجمع كل اللي محتاجه في مكان واحد.. شرح مبسط، ملخصات، ومتابعة مستمرة.
                </p>
              </div>

              {/* Highlight Features Pills */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ثانوية عامة ودبلومات</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>بنك أسئلة (1600+ سؤال)</span>
                </div>
              </div>

              {/* Button [التالي] */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: HOW TO USE THE PLATFORM                           */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  ازاي تستخدم المنصة؟
                </h2>
                <p className="text-xs text-slate-400">
                  خطوات بسيطة هتضمنلك أعلى درجات التفوق وأسهل تجربة
                </p>
              </div>

              {/* Steps with Icons */}
              <div className="space-y-3 pt-1">
                {/* Point 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <PlayCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-[10px] font-bold text-red-400 block mb-0.5">
                      الخطوة الأولى
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      1. اتفرج على الفيديوهات المتقسمة درس درس
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      محاضرات معسكرات الإنقاذ بجودة 1080p عالية الوضوح.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <FileDown className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-[10px] font-bold text-indigo-400 block mb-0.5">
                      الخطوة الثانية
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      2. حمل ملخص PDF تحت كل فيديو
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      مذكرات جاهزة للطباعة والمذاكرة السريعة مع القوانين ونواتج التعلم.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
                      الخطوة الثالثة
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      3. جمع نقط واطلع في لوحة الصدارة
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      اكسب نقاط XP مع كل سؤال تحله ومذكرة تقرأها لفتح الأوسمة والجوائز.
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-start gap-3.5 hover:border-emerald-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="leading-snug">
                    <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">
                      الخطوة الرابعة
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      4. تنزيل المنصة على الهاتف
                    </h4>
                    <p className="text-[11px] text-emerald-300/90 font-medium mt-0.5">
                      يمكنك استخدام المنصة بدون المتصفح عن طريق تنزيلها.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions: [التالي] and [تخطي] */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>السابق</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                  >
                    تخطي الشرح »
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: READY TO START (REGISTER / GUEST)                 */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl ring-4 ring-emerald-500/20">
                <UserCheck className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  جاهز تبدأ؟ 🚀
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto font-medium">
                  سجل برقم موبايلك عشان نحفظ تقدمك ونقاطك وتستمتع بجميع المذكرات وبنك الأسئلة.
                </p>
              </div>

              {/* Bonus Tag */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>تحصل فور التسجيل على <strong>+50 نقطة XP</strong> ترحيبية مجاناً!</span>
              </div>

              {/* Big [سجل الآن] Button and [أكمل كزائر بدون تسجيل] Link */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleRegister}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>سجل الآن</span>
                </button>

                <div>
                  <button
                    type="button"
                    onClick={handleGuest}
                    className="text-xs font-bold text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors cursor-pointer py-1"
                  >
                    أكمل كزائر بدون تسجيل
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  * كزائر يمكنك تصفح المنصة مجاناً، ويلزم تسجيل الدخول عند تحميل ملفات الـ PDF أو فتح بنك الأسئلة.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
