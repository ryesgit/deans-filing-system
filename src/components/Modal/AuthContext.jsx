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
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      // In a real app, you should validate this token with your backend
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // --- Replace with your actual API call ---
    // This is a mock API call for demonstration purposes.
    // It simulates a network request and a successful login.
    console.log('Attempting login with:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Support both admin and faculty demo accounts
    if (credentials.username === 'admin' && credentials.password === 'password') {
      const fakeToken = 'fake-jwt-token-admin';
      const userData = { name: 'Admin User', role: 'admin' };
      localStorage.setItem('authToken', fakeToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      navigate('/'); // Redirect to the dashboard on success
      return { success: true };
    } else if (credentials.username === 'faculty' && credentials.password === 'password') {
      const fakeToken = 'fake-jwt-token-faculty';
      const userData = { name: 'Faculty User', role: 'faculty' };
      localStorage.setItem('authToken', fakeToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      navigate('/'); // Redirect to the dashboard on success
      return { success: true };
    } else {
      return { success: false, message: 'Invalid username or password' };
    }
    // --- End of mock API call ---
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
