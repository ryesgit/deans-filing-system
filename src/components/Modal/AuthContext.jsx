import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { API_BASE_URL } from '../../config/apiBaseUrl';
import { ForceChangePasswordModal } from './ForceChangePasswordModal';

const AuthContext = createContext(null);

const hasUserIdentity = (userData) => Boolean(userData?.id || userData?.userId);
const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');
const toText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value instanceof Error) return value.message || fallback;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

const processUserData = (userData) => {
  if (!userData || typeof userData !== 'object') return null;

  try {
    const resolvedAvatar =
      typeof userData.avatar === 'string' && userData.avatar.startsWith('/')
        ? `${API_BASE_URL}${userData.avatar}`
        : userData.avatar;

    return {
      ...userData,
      avatar: typeof resolvedAvatar === 'string' ? resolvedAvatar : null,
      profilePicture: userData.profilePicture || resolvedAvatar,
    };
  } catch (error) {
    console.error('Error processing user data:', error);
    return userData;
  }
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
      
      // Force password change if using default password
      if (credentials.password === "password123") {
        userData.mustChangePassword = true;
      }
      
      persistUser(userData);

      setIsAuthenticated(true);
      setUser(userData);

      navigate('/');
      return { success: true };
    } catch (err) {
      const errorMessage = toText(err?.message, 'Invalid username or password');
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
      const errorMessage = toText(err?.message, 'Registration failed');
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    // Clear all auth data from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear sensitive state
    setIsAuthenticated(false);
    setUser(null);

    // Use window.location.href for a full page reload to /login.
    // This is the most bulletproof way to fix "white screen" issues on logout
    // because it completely tears down the React tree and starts fresh.
    window.location.href = '/login';
  };

  const handlePasswordChanged = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      persistUser(updatedUser);
    }
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
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Poppins, Helvetica, Arial, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #800000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading Dean's Filing System...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && user.mustChangePassword && (
        <ForceChangePasswordModal user={user} onPasswordChanged={handlePasswordChanged} />
      )}
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
