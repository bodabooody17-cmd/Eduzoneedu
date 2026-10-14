import React, { useState, useEffect } from 'react';
import { EducationNewsItem } from '../types';
import { EDUCATION_NEWS } from '../data/coursesData';
import { Newspaper, Flame, Clock, ChevronRight, X } from 'lucide-react';

interface NewsTickerProps {
  onOpenNewsDetail?: (news: EducationNewsItem) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = () => {
  const [selectedNews, setSelectedNews] = useState<EducationNewsItem | null>(null);
  const [customNews, setCustomNews] = useState<EducationNewsItem[]>(() => {
    try {
      const s = localStorage.getItem('eduzone_custom_news');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleNews = (e: any) => {
      try {
        const stored = localStorage.getItem('eduzone_custom_news');
        if (stored) {
          setCustomNews(JSON.parse(stored));
        } else if (e.detail) {
          setCustomNews(e.detail);
        }
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('eduzone_news_updated', handleNews);
    return () => window.removeEventListener('eduzone_news_updated', handleNews);
  }, []);

  const allNews = [...customNews, ...EDUCATION_NEWS];

  return (
    <section aria-label="الشريط الإخباري التعليمي" className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white">
              آخر الأخبار التعليمية وقرارات الامتحانات (2026 / 2027)
            </h2>
            <p className="text-[11px] text-slate-400">
              تغطية حصرية لأخبار الثانوية العامة والدبلومات الفنية ومنصة EduZone
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>بث مباشر</span>
        </span>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {allNews.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedNews(item)}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-850 hover:border-indigo-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between text-right group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                  {item.category}
                </span>
                {item.isHot && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-950/80 text-red-300 border border-red-500/40 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-red-400" />
                    <span>عاجل</span>
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{item.date}</span>
              </span>
              <span className="font-semibold text-slate-400 group-hover:text-amber-400 flex items-center gap-0.5">
                <span>التفاصيل</span>
                <ChevronRight className="w-3 h-3 transform rotate-180" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-right text-white">
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-indigo-600 px-2 py-0.5 rounded-md">
                  {selectedNews.category}
                </span>
                <span className="text-xs text-slate-300">{selectedNews.date}</span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-black text-white leading-snug">
                {selectedNews.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedNews.summary}
              </p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>المصدر: {selectedNews.source}</span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  حسناً
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
