import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authAPI.getMe()
        .then(response => {
          const userData = response.data;
          if (userData && userData.id) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
          // Do nothing if userData is invalid, just rely on localStorage
          setLoading(false);
        })
        .catch((error) => {
          // Don't log out on network error, just log the error
          console.error("Failed to verify token with backend", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token } = response.data;

      localStorage.setItem('authToken', token);

      try {
        const meResponse = await authAPI.getMe();
        const fullUserData = meResponse.data.user || meResponse.data;

        localStorage.setItem('user', JSON.stringify(fullUserData));
        setIsAuthenticated(true);
        setUser(fullUserData);
      } catch (meError) {
        console.error('Failed to fetch full user data:', meError);
        const { user: userData } = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
      }

      navigate('/');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Invalid username or password'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login'); // Redirect to login page on logout
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
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
