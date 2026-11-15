import { ArrowDownUp, LayoutGrid, List, Search, X } from 'lucide-react';
import { NOTE_CATEGORIES } from '../services/noteService';

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionToggle,
  viewMode,
  onViewModeChange,
}) {
  const categories = ['All', ...NOTE_CATEGORIES];

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes by title or content..."
            aria-label="Search notes"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
            <label htmlFor="notes-sort-select" className="text-xs text-[#64748B] whitespace-nowrap">
              Sort by
            </label>
            <select
              id="notes-sort-select"
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value)}
              className="text-xs font-medium text-[#1E293B] bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="updatedAt">Updated Date</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
            <button
              type="button"
              onClick={onSortDirectionToggle}
              title={sortDirection === 'desc' ? 'Newest first' : 'Oldest first'}
              aria-label={`Sort direction: ${sortDirection === 'desc' ? 'descending' : 'ascending'}`}
              className="p-1 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80"
            role="group"
            aria-label="View layout"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Filter notes by category"
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-white border border-slate-200 text-[#64748B] hover:text-[#1E293B] hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
