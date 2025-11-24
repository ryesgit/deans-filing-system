import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const processUserData = (userData) => {
  if (!userData) return null;

  return {
    ...userData,
    avatar: userData.avatar && userData.avatar.startsWith('/')
      ? `${API_BASE_URL}${userData.avatar}`
      : userData.avatar
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? processUserData(JSON.parse(storedUser)) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authAPI.getMe()
        .then(response => {
          const userData = processUserData(response.data.user || response.data);
          if (userData && userData.id) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to verify token with backend", err);
          // Clear invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setError(null); // Clear previous errors
      const response = await authAPI.login(credentials);
      const { token, user: rawUserData } = response.data;
      const userData = processUserData(rawUserData);

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);

      navigate('/');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Invalid username or password';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    navigate('/login'); // Redirect to login page on logout
  };
  
  const clearError = () => {
    setError(null);
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    clearError,
  };

  // Show a loading indicator while checking for the token
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
