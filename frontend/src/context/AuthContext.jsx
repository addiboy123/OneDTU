// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import * as authApi from '../api/auth'; // Your API functions

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial app load, check localStorage for an existing token.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to read auth data from localStorage", error);
    } finally {
      setLoading(false);
    }
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