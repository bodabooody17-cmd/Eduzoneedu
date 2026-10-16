'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CourseView } from '../../../components/CourseView';
import { VIDEO_COURSES, SUMMARY_ITEMS } from '../../../src/data/coursesData';
import { isAllowedForTrack } from '@/lib/strictFilter';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: PageProps) {
  const [myTrack, setMyTrack] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMyTrack(localStorage.getItem('EduZone_Track') || '');
    }
  }, []);

  const course =
    VIDEO_COURSES.find((c) => c.id === params?.id) ||
    (SUMMARY_ITEMS.find((s) => s.id === params?.id) as any) ||
    VIDEO_COURSES[0];

  const materialTitle = course ? `${course.title} ${course.subject || course.category || ''}` : '';

  // Direct Access Protection: If user is Adaby and accesses physics link, block and redirect
  if (myTrack && course && !isAllowedForTrack(materialTitle, myTrack)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 text-right">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl animate-fadeIn">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/40">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-white">عفواً، وصول مقيد</h2>
            <p className="text-sm font-bold text-red-400">
              هذه المادة غير متاحة لشعبتك: {myTrack}
            </p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            وفق نظام حماية المسار الدراسي المعتمد، لا يمكنك تصفح مواد تتبع شعبة أخرى لتجنب التشتت وتكثيف التركيز على منهجك المعتمد.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <span>العودة للمواد المخصصة لشعبتك</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-6">
      <CourseView course={course} />
    </main>
  );
}
