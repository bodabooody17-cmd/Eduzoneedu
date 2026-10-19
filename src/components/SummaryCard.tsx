import React from 'react';
import { SummaryItem } from '../types';
import { FileText, Download, Eye, Bookmark } from 'lucide-react';

interface SummaryCardProps {
  item: SummaryItem;
  onReadOnline: (item: SummaryItem) => void;
  onDownloadPdf: (item: SummaryItem) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCommerce?: boolean;
  onOpenVipPayment?: () => void;
  onOpenBooklet?: (item: SummaryItem) => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  item,
  onReadOnline,
  onDownloadPdf,
  isSaved,
  onToggleSave,
  onOpenBooklet,
}) => {
  const isPaid = item.planType === 'paid';

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-md shadow-black/25 p-4 flex flex-col justify-between text-right text-white relative transition-all duration-150 active:scale-[0.99]">
      <div>
        {/* Card Header & Track */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                isPaid
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isPaid ? 'مدفوع (VIP)' : 'مجاني'}
            </span>
            {onOpenBooklet ? (
              <button
                type="button"
                onClick={() => onOpenBooklet(item)}
                title="فتح مذكرة الـ 24 صفحة كاملة"
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 border border-yellow-400/40 flex items-center gap-1 transition cursor-pointer"
              >
                📖 24 صفحة كاملة
              </button>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 flex items-center gap-1">
                📖 24 صفحة كاملة
              </span>
            )}
            <span className="text-xs font-semibold text-slate-400">
              {item.subject}
            </span>
          </div>
          <button
            onClick={() => onToggleSave(item.id)}
            title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المذكرة'}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isSaved
                ? 'text-amber-400 bg-amber-500/20 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/80'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-black text-white leading-snug mb-1.5">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-750"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>{item.pagesCount} صفحة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onReadOnline(item)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer border border-slate-700 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>قراءة</span>
          </button>
          <button
            onClick={() => onDownloadPdf(item)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
