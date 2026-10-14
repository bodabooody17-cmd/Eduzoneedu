import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [stage, setStage] = useState('ثانوية عامة (علمي علوم)');
  const [question, setQuestion] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn text-right">
      <div className="bg-slate-900 w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                تواصل مع إدارة منصة EduZone
              </h2>
              <p className="text-xs text-slate-400">
                فريق الدعم الفني والأكاديمي متاح للرد على استفساراتكم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-slate-900">
          {/* Quick Telegram Channel */}
          <div className="space-y-3">
            <a
              href="https://t.me/+2OhLLu7ofSoxNTNk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 p-4 rounded-xl text-white flex items-center justify-between shadow-lg hover:shadow-xl transition-all cursor-pointer block group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm">مجتمع وقناة التليجرام الرسمية</h3>
                  <p className="text-xs text-sky-100">
                    انضم لآلاف الطلاب لتحميل المذكرات الفورية والاستفسار من المدرسين
                  </p>
                </div>
              </div>
              <span className="text-xs font-black bg-white text-slate-950 px-3 py-1.5 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                انضم الآن
              </span>
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-black text-white border-b border-slate-800 pb-2">
              إرسال استفسار مباشر
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                اسم الطالب / المعلم:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="اكتب اسمك هنا..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 text-xs focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الشعبة أو المرحلة:
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-sky-500"
              >
                <option value="ثانوية عامة (علمي علوم)">ثانوية عامة (علمي علوم)</option>
                <option value="ثانوية عامة (علمي رياضة)">ثانوية عامة (علمي رياضة)</option>
                <option value="دبلوم تجارة (3 و 5 سنوات)">دبلوم تجارة (3 و 5 سنوات)</option>
                <option value="دبلوم صنايع">دبلوم صنايع</option>
                <option value="دورات جامعية">دورات جامعية</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نص الرسالة أو الاستفسار:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={3}
                placeholder="اكتب استفسارك بالتفصيل..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 text-xs focus:ring-1 focus:ring-sky-500"
              />
            </div>
            {sentSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم إرسال رسالتك بنجاح! سيتم الرد عليك في أقرب وقت.</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
