import { useMemo, useState } from 'react';
import { Clock, FileText, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { SearchBar } from '../components/SearchBar';
import { StatsCard } from '../components/StatsCard';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';

export function Dashboard() {
  const { user } = useAuth();
  const {
    activeNotes,
    stats,
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

  const firstName = user?.fullName.split(' ')[0] || 'there';

  return (
    <WorkspaceLayout title="Dashboard">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Here is an overview of your notes, starred references, and recent updates.
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
      </section>

      {/* Notes Statistics */}
      <section
        aria-label="Notes statistics"
        className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatsCard
          label="Total Notes"
          value={stats.total}
          helperText="Active notes in workspace"
          icon={<FileText className="w-5 h-5" />}
          accent="primary"
        />
        <StatsCard
          label="Favorites"
          value={stats.favorites}
          helperText="Starred for quick access"
          icon={<Star className="w-5 h-5" />}
          accent="amber"
        />
        <StatsCard
          label="Recently Updated"
          value={stats.recentlyUpdated}
          helperText="Edited within the last 7 days"
          icon={<Clock className="w-5 h-5" />}
          accent="slate"
        />
      </section>

      {/* Search, Filter & Notes Grid */}
      <section className="mt-8 space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-[#1E293B]">
            Your Notes
          </h3>
          <span className="text-xs text-[#64748B] font-mono tabular-nums">
            {visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}
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
            title={
              searchQuery || selectedCategory !== 'All'
                ? 'No matching notes found'
                : 'No notes in your workspace yet'
            }
            description={
              searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search keywords or switching the selected category filter.'
                : 'Capture your first idea, meeting summary, or study guide to get started.'
            }
            actionLabel={
              searchQuery || selectedCategory !== 'All'
                ? 'Clear Filters'
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
      </section>
    </WorkspaceLayout>
  );
}
