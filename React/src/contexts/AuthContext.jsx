import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sprawdź token przy starcie aplikacji
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const savedToken = sessionStorage.getItem('token');
      const savedUser = sessionStorage.getItem('user');
      
      if (savedToken && savedUser) {
        const parsedToken = JSON.parse(savedToken);
        const parsedUser = JSON.parse(savedUser);
        
        // Sprawdź czy token nie wygasł
        const isTokenValid = await validateToken(parsedToken);
        
        if (isTokenValid) {
          setToken(parsedToken);
          setUser(parsedUser);
        } else {
          // Token wygasł - wyczyść dane
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:4000/health', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const clearAuthData = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const login = async (credentials) => {
    try {
      setError(null);
      
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        const userData = { 
          id: data.userId, 
          email: data.userEmail 
        };
        
        setToken(data.token);
        setUser(userData);
        
        sessionStorage.setItem('token', JSON.stringify(data.token));
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        setError(data.error || 'Błąd logowania');
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Błąd połączenia z serwerem';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};