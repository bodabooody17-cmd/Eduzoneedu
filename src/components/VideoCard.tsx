import React from 'react';
import { VideoCourse } from '../types';
import { Play, Clock, BookOpen, User, Sparkles } from 'lucide-react';

interface VideoCardProps {
  course: VideoCourse;
  onWatchCourse: (course: VideoCourse) => void;
  onOpenVipPayment?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  course,
  onWatchCourse,
}) => {
  const isReader = course.format === 'reader' || course.id === 'course-english-masterclass';
  const isPaid = course.planType === 'paid';

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-md shadow-black/25 transition-all duration-150 flex flex-col justify-between text-right text-white active:scale-[0.99]">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-750">
            <span className={`w-1.5 h-1.5 rounded-full ${isReader ? 'bg-emerald-400' : 'bg-indigo-400'}`}></span>
            {course.category}
          </span>
          <div className="flex items-center gap-1.5">
            {isReader && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                مذكرة وقراءة 📖
              </span>
            )}
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                isPaid
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {course.priceBadge || (isPaid ? 'مدفوع VIP' : 'مجاني')}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-black text-white leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{course.lessonsCount} {isReader ? 'محاضرة مقروءة' : 'دروس'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>+80 XP لكل درس</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400">
          {isReader ? 'شرح وسبورات واضحة' : '1080p Full HD'}
        </span>
        <button
          onClick={() => onWatchCourse(course)}
          className={`px-4 py-2 rounded-xl text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${
            isReader
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isReader ? (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              <span>قراءة واستذكار المذكرة</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>مشاهدة الكورس</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
