import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { notificationsAPI } from "../../services/api";
import { useAuth } from "../Modal/AuthContext";

const DEFAULT_POLL_INTERVAL_MS = 30000;
const RATE_LIMIT_POLL_INTERVAL_MS = 5 * 60 * 1000;
const MAX_POLL_INTERVAL_MS = 15 * 60 * 1000;

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
  const pollTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const pollIntervalRef = useRef(DEFAULT_POLL_INTERVAL_MS);

  const mapNotifications = (response) => {
    const notificationsData = response.data.notifications || response.data;

    return Array.isArray(notificationsData)
      ? notificationsData.map((n) => ({
          ...n,
          read: n.isRead || n.read || false,
        }))
      : [];
  };

  const clearPollTimeout = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const scheduleNextPoll = () => {
    clearPollTimeout();

    if (!user) {
      return;
    }

    pollTimeoutRef.current = setTimeout(() => {
      refreshNotifications({ background: true });
    }, pollIntervalRef.current);
  };

  const handleRefreshError = (error, action) => {
    if (error?.status === 429) {
      pollIntervalRef.current = Math.min(
        Math.max(pollIntervalRef.current * 2, RATE_LIMIT_POLL_INTERVAL_MS),
        MAX_POLL_INTERVAL_MS
      );
      console.warn(
        `Notification refresh rate-limited during ${action}. Backing off to ${Math.round(
          pollIntervalRef.current / 1000
        )}s.`
      );
      return;
    }

    pollIntervalRef.current = DEFAULT_POLL_INTERVAL_MS;
    console.error(`Failed to ${action}:`, error);
  };

  // Fetch notifications from backend
  useEffect(() => {
    if (user) {
      pollIntervalRef.current = DEFAULT_POLL_INTERVAL_MS;
      setLoading(true);
      refreshNotifications({ initial: true });
    } else {
      clearPollTimeout();
      setNotifications([]);
      setLoading(false);
    }

    return () => {
      clearPollTimeout();
    };
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

  const refreshNotifications = async ({ initial = false, background = false } = {}) => {
    if (!user || isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;

    try {
      const response = await notificationsAPI.getAll();
      setNotifications(mapNotifications(response));
      pollIntervalRef.current = DEFAULT_POLL_INTERVAL_MS;
    } catch (error) {
      handleRefreshError(error, initial ? "fetch notifications" : "refresh notifications");
      if (initial) {
        setNotifications([]);
      }
    } finally {
      isRefreshingRef.current = false;
      if (initial) {
        setLoading(false);
      }
      if (background || initial) {
        scheduleNextPoll();
      }
    }
  };

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
