// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth'; // Your API functions

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state from localStorage on load and when storage/auth-changed events occur.
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Failed to read auth data from localStorage", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial sync
    syncFromStorage();

    // Update when another tab/window or part of the app changes auth
    const onStorage = (e) => {
      // Only react if token or user keys changed (or null event)
      if (!e || e.key === null || e.key === 'token' || e.key === 'user') {
        syncFromStorage();
      }
    };
    const onAuthChanged = () => syncFromStorage();

    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-changed', onAuthChanged);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, []);

  /**
   * Handles the response from a successful authentication API call.
   * Updates state and saves the token to localStorage.
   */
  const handleAuthResponse = (data) => {
    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
  // notify other parts of the app that auth changed
  try { window.dispatchEvent(new Event('auth-changed')); } catch (e) {}
    }
    return data;
  };

  const login = async (credentials) => {
    const data = await authApi.loginUser(credentials);
    return handleAuthResponse(data);
  };

  const signup = async (userData) => {
    const data = await authApi.signupUser(userData);
    return handleAuthResponse(data);
  };
  
  const googleLogin = async (credential) => {
    const data = await authApi.googleLogin(credential);
    return handleAuthResponse(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  // notify other parts of the app that auth changed
  try { window.dispatchEvent(new Event('auth-changed')); } catch (e) {}
  };

  const value = {
    user,
    token,
    login,
    signup,
    googleLogin,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}