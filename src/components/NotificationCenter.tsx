import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Volume2,
  ShieldCheck,
  MessageCircle,
  Clock,
  Radio,
  Send,
} from 'lucide-react';
import {
  EducationalNotification,
  getStoredNotifications,
  saveStoredNotifications,
  requestNotificationPermission,
  showPushNotification,
  subscribeToNotificationBroadcast,
} from '../utils/notificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp?: () => void;
  onOpenTelegram?: () => void;
  onOpenSupervisorDashboard?: () => void;
  isSupervisor?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onOpenWhatsApp,
  onOpenTelegram,
  onOpenSupervisorDashboard,
  isSupervisor = false,
}) => {
  const [notifications, setNotifications] = useState<EducationalNotification[]>(getStoredNotifications);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchServerNotifications = async () => {
    try {
      let userId = 'all';
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('eduzone_user') || localStorage.getItem('eduzone_student_user');
          if (stored) {
            const user = JSON.parse(stored);
            if (user?.phone || user?.contact || user?.id) {
              userId = user.phone || user.contact || user.id;
            }
          }
        } catch {}
      }
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.notifications)) {
        const formatted = data.notifications.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleDateString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
          }),
          read: n.isRead,
          type: n.type || 'update',
          actionUrl: n.actionUrl,
        }));
        setNotifications(formatted);
        saveStoredNotifications(formatted);
      }
    } catch (err) {
      console.warn('Notification fetch warning:', err);
    }
  };

  // Sync with server API, events from Supervisor Dashboard & other tabs
  useEffect(() => {
    fetchServerNotifications();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }

    const interval = setInterval(() => {
      fetchServerNotifications();
    }, 30000);

    const unsubscribe = subscribeToNotificationBroadcast(
      (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
      },
      (updatedList) => {
        setNotifications(updatedList);
      }
    );

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      setToastMessage('متصفحك الحالي لا يدعم الإشعارات المنبثقة.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const perm = await requestNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      setToastMessage('تم تفعيل الإشعارات الفورية بنجاح!');
    } else {
      setToastMessage('تم رفض إذن الإشعارات من إعدادات المتصفح.');
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendTestNotification = async () => {
    const testNotif: EducationalNotification = {
      id: `test-${Date.now()}`,
      title: 'إشعار فوري تجريبي - EduZone',
      message: 'نظام الإشعارات يعمل بكفاءة مع Service Worker حتى أثناء خروجك من الموقع!',
      time: 'الآن',
      read: false,
      type: 'update',
    };

    await showPushNotification(testNotif);
    setToastMessage('تم إرسال إشعار تجريبي فوري بنجاح!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
    } catch {}
  };

  const handleToggleRead = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveStoredNotifications(updated);
    if (target && !target.read) {
      try {
        await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh] text-white">
        {/* Header */}
        <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">مركز الإشعارات والبث الفوري</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">تنبيهات المذكرات والمراجعات الوزارية العاجلة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supervisor Quick Access if supervisor */}
        {isSupervisor && onOpenSupervisorDashboard && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>أنت مسجل بصلاحية المشرف العام</span>
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenSupervisorDashboard();
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-black text-xs transition-colors cursor-pointer shadow-xs"
            >
              إرسال إشعار للطلاب
            </button>
          </div>
        )}

        {/* Browser Permission & Push Banner */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>إشعارات Push Notification عبر Service Worker:</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {browserPermission === 'granted'
                ? '✅ مفعلة وتصلك الإشعارات حتى عند قفل أو تصغير المتصفح.'
                : 'اضغط تفعيل لتصلك إشعارات المذكرات لحظياً على جهازك.'}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {browserPermission !== 'granted' ? (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                تفعيل الإشعارات
              </button>
            ) : (
              <button
                onClick={handleSendTestNotification}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>إشعار تجريبي</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback toast */}
        {toastMessage && (
          <div className="bg-amber-500/20 text-amber-300 border-b border-amber-500/30 text-xs font-bold p-2.5 text-center animate-fadeIn shrink-0">
            {toastMessage}
          </div>
        )}

        {/* Notifications list */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-semibold">
              جميع التنبيهات ({unreadCount} غير مقروءة)
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer transition-colors"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-1.5">
              <Bell className="w-10 h-10 mx-auto mb-1 opacity-40 text-slate-400" />
              <p className="text-sm font-black text-slate-300">لا يوجد إشعارات</p>
              <p className="text-xs text-slate-500">ستظهر هنا أي تنبيهات دراسية أو مواعيد امتحانات فور صدورها.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isSupervisorNotif = notif.id.startsWith('supervisor-');
              return (
                <div
                  key={notif.id}
                  onClick={() => handleToggleRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-right ${
                    isSupervisorNotif
                      ? 'bg-amber-950/30 border-amber-500/40 shadow-xs text-amber-100 hover:border-amber-400'
                      : !notif.read
                      ? 'bg-slate-900 border-indigo-500/40 shadow-xs ring-1 ring-indigo-500/20 hover:border-indigo-400'
                      : 'bg-slate-900/60 border-slate-800 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        {notif.title}
                      </span>
                      {isSupervisorNotif && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/40">
                          بث المشرف العام
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>
                  {/* Action Link if provided */}
                  {notif.actionUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href={notif.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>فتح الرابط المرفق</span>
                      </a>
                    </div>
                  )}
                  {notif.type === 'whatsapp' && !notif.actionUrl && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-400">
                        قناة ومجتمع التليجرام الرسمي:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenTelegram) onOpenTelegram();
                          else if (onOpenWhatsApp) onOpenWhatsApp();
                        }}
                        className="text-[11px] bg-sky-500 hover:bg-sky-600 text-white font-bold px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                      >
                        انضمام للجروب
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>منصة EduZone التعليمية | Eng . Abdullah</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-300 hover:text-white font-bold cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
