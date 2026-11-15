import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { noteService } from '../services/noteService';
import { stripHtml } from '../utils/validation';
import { useAuth } from './AuthContext';

const VIEW_MODE_KEY = 'folionote_view_mode_v1';

const NotesContext = createContext(undefined);

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(VIEW_MODE_KEY);
      return saved === 'list' ? 'list' : 'grid';
    } catch {
      return 'grid';
    }
  });

  const setViewMode = useCallback((mode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {
      // Ignore storage failures
    }
  }, []);

  const refreshNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      return;
    }
    setIsLoading(true);
    try {
      const fetched = await noteService.getNotes(user.id);
      setNotes(fetched);
    } catch {
      toast.error('Unable to load notes.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const activeNotes = useMemo(() => notes.filter((n) => !n.isDeleted), [notes]);
  const favoriteNotes = useMemo(
    () => notes.filter((n) => !n.isDeleted && n.isFavorite),
    [notes]
  );
  const deletedNotes = useMemo(() => notes.filter((n) => n.isDeleted), [notes]);

  const stats = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentlyUpdated = activeNotes.filter(
      (n) => new Date(n.updatedAt).getTime() >= sevenDaysAgo
    ).length;

    return {
      total: activeNotes.length,
      favorites: favoriteNotes.length,
      recentlyUpdated,
      deleted: deletedNotes.length,
    };
  }, [activeNotes, favoriteNotes, deletedNotes]);

  const getNoteById = useCallback(
    (noteId) => notes.find((n) => n.id === noteId),
    [notes]
  );

  const createNote = useCallback(
    async (payload) => {
      if (!user) throw new Error('Authentication required.');
      const created = await noteService.createNote(user.id, payload);
      setNotes((prev) => [created, ...prev]);
      toast.success('Note saved.');
      return created;
    },
    [user]
  );

  const updateNote = useCallback(
    async (noteId, updates) => {
      if (!user) throw new Error('Authentication required.');
      const updated = await noteService.updateNote(user.id, noteId, updates);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      toast.success('Note updated.');
      return updated;
    },
    [user]
  );

  const toggleFavorite = useCallback(
    async (noteId) => {
      if (!user) return;
      const updated = await noteService.toggleFavorite(user.id, noteId);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      toast.info(updated.isFavorite ? 'Added to favorites.' : 'Removed from favorites.');
    },
    [user]
  );

  const softDeleteNote = useCallback(
    async (noteId) => {
      if (!user) return;
      const updated = await noteService.softDeleteNote(user.id, noteId);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      toast.info('Note moved to Recently Deleted.');
    },
    [user]
  );

  const restoreNote = useCallback(
    async (noteId) => {
      if (!user) return;
      const updated = await noteService.restoreNote(user.id, noteId);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      toast.success('Note restored.');
    },
    [user]
  );

  const permanentlyDeleteNote = useCallback(
    async (noteId) => {
      if (!user) return;
      await noteService.permanentlyDeleteNote(user.id, noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.info('Note permanently deleted.');
    },
    [user]
  );

  const emptyTrash = useCallback(async () => {
    if (!user) return;
    await noteService.emptyTrash(user.id);
    setNotes((prev) => prev.filter((n) => !n.isDeleted));
    toast.info('Trash emptied.');
  }, [user]);

  const filterAndSortNotes = useCallback((sourceNotes, options) => {
    const normalizedQuery = (options.searchQuery || '').trim().toLowerCase();

    const filtered = sourceNotes.filter((note) => {
      if (options.category !== 'All' && note.category !== options.category) {
        return false;
      }
      if (!normalizedQuery) return true;
      const plainBody = stripHtml(note.content).toLowerCase();
      return (
        note.title.toLowerCase().includes(normalizedQuery) ||
        plainBody.includes(normalizedQuery) ||
        note.category.toLowerCase().includes(normalizedQuery)
      );
    });

    return [...filtered].sort((a, b) => {
      if (options.sortField === 'title') {
        const cmp = a.title.localeCompare(b.title);
        return options.sortDirection === 'asc' ? cmp : -cmp;
      }
      const timeA = new Date(a[options.sortField]).getTime();
      const timeB = new Date(b[options.sortField]).getTime();
      return options.sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNotes,
        favoriteNotes,
        deletedNotes,
        stats,
        isLoading,
        viewMode,
        setViewMode,
        refreshNotes,
        getNoteById,
        createNote,
        updateNote,
        toggleFavorite,
        softDeleteNote,
        restoreNote,
        permanentlyDeleteNote,
        emptyTrash,
        filterAndSortNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider.');
  }
  return context;
}
