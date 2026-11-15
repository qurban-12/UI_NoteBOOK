const USERS_STORAGE_KEY = 'folionote_users_v1';
const SESSION_STORAGE_KEY = 'folionote_session_v1';

export const DEFAULT_AVATAR_URL = '/src/assets/images/avatar_user_profile_1794750849367.jpg';

export const DEMO_CREDENTIALS = {
  email: 'alex.morgan@folionote.app',
  password: 'Password123!',
};

const SEED_USER = {
  id: 'user_demo_01',
  fullName: 'Alex Morgan',
  email: DEMO_CREDENTIALS.email,
  password: DEMO_CREDENTIALS.password,
  avatar: DEFAULT_AVATAR_URL,
  role: 'Product Designer',
  bio: 'Organizing product specifications, engineering learning notes, and weekly planning.',
  createdAt: '2026-09-14T09:30:00.000Z',
};

function sanitizeUser(record) {
  const { password: _password, ...safeUser } = record;
  return safeUser;
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initialUsers = [SEED_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initialUsers = [SEED_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return parsed;
  } catch {
    return [SEED_USER];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function persistSession(user, rememberMe) {
  const serialized = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

/**
 * Auth service structured with async boundaries for seamless future
 * migration to a Node.js + Express.js + MySQL REST backend (e.g. /api/auth/*).
 */
export const authService = {
  getCurrentSession() {
    readUsers();
    try {
      const persistent = localStorage.getItem(SESSION_STORAGE_KEY);
      if (persistent) {
        return JSON.parse(persistent);
      }
      const temporary = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (temporary) {
        return JSON.parse(temporary);
      }
      return null;
    } catch {
      return null;
    }
  },

  async login(payload) {
    // Future REST integration: POST /api/auth/login
    const users = readUsers();
    const normalizedEmail = payload.email.trim().toLowerCase();
    const match = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === payload.password
    );

    if (!match) {
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }

    const user = sanitizeUser(match);
    persistSession(user, Boolean(payload.rememberMe));
    return user;
  },

  async signup(payload) {
    // Future REST integration: POST /api/auth/register
    const users = readUsers();
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newRecord = {
      id: `user_${Date.now()}`,
      fullName: payload.fullName.trim(),
      email: normalizedEmail,
      password: payload.password,
      avatar: '',
      role: 'Workspace Member',
      bio: 'Personal knowledge base and project notes.',
      createdAt: new Date().toISOString(),
    };

    writeUsers([...users, newRecord]);
    const safeUser = sanitizeUser(newRecord);
    persistSession(safeUser, true);
    return safeUser;
  },

  async updateProfile(userId, updates) {
    // Future REST integration: PUT /api/users/:id
    const users = readUsers();
    const normalizedEmail = updates.email.trim().toLowerCase();

    const conflict = users.find(
      (u) => u.id !== userId && u.email.toLowerCase() === normalizedEmail
    );
    if (conflict) {
      throw new Error('Another account is already using this email address.');
    }

    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error('User account not found.');
    }

    const updatedRecord = {
      ...users[index],
      fullName: updates.fullName.trim(),
      email: normalizedEmail,
      role: updates.role !== undefined ? updates.role.trim() : users[index].role,
      bio: updates.bio !== undefined ? updates.bio.trim() : users[index].bio,
      avatar: updates.avatar !== undefined ? updates.avatar : users[index].avatar,
    };

    const nextUsers = [...users];
    nextUsers[index] = updatedRecord;
    writeUsers(nextUsers);

    const safeUser = sanitizeUser(updatedRecord);
    const usesLocal = Boolean(localStorage.getItem(SESSION_STORAGE_KEY));
    persistSession(safeUser, usesLocal);
    return safeUser;
  },

  async logout() {
    // Future REST integration: POST /api/auth/logout
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  },
};
