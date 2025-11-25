import React, { createContext, useState, useContext, useEffect } from "react";
import { notificationsAPI } from "../../services/api";
import { useAuth } from "../Modal/AuthContext";

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
  const { user } = useAuth();

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsAPI.getAll();
        const notificationsData = response.data.notifications || response.data;
        const mappedNotifications = Array.isArray(notificationsData)
          ? notificationsData.map(n => ({
            ...n,
            read: n.isRead || n.read || false
          }))
          : [];

        // Filter notifications for the current user if user is logged in
        // Assuming notifications have a userId field matching the user's ID
        setNotifications(mappedNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    if (user) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const refreshNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      const notificationsData = response.data.notifications || response.data;
      const mappedNotifications = Array.isArray(notificationsData)
        ? notificationsData.map(n => ({
          ...n,
          read: n.isRead || n.read || false
        }))
        : [];
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
