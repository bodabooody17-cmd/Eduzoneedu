import React from 'react';
import { X, Check, Sparkles, BookOpen } from 'lucide-react';
import { TRACKS_CONFIG } from '../lib/tracks';

interface ChangeTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrackName?: string;
  onSelectTrack: (trackName: string) => void;
}

export const ChangeTrackModal: React.FC<ChangeTrackModalProps> = ({
  isOpen,
  onClose,
  currentTrackName = '',
  onSelectTrack,
}) => {
  if (!isOpen) return null;

  const tracks = [
    {
      id: 'ثانوية عامة (علمي علوم)',
      title: '🔬 ثانوية عامة (علمي علوم)',
      desc: 'فيزياء • كيمياء • أحياء • جيولوجيا • عربي • لغات',
      badge: 'علمي علوم',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'ثانوية عامة (علمي رياضة)',
      title: '📐 ثانوية عامة (علمي رياضة)',
      desc: 'فيزياء • كيمياء • رياضة بحتة • استاتيكا وديناميكا • عربي',
      badge: 'علمي رياضة',
      color: 'from-indigo-600 to-purple-700',
    },
    {
      id: 'ثانوية عامة (شعبة أدبي)',
      title: '📚 ثانوية عامة (شعبة أدبي)',
      desc: 'تاريخ • جغرافيا • فلسفة ومنطق • علم نفس • عربي • لغات',
      badge: 'أدبي',
      color: 'from-amber-600 to-orange-700',
    },
    {
      id: 'دبلوم تجارة (3 و 5 سنوات)',
      title: '💼 دبلوم تجارة (3 و 5 سنوات)',
      desc: 'محاسبة مالية • إدارة أعمال • اقتصاد • إحصاء • قانون تجاري',
      badge: 'تجارة',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'دبلوم صنايع وتكنولوجيا',
      title: '⚙️ دبلوم صنايع وتكنولوجيا',
      desc: 'رسم فني صناعي • ميكانيكا • كهرباء • تبريد وتكييف',
      badge: 'صنايع',
      color: 'from-rose-600 to-pink-700',
    },
    {
      id: 'ثانوية عامة لغات (Languages)',
      title: '🌐 ثانوية عامة لغات (Languages)',
      desc: 'Physics • Chemistry • Biology • Pure & Applied Math',
      badge: 'Languages',
      color: 'from-cyan-600 to-blue-700',
    },
    {
      id: 'دورات جامعية و ICDL',
      title: '💻 دورات جامعية و ICDL',
      desc: 'Microsoft Office • دوال إكسيل • إعداد أبحاث • برمجة',
      badge: 'جامعية',
      color: 'from-violet-600 to-purple-800',
    },
  ];

  const handleSelect = (trackId: string) => {
    try {
      localStorage.setItem('EduZone_Track', trackId);
      localStorage.setItem('userBranch', trackId);
      window.dispatchEvent(new Event('eduzone_track_changed'));
    } catch (e) {
      console.error(e);
    }
    onSelectTrack(trackId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-white font-sans text-right animate-fadeIn select-none">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg">
              🎓
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                تغيير الشعبة الدراسية
              </h2>
              <p className="text-[11px] text-slate-400">
                اختار شعبتك عشان نفلترلك المذكرات والأسئلة بدقة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {tracks.map((t) => {
            const isSelected =
              currentTrackName &&
              (currentTrackName.includes(t.badge) ||
                t.id.includes(currentTrackName) ||
                currentTrackName === t.id);

            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-md ring-1 ring-yellow-400/40'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{t.title}</span>
                    {isSelected && (
                      <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                        الشعبة الحالية
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {t.desc}
                  </div>
                </div>

                <div className="shrink-0 mr-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-900" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400">
          <span>يمكنك تغيير شعبتك في أي وقت من زر الشعبة أو ملفك الشخصي</span>
        </div>
      </div>
    </div>
  );
};
