import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { API_BASE_URL } from '../../config/apiBaseUrl';

const AuthContext = createContext(null);

const hasUserIdentity = (userData) => Boolean(userData?.id || userData?.userId);
const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

const processUserData = (userData) => {
  if (!userData) return null;

  const resolvedAvatar =
    userData.avatar && userData.avatar.startsWith('/')
      ? `${API_BASE_URL}${userData.avatar}`
      : userData.avatar;

  return {
    ...userData,
    avatar: resolvedAvatar,
    profilePicture: userData.profilePicture || resolvedAvatar,
  };
};

const getPersistedUserData = (userData) => {
  if (!userData) return null;

  const persistedUser = { ...userData };

  // Avoid blowing the storage quota by persisting large base64-encoded images.
  if (isDataUrl(persistedUser.avatar)) {
    delete persistedUser.avatar;
  }

  if (isDataUrl(persistedUser.profilePicture) || persistedUser.profilePicture === persistedUser.avatar) {
    delete persistedUser.profilePicture;
  }

  return persistedUser;
};

const persistUser = (userData) => {
  const persistedUser = getPersistedUserData(userData);

  if (!persistedUser) {
    localStorage.removeItem('user');
    return;
  }

  try {
    localStorage.setItem('user', JSON.stringify(persistedUser));
  } catch (error) {
    console.warn('Failed to persist user in localStorage', error);
    localStorage.removeItem('user');
  }
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
          if (hasUserIdentity(userData)) {
            setIsAuthenticated(true);
            setUser(userData);
            persistUser(userData);
          } else {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('user');
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
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, user: rawUserData } = response.data;
      const userData = processUserData(rawUserData);

      localStorage.setItem('authToken', token);
      persistUser(userData);

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

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const message = response.data.message || 'Registration submitted successfully. Your account is pending admin approval.';

      return {
        success: true,
        message: message,
        pending: true
      };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
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
    navigate('/login');
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
    register,
    logout,
    updateUser: (userData) => {
      const processedData = processUserData(userData);
      setUser(processedData);
      persistUser(processedData);
    },
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
