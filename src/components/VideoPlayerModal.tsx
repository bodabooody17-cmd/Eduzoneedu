import React, { useState } from 'react';
import { VideoCourse } from '../types';
import { awardPoints } from '../utils/gamification';
import {
  X,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  BookOpen,
  Clock,
  ListOrdered,
  Sparkles,
  Zap,
} from 'lucide-react';

import { AdsterraNativeBanner } from './AdsterraNativeBanner';

interface VideoPlayerModalProps {
  course: VideoCourse | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  course,
  onClose,
  isAdmin = false,
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(25);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [showEarnedToast, setShowEarnedToast] = useState(false);

  if (!course) return null;

  const currentLesson = course.lessons[selectedLessonIndex] || course.lessons[0];
  const isLessonCompleted = completedLessonIds.includes(currentLesson.id);

  const handleCompleteLesson = () => {
    if (isLessonCompleted) return;
    setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    awardPoints(80, `إنهاء درس: ${currentLesson.title} (${course.title})`, 'course');
    setShowEarnedToast(true);
    setTimeout(() => {
      setShowEarnedToast(false);
    }, 4500);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSpeed = () => {
    if (playbackSpeed === 1) setPlaybackSpeed(1.25);
    else if (playbackSpeed === 1.25) setPlaybackSpeed(1.5);
    else if (playbackSpeed === 1.5) setPlaybackSpeed(2);
    else setPlaybackSpeed(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {course.title}
              </h2>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>المحاضر: {course.instructor}</span>
                <span aria-hidden="true">•</span>
                <span>{course.lessonsCount} دروس تعليمية</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video & Playlist Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 bg-slate-950">
          {/* Main Stage (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-950 p-4 sm:p-6 text-white border-b lg:border-b-0 lg:border-l border-slate-800">
            {/* Virtual Video Canvas */}
            <div className="relative aspect-video w-full bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-between p-4 group">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="bg-slate-800/90 text-slate-200 px-2.5 py-1 rounded-md font-bold">
                  {currentLesson.title}
                </span>
                <span className="text-red-400 font-bold">بث 1080p HD</span>
              </div>

              {/* Center Play Button Graphic */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleTogglePlay}
                  className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Player Controls Bar */}
              <div className="bg-slate-950/90 backdrop-blur-md rounded-lg p-2.5 space-y-2">
                {/* Timeline bar */}
                <div
                  className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = Math.round((clickX / rect.width) * 100);
                    setProgressPercent(Math.min(100, Math.max(0, percent)));
                  }}
                >
                  <div
                    className="bg-red-600 h-full rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button onClick={handleTogglePlay} className="hover:text-white cursor-pointer">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <span className="tabular-nums font-mono text-[11px]">
                      {Math.floor((progressPercent * 45) / 100)}:20 / {currentLesson.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleNextSpeed}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-bold tabular-nums cursor-pointer"
                    >
                      {playbackSpeed}x
                    </button>
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Adsterra Native Banner (Directly under video player, min-height 250px, client-side, hidden for admin) */}
            <AdsterraNativeBanner isAdmin={isAdmin} />

            {/* Floating XP Reward Notification */}
            {showEarnedToast && (
              <div className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 p-3 rounded-xl text-center text-xs font-black shadow-lg flex items-center justify-center gap-2 mt-4 animate-bounce">
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>تهانينا! حصلت على +80 نقطة خبرة (XP) لإتمام الدرس!</span>
              </div>
            )}

            {/* Lecture Summary Details below video */}
            <div className="mt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {currentLesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    مدة المحاضرة: {currentLesson.duration} | إنتاج منصة EduZone
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isLessonCompleted ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>مكتمل (+80 XP)</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleCompleteLesson}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>إتمام الدرس (+80 XP)</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>ملخص نواتج التعلم:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentLesson.summary}
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 block mb-1">
                    أبرز النقاط الجوهرية:
                  </span>
                  {(currentLesson.keyTakeaways || []).map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ListOrdered className="w-4 h-4 text-red-500" />
                  <span>قائمة دروس الكورس</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold tabular-nums">
                  {course.lessons.length} دروس
                </span>
              </div>

              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => {
                  const isCurrent = idx === selectedLessonIndex;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLessonIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`w-full text-right p-3 rounded-xl transition-all flex items-start gap-3 border cursor-pointer ${
                        isCurrent
                          ? 'bg-red-950/60 border-red-700/60 text-white'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isCurrent
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-bold leading-tight">
                          {lesson.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">
                هل تحتاج لمساعدة أو مناقشة مع المدرسين؟
              </span>
              <a
                href="https://t.me/+2OhLLu7ofSoxNTNk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 font-bold block"
              >
                انضم لمجتمع التليجرام الرسمي
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
