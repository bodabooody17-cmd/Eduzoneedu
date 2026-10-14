import React, { useState, useEffect } from 'react';
import { awardPoints } from '../utils/gamification';
import { playNotificationChime } from '../utils/notificationAudio';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Flame,
} from 'lucide-react';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(selectedMinutes * 60);
    setIsRunning(false);
  }, [selectedMinutes]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playNotificationChime();
      awardPoints(40, `إكمال جلسة تركيز (${selectedMinutes} دقيقة)`, 'bonus');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, selectedMinutes]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                مؤقت المذاكرة والتركيز (بومودورو)
              </h3>
              <p className="text-[11px] text-slate-400">
                قسّم وقتك لجلسات تركيز للحصول على أعلى معدل استيعاب ونقاط XP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-5 bg-slate-900">
          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2">
            {[
              { min: 15, label: '15 دقيقة (سريع)' },
              { min: 25, label: '25 دقيقة (بومودورو)' },
              { min: 50, label: '50 دقيقة (مكثف)' },
            ].map((preset) => (
              <button
                key={preset.min}
                onClick={() => {
                  setSelectedMinutes(preset.min);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMinutes === preset.min
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Big Clock Dial */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center rounded-full border-8 border-slate-800 bg-slate-950 shadow-2xl">
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-wider">
                {formattedTime}
              </span>
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>جلسة تركيز مستمرة</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'إيقاف مؤقت' : 'ابدأ الجلسة'}</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(selectedMinutes * 60);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl transition-colors cursor-pointer border border-slate-700"
              title="إعادة ضبط المؤقت"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Reward note */}
          <div className="bg-amber-950/40 rounded-xl p-3 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>عند انتهاء الجلسة ستحصل على <strong>+40 نقطة XP</strong> تشجيعية!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
