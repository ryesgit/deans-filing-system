import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On initial load, check for a token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you should validate this token with your backend
      setIsAuthenticated(true);
      // You might also fetch user details here
      // setUser({ name: 'Demo User' });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // --- Replace with your actual API call ---
    // This is a mock API call for demonstration purposes.
    // It simulates a network request and a successful login.
    console.log('Attempting login with:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials.username === 'admin' && credentials.password === 'password') {
      const fakeToken = 'fake-jwt-token';
      localStorage.setItem('authToken', fakeToken);
      setIsAuthenticated(true);
      setUser({ name: 'Admin User' });
      navigate('/'); // Redirect to the dashboard on success
      return { success: true };
    } else {
      return { success: false, message: 'Invalid username or password' };
    }
    // --- End of mock API call ---
  };

  const logout = () => {
    localStorage.removeItem('authToken');
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
