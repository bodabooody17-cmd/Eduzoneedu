import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, Sparkles } from 'lucide-react';
import { playNotificationChime } from '../utils/notificationAudio';
import { awardPoints } from '../utils/gamification';

interface NotificationPromptBannerProps {
  onActivated?: () => void;
}

export const NotificationPromptBanner: React.FC<NotificationPromptBannerProps> = ({ onActivated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Only show if in browser, Notification API supported, permission not granted yet, and not dismissed
    if (typeof window === 'undefined') return;

    try {
      const dismissed = localStorage.getItem('eduzone_notif_banner_dismissed');
      const hasPermission = 'Notification' in window && Notification.permission === 'granted';

      if (!dismissed && !hasPermission) {
        // Subtle delay so it doesn't collide with initial page load
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Notification prompt check:', e);
    }
  }, []);

  if (!isVisible) return null;

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      let permission: NotificationPermission = 'default';
      if ('Notification' in window) {
        permission = await Notification.requestPermission();
      }

      // OneSignal Web Push subscription opt-in
      try {
        if ((window as any).OneSignal?.User?.PushSubscription) {
          await (window as any).OneSignal.User.PushSubscription.optIn();
        } else if ((window as any).OneSignalDeferred) {
          (window as any).OneSignalDeferred.push(async function(OneSignal: any) {
            try {
              await OneSignal.User.PushSubscription.optIn();
            } catch (err) {
              console.warn('[OneSignalDeferred] optIn:', err);
            }
          });
        }
      } catch (osErr) {
        console.warn('OneSignal optIn notice:', osErr);
      }

      if (permission === 'granted') {
        setIsSuccess(true);
        playNotificationChime();
        awardPoints(30, 'تفعيل الإشعارات الفورية للمنصة', 'bonus');

        try {
          localStorage.setItem('eduzone_notif_banner_dismissed', 'true');
          localStorage.setItem('eduzone_notif_enabled', 'true');
        } catch {}

        if (onActivated) onActivated();

        setTimeout(() => {
          setIsVisible(false);
        }, 2200);
      } else {
        // If denied or dismissed native prompt
        try {
          localStorage.setItem('eduzone_notif_banner_dismissed', 'true');
        } catch {}
        setIsVisible(false);
      }
    } catch (err) {
      console.warn('Failed to activate notifications:', err);
      setIsVisible(false);
    } finally {
      setIsActivating(false);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('eduzone_notif_banner_dismissed', 'true');
    } catch {}
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp text-right font-sans">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/95 text-white p-3.5 sm:p-4 rounded-2xl border border-amber-500/40 shadow-2xl shadow-black/60 backdrop-blur-md flex items-center justify-between gap-3">
        {/* Bell Icon with radiant pulse */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-slate-950 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5 text-slate-950 animate-pulse" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
              {isSuccess ? 'تم تفعيل الإشعارات بنجاح!' : 'فعّل الإشعارات ليصلك كل جديد'}
            </h4>
            {!isSuccess && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold font-mono">
                +30 XP
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
            {isSuccess
              ? 'ستصلك تنبيهات المذكرات ومواعيد الامتحانات أولاً بأول'
              : 'مذكرات جديدة وجداول المراجعات النهائية والامتحانات فور نشرها'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isSuccess ? (
            <>
              <button
                type="button"
                onClick={handleActivate}
                disabled={isActivating}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1 disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>{isActivating ? 'جاري...' : 'تفعيل'}</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                title="إغلاق"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 rounded-lg">
              جاهز ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
