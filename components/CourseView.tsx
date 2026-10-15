'use client';

import React from 'react';
import { VideoCourse } from '../src/types';
import { AdsterraNativeBanner } from '../src/components/AdsterraNativeBanner';

interface CourseViewProps {
  course: VideoCourse;
  isAdmin?: boolean;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, isAdmin = false }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4 text-white">
      <div className="space-y-1 text-right">
        <h1 className="text-xl font-black">{course.title}</h1>
        <p className="text-xs text-slate-400">المحاضر: {course.instructor}</p>
      </div>

      {/* Video Player Canvas */}
      <div className="relative aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-400">مشغل الفيديو عالي الدقة (1080p Full HD)</span>
      </div>

      {/* Adsterra Native Banner (Directly under video player, min-height 250px, client-side, hidden for admin) */}
      {!isAdmin && <AdsterraNativeBanner isAdmin={isAdmin} />}

      {/* Course Description */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-right space-y-2">
        <h3 className="text-sm font-bold text-amber-400">عن هذا الكورس</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{course.description}</p>
      </div>
    </div>
  );
};

export default CourseView;
