import React, { useState } from 'react';
import { awardPoints } from '../utils/gamification';
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface TransactionExercise {
  id: string;
  scenario: string;
  amount: number;
  correctDebit: string;
  correctCredit: string;
  options: string[];
  explanation: string;
}

const SAMPLE_TRANSACTIONS: TransactionExercise[] = [
  {
    id: 'tx-1',
    scenario: 'اشترت المنشأة بضاعة بمبلغ 25,000 جنيه وسددت القيمة نقداً من الخزينة.',
    amount: 25000,
    correctDebit: 'حـ/ المشتريات',
    correctCredit: 'حـ/ الخزينة (الصندوق)',
    options: ['حـ/ المشتريات', 'حـ/ الخزينة (الصندوق)', 'حـ/ المبيعات', 'حـ/ البنك', 'حـ/ الدائنين'],
    explanation: 'المشتريات أصل ومصروف مدين زاد فيكون مديناً، بينما الخزينة أصل نقدي نقص فيكون دائناً.',
  },
  {
    id: 'tx-2',
    scenario: 'باعت المنشأة بضاعة بمبلغ 40,000 جنيه بشيك أودع بالحساب الجاري في البنك.',
    amount: 40000,
    correctDebit: 'حـ/ البنك',
    correctCredit: 'حـ/ المبيعات',
    options: ['حـ/ البنك', 'حـ/ الخزينة (الصندوق)', 'حـ/ المبيعات', 'حـ/ المدينين'],
    explanation: 'البنك أصل زاد فيكون مديناً، والمبيعات إيراد طبيعته دائنة زاد فيكون دائناً.',
  },
  {
    id: 'tx-3',
    scenario: 'سددت المنشأة إيجار المقر الإداري الشهري بمبلغ 6,000 جنيه نقداً.',
    amount: 6000,
    correctDebit: 'حـ/ مصروف الإيجار',
    correctCredit: 'حـ/ الخزينة (الصندوق)',
    options: ['حـ/ مصروف الإيجار', 'حـ/ الخزينة (الصندوق)', 'حـ/ إيراد الإيجار', 'حـ/ رأس المال'],
    explanation: 'المصروفات دائماً مدينة عند نشوئها وزيادتها، وسدادها نقداً ينقص الخزينة فتصبح دائنة.',
  },
];

export const AccountingSandbox: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDebit, setSelectedDebit] = useState<string>('');
  const [selectedCredit, setSelectedCredit] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [earnedFeedback, setEarnedFeedback] = useState<string | null>(null);

  const tx = SAMPLE_TRANSACTIONS[currentIndex];
  const isCorrect = isEvaluated && selectedDebit === tx.correctDebit && selectedCredit === tx.correctCredit;

  const handleVerify = () => {
    if (!selectedDebit || !selectedCredit) return;
    setIsEvaluated(true);
    if (selectedDebit === tx.correctDebit && selectedCredit === tx.correctCredit) {
      awardPoints(35, `حل تمرين قيود اليومية: ${tx.scenario.slice(0, 30)}...`, 'quiz');
      setEarnedFeedback('إجابة محاسبية نموذجية متطابقة! حصلت على +35 نقطة XP.');
    } else {
      setEarnedFeedback('القيد المحاسبي غير مطابق لطبيعة الحسابات، راجع أطراف القيد.');
    }
  };

  const handleNext = () => {
    setIsEvaluated(false);
    setSelectedDebit('');
    setSelectedCredit('');
    setEarnedFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_TRANSACTIONS.length);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl text-right space-y-4 text-white">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              محاكي تسجيل قيود اليومية للدبلومات الفنية والتجارية
            </h3>
            <p className="text-[11px] text-slate-400">
              تدريب عملي تفاعلي على نظرية القيد المزدوج وتحديد الطرف المدين والدائن
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
          تمرين {currentIndex + 1} من {SAMPLE_TRANSACTIONS.length}
        </span>
      </div>

      {/* Scenario Box */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 block">العملية المالية:</span>
        <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed">
          {tx.scenario}
        </p>
        <div className="text-xs font-mono font-bold text-amber-400">
          القيمة النقدية: {tx.amount.toLocaleString()} جنيه مصري
        </div>
      </div>

      {/* Inputs - Single Column Mobile Stack */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Debit Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <span>الطرف المدين (من حـ/):</span>
          </label>
          <select
            value={selectedDebit}
            onChange={(e) => {
              setSelectedDebit(e.target.value);
              setIsEvaluated(false);
            }}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">-- اختر الحساب المدين --</option>
            {tx.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Credit Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-indigo-400 flex items-center gap-1">
            <span>الطرف الدائن (إلى حـ/):</span>
          </label>
          <select
            value={selectedCredit}
            onChange={(e) => {
              setSelectedCredit(e.target.value);
              setIsEvaluated(false);
            }}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">-- اختر الحساب الدائن --</option>
            {tx.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback Message */}
      {isEvaluated && (
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/40 border-red-500/50 text-red-200'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{earnedFeedback}</span>
          </div>
          <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <strong>الشرح المحاسبي:</strong> {tx.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleNext}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>التمرين التالي</span>
        </button>
        <button
          onClick={handleVerify}
          disabled={!selectedDebit || !selectedCredit}
          className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-black text-xs shadow-md transition-all cursor-pointer"
        >
          تحقق من صحة القيد
        </button>
      </div>
    </div>
  );
};
