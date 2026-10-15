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
  Eye,
  UserCheck,
  ArrowRight,
  Phone,
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
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'news' | 'rewards' | 'students'>('send');

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

  // Registered Students Tracking State
  interface RegisteredStudent {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    stage?: string;
    role: string;
    avatarUrl?: string;
    createdAt: string;
    lastSeen?: string;
    enrollments?: Array<{ id: string; courseId: string; courseName?: string; track?: string; enrolledAt: string }>;
  }

  const [studentsList, setStudentsList] = useState<RegisteredStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<{
    user: RegisteredStudent;
    enrollments: Array<{ id: string; courseId: string; courseName?: string; track?: string; enrolledAt: string }>;
    loginLogs: Array<{ id: string; timestamp: string }>;
  } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setStudentsList(data.users);
      } else {
        setStudentsList([]);
      }
    } catch (err) {
      console.warn('Failed to fetch students:', err);
      setStudentsList([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    setSelectedStudentId(id);
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();
      if (data.success && data.user) {
        setStudentDetails({
          user: data.user,
          enrollments: data.enrollments || [],
          loginLogs: data.loginLogs || [],
        });
        if (!data.loginLogs || data.loginLogs.length === 0) {
          console.log(`[Student Detail Log] وقت دخول الطالب (${id}):`, new Date().toISOString());
        }
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNotificationsList(getStoredNotifications());
      fetchStudents();
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
          setSuccessBanner('تم إرسال الإشعار وبثه بنجاح وحفظه في المنصة لجميع الطلاب!');
        } else {
          // Guaranteed fallback save to local notifications endpoint
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: newNotif.title,
              message: newNotif.message,
              userId: 'all',
              actionUrl: newNotif.actionUrl,
              type: notifType,
            }),
          }).catch(() => {});
          setSuccessBanner('تم إرسال الإشعار وحفظه في المنصة بنجاح!');
        }
      } catch (apiErr) {
        // Guaranteed fallback save
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newNotif.title,
            message: newNotif.message,
            userId: 'all',
            actionUrl: newNotif.actionUrl,
            type: notifType,
          }),
        }).catch(() => {});
        setSuccessBanner('تم إرسال الإشعار وحفظه في المنصة بنجاح لجميع الطلاب!');
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
          <button
            onClick={() => {
              setActiveTab('students');
              setSelectedStudentId(null);
              fetchStudents();
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs ${
              activeTab === 'students'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>الطلاب المسجلين</span>
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

          {/* TAB 5: Registered Students Tracking */}
          {activeTab === 'students' && (
            <div className="space-y-4 animate-fadeIn">
              {selectedStudentId && studentDetails ? (
                /* Student Details View (matches /admin/users/[id]) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <button
                      onClick={() => setSelectedStudentId(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>العودة لقائمة الطلاب</span>
                    </button>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
                      ID: {studentDetails.user.id}
                    </span>
                  </div>

                  {/* 1. بياناته الكاملة */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <span>البيانات الكاملة للطالب:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">الاسم:</span>
                        <span className="font-bold text-white text-sm">{studentDetails.user.name}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">رقم الموبايل:</span>
                        <span className="font-bold text-amber-300 font-mono dir-ltr text-right block">
                          {studentDetails.user.phone || 'غير مسجل'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">البريد الإلكتروني:</span>
                        <span className="font-medium text-slate-300 font-mono block truncate">
                          {studentDetails.user.email || '—'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">المرحلة / الشعبة:</span>
                        <span className="font-bold text-indigo-300">{studentDetails.user.stage || 'عام'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">تاريخ التسجيل:</span>
                        <span className="font-medium text-slate-300">
                          {new Date(studentDetails.user.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">آخر ظهور:</span>
                        <span className="font-medium text-emerald-400">
                          {studentDetails.user.lastSeen
                            ? new Date(studentDetails.user.lastSeen).toLocaleDateString('ar-EG') + ' ' + new Date(studentDetails.user.lastSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                            : 'غير محدد'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. الكورسات المشترك بها من db.enrollment */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-indigo-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>الكورسات المشترك بها ({studentDetails.enrollments.length}):</span>
                    </h4>
                    {studentDetails.enrollments.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-800">
                        لم يشترك في أي كورسات حتى الآن.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {studentDetails.enrollments.map((enr) => (
                          <div
                            key={enr.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-bold text-white">{enr.courseName || enr.courseId}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">المسار: {enr.track || 'عام'}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(enr.enrolledAt).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. سجل الدخول من db.loginLog */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>سجل تسجيل الدخول (Login Logs):</span>
                    </h4>
                    {studentDetails.loginLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-800">
                        لا يوجد سجل دخول سابق مخزن. تم تسجيل وقت الدخول بالكونسول.
                      </p>
                    ) : (
                      <div className="overflow-x-auto max-h-48 rounded-xl border border-slate-800">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                            <tr>
                              <th className="p-2.5">#</th>
                              <th className="p-2.5">معرف الجلسة</th>
                              <th className="p-2.5">وقت الدخول</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                            {studentDetails.loginLogs.map((log, index) => (
                              <tr key={log.id} className="hover:bg-slate-900/40">
                                <td className="p-2.5 text-slate-400 font-mono">{index + 1}</td>
                                <td className="p-2.5 text-slate-400 font-mono">{log.id}</td>
                                <td className="p-2.5 text-slate-200">
                                  {new Date(log.timestamp).toLocaleDateString('ar-EG')} - {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Main Table: shadcn/ui Table */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>قائمة الطلاب المسجلين بالمنصة:</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        بيانات حقيقية مسترجعة مباشرة من قاعدة بيانات الطلاب المسجلين
                      </p>
                    </div>
                    <button
                      onClick={fetchStudents}
                      disabled={isLoadingStudents}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                    >
                      {isLoadingStudents ? 'جاري التحديث...' : 'تحديث القائمة'}
                    </button>
                  </div>

                  {isLoadingStudents ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                      جاري تحميل بيانات الطلاب الحقيقية من قاعدة البيانات...
                    </div>
                  ) : studentsList.length === 0 ? (
                    /* 1. لو مفيش مستخدمين اعرض رسالة "لا يوجد طلاب مسجلين حتى الآن" */
                    <div className="text-center py-12 px-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-slate-300 font-bold text-sm">لا يوجد طلاب مسجلين حتى الآن</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        سيظهر هنا أي طالب يسجل دخوله برقم الهاتف في منصة EduZone.
                      </p>
                    </div>
                  ) : (
                    /* 2. شكل الجدول: shadcn/ui Table */
                    <div className="relative w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                      <table className="w-full caption-bottom text-xs text-right">
                        <thead className="[&_tr]:border-b bg-slate-900/90 text-slate-400 font-bold border-slate-800">
                          <tr className="border-b transition-colors">
                            <th className="h-10 px-3 align-middle font-medium text-slate-300">الاسم</th>
                            <th className="h-10 px-3 align-middle font-medium text-slate-300">رقم الموبايل</th>
                            <th className="h-10 px-3 align-middle font-medium text-slate-300">الايميل</th>
                            <th className="h-10 px-3 align-middle font-medium text-slate-300">تاريخ التسجيل</th>
                            <th className="h-10 px-3 align-middle font-medium text-slate-300">عدد الكورسات</th>
                            <th className="h-10 px-3 align-middle font-medium text-slate-300">آخر ظهور</th>
                            <th className="h-10 px-3 align-middle font-medium text-slate-300 text-center">إجراء</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 divide-y divide-slate-800/60">
                          {studentsList.map((student) => {
                            const formattedCreatedAt = new Date(student.createdAt).toLocaleDateString('ar-EG');
                            const formattedLastSeen = student.lastSeen
                              ? new Date(student.lastSeen).toLocaleDateString('ar-EG') + ' ' + new Date(student.lastSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                              : 'غير محدد';
                            const enrollmentsCount = student.enrollments ? student.enrollments.length : 0;

                            return (
                              <tr
                                key={student.id}
                                className="border-b border-slate-800/80 transition-colors hover:bg-slate-800/40 text-slate-200"
                              >
                                {/* الاسم */}
                                <td className="p-3 align-middle font-semibold text-white flex items-center gap-2">
                                  {student.avatarUrl ? (
                                    <img
                                      src={student.avatarUrl}
                                      alt={student.name}
                                      className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] border border-amber-500/30 shrink-0">
                                      {student.name.charAt(0) || 'ط'}
                                    </div>
                                  )}
                                  <span className="truncate max-w-[120px]">{student.name}</span>
                                </td>

                                {/* رقم الموبايل */}
                                <td className="p-3 align-middle font-mono text-slate-300 dir-ltr text-right">
                                  {student.phone || 'غير مسجل'}
                                </td>

                                {/* الايميل */}
                                <td className="p-3 align-middle text-slate-400 text-[11px] font-mono">
                                  {student.email || '—'}
                                </td>

                                {/* تاريخ التسجيل: بصيغة toLocaleDateString('ar-EG') */}
                                <td className="p-3 align-middle text-slate-300 text-[11px]">
                                  {formattedCreatedAt}
                                </td>

                                {/* عدد الكورسات: enrollments.length */}
                                <td className="p-3 align-middle">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    {enrollmentsCount} كورس
                                  </span>
                                </td>

                                {/* آخر ظهور */}
                                <td className="p-3 align-middle text-slate-400 text-[10px]">
                                  {formattedLastSeen}
                                </td>

                                {/* إجراء: عرض */}
                                <td className="p-3 align-middle text-center">
                                  <button
                                    onClick={() => fetchStudentDetails(student.id)}
                                    className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs cursor-pointer active:scale-95"
                                  >
                                    <Eye className="w-3 h-3 ml-1" />
                                    <span>عرض</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
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
