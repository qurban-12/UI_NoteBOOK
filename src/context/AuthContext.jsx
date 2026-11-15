import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionUser = authService.getCurrentSession();
    setUser(sessionUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload) => {
    const loggedInUser = await authService.login(payload);
    setUser(loggedInUser);
    toast.success(`Welcome back, ${loggedInUser.fullName}!`);
    return loggedInUser;
  }, []);

  const signup = useCallback(async (payload) => {
    const createdUser = await authService.signup(payload);
    setUser(createdUser);
    toast.success('Account created successfully. Your workspace is ready.');
    return createdUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    toast.info('You have been signed out.');
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) {
        throw new Error('You must be signed in to update your profile.');
      }
      const updatedUser = await authService.updateProfile(user.id, updates);
      setUser(updatedUser);
      toast.success('Profile updated successfully.');
      return updatedUser;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
