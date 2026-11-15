import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { AllNotes } from './pages/AllNotes';
import { Dashboard } from './pages/Dashboard';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { Profile } from './pages/Profile';
import { RecentlyDeleted } from './pages/RecentlyDeleted';
import { Signup } from './pages/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotesProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <AllNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <NoteEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trash"
              element={
                <ProtectedRoute>
                  <RecentlyDeleted />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
