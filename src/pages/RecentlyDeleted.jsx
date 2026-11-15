import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { SearchBar } from '../components/SearchBar';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useNotes } from '../context/NotesContext';

export function RecentlyDeleted() {
  const {
    deletedNotes,
    viewMode,
    setViewMode,
    restoreNote,
    permanentlyDeleteNote,
    emptyTrash,
    filterAndSortNotes,
  } = useNotes();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const [noteToDelete, setNoteToDelete] = useState(null);
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);

  const visibleNotes = useMemo(
    () =>
      filterAndSortNotes(deletedNotes, {
        searchQuery,
        category: selectedCategory,
        sortField,
        sortDirection,
      }),
    [deletedNotes, filterAndSortNotes, searchQuery, selectedCategory, sortField, sortDirection]
  );

  return (
    <WorkspaceLayout title="Recently Deleted">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E293B]">
            Recently Deleted
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Restore deleted notes back to your workspace or remove them permanently.
          </p>
        </div>

        {deletedNotes.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmEmptyOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#EF4444] bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      {deletedNotes.length > 0 && (
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDirection={sortDirection}
          onSortDirectionToggle={() =>
            setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))
          }
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      <div className="mt-6">
        {deletedNotes.length === 0 ? (
          <EmptyState
            icon={<Trash2 className="w-6 h-6" />}
            title="Trash is empty"
            description="Notes you delete are kept here so you can restore them if needed."
            actionLabel="Back to Dashboard"
            onAction={() => navigate('/dashboard')}
          />
        ) : visibleNotes.length === 0 ? (
          <EmptyState
            icon={<Trash2 className="w-6 h-6" />}
            title="No matching deleted notes"
            description="Adjust your search or category filter to view other deleted notes."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode="grid"
                isTrash
                onRestore={restoreNote}
                onPermanentDelete={(id) => setNoteToDelete(id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode="list"
                isTrash
                onRestore={restoreNote}
                onPermanentDelete={(id) => setNoteToDelete(id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        title="Delete note permanently?"
        description="This action cannot be undone. The note will be permanently removed from your workspace."
        confirmLabel="Delete Forever"
        onCancel={() => setNoteToDelete(null)}
        onConfirm={async () => {
          if (noteToDelete) {
            await permanentlyDeleteNote(noteToDelete);
            setNoteToDelete(null);
          }
        }}
      />

      <ConfirmDialog
        isOpen={confirmEmptyOpen}
        title="Empty Recently Deleted?"
        description={`All ${deletedNotes.length} deleted ${
          deletedNotes.length === 1 ? 'note' : 'notes'
        } will be permanently removed and cannot be recovered.`}
        confirmLabel="Empty Trash"
        onCancel={() => setConfirmEmptyOpen(false)}
        onConfirm={async () => {
          await emptyTrash();
          setConfirmEmptyOpen(false);
        }}
      />
    </WorkspaceLayout>
  );
}
