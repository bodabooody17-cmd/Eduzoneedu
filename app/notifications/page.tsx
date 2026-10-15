'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  type?: 'update' | 'reminder' | 'whatsapp';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      let userId = 'all';
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('eduzone_student_user');
          if (stored) {
            const user = JSON.parse(stored);
            if (user?.contact) userId = user.contact;
          }
        } catch {}
      }

      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch and 30-second interval polling
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
    } catch (err) {
      console.warn('Failed to mark all notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-3 sm:p-6 text-right selection:bg-indigo-600 selection:text-white" dir="rtl">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header App Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md shadow-black/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">
                مركز الإشعارات والتنبيهات
              </h1>
              <p className="text-xs text-slate-400">
                {unreadCount > 0
                  ? `لديك ${unreadCount} إشعار جديد غير مقروء`
                  : 'جميع الإشعارات مقروءة'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchNotifications()}
              title="تحديث الإشعارات"
              disabled={refreshing}
              className={`p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-750 transition-colors cursor-pointer ${
                refreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-750 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </a>
          </div>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-slate-400 font-bold">
              تحديث تلقائي كل 30 ثانية
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="py-12 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">جاري تحميل الإشعارات...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3 p-6 shadow-md shadow-black/25">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-300">
              لا يوجد إشعارات
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              ستصلك هنا كل الإشعارات والتنبيهات المدرسية وجداول المراجعات النهائية فور صدورها.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isRead) handleMarkAsRead(item.id);
                  if (item.actionUrl) window.open(item.actionUrl, '_blank');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  item.isRead
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                    : 'bg-slate-900 border-amber-500/40 shadow-md shadow-black/20 text-white'
                }`}
              >
                {!item.isRead && (
                  <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                )}

                <div className="space-y-1.5 pl-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.type === 'reminder'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : item.type === 'whatsapp'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {item.type === 'reminder'
                        ? 'تذكير مذاكرة'
                        : item.type === 'whatsapp'
                        ? 'قناة الإدارة'
                        : 'إشعار رسمي'}
                    </span>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.actionUrl && (
                        <span className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1">
                          <span>فتح الرابط</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                      {!item.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(item.id);
                          }}
                          className="text-slate-400 hover:text-white flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" />
                          <span>تحديد كمقروء</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
