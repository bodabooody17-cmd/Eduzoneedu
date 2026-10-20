import React, { useState } from 'react';
import {
  X,
  Sparkles,
  GraduationCap,
  MapPin,
  Calendar,
  Maximize2,
} from 'lucide-react';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isFullPhotoOpen, setIsFullPhotoOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right select-none">
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-amber-500/40 overflow-hidden flex flex-col relative max-h-[92vh]">
          {/* Glow decoration */}
          <div className="absolute top-0 right-1/4 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Top Bar */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-amber-400">
                الملف الشخصي للمؤسس والمطور الرئيسي
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto relative z-10">
            {/* Portrait & Core Identity */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                onClick={() => setIsFullPhotoOpen(true)}
                title="اضغط لعرض الصورة الأصلية كاملة"
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/images/eng_abdullah.jpg"
                  alt="Eng.Abdullah Abdelwahab"
                  className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-[center_24%] border-2 border-amber-400 shadow-2xl bg-slate-900 group-hover:scale-102 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = '/public/assets/aistudio/developer_profile.jpg';
                  }}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-slate-950 border border-amber-400 text-amber-300 text-[10px] font-black shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Founder & Lead Engineer</span>
                </span>
                <span className="absolute top-1 left-1 p-1 bg-slate-950/80 rounded-full border border-amber-400/50 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>

              <div className="pt-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Eng.Abdullah Abdelwahab
                </h2>
                <p className="text-sm font-bold text-amber-400 mt-1">
                  مؤسس ومطور منصة EduZone التعليمية
                </p>
                <button
                  type="button"
                  onClick={() => setIsFullPhotoOpen(true)}
                  className="mt-2 text-[11px] text-amber-400/90 hover:text-amber-300 font-bold bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3 h-3 text-amber-400" />
                  <span>عرض الصورة الأصلية بالكامل</span>
                </button>
              </div>
            </div>

            {/* Quick Info Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">العمر</span>
                  <span className="text-xs font-black text-white">22 Years old</span>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">الموقع</span>
                  <span className="text-xs font-black text-white">El Mahalla El Kubra</span>
                </div>
              </div>
            </div>

            {/* Academic Background Card */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-right">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>المؤهل الأكاديمي والمهني:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                Computer Science and Information Technology graduate, Business Administration department, 2026
              </p>
            </div>

            {/* About EduZone & Vision */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-1.5">
              <span className="text-[11px] font-black text-amber-400 block">
                رؤية منصة EduZone التعليمية
              </span>
              <p>
                نهدف لتقديم تجربة تعليمية رائدة تجمع بين أفضل مذكرات الأساتذة المعتمدين، وبنك أسئلة ذكي تفاعلي، وتطوير مهارات الطلاب الفنية والجامعية لدخول سوق العمل بجدارة.
              </p>
            </div>

            {/* Close Action */}
            <div className="pt-1">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors border border-slate-700/60 cursor-pointer shadow-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Portrait Lightbox (Shows developer photo untouched: exact features, full background & resolution) */}
      {isFullPhotoOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsFullPhotoOpen(false)}
        >
          <div className="relative max-w-sm w-full flex flex-col items-center">
            <button
              onClick={() => setIsFullPhotoOpen(false)}
              className="absolute -top-12 left-0 p-2 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <X className="w-4 h-4" />
              <span>إغلاق</span>
            </button>
            <div className="rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl bg-slate-950 max-h-[82vh]">
              <img
                src="/images/eng_abdullah.jpg"
                alt="Eng.Abdullah Abdelwahab - Full Portrait"
                className="w-full h-auto max-h-[82vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/public/assets/aistudio/developer_profile.jpg';
                }}
              />
            </div>
            <p className="text-center text-xs text-amber-300 font-bold mt-3">
              Eng.Abdullah Abdelwahab — مؤسس ومطور منصة EduZone
            </p>
          </div>
        </div>
      )}
    </>
  );
};
