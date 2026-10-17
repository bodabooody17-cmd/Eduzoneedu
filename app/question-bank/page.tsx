'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { filterQuestions } from '@/lib/questionBankFilter';
import { QUESTION_BANK, BankQuestion } from '../../src/data/questionBankData';
import { ArrowRight, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

interface QuestionBankPageProps {
  allQuestions?: BankQuestion[];
}

export default function QuestionBankPage({ allQuestions = QUESTION_BANK }: QuestionBankPageProps) {
  const [myTrack, setMyTrack] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMyTrack(localStorage.getItem('EduZone_Track') || 'ثانوية عامة (علمي علوم)');
    }
  }, []);

  // 1. فلترة الأسئلة المسموحة فقط لشعبة الطالب
  const myQuestions = useMemo(() => {
    return filterQuestions(allQuestions, myTrack);
  }, [allQuestions, myTrack]);

  // 2. فلتر المواد اللي تظهر في الفلتر العلوي (فقط المواد الخاصة بشعبة الطالب)
  const mySubjects = useMemo(() => {
    return Array.from(new Set(myQuestions.map((q) => q.subject)));
  }, [myQuestions]);

  // 3. الأسئلة المعروضة حسب المادة المختارة
  const displayedQuestions = useMemo(() => {
    if (selectedSub === 'all') return myQuestions;
    return myQuestions.filter((q) => q.subject === selectedSub);
  }, [myQuestions, selectedSub]);

  const handleSelectOption = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 font-sans dir-rtl text-right">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Navigation header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h1 className="text-base sm:text-lg font-black text-white">بنك الأسئلة التفاعلي</h1>
          </div>
        </div>

        {/* بنر الشعبة باللون الأصفر */}
        <div className="bg-yellow-400 text-slate-950 p-2.5 rounded-xl text-center font-bold text-sm shadow-md flex items-center justify-between">
          <span className="font-black">
            بنك أسئلة: {myTrack || 'عام'} - {myQuestions.length} سؤال متاح
          </span>
          <span className="text-[11px] bg-slate-950 text-yellow-400 px-2.5 py-0.5 rounded-full font-mono">
            {mySubjects.length} مواد دراسية
          </span>
        </div>

        {/* أزرار المواد - أظهر موادك فقط */}
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setSelectedSub('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedSub === 'all'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-gray-800 text-slate-300 hover:bg-gray-700'
            }`}
          >
            الكل ({myQuestions.length})
          </button>
          {mySubjects.map((sub) => {
            const count = myQuestions.filter((q) => q.subject === sub).length;
            const isActive = selectedSub === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>

        {/* عرض الأسئلة */}
        <div className="space-y-3">
          {displayedQuestions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const selectedOpt = userAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-gray-900 border border-slate-800 p-4 rounded-2xl shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 font-bold">سؤال #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-yellow-400 font-bold bg-yellow-400/10 px-2.5 py-0.5 rounded-md border border-yellow-400/20">
                      {q.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {q.lesson}
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {q.question}
                </p>

                {/* خيارات الإجابة */}
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-850 hover:bg-slate-800 text-slate-200 border-slate-750';
                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      } else if (optIdx === selectedOpt && !isCorrect) {
                        btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                      } else {
                        btnStyle = 'bg-slate-900/50 text-slate-500 border-slate-850';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-right p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && optIdx === selectedOpt && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* شرح الإجابة */}
                {revealed[q.id] && q.explanation && (
                  <div className="mt-2 p-2.5 bg-slate-950/80 rounded-xl border border-indigo-500/30 text-xs text-indigo-300">
                    <span className="font-bold text-amber-400 block mb-0.5">💡 التفسير والشرح:</span>
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
