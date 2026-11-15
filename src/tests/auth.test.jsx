import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { DEMO_CREDENTIALS } from '../services/authService';

describe('Authentication Screens', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('shows validation errors when submitting empty login form', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  test('logs in successfully with valid demo credentials', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard Workspace</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email address'), DEMO_CREDENTIALS.email);
    await user.type(screen.getByLabelText('Password'), DEMO_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Workspace')).toBeInTheDocument();
    });
  });

  test('displays error message for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email address'), 'wrong@example.com');
    await user.type(screen.getByLabelText('Password'), 'WrongPass123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  test('registers a new user account on the signup page', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<div>Dashboard Workspace</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Full name'), 'Jordan Taylor');
    await user.type(screen.getByLabelText('Email address'), 'jordan@example.com');
    await user.type(screen.getByLabelText('Password'), 'StrongPass123');
    await user.type(screen.getByLabelText('Confirm password'), 'StrongPass123');
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Workspace')).toBeInTheDocument();
    });
  });
});
