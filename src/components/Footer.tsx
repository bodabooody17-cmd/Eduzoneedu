import React, { useEffect } from 'react';
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
  useEffect(() => {
    try {
      // Ensure DMCA badge has verified reference URL for official protection status
      const dmcaBadges = document.querySelectorAll<HTMLAnchorElement>('a.dmca-badge');
      if (dmcaBadges && dmcaBadges.length > 0) {
        dmcaBadges.forEach((badge) => {
          if (badge.href && !badge.href.includes('refurl')) {
            const separator = badge.href.includes('?') ? '&' : '?';
            badge.href = `${badge.href}${separator}refurl=${encodeURIComponent(window.location.href)}`;
          }
        });
      }

      // Load DMCA Badge Helper script asynchronously
      const scriptId = 'dmca-badge-helper-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://images.dmca.com/Badges/DMCABadgeHelper.min.js';
        script.async = true;
        script.onerror = () => {
          console.warn('[DMCA] Badge helper script load notice');
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      console.warn('[DMCA] Badge init notice:', err);
    }
  }, []);

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

        {/* Copyright & DMCA Protection */}
        <div className="pt-3 text-center text-xs text-slate-400 border-t border-slate-900 space-y-2 flex flex-col items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span>© 2026 EduZone - جميع الحقوق محفوظه -</span>
            <a
              href="//www.dmca.com/Protection/Status.aspx?ID=9d3c4934-f507-42de-9422-e9b6bb0ae751"
              title="DMCA.com Protection Status"
              className="dmca-badge inline-flex items-center align-middle transition-opacity hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-08.png?ID=9d3c4934-f507-42de-9422-e9b6bb0ae751"
                alt="DMCA.com Protection Status"
                className="inline-block"
              />
            </a>
          </div>
          <p className="text-slate-300 font-medium">صُنع بكل ❤️ لطلاب مصر</p>
        </div>
      </div>
    </footer>
  );
};
