import { useMemo, useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { SearchBar } from '../components/SearchBar';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useNotes } from '../context/NotesContext';

export function AllNotes() {
  const {
    activeNotes,
    isLoading,
    viewMode,
    setViewMode,
    toggleFavorite,
    softDeleteNote,
    filterAndSortNotes,
  } = useNotes();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const visibleNotes = useMemo(
    () =>
      filterAndSortNotes(activeNotes, {
        searchQuery,
        category: selectedCategory,
        sortField,
        sortDirection,
      }),
    [activeNotes, filterAndSortNotes, searchQuery, selectedCategory, sortField, sortDirection]
  );

  return (
    <WorkspaceLayout title="All Notes">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E293B]">
            All Notes
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Browse, search, and organize every note across your categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/notes/new')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Note</span>
        </button>
      </div>

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

      <div className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 bg-white border border-slate-200 rounded-xl p-5 animate-pulse"
              />
            ))}
          </div>
        ) : visibleNotes.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title={
              searchQuery || selectedCategory !== 'All'
                ? 'No notes match your filter'
                : 'No notes created yet'
            }
            description={
              searchQuery || selectedCategory !== 'All'
                ? 'Try clearing your search or selecting All categories.'
                : 'Start writing your first note using the rich text editor.'
            }
            actionLabel={
              searchQuery || selectedCategory !== 'All'
                ? 'Reset Filters'
                : 'Create New Note'
            }
            onAction={() => {
              if (searchQuery || selectedCategory !== 'All') {
                setSearchQuery('');
                setSelectedCategory('All');
              } else {
                navigate('/notes/new');
              }
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode="grid"
                onOpen={(id) => navigate(`/notes/${id}`)}
                onEdit={(id) => navigate(`/notes/${id}`)}
                onToggleFavorite={toggleFavorite}
                onDelete={softDeleteNote}
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
                onOpen={(id) => navigate(`/notes/${id}`)}
                onEdit={(id) => navigate(`/notes/${id}`)}
                onToggleFavorite={toggleFavorite}
                onDelete={softDeleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
