import React from 'react';
import { Sparkles, Send } from 'lucide-react';

interface FooterProps {
  onSelectTrack: (track: any) => void;
  onOpenContact: () => void;
  onOpenTimer: () => void;
  onOpenCreatorProfile?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTrack,
  onOpenContact,
  onOpenTimer,
  onOpenCreatorProfile,
}) => {
  return (
    <footer className="w-full bg-slate-950 text-white mt-4 border-t border-slate-800/80 px-3 py-6 pb-24 text-right select-none">
      <div className="w-full flex flex-col space-y-5">
        {/* Brand & Eng. Abdullah */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-0.5 rounded-full bg-slate-900 border border-amber-400 shadow-sm shrink-0">
              <img
                src="/images/eduzone_logo.jpg"
                alt="EduZone Logo"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/eduzone_logo.png';
                }}
              />
            </div>
            <span className="text-base font-black text-white">
              Eduzone التعليميه
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            المنصة التعليمية الرائدة لطلاب الثانوية العامة والدبلومات الفنية في مصر.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreatorProfile}
              title="الملف التعريفي للمهندس عبد الله"
              className="text-xs font-bold text-amber-400 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-xl border border-amber-400/30 inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>بإشراف Eng.Abdullah</span>
            </button>
            <a
              href="https://t.me/+2OhLLu7ofSoxNTNk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-sky-400/30 hover:text-sky-300 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>قناة التليجرام الرسمية</span>
            </a>
          </div>
        </div>

        {/* رؤية المنصة */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-2 text-right shadow-md shadow-black/25">
          <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>رؤية المنصة</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            تمكين طلاب الثانوية العامة والدبلومات الفنية في مصر من الحصول على تجربة تعليمية متكاملة، عبر توفير ملخصات مبسطة، كبسولات إنقاذ معتمدة، وبنك أسئلة تفاعلي ذكي لرفع كفاءة التحصيل الدراسي وتحقيق أعلى الدرجات.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-3 text-center text-xs text-slate-400 border-t border-slate-900 space-y-1">
          <p>© 2026 EduZone - جميع الحقوق محفوظه -</p>
          <p className="text-slate-300 font-medium">صُنع بكل ❤️ لطلاب مصر</p>
        </div>
      </div>
    </footer>
  );
};
