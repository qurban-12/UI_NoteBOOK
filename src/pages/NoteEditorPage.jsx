import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EmptyState } from '../components/EmptyState';
import { NoteEditor } from '../components/NoteEditor';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useNotes } from '../context/NotesContext';
import { formatDateTime } from '../utils/validation';

export function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNoteById, createNote, updateNote } = useNotes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreating = !id || id === 'new';
  const existingNote = !isCreating && id ? getNoteById(id) : undefined;

  const handleSave = async (payload) => {
    setIsSubmitting(true);
    try {
      if (isCreating) {
        await createNote(payload);
      } else if (existingNote) {
        await updateNote(existingNote.id, payload);
      }
      navigate('/notes');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to save note.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreating && !existingNote) {
    return (
      <WorkspaceLayout title="Note Not Found">
        <EmptyState
          title="This note could not be found"
          description="It may have been permanently deleted or moved."
          actionLabel="Back to All Notes"
          onAction={() => navigate('/notes')}
        />
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout title={isCreating ? 'New Note' : 'Edit Note'}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/notes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Notes</span>
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            /
          </span>
          <span className="text-sm text-[#1E293B] font-medium truncate">
            {isCreating ? 'New Note' : existingNote?.title}
          </span>
        </div>

        {!isCreating && existingNote && (
          <div className="text-xs text-[#64748B] font-mono tabular-nums">
            Last updated {formatDateTime(existingNote.updatedAt)}
          </div>
        )}
      </div>

      <NoteEditor
        initialTitle={existingNote?.title ?? ''}
        initialContent={existingNote?.content ?? ''}
        initialCategory={existingNote?.category ?? 'Work'}
        initialFavorite={existingNote?.isFavorite ?? false}
        isSubmitting={isSubmitting}
        submitLabel={isCreating ? 'Create Note' : 'Save Changes'}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
      />
    </WorkspaceLayout>
  );
}
