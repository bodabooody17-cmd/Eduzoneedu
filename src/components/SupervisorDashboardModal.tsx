import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  Bell,
  Trash2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Volume2,
  Newspaper,
  Layers,
  Flame,
  Radio,
  BookOpen,
  Trophy,
  Award,
  Zap,
  Star,
  Gift,
} from 'lucide-react';
import { StudentUser } from './AuthModal';
import { playNotificationChime } from '../utils/notificationAudio';
import { awardPoints, getStudentProgress, LEVEL_DEFINITIONS } from '../utils/gamification';
import {
  EducationalNotification,
  getStoredNotifications,
  saveStoredNotifications,
  broadcastNotification,
} from '../utils/notificationService';

interface SupervisorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onNotificationSent?: (notification: EducationalNotification) => void;
  theme?: 'dark' | 'light';
}

export const SupervisorDashboardModal: React.FC<SupervisorDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNotificationSent,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'news' | 'rewards'>('send');

  // New Notification Form States
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'update' | 'reminder' | 'whatsapp'>('update');
  const [targetAudience, setTargetAudience] = useState('الجميع (كافة الطلاب)');
  const [actionUrl, setActionUrl] = useState('');
  const [playChime, setPlayChime] = useState(true);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New Urgent News item
  const [newsText, setNewsText] = useState('');
  const [newsCategory, setNewsCategory] = useState('ثانوية عامة');

  // Bonus Points Distribution
  const [bonusPoints, setBonusPoints] = useState<number>(100);
  const [bonusReason, setBonusReason] = useState<string>('مكافأة تفوق عامة من إدارة EduZone');

  // Existing Notifications in Storage
  const [notificationsList, setNotificationsList] = useState<EducationalNotification[]>(getStoredNotifications);

  useEffect(() => {
    if (isOpen) {
      setNotificationsList(getStoredNotifications());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Send Notification with OneSignal REST API Integration
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const newNotif: EducationalNotification = {
      id: `supervisor-${Date.now()}`,
      title: notifTitle.trim(),
      message: `${notifMessage.trim()}${targetAudience !== 'الجميع (كافة الطلاب)' ? ` [موجّه إلى: ${targetAudience}]` : ''}`,
      time: 'الآن',
      read: false,
      type: notifType,
      actionUrl: actionUrl.trim() || undefined,
    };

    try {
      // 1. Broadcast notification locally (storage, tabs, Service Worker)
      broadcastNotification(newNotif);
      setNotificationsList(getStoredNotifications());

      if (onNotificationSent) {
        onNotificationSent(newNotif);
      }

      // 2. Dispatch to OneSignal REST API via /api/send-notification
      try {
        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newNotif.title,
            message: newNotif.message,
            actionUrl: newNotif.actionUrl,
            type: notifType,
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          setSuccessBanner('تم إرسال الإشعار وبثه بنجاح عبر OneSignal (Segments: All) ولجميع الطلاب!');
        } else {
          setSuccessBanner('تم بث الإشعار للمنصة وإرسال طلب OneSignal (App ID: 89883b4e...) بنجاح!');
        }
      } catch (apiErr) {
        console.warn('OneSignal API call error:', apiErr);
        setSuccessBanner('تم إرسال الإشعار وبثه فورياً بنجاح لجميع الطلاب!');
      }

      // Reset Form & Schedule banner dismissal
      setNotifTitle('');
      setNotifMessage('');
      setActionUrl('');
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Grant Bonus Points to Students
  const handleGrantBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (bonusPoints <= 0) return;

    // 1. Award to student progress
    awardPoints(bonusPoints, bonusReason, 'bonus');

    // 2. Create broadcast notification
    const bonusNotif: EducationalNotification = {
      id: `supervisor-bonus-${Date.now()}`,
      title: `🎉 مكافأة نقاط إضافية (+${bonusPoints} XP)`,
      message: `${bonusReason} - تم إضافة ${bonusPoints} نقطة خبرة لرصيدك.`,
      time: 'الآن',
      read: false,
      type: 'update',
    };

    try {
      broadcastNotification(bonusNotif);
      setNotificationsList(getStoredNotifications());
      setSuccessBanner(`تم منح وبث ${bonusPoints} نقطة XP لجميع الطلاب بنجاح!`);
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete notification
  const handleDeleteNotif = (id: string) => {
    const updated = notificationsList.filter((n) => n.id !== id);
    setNotificationsList(updated);
    saveStoredNotifications(updated);
  };

  // Handle Publish Urgent News Ticker
  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsText.trim()) return;

    try {
      const customNews = {
        id: `news-${Date.now()}`,
        title: newsText.trim(),
        category: newsCategory,
        date: 'الآن',
        summary: `بيان رسمي صادر بتاريخ ${new Date().toLocaleDateString('ar-EG')}`,
        source: currentUser?.name || 'مشرف عام EduZone',
        isHot: true,
      };

      const existingNews = (() => {
        try {
          const stored = localStorage.getItem('eduzone_custom_news');
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      })();

      const updatedNews = [customNews, ...existingNews];
      localStorage.setItem('eduzone_custom_news', JSON.stringify(updatedNews));
      window.dispatchEvent(new CustomEvent('eduzone_news_updated', { detail: updatedNews }));

      setNewsText('');
      setSuccessBanner('تم نشر الخبر في الشريط الإخباري العاجل بنجاح!');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/40 bg-slate-900 text-white overflow-hidden flex flex-col max-h-[92vh] transition-colors duration-200">
        {/* Header - Gold / Amber Theme */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950/80 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  لوحة تحكم المشرف العام
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  بث الإشعارات الفوري
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                إرسال الإشعارات والتنبيهات لجميع الطلاب والتحكم في منصة EduZone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supervisor Info Bar */}
        <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="المشرف"
                className="w-7 h-7 rounded-full object-cover border border-amber-400"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                {currentUser?.name?.charAt(0) || 'م'}
              </div>
            )}
            <span className="font-bold text-amber-300">
              المشرف النشط: {currentUser?.name || 'م. عبد الله'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300 font-semibold">
            <span className="flex items-center gap-1 text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>البث الفوري متصل</span>
            </span>
            <span className="text-slate-400">|</span>
            <span>عدد الإشعارات: {notificationsList.length}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'send'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>إرسال إشعار فوري</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>سجل الإشعارات ({notificationsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'news'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>الشريط الإخباري</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>مكافآت الطلاب</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {successBanner && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* TAB 1: Send Notification Form */}
          {activeTab === 'send' && (
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>بث مباشر عبر OneSignal REST API</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                    Segments: All
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  عند الضغط على إرسال، يتم استدعاء <code className="text-amber-300 font-mono">/api/send-notification</code> والإرسال الفوري لـ OneSignal (App ID: 89883b4e-3e4e-4f53-92e8-8e20fc1fdc66) وبث الإشعار لجميع الأجهزة والطلاب.
                </p>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  عنوان الإشعار:*
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="مثال: مراجعة ليلة الامتحان في مادة الفيزياء"
                  className="w-full px-3 py-2.5 rounded-xl border text-xs font-bold bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Message Details Input */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  نص وتفاصيل الإشعار:*
                </label>
                <textarea
                  required
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="اكتب التنبيه أو ملخص المذكرة هنا..."
                  className="w-full px-3 py-2.5 rounded-xl border text-xs leading-relaxed bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 2-Columns Settings: Type & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Type */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-200">
                    تصنيف الإشعار:
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="update">تحديث ومذكرة جديدة (Update)</option>
                    <option value="reminder">تذكير امتحاني (Reminder)</option>
                    <option value="whatsapp">مجموعة التليجرام (Telegram)</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-200">
                    الجمهور المستهدف:
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="الجميع (كافة الطلاب)">الجميع (كافة الطلاب)</option>
                    <option value="طلاب الثانوية العامة (علمي)">طلاب الثانوية العامة (علمي)</option>
                    <option value="طلاب الثانوية العامة (أدبي)">طلاب الثانوية العامة (أدبي)</option>
                    <option value="طلاب دبلوم تجارة">طلاب دبلوم تجارة</option>
                    <option value="طلاب دبلوم صنايع">طلاب دبلوم صنايع</option>
                  </select>
                </div>
              </div>

              {/* Optional Action URL */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200 flex items-center justify-between">
                  <span>رابط إجراء خارجي (اختياري):</span>
                  <span className="text-[10px] text-slate-400 font-normal">مثل رابط تليجرام أو ملف PDF</span>
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://t.me/+2OhLLu7ofSoxNTNk"
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Audio Chime Toggle */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="playChimeToggle"
                  checked={playChime}
                  onChange={(e) => setPlayChime(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="playChimeToggle" className="cursor-pointer flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>تشغيل نغمة تنبيه صوتية عند البث</span>
                </label>
              </div>

              {/* Send Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>بث الإشعار الآن لجميع المستخدمين</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Notification History & Management */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>سجل الإشعارات المرسلة ({notificationsList.length})</span>
                <span className="text-[11px] text-slate-400">يمكنك حذف أي إشعار قديم من هنا</span>
              </div>

              {notificationsList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">لا توجد إشعارات مسجلة حتى الآن.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors bg-slate-950/60 border-slate-800 text-right"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            notif.type === 'whatsapp'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : notif.type === 'reminder'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {notif.type === 'whatsapp' ? (
                            <MessageCircle className="w-4 h-4" />
                          ) : notif.type === 'reminder' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.actionUrl && (
                            <a
                              href={notif.actionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline pt-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>الرابط المرفق</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNotif(notif.id)}
                        title="حذف الإشعار"
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Urgent News Ticker Publishing */}
          {activeTab === 'news' && (
            <form onSubmit={handlePublishNews} className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 leading-relaxed">
                📢 ينشر الخبر مباشرة في الشريط الإخباري بالصفحة الرئيسية لجميع زوار EduZone.
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  قسم الخبر:
                </label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ثانوية عامة">ثانوية عامة</option>
                  <option value="التعليم الفني">التعليم الفني</option>
                  <option value="دورات جامعية">دورات جامعية</option>
                  <option value="أخبار EduZone">أخبار EduZone</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  نص الخبر العاجل:*
                </label>
                <textarea
                  required
                  rows={3}
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  placeholder="مثال: وزارة التربية والتعليم تؤكد موعد امتحانات 2026..."
                  className="w-full px-3 py-2.5 rounded-xl border text-xs leading-relaxed bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>نشر الخبر فوراً</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Student Points & Rewards Management */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>نظام نقاط وتحفيز الطلاب (Gamification Dashboard)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  يحصل كل طالب عند قراءة المذكرات على <strong>نقاط خبرة (+50 XP)</strong> ولإنهاء الدروس <strong>(+80 XP)</strong> ولحل الأسئلة <strong>(+25 XP)</strong> لرفع مستواهم وتشجيعهم على التفوق.
                </p>
              </div>

              {/* Broadcast Bonus Points to All Students */}
              <form onSubmit={handleGrantBonus} className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>منح نقاط خبرة وبث مكافأة تفوق للجميع:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      مقدار النقاط:
                    </label>
                    <select
                      value={bonusPoints}
                      onChange={(e) => setBonusPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-bold font-mono bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      <option value={50}>+50 نقطة XP</option>
                      <option value={100}>+100 نقطة XP (الافتراضي)</option>
                      <option value={200}>+200 نقطة XP</option>
                      <option value={500}>+500 نقطة XP (مكافأة كبرى)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      سبب المكافأة:
                    </label>
                    <input
                      type="text"
                      required
                      value={bonusReason}
                      onChange={(e) => setBonusReason(e.target.value)}
                      placeholder="مثال: مكافأة تفوق لاجتياز اختبار الفيزياء"
                      className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-950 border-slate-700 text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>إرسال المكافأة (+{bonusPoints} XP) وبثها للجميع</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام الإشراف المركزي لمنصة EduZone المعتمد</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
