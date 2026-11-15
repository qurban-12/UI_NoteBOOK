import { Edit3, RotateCcw, Star, Trash2 } from 'lucide-react';
import { formatDate, stripHtml } from '../utils/validation';

export function NoteCard({
  note,
  viewMode,
  isTrash = false,
  onOpen,
  onEdit,
  onToggleFavorite,
  onDelete,
  onRestore,
  onPermanentDelete,
}) {
  const previewText = stripHtml(note.content) || 'No content yet.';
  const formattedDate = formatDate(
    isTrash && note.deletedAt ? note.deletedAt : note.updatedAt
  );

  if (viewMode === 'list') {
    return (
      <article
        onClick={() => !isTrash && onOpen?.(note.id)}
        className={`group bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 ${
          !isTrash
            ? 'hover:border-slate-300 hover:shadow-xs cursor-pointer'
            : 'hover:border-slate-300'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-base font-semibold text-[#1E293B] truncate">
              {note.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-[#64748B] line-clamp-1">{previewText}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#64748B]">
            <span className="font-medium text-slate-600">{note.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {isTrash ? `Deleted ${formattedDate}` : `Updated ${formattedDate}`}
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {!isTrash ? (
            <>
              <button
                type="button"
                onClick={() => onToggleFavorite?.(note.id)}
                aria-label={
                  note.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
                title={
                  note.isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  note.isFavorite
                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100/70'
                    : 'text-[#64748B] hover:text-amber-500 hover:bg-slate-100'
                }`}
              >
                <Star
                  className="w-4 h-4"
                  fill={note.isFavorite ? 'currentColor' : 'none'}
                />
              </button>
              <button
                type="button"
                onClick={() => onEdit?.(note.id)}
                aria-label={`Edit ${note.title}`}
                title="Edit note"
                className="p-2 rounded-lg text-[#64748B] hover:text-[#6366F1] hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(note.id)}
                aria-label={`Delete ${note.title}`}
                title="Move to Recently Deleted"
                className="p-2 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onRestore?.(note.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6366F1] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>
              <button
                type="button"
                onClick={() => onPermanentDelete?.(note.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#EF4444] bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Forever</span>
              </button>
            </>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => !isTrash && onOpen?.(note.id)}
      className={`group bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between min-h-[196px] transition-all duration-150 ${
        !isTrash
          ? 'hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer'
          : 'hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-[#1E293B] leading-snug line-clamp-2">
            {note.title}
          </h3>
          {!isTrash && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(note.id);
              }}
              aria-label={
                note.isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
              title={
                note.isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
              className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                note.isFavorite
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100/70'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
            >
              <Star
                className="w-4 h-4"
                fill={note.isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>

        <p className="mt-2.5 text-sm text-[#64748B] leading-relaxed line-clamp-3">
          {previewText}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] min-w-0 truncate">
          <span className="font-medium text-slate-600">{note.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums truncate">{formattedDate}</span>
        </div>

        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {!isTrash ? (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(note.id)}
                aria-label={`Edit ${note.title}`}
                title="Edit note"
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#6366F1] hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(note.id)}
                aria-label={`Delete ${note.title}`}
                title="Move to Recently Deleted"
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onRestore?.(note.id)}
                aria-label={`Restore ${note.title}`}
                title="Restore note"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#6366F1] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>
              <button
                type="button"
                onClick={() => onPermanentDelete?.(note.id)}
                aria-label={`Delete ${note.title} permanently`}
                title="Delete forever"
                className="p-1.5 rounded-md text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
