export function Logo({ size = 'md' }) {
  const iconDim = size === 'lg' ? 'w-9 h-9' : size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const textSize =
    size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <span
        className={`${iconDim} inline-flex items-center justify-center rounded-lg bg-[#6366F1] text-white shadow-xs`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4.5 h-4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      </span>
      <span
        className={`font-display font-bold tracking-tight text-[#1E293B] ${textSize}`}
      >
        FolioNote
      </span>
    </span>
  );
}
