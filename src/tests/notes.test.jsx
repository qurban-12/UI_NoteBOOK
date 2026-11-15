import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NoteCard } from '../components/NoteCard';
import { AuthProvider } from '../context/AuthContext';
import { NotesProvider } from '../context/NotesContext';
import { Dashboard } from '../pages/Dashboard';
import { authService, DEMO_CREDENTIALS } from '../services/authService';

const sampleNote = {
  id: 'note_test_1',
  userId: 'user_demo_01',
  title: 'React Architecture Patterns',
  content: '<p>Composition and custom hooks keep components clean.</p>',
  category: 'Learning',
  isFavorite: false,
  isDeleted: false,
  createdAt: '2026-11-10T10:00:00.000Z',
  updatedAt: '2026-11-15T08:00:00.000Z',
  deletedAt: null,
};

describe('Notes Components & Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('renders NoteCard title, preview, category, and triggers actions', async () => {
    const user = userEvent.setup();
    const onToggleFavorite = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <NoteCard
        note={sampleNote}
        viewMode="grid"
        onToggleFavorite={onToggleFavorite}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('React Architecture Patterns')).toBeInTheDocument();
    expect(
      screen.getByText('Composition and custom hooks keep components clean.')
    ).toBeInTheDocument();
    expect(screen.getByText('Learning')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }));
    expect(onToggleFavorite).toHaveBeenCalledWith('note_test_1');

    await user.click(
      screen.getByRole('button', { name: 'Edit React Architecture Patterns' })
    );
    expect(onEdit).toHaveBeenCalledWith('note_test_1');

    await user.click(
      screen.getByRole('button', { name: 'Delete React Architecture Patterns' })
    );
    expect(onDelete).toHaveBeenCalledWith('note_test_1');
  });

  test('filters Dashboard notes by search query and category', async () => {
    const user = userEvent.setup();
    await authService.login({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      rememberMe: true,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <NotesProvider>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </NotesProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My Learning Goals')).toBeInTheDocument();
    });

    expect(screen.getByText('Meeting Notes')).toBeInTheDocument();

    const searchInput = screen.getByLabelText('Search notes');
    await user.type(searchInput, 'Learning Goals');

    expect(screen.getByText('My Learning Goals')).toBeInTheDocument();
    expect(screen.queryByText('Meeting Notes')).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.click(screen.getByRole('tab', { name: 'Work' }));

    expect(screen.getByText('Meeting Notes')).toBeInTheDocument();
    expect(screen.queryByText('My Learning Goals')).not.toBeInTheDocument();
  });
});
