const NOTES_STORAGE_KEY = 'folionote_notes_v1';
const SEEDED_USERS_KEY = 'folionote_seeded_users_v1';

export const NOTE_CATEGORIES = [
  'Work',
  'Learning',
  'Personal',
  'Ideas',
  'Tasks',
];

function createStarterNotes(userId) {
  const now = Date.now();
  const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
  const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString();

  return [
    {
      id: `note_${userId}_1`,
      userId,
      title: 'My Learning Goals',
      category: 'Learning',
      isFavorite: true,
      isDeleted: false,
      createdAt: daysAgo(12),
      updatedAt: hoursAgo(2),
      deletedAt: null,
      content: `<h2>Q4 Technical Mastery Plan</h2><p>Focus on building rock-solid full-stack engineering fundamentals with deliberate weekly practice.</p><ul><li><strong>JavaScript &amp; React Patterns:</strong> Compound components, custom hooks, and predictable state architecture.</li><li><strong>Database Design:</strong> Indexing strategies, normalized schemas, and query profiling in MySQL.</li><li><strong>API Security:</strong> JWT refresh rotation, input sanitization, and rate limiting.</li></ul><blockquote>Consistency compounds faster than intensity.</blockquote>`,
    },
    {
      id: `note_${userId}_2`,
      userId,
      title: 'React.js Important Concepts',
      category: 'Learning',
      isFavorite: true,
      isDeleted: false,
      createdAt: daysAgo(9),
      updatedAt: hoursAgo(6),
      deletedAt: null,
      content: `<h2>Core Mental Models</h2><p>Key concepts to review before building scalable interactive interfaces:</p><ol><li><strong>Reconciliation &amp; Keys:</strong> Always provide stable keys on dynamic lists so React preserves component state accurately.</li><li><strong>Effect Synchronization:</strong> Use <code>useEffect</code> strictly for synchronizing with external systems (subscriptions, timers, DOM).</li><li><strong>Derived State:</strong> Compute filtered lists and statistics directly during render instead of duplicating state.</li></ol><pre><code>const visibleNotes = useMemo(() =&gt; filterNotes(notes, query), [notes, query]);</code></pre>`,
    },
    {
      id: `note_${userId}_3`,
      userId,
      title: 'Meeting Notes',
      category: 'Work',
      isFavorite: false,
      isDeleted: false,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(1),
      deletedAt: null,
      content: `<h2>Product Architecture Sync — Nov 14</h2><p><strong>Attendees:</strong> Engineering, Product Design, QA</p><ul><li>Agreed on clean single-elevation card surfaces and keyboard-friendly search filtering.</li><li>Reviewed REST API contract for upcoming Express + MySQL migration (<code>/api/v1/notes</code>).</li><li>Next milestone: finalize rich text formatting shortcuts and trash retention policy.</li></ul>`,
    },
    {
      id: `note_${userId}_4`,
      userId,
      title: 'Project Development Ideas',
      category: 'Ideas',
      isFavorite: true,
      isDeleted: false,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(2),
      deletedAt: null,
      content: `<h2>FolioNote Roadmap Explorations</h2><p>High-leverage enhancements worth prototyping next quarter:</p><ul><li><strong>Command Palette (Cmd+K):</strong> Instant navigation between workspaces, recent notes, and quick capture.</li><li><strong>Markdown Export:</strong> Download any note or folder cleanly as <code>.md</code> or structured JSON backup.</li><li><strong>Version Snapshots:</strong> Lightweight diff history before major edits.</li></ul>`,
    },
    {
      id: `note_${userId}_5`,
      userId,
      title: 'Daily Tasks',
      category: 'Tasks',
      isFavorite: false,
      isDeleted: false,
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(1),
      deletedAt: null,
      content: `<h2>Today's Priorities</h2><ul><li>Finalize responsive grid and list view transitions in dashboard.</li><li>Review unit tests for signup validation and note CRUD flows.</li><li>Draft onboarding checklist for new workspace members.</li><li>Schedule 30-minute deep work block for refactoring service adapters.</li></ul>`,
    },
    {
      id: `note_${userId}_6`,
      userId,
      title: 'Old Sprint Scratchpad',
      category: 'Personal',
      isFavorite: false,
      isDeleted: true,
      createdAt: daysAgo(18),
      updatedAt: daysAgo(10),
      deletedAt: daysAgo(3),
      content: `<p>Archived rough notes from October sprint planning. Safe to restore or clear permanently from trash.</p>`,
    },
  ];
}

function readAllNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAllNotes(notes) {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function ensureUserSeeded(userId) {
  try {
    const rawSeeded = localStorage.getItem(SEEDED_USERS_KEY);
    const seededIds = rawSeeded ? JSON.parse(rawSeeded) : [];
    if (!seededIds.includes(userId)) {
      const existing = readAllNotes();
      const userAlreadyHasNotes = existing.some((n) => n.userId === userId);
      if (!userAlreadyHasNotes) {
        const starters = createStarterNotes(userId);
        writeAllNotes([...starters, ...existing]);
      }
      localStorage.setItem(SEEDED_USERS_KEY, JSON.stringify([...seededIds, userId]));
    }
  } catch {
    // Ignore storage quota errors cleanly
  }
}

/**
 * Note service structured with async Promise interfaces for seamless future
 * migration to Node.js + Express.js + MySQL REST endpoints (/api/notes/*).
 */
export const noteService = {
  async getNotes(userId) {
    // Future REST integration: GET /api/notes
    ensureUserSeeded(userId);
    return readAllNotes().filter((note) => note.userId === userId);
  },

  async getNoteById(userId, noteId) {
    // Future REST integration: GET /api/notes/:id
    ensureUserSeeded(userId);
    const match = readAllNotes().find((n) => n.userId === userId && n.id === noteId);
    return match ?? null;
  },

  async createNote(userId, payload) {
    // Future REST integration: POST /api/notes
    const now = new Date().toISOString();
    const newNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId,
      title: payload.title.trim() || 'Untitled Note',
      content: payload.content,
      category: payload.category,
      isFavorite: Boolean(payload.isFavorite),
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const all = readAllNotes();
    writeAllNotes([newNote, ...all]);
    return newNote;
  },

  async updateNote(userId, noteId, updates) {
    // Future REST integration: PUT /api/notes/:id
    const all = readAllNotes();
    const index = all.findIndex((n) => n.userId === userId && n.id === noteId);
    if (index === -1) {
      throw new Error('Note not found.');
    }

    const updated = {
      ...all[index],
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() || 'Untitled Note' : all[index].title,
      updatedAt: new Date().toISOString(),
    };

    const next = [...all];
    next[index] = updated;
    writeAllNotes(next);
    return updated;
  },

  async toggleFavorite(userId, noteId) {
    // Future REST integration: PATCH /api/notes/:id/favorite
    const all = readAllNotes();
    const index = all.findIndex((n) => n.userId === userId && n.id === noteId);
    if (index === -1) {
      throw new Error('Note not found.');
    }

    const updated = {
      ...all[index],
      isFavorite: !all[index].isFavorite,
    };

    const next = [...all];
    next[index] = updated;
    writeAllNotes(next);
    return updated;
  },

  async softDeleteNote(userId, noteId) {
    // Future REST integration: PATCH /api/notes/:id/trash
    const all = readAllNotes();
    const index = all.findIndex((n) => n.userId === userId && n.id === noteId);
    if (index === -1) {
      throw new Error('Note not found.');
    }

    const updated = {
      ...all[index],
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    };

    const next = [...all];
    next[index] = updated;
    writeAllNotes(next);
    return updated;
  },

  async restoreNote(userId, noteId) {
    // Future REST integration: PATCH /api/notes/:id/restore
    const all = readAllNotes();
    const index = all.findIndex((n) => n.userId === userId && n.id === noteId);
    if (index === -1) {
      throw new Error('Note not found.');
    }

    const updated = {
      ...all[index],
      isDeleted: false,
      deletedAt: null,
      updatedAt: new Date().toISOString(),
    };

    const next = [...all];
    next[index] = updated;
    writeAllNotes(next);
    return updated;
  },

  async permanentlyDeleteNote(userId, noteId) {
    // Future REST integration: DELETE /api/notes/:id
    const all = readAllNotes();
    const next = all.filter((n) => !(n.userId === userId && n.id === noteId));
    writeAllNotes(next);
  },

  async emptyTrash(userId) {
    // Future REST integration: DELETE /api/notes/trash
    const all = readAllNotes();
    const next = all.filter((n) => !(n.userId === userId && n.isDeleted));
    writeAllNotes(next);
  },
};
