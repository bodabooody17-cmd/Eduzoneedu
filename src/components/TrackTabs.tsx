import React from 'react';
import { EducationalTrack, PlanFilter } from '../types';
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Wrench,
  Video,
  HelpCircle,
  Calculator,
  Trophy,
  Globe,
} from 'lucide-react';

interface TrackTabsProps {
  activeTrack: EducationalTrack;
  onSelectTrack: (track: EducationalTrack) => void;
  activePlanFilter: PlanFilter;
  onSelectPlanFilter: (filter: PlanFilter) => void;
  onOpenPricingModal: () => void;
  counts: {
    all: number;
    thanawya_science: number;
    thanawya_arts: number;
    languages: number;
    commerce_diploma: number;
    technical_industrial: number;
    university_courses: number;
    free_courses: number;
  };
  myTrackName?: string;
  myTrackCount?: number;
}

export const TrackTabs: React.FC<TrackTabsProps> = ({
  activeTrack,
  onSelectTrack,
  activePlanFilter,
  onSelectPlanFilter,
  onOpenPricingModal,
  counts,
  myTrackName,
  myTrackCount,
}) => {
  const isStudentLanguages = Boolean(
    myTrackName && (myTrackName.includes('لغات') || myTrackName.toLowerCase().includes('lang'))
  );
  const isStudentThanawya = Boolean(
    myTrackName && !isStudentLanguages && (myTrackName.includes('علمي') || myTrackName.includes('أدبي'))
  );
  const isStudentTechnical = Boolean(
    myTrackName && (myTrackName.includes('تجارة') || myTrackName.includes('صنايع'))
  );
  const isStudentIcdl = Boolean(
    myTrackName && myTrackName.includes('ICDL')
  );

  const allLabel = myTrackName ? 'الرئيسية (موادك)' : 'الرئيسية (الكل)';
  const allCount = myTrackName && myTrackCount !== undefined ? myTrackCount : 21;

  // Independent Sections - Dedicated tabs for navigation
  const rawTabs: { id: EducationalTrack; label: string; count?: number; icon: React.ReactNode; hidden?: boolean }[] = [
    {
      id: 'all',
      label: allLabel,
      count: allCount,
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'thanawya_science',
      label: 'ثانوية عامة',
      count: 12,
      icon: <BookOpen className="w-3.5 h-3.5" />,
      hidden: isStudentTechnical || isStudentIcdl || isStudentLanguages,
    },
    {
      id: 'free_courses',
      label: 'قسم الكورسات',
      count: counts.free_courses,
      icon: <Video className="w-3.5 h-3.5" />,
    },
    ...(isStudentLanguages
      ? [
          {
            id: 'languages' as EducationalTrack,
            label: 'قسم اللغات (Languages)',
            count: 5,
            icon: <Globe className="w-3.5 h-3.5" />,
          },
        ]
      : []),
    {
      id: 'technical_industrial',
      label: 'دبلومات فنية وتجارية',
      count: 5,
      icon: <Wrench className="w-3.5 h-3.5" />,
      hidden: isStudentThanawya || isStudentIcdl || isStudentLanguages,
    },
    {
      id: 'university_courses',
      label: 'دورات ICDL',
      count: 3,
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      hidden: isStudentThanawya || isStudentTechnical,
    },
    {
      id: 'quiz_bank',
      label: 'بنك الأسئلة (1600+)',
      count: 1600,
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
    {
      id: 'accounting_sandbox',
      label: 'محاكي القيود المحاسبية',
      icon: <Calculator className="w-3.5 h-3.5" />,
      hidden: isStudentThanawya || isStudentIcdl,
    },
    {
      id: 'gamification_dashboard',
      label: 'لوحة الأوائل والجوائز (XP)',
      icon: <Trophy className="w-3.5 h-3.5" />,
    },
  ];

  const tabs = rawTabs.filter((t) => !t.hidden);

  return (
    <div className="bg-slate-900 border border-slate-800 shadow-md shadow-black/25 rounded-2xl p-3 space-y-2.5 text-white">
      {/* Upper bar: Track selectors - Horizontal scroll optimized for mobile thumbs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive =
            activeTrack === tab.id ||
            (tab.id === 'thanawya_science' && activeTrack === 'thanawya_arts') ||
            (tab.id === 'technical_industrial' && activeTrack === 'commerce_diploma');

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTrack(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-750'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md tabular-nums ${
                    isActive ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter by Free / All */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-400 ml-1">تصفية:</span>
          <button
            onClick={() => onSelectPlanFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activePlanFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            جميع المذكرات
          </button>
          <button
            onClick={() => onSelectPlanFilter('free')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activePlanFilter === 'free'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            المحتوى المجاني
          </button>
        </div>

        {/* Telegram VIP shortcut */}
        <button
          onClick={onOpenPricingModal}
          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>اشتراك VIP (تواصل مباشر)</span>
        </button>
      </div>
    </div>
  );
};
