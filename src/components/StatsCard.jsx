export function StatsCard({
  label,
  value,
  helperText,
  icon,
  accent = 'primary',
}) {
  const iconStyles =
    accent === 'amber'
      ? 'bg-amber-50 text-amber-600'
      : accent === 'slate'
      ? 'bg-slate-100 text-[#64748B]'
      : 'bg-indigo-50 text-[#6366F1]';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#64748B] truncate">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-[#1E293B] tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-xs text-[#64748B] truncate">{helperText}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconStyles}`}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  );
}
