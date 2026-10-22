'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyTrackData, TRACKS_CONFIG } from '@/lib/tracks';
import { isAllowedForTrack } from '@/lib/strictFilter';
import { SUMMARY_ITEMS } from '../src/data/coursesData';
import { Footer } from '../src/components/Footer';
import { BookOpen, Wrench, GraduationCap, Video, BookMarked, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [myTrack, setMyTrack] = useState<any>(null);
  const [allMaterials, setAllMaterials] = useState<any[]>(SUMMARY_ITEMS);

  useEffect(() => {
    const data = getMyTrackData();
    setMyTrack(data);
  }, []);

  const trackName = typeof window !== 'undefined' ? (localStorage.getItem('EduZone_Track') || (myTrack?.name || '')) : (myTrack?.name || '');

  // الفلترة الحقيقية ونظام الحماية الصارم
  const filteredMaterials = allMaterials.filter((mat: any) => {
    // ده السطر اللي هيمنع أدبي يشوف فيزياء
    if (!isAllowedForTrack(`${mat.title} ${mat.subject || ''} ${mat.category || ''}`, trackName)) {
      return false;
    }
    if (!myTrack) return true; // لو مش مسجل اظهر الكل
    return (
      myTrack.subjects.some(
        (sub: string) =>
          mat.title?.includes(sub) ||
          mat.subject?.includes(sub) ||
          mat.category?.includes(sub)
      ) || myTrack.keywords.some((k: string) => mat.title?.includes(k))
    );
  });

  // فلترة كروت الأقسام والمراحل التعليمية
  const sections = [
    {
      id: 1,
      title: "الثانوية العامة (علمي وأدبي)",
      count: 12,
      type: "ثانوية عامة",
      description: "مذكرات كبسولة الإنقاذ، قوانين الفيزياء، الكيمياء العضوية، والنحو الشامل لعام 2026/2027.",
      color: "bg-indigo-600",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "الدبلومات الفنية والتجارية",
      count: 5,
      type: "دبلومات فنية",
      description: "المحاسبة المالية، الرسم الفني، والتطبيقات الصناعية والتجارية الحديثة.",
      color: "bg-teal-600",
      icon: <Wrench className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "دورات ICDL",
      count: 3,
      type: "دورات",
      description: "دورات احتراف برامج الأوفيس، الإكسيل المالي، ومهارات الحاسب لسوق العمل.",
      color: "bg-amber-600",
      icon: <GraduationCap className="w-5 h-5" />,
    },
  ];

  const filteredSections = sections.filter((sec) => {
    if (!trackName) return true;
    if (trackName.includes('علمي') || trackName.includes('أدبي')) {
      // طالب ثانوية عامة، اخفي الدبلومات
      return sec.type.includes('ثانوية عامة');
    }
    if (trackName.includes('تجارة') || trackName.includes('صنايع')) {
      return sec.type.includes('دبلومات فنية');
    }
    if (trackName.includes('ICDL')) {
      return sec.type.includes('دورات');
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Banner */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <img
            src="/images/eduzone_logo.jpg"
            alt="EduZone Logo"
            className="w-8 h-8 rounded-full object-cover border border-amber-400"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/eduzone_logo.png';
            }}
          />
          <h1 className="text-base font-black text-white">EduZone التعليمية</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition"
          >
            الإشعارات
          </Link>
          <Link
            href="/admin"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold transition"
          >
            لوحة الإشراف
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* بنر الشعبة الدراسية المسجلة */}
        {myTrack && (
          <div className="bg-yellow-400 text-black p-3 rounded-xl m-3 text-center font-bold">
            <span>📚 موادك: {myTrack?.name || trackName}</span>
          </div>
        )}

        {/* قسم الأقسام والمراحل التعليمية */}
        <section className="space-y-4">
          <div className="border-r-4 border-indigo-500 pr-3">
            <h2 className="text-lg font-black text-white">الأقسام والمراحل التعليمية</h2>
            <p className="text-xs text-slate-400">
              اختر مسارك للوصول المباشر للمذكرات المعتمدة، كبسولات الإنقاذ، ومعسكرات الفيديو
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSections.map((sec) => (
              <div
                key={sec.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${sec.color} text-white flex items-center justify-center font-black`}>
                    {sec.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {sec.count} مذكرات
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">{sec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {sec.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* المذكرات والمواد الدراسية (مفلترة حسب الشعبة) */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-r-4 border-amber-400 pr-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>
                  {myTrack ? `المواد والمذكرات المخصصة لشعبتك (${myTrack.name})` : 'المواد والمذكرات الدراسية المعتمدة'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {myTrack ? 'تمت تصفية المواد لتظهر فقط المناهج الخاصة بشعبتك' : 'جميع المواد لجميع المراحل'}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              {filteredMaterials.length} مادة
            </span>
          </div>

          {/* هنا اعرض filteredMaterials بدل allMaterials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {mat.subject || mat.trackLabel || 'مادة دراسية'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {mat.fileSize || 'PDF'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-relaxed">
                    {mat.title}
                  </h3>
                  {mat.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-slate-400 text-[11px]">{mat.author || 'منصة EduZone'}</span>
                  <Link
                    href={`/courses/${mat.id}`}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                  >
                    عرض التفاصيل ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onSelectTrack={() => {}}
        onOpenContact={() => {}}
        onOpenTimer={() => {}}
      />
    </div>
  );
}
