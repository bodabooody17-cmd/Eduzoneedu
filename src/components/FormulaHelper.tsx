import React, { useState } from 'react';
import { Sigma, Atom, Calculator } from 'lucide-react';

interface FormulaGroup {
  id: string;
  category: string;
  icon: any;
  items: { name: string; formula: string; note: string }[];
}

const FORMULA_GROUPS: FormulaGroup[] = [
  {
    id: 'physics',
    category: 'الفيزياء',
    icon: Atom,
    items: [
      { name: 'قانون أوم', formula: 'V = I × R', note: 'فرق الجهد = شدة التيار × المقاومة' },
      { name: 'قانون أوم للدوائر المغلقة', formula: 'Σ V_B = Σ (I × R)', note: 'لحساب تيار الدائرة الكلية مع المقاومة الداخلية' },
      { name: 'طاقة الفوتون وبلانك', formula: 'E = h × ν = (h × c) / λ', note: 'تردد الفوتون والطول الموجي' },
      { name: 'القوة الدافعة اللحظية للدينامو', formula: 'emf = N × B × A × ω × sin(θ)', note: 'السرعة الزاوية ω = 2πf' },
    ],
  },
  {
    id: 'accounting',
    category: 'المحاسبة المالية',
    icon: Calculator,
    items: [
      { name: 'معادلة الميزانية', formula: 'الأصول = الالتزامات + حقوق الملكية', note: 'أساس نظرية القيد المزدوج' },
      { name: 'مجمل الربح', formula: 'صافي المبيعات - (تكلفة المبيعات)', note: 'حساب المتاجرة' },
      { name: 'صافي الدخل', formula: 'مجمل الربح - المصروفات التشغيلية', note: 'قائمة الدخل السنوية' },
      { name: 'قسط الإهلاك السنوي (القسط الثابت)', formula: '(تكلفة الأصل - الخردة) / العمر الإنتاجي', note: 'تسوية الأصول الثابتة' },
    ],
  },
];

export const FormulaHelper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'physics' | 'accounting'>('physics');
  const currentGroup = FORMULA_GROUPS.find((g) => g.id === activeTab) || FORMULA_GROUPS[0];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-right space-y-3.5 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sigma className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white">
              بنك القوانين والمعادلات الذهبية
            </h3>
            <p className="text-[10px] text-slate-400">
              أهم القوانين الامتحانية المتكررة للحفظ والمراجعة السريعة
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
          <button
            onClick={() => setActiveTab('physics')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'physics'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            فيزياء
          </button>
          <button
            onClick={() => setActiveTab('accounting')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'accounting'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            محاسبة
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {currentGroup.items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1"
          >
            <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
            <div className="font-mono font-black text-xs sm:text-sm text-amber-300 bg-slate-900 p-2 rounded-lg border border-slate-800 dir-ltr text-center">
              {item.formula}
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
