import React, { createContext, useState, useContext, useEffect } from "react";
import { notificationsAPI } from "../../services/api";

// Create the context
const NotificationContext = createContext();

// Create a custom hook for easy access to the context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

// Create the Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsAPI.getAll();
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Keep empty array on error
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
