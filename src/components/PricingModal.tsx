import React from 'react';
import { X, Check, Crown, Sparkles, Send, ShieldCheck } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onOpenTelegram,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                باقات وبطاقات اشتراك EduZone (2026 / 2027)
              </h2>
              <p className="text-xs text-amber-300 mt-0.5">
                تصفح المحتوى المجاني أو اشترك في باقة VIP لفتح بنك الأسئلة المتقدم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto bg-slate-950">
          {/* Dual Tiers Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Free Tier */}
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between text-right">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    الباقة الأساسية
                  </span>
                  <span className="text-xl font-black text-white">مجاناً 100%</span>
                </div>
                <h3 className="text-base font-black text-white mb-1">
                  الباقة المفتوحة للجميع
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  متاحة لكل الطلاب مجاناً بدون أي رسوم
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تصفح وتحميل جميع المذكرات بصيغة PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>أول 60 سؤال في كل مادة مع كسب نقاط XP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>استخدام محاكي القيود المحاسبية ومؤقت المذاكرة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>استقبال الإشعارات والتنبيهات الوزارية</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800">
                <span className="block text-center text-xs font-bold text-slate-400 py-2 bg-slate-800 rounded-xl">
                  متاحة تلقائياً عند التسجيل
                </span>
              </div>
            </div>

            {/* VIP Premium Tier */}
            <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 border-2 border-amber-400 shadow-xl flex flex-col justify-between text-right relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-br-xl shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>الأكثر تميزاً</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    باقة التفوق VIP
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 tabular-nums">100</span>
                    <span className="text-xs text-slate-300 mr-1 font-semibold">جنيه مصري / ترم</span>
                  </div>
                </div>
                <h3 className="text-base font-black text-white mb-1">
                  العضوية الذهبية الشاملة
                </h3>
                <p className="text-xs text-amber-200/80 mb-4">
                  للطلاب الراغبين في حصد أعلى الدرجات والترتيب على الجمهورية
                </p>
                <ul className="space-y-2.5 text-xs text-slate-200 border-t border-slate-800 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>بنك الأسئلة المتقدم:</strong> فتح الـ 140 سؤال المتبقية (200 سؤال لكل مادة)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>الدورات المتخصصة:</strong> شروحات ICDL وكورسات الجامعة المعتمدة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>تحديثات مستمرة لأسئلة 2026 / 2027</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>مجموعة تليجرام خاصة بالمشتركين للأجوبة المباشرة</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={onOpenTelegram}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>تفعيل باقة VIP (100 جنيه) عبر تليجرام</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods Info Box */}
          <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>طرق التحويل والدفع المعتمدة:</span>
              </span>
              <span className="text-[11px] text-amber-400 font-bold">تفعيل فوري</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              يتم تحويل قيمة الاشتراك (<strong>100 جنيه فقط</strong>) وإرسال صورة الإيصال عبر تليجرام للتفعيل الفوري لحسابك:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">فودافون كاش</div>
                  <div className="text-[11px] text-slate-400">تواصل عبر تليجرام لأخذ الرقم</div>
                </div>
                <button
                  onClick={onOpenTelegram}
                  className="text-xs bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>طلب الرقم</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">تطبيق InstaPay (إنستاباي)</div>
                  <div className="text-[11px] text-slate-400">تحويل بنكي فوري بالاسم</div>
                </div>
                <button
                  onClick={onOpenTelegram}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تواصل الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            منصة EduZone التعليمية | Eng . Abdullah | تليجرام: https://t.me/+2OhLLu7ofSoxNTNk
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-300 hover:text-white font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
