import { FileText } from 'lucide-react';

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-14 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#64748B] flex items-center justify-center mb-4">
        {icon ?? <FileText className="w-6 h-6" />}
      </div>
      <h3 className="font-display text-base font-semibold text-[#1E293B]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#64748B] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
