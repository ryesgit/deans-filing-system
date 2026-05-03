import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { notificationsAPI } from "../../services/api";
import { useAuth } from "../Modal/AuthContext";

const DEFAULT_POLL_INTERVAL_MS = 30000;
const RATE_LIMIT_POLL_INTERVAL_MS = 5 * 60 * 1000;
const MAX_POLL_INTERVAL_MS = 15 * 60 * 1000;

// Only ADMIN has the User Management page and can act on pending registrations
const ADMIN_ROLES = ["ADMIN"];

// localStorage key for tracking which pending-user IDs have been "seen"
const SEEN_PENDING_KEY = "dfs_seen_pending_user_ids";

const getSeenPendingIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_PENDING_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const addSeenPendingId = (id) => {
  const seen = getSeenPendingIds();
  seen.add(String(id));
  localStorage.setItem(SEEN_PENDING_KEY, JSON.stringify([...seen]));
};

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

  const isAdminRole = ADMIN_ROLES.includes(user?.role?.toUpperCase());

  const mapNotifications = (response) => {
    const notificationsData = response.data.notifications || response.data;

    return Array.isArray(notificationsData)
      ? notificationsData.map((n) => ({
          ...n,
          read: n.isRead || n.read || false,
        }))
      : [];
  };

  // Build synthetic local notifications for each pending user not yet seen
  const buildPendingUserNotifications = (usersResponse) => {
    const usersData = usersResponse.data.users || usersResponse.data;
    if (!Array.isArray(usersData)) return [];

    const seenIds = getSeenPendingIds();
    const pendingUsers = usersData.filter((u) => u.status === "PENDING");

    return pendingUsers
      .filter((u) => !seenIds.has(String(u.id)))
      .map((u) => ({
        // Use a stable synthetic ID so it won't clash with real notification IDs
        id: `pending-user-${u.id}`,
        _syntheticPendingUserId: u.id,
        title: "New User Registration",
        message: `${u.name || "A new user"} (${u.role || "unknown role"}) has registered and is awaiting approval.`,
        type: "info",
        link: "/user-management",
        read: false,
        isRead: false,
        createdAt: u.createdAt || new Date().toISOString(),
      }));
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
    // Synthetic pending-user notification — mark locally and remember it was seen
    if (typeof id === "string" && id.startsWith("pending-user-")) {
      const syntheticNotif = notifications.find((n) => n.id === id);
      if (syntheticNotif?._syntheticPendingUserId != null) {
        addSeenPendingId(syntheticNotif._syntheticPendingUserId);
      }
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n))
      );
      return;
    }

    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    // Mark synthetic pending-user notifications locally and persist them as seen
    notifications.forEach((n) => {
      if (
        typeof n.id === "string" &&
        n.id.startsWith("pending-user-") &&
        n._syntheticPendingUserId != null
      ) {
        addSeenPendingId(n._syntheticPendingUserId);
      }
    });
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, isRead: true }))
    );

    try {
      await notificationsAPI.markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const refreshNotifications = async ({ initial = false, background = false } = {}) => {
    if (!user || isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;

    try {
      // Always fetch real backend notifications
      const [notifResponse, pendingNotifs] = await Promise.all([
        notificationsAPI.getAll(),
        // Only fetch pending users for admin/staff roles
        isAdminRole
          ? import("../../services/api")
              .then(({ usersAPI }) => usersAPI.getAll())
              .then((res) => buildPendingUserNotifications(res))
              .catch(() => [])
          : Promise.resolve([]),
      ]);

      const realNotifs = mapNotifications(notifResponse);

      // Merge: real notifications first, then synthetic ones (deduped by id)
      const realIds = new Set(realNotifs.map((n) => n.id));
      const merged = [
        ...realNotifs,
        ...pendingNotifs.filter((n) => !realIds.has(n.id)),
      ];

      // Sort by createdAt descending
      merged.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setNotifications(merged);
      pollIntervalRef.current = DEFAULT_POLL_INTERVAL_MS;
    } catch (error) {
      handleRefreshError(
        error,
        initial ? "fetch notifications" : "refresh notifications"
      );
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
