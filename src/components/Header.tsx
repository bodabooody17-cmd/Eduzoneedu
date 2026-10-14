import React from 'react';
import {
  Bookmark,
  Clock,
  HelpCircle,
  Bell,
  User,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { StudentUser } from './AuthModal';
import { StudentProgress } from '../utils/gamification';

interface HeaderProps {
  activeTrack: string;
  onSelectTrack: (track: any) => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  onOpenTimerModal: () => void;
  onOpenContactModal: () => void;
  onOpenQuizModal: () => void;
  onOpenNotifications: () => void;
  onOpenPricingModal?: () => void;
  currentUser?: StudentUser | null;
  studentProgress?: StudentProgress;
  onOpenAuthModal?: (role?: 'student' | 'teacher' | 'supervisor') => void;
  onOpenProfile?: () => void;
  onOpenSupervisorDashboard?: () => void;
  onOpenCreatorProfile?: () => void;
  onLogout?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTrack,
  savedCount,
  onOpenSavedModal,
  onOpenTimerModal,
  onOpenContactModal,
  onOpenQuizModal,
  onOpenNotifications,
  currentUser,
  onOpenAuthModal,
  onOpenProfile,
  onOpenSupervisorDashboard,
  onOpenCreatorProfile,
  unreadNotificationsCount = 3,
}) => {
  const isSupervisor = currentUser?.role === 'supervisor';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-white shadow-sm select-none">
      <div className="w-full px-3 py-2 flex flex-col gap-2">
        {/* Main App Bar Row */}
        <div className="flex items-center justify-between w-full">
          {/* User Profile / Login */}
          <div className="flex items-center shrink-0">
            {currentUser ? (
              <button
                onClick={onOpenProfile || (() => onOpenAuthModal && onOpenAuthModal())}
                className={`flex items-center gap-1.5 p-1 px-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-colors max-w-[120px] ${
                  isSupervisor
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : currentUser.role === 'teacher'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800 border-slate-700 text-white'
                }`}
                title="الملف الشخصي"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover aspect-square border border-amber-400 shrink-0"
                  />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center ${
                      isSupervisor
                        ? 'bg-amber-400 text-slate-950'
                        : currentUser.role === 'teacher'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="truncate text-[10px]">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal()}
                className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>دخول</span>
              </button>
            )}
          </div>

          {/* Centered App Brand */}
          <div className="flex flex-col items-center justify-center text-center">
            <button
              onClick={() => onSelectTrack('all')}
              className="flex items-center justify-center gap-1.5 group cursor-pointer focus:outline-hidden"
            >
              <div className="p-0.5 rounded-full bg-slate-950 border border-amber-400 shadow-sm">
                <img
                  src="/images/eduzone_logo.jpg"
                  alt="EduZone Logo"
                  className="w-7 h-7 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/eduzone_logo.png';
                  }}
                />
              </div>
              <span className="text-sm font-black text-white">
                Eduzone التعليميه
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1 py-0.2 rounded border border-emerald-500/30">
                Android
              </span>
            </button>
            <button
              onClick={onOpenCreatorProfile}
              title="الملف التعريفي للمؤسس م. عبد الله"
              className="text-[9px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer block leading-tight mt-0.5"
            >
              بإشراف Eng.Abdullah
            </button>
          </div>

          {/* Notifications Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenNotifications}
              title="الإشعارات والتنبيهات"
              className="relative p-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 transition-colors cursor-pointer active:scale-95"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full tabular-nums animate-bounce shadow-sm">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Mobile Action Chips - Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none w-full">
          {isSupervisor && onOpenSupervisorDashboard && (
            <button
              onClick={onOpenSupervisorDashboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] shadow-sm cursor-pointer shrink-0 animate-pulse"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>لوحة المشرف</span>
            </button>
          )}
          <button
            onClick={onOpenQuizModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-750 shrink-0"
          >
            <HelpCircle className="w-3 h-3 text-purple-400" />
            <span>بنك الأسئلة (1600+)</span>
          </button>
          <button
            onClick={onOpenTimerModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer bg-slate-800 border-slate-700 text-emerald-300 hover:bg-slate-750 shrink-0"
          >
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>مؤقت المذاكرة</span>
          </button>
          <button
            onClick={onOpenSavedModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750 shrink-0"
          >
            <Bookmark className="w-3 h-3 text-amber-400" />
            <span>المحفوظات {savedCount > 0 && `(${savedCount})`}</span>
          </button>
          <button
            onClick={onOpenContactModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 text-[10px] font-bold transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>تواصل معنا</span>
          </button>
        </div>
      </div>
    </header>
  );
};
