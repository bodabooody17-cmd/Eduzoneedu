import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, EyeOff } from 'lucide-react';
import {
  monitorAdContainerForSafety,
  isAdSuppressedByUser,
  suppressAdByUser,
} from '../utils/adSafetyGuardian';

interface AdsterraNativeBannerProps {
  isAdmin?: boolean;
}

export const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({ isAdmin = false }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isSuppressed, setIsSuppressed] = useState(() => isAdSuppressedByUser());
  const [hasUnsafeBlocked, setHasUnsafeBlocked] = useState(false);

  useEffect(() => {
    // Never show ads for admins or supervisors or if suppressed
    if (isAdmin || isSuppressed) return;

    const el = bannerRef.current;
    if (!el) return;

    // Reset container to avoid duplicate scripts on lesson switch or remount
    el.innerHTML =
      '<div id="container-91018cf29ba0529315096e8cb307cfb5" style="min-height:250px; width:100%;"></div>';

    // Hook safety monitor to prevent adult / 18+ / gambling ads
    const cleanupObserver = monitorAdContainerForSafety(el, () => {
      setHasUnsafeBlocked(true);
    });

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/21/91018cf29ba0529315096e8cb307cfb5';

    el.appendChild(script);

    return () => {
      if (cleanupObserver) cleanupObserver();
      if (el) {
        el.innerHTML = '';
      }
    };
  }, [isAdmin, isSuppressed]);

  // If user is admin, render nothing
  if (isAdmin) {
    return null;
  }

  const handleSuppress = () => {
    suppressAdByUser();
    setIsSuppressed(true);
  };

  if (isSuppressed || hasUnsafeBlocked) {
    return (
      <div className="w-full my-4 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between text-right">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>بيئة المشاهدة آمنة ومفلترة 100%</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-md">
                EduZone Guard
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              تم حجب أي محتوى إعلاني غير لائق لتوفير أقصى درجات التركيز أثناء مشاهدة المحاضرة.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-4 flex flex-col">
      <div className="flex items-center justify-between px-2 mb-1.5 text-[11px]">
        <div className="flex items-center gap-1 text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>إعلان داعم للمنصة (خالٍ تماماً من محتوى +18)</span>
        </div>
        <button
          onClick={handleSuppress}
          title="إخفاء الإعلان"
          className="flex items-center gap-1 text-slate-500 hover:text-amber-400 transition cursor-pointer text-[10px]"
        >
          <EyeOff className="w-3 h-3" />
          <span>إخفاء</span>
        </button>
      </div>

      <div
        ref={bannerRef}
        className="w-full rounded-xl overflow-hidden bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-center transition-all relative"
        style={{ minHeight: '250px' }}
      >
        <div id="container-91018cf29ba0529315096e8cb307cfb5" style={{ minHeight: '250px', width: '100%' }}></div>
      </div>
    </div>
  );
};
