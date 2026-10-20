'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import {
  monitorAdContainerForSafety,
  purgeUnsafeElements,
  isAdSuppressedByUser,
  suppressAdByUser,
} from '../utils/adSafetyGuardian';

export default function AdsterraAd() {
  const [isSuppressed, setIsSuppressed] = useState(() => isAdSuppressedByUser());
  const [hasUnsafeBlocked, setHasUnsafeBlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuppressed) return;

    const containerTarget = containerRef.current || document.getElementById('container-91018cf29ba0529315096e8cb307cfb5');

    // Monitor for unsafe +18 / adult / inappropriate scripts and elements
    let cleanupObserver: (() => void) | undefined;
    if (containerTarget) {
      cleanupObserver = monitorAdContainerForSafety(containerTarget, () => {
        setHasUnsafeBlocked(true);
      });
    }

    const containerEl = document.getElementById('container-91018cf29ba0529315096e8cb307cfb5');
    if (containerEl && containerEl.innerHTML !== '') return;

    // Ensure banner script is loaded in client
    const scriptId = 'adsterra-banner-91018cf29ba0529315096e8cb307cfb5';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://bauval.org/21/91018cf29ba0529315096e8cb307cfb5';
      script.onerror = () => {
        console.warn('[Adsterra] Banner script blocked or unavailable');
      };
      document.body.appendChild(script);
    }

    return () => {
      if (cleanupObserver) cleanupObserver();
    };
  }, [isSuppressed]);

  const handleSuppress = () => {
    suppressAdByUser();
    setIsSuppressed(true);
  };

  if (isSuppressed || hasUnsafeBlocked) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-6 px-4">
        <div className="w-full max-w-[728px] p-4 bg-slate-900/80 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>بيئة تعليمية نظيفة وآمنة 100%</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-md">
                  EduZone Safe
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تم تفعيل نظام الحماية التلقائي لمنع أي إعلانات غير ملائمة (+18) لضمان تركيزك الدراسي.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('eduzone_student_hide_ads');
              setIsSuppressed(false);
              setHasUnsafeBlocked(false);
            }}
            className="text-[10px] text-slate-400 hover:text-white transition px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer shrink-0"
          >
            إعادة الفحص
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 px-2">
      {/* Safe Ad Notice & Suppress Button */}
      <div className="w-full max-w-[728px] flex items-center justify-between px-2 mb-1.5 text-[11px]">
        <div className="flex items-center gap-1 text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>إعلان تعليمي آمن (مفلتر ضد محتوى +18)</span>
        </div>
        <button
          onClick={handleSuppress}
          title="إخفاء أو الإبلاغ عن إعلان غير لائق"
          className="flex items-center gap-1 text-slate-500 hover:text-amber-400 transition cursor-pointer text-[10px]"
        >
          <EyeOff className="w-3 h-3" />
          <span>إخفاء الإعلان</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-[728px] min-h-[90px] bg-[#1e1e32] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden relative"
      >
        {/* Adsterra Banner */}
        <div id="container-91018cf29ba0529315096e8cb307cfb5"></div>
      </div>
    </div>
  );
}
