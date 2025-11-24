import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const EMERGENT_AUTH_URL = 'https://auth.emergentagent.com';
const REDIRECT_URL = `${window.location.origin}/dashboard`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingSession, setProcessingSession] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is already authenticated
  const checkAuth = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Process session_id from URL fragment
  const processSessionId = async (sessionId) => {
    setProcessingSession(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/process-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to process session');
      }

      const data = await response.json();
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Session processing error:', error);
      return false;
    } finally {
      setProcessingSession(false);
    }
  };

  // Redirect to Emergent Auth
  const login = () => {
    const authUrl = `${EMERGENT_AUTH_URL}/?redirect=${encodeURIComponent(REDIRECT_URL)}`;
    window.location.href = authUrl;
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  const value = {
    user,
    loading,
    processingSession,
    login,
    logout,
    processSessionId,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
