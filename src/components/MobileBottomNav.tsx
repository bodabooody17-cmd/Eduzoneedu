import React from 'react';
import { Home, BookOpen, Video, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'summaries' | 'courses' | 'profile';
  onSelectNavTab: (tab: 'home' | 'summaries' | 'courses' | 'profile') => void;
  currentUser: { name: string; contact: string; stage: string; avatarUrl?: string; role?: string } | null;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectNavTab,
  currentUser,
  savedCount,
}) => {
  return (
    <nav
      aria-label="شريط التنقل السفلي للهاتف"
      className="fixed bottom-0 inset-x-0 z-50 w-full bg-slate-900 border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] text-slate-300 select-none"
      style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="w-full flex items-center justify-around px-2 py-1.5">
        {/* 1. الرئيسية */}
        <button
          onClick={() => onSelectNavTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 cursor-pointer ${
            activeTab === 'home'
              ? 'text-amber-400 font-bold bg-amber-400/10'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-none">الرئيسية</span>
        </button>

        {/* 2. المناهج */}
        <button
          onClick={() => onSelectNavTab('summaries')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 relative cursor-pointer ${
            activeTab === 'summaries'
              ? 'text-amber-400 font-bold bg-amber-400/10'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
            )}
            {activeTab === 'summaries' && (
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-none">المناهج</span>
        </button>

        {/* 3. الفيديوهات */}
        <button
          onClick={() => onSelectNavTab('courses')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 cursor-pointer ${
            activeTab === 'courses'
              ? 'text-amber-400 font-bold bg-amber-400/10'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Video className="w-5 h-5" />
            {activeTab === 'courses' && (
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-none">الفيديوهات</span>
        </button>

        {/* 4. حسابي */}
        <button
          onClick={() => onSelectNavTab('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 cursor-pointer ${
            activeTab === 'profile'
              ? 'text-amber-400 font-bold bg-amber-400/10'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className={`w-5 h-5 rounded-full object-cover aspect-square border ${
                  activeTab === 'profile' ? 'border-amber-400' : 'border-slate-600'
                }`}
              />
            ) : (
              <User className="w-5 h-5" />
            )}
            {activeTab === 'profile' && (
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-none">حسابي</span>
        </button>
      </div>
    </nav>
  );
};
