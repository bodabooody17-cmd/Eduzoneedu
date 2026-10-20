import React from 'react';
import { Search, Sparkles, Smartphone } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreClick: () => void;
  onOpenQuizClick: () => void;
  onOpenTechnicalClick?: () => void;
  onOpenUniversityCourses?: () => void;
  onOpenPricingModal?: () => void;
  onOpenCreatorProfile?: () => void;
  onOpenApkModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick,
  onOpenQuizClick,
  onOpenUniversityCourses,
  onOpenCreatorProfile,
  onOpenApkModal,
}) => {
  const scrollToSection = (_section: string) => {
    onExploreClick();
  };

  const navigateTo = (target: string) => {
    if (target === 'courses') {
      if (onOpenUniversityCourses) {
        onOpenUniversityCourses();
      } else {
        onExploreClick();
      }
    } else if (target === 'questions-bank') {
      onOpenQuizClick();
    }
  };

  return (
    <section className="w-full bg-slate-950 text-white pt-4 pb-5 px-3 border-b border-slate-900 select-none">
      <div className="w-full space-y-3.5 text-right">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={onOpenApkModal}
            title="تحميل منصه Eduzone التعليميه للهاتف"
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>تحميل منصه Eduzone التعليميه للهاتف</span>
          </button>
          <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[11px]">
            العام الدراسي 2026 / 2027
          </span>

          {/* Interactive Creator Profile Badge */}
          <button
            type="button"
            onClick={onOpenCreatorProfile}
            title="الملف التعريفي لـ Eng.Abdullah"
            className="text-amber-300 hover:text-white font-bold text-[11px] bg-slate-900 border border-amber-400/40 hover:border-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <img
              src="/images/eng_abdullah.jpg"
              alt="Eng.Abdullah"
              className="w-4 h-4 rounded-full object-cover object-[center_24%] border border-amber-400/80 shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>بإشراف Eng.Abdullah</span>
          </button>
        </div>

        {/* Brand Banner */}
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-full bg-slate-900 border border-amber-400 shadow-sm shrink-0">
            <img
              src="/images/eduzone_logo.jpg"
              alt="EduZone Emblem"
              className="w-11 h-11 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/eduzone_logo.png';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-tight text-white">
              Eduzone التعليميه
            </h1>
            <p className="text-[11px] text-amber-300 font-medium">
              الملخصات المعتمدة، بنك الأسئلة، ودورات التطوير المهني
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          المرجع الأول لطلاب الثانوية العامة، الدبلومات الفنية (صنايع وتجارة)، وكورسات الـ ICDL مع بنك أسئلة يضم أكثر من 1600 سؤال امتحاني مع الشرح الفوري.
        </p>

        {/* Search Input Bar - Thumb Friendly & Flat Solid */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مذكرات، مواد، قوانين، أو امتحانات..."
            className="w-full pl-3 pr-10 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-semibold placeholder:text-slate-400 border border-slate-800 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end items-center flex-wrap mt-4">
          <button onClick={() => scrollToSection('sections')} className="bg-[#FFC107] text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition cursor-pointer">
            تصفح الأقسام
          </button>
          <button onClick={() => navigateTo('courses')} className="bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-white/20 transition cursor-pointer">
            الكورسات
          </button>
          <button onClick={() => navigateTo('questions-bank')} className="bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-white/20 transition flex items-center gap-1 cursor-pointer">
            بنك الأسئلة (+1600)
          </button>
        </div>
      </div>
    </section>
  );
};
