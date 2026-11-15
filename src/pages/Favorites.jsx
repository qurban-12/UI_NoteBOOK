import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { SearchBar } from '../components/SearchBar';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useNotes } from '../context/NotesContext';

export function Favorites() {
  const {
    favoriteNotes,
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
      filterAndSortNotes(favoriteNotes, {
        searchQuery,
        category: selectedCategory,
        sortField,
        sortDirection,
      }),
    [favoriteNotes, filterAndSortNotes, searchQuery, selectedCategory, sortField, sortDirection]
  );

  return (
    <WorkspaceLayout title="Favorites">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E293B]">
            Favorites
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Important references and pinned notes marked with a star.
          </p>
        </div>
        <span className="text-xs text-[#64748B] font-mono tabular-nums">
          {visibleNotes.length} {visibleNotes.length === 1 ? 'favorite' : 'favorites'}
        </span>
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
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-48 bg-white border border-slate-200 rounded-xl p-5 animate-pulse"
              />
            ))}
          </div>
        ) : visibleNotes.length === 0 ? (
          <EmptyState
            icon={<Star className="w-6 h-6" />}
            title={
              searchQuery || selectedCategory !== 'All'
                ? 'No matching favorite notes'
                : 'No favorite notes yet'
            }
            description={
              searchQuery || selectedCategory !== 'All'
                ? 'Try clearing your search or category filter.'
                : 'Click the star icon on any note card to keep your key references right here.'
            }
            actionLabel={
              searchQuery || selectedCategory !== 'All'
                ? 'Reset Filters'
                : 'Browse All Notes'
            }
            onAction={() => {
              if (searchQuery || selectedCategory !== 'All') {
                setSearchQuery('');
                setSelectedCategory('All');
              } else {
                navigate('/notes');
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
