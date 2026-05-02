import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./NotificationContext";
import { useAuth } from "../Modal/AuthContext";
import "./style.css";

const ADMIN_REQUEST_ROLES = ["ADMIN", "STAFF", "FACULTY"];
const REQUEST_LINK_PATTERN = /^\/requests?\/(\d+)\/?$/i;
const toText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Error) return value.message || fallback;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

const getNotificationTarget = (notification, userRole) => {
  const link = notification?.link?.trim();

  if (!link) {
    return null;
  }

  const requestMatch = link.match(REQUEST_LINK_PATTERN);
  if (requestMatch) {
    return {
      pathname: ADMIN_REQUEST_ROLES.includes(userRole) ? "/dashboard" : "/request",
      state: {
        selectedRequestId: Number(requestMatch[1]),
      },
    };
  }

  if (link === "/requests" || link === "/requests/") {
    return {
      pathname: ADMIN_REQUEST_ROLES.includes(userRole) ? "/dashboard" : "/request",
    };
  }

  if (link === "/") {
    return { pathname: "/dashboard" };
  }

  return { pathname: link };
};

const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role?.toUpperCase() || "";

    if (!isOpen) return null;

    const notificationList = Array.isArray(notifications) ? notifications : [];
    const unreadCount = notificationList.filter(n => !n.read && !n.isRead).length;

    const handleNotificationClick = async (notification) => {
        if (!notification.read && !notification.isRead) {
            await markAsRead(notification.id);
        }

    const target = getNotificationTarget(notification, userRole);
    if (target) {
      navigate(target.pathname, target.state
        ? {
            state: {
              ...target.state,
              requestFocusNonce: Date.now(),
            },
          }
        : undefined);
      onClose();
    }
  };

    const handleMarkAllAsRead = async (e) => {
        e.stopPropagation();
        await markAllAsRead();
    };

    return (
        <>
            <div className="notification-backdrop" onClick={onClose} />
            <div className="notification-dropdown">
                <div className="notification-header">
                    <h3>Notifications</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="notification-count">{unreadCount} new</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#8B0000",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    textDecoration: "underline",
                                    padding: "0",
                                }}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>
                <div className="notification-list">
                    {notificationList.length === 0 ? (
                        <div className="notification-item">
                            <p className="notification-message" style={{ textAlign: "center", color: "#999" }}>
                                No notifications yet
                            </p>
                        </div>
                    ) : (
                        notificationList.map((notification) => (
                            (() => {
                                const target = getNotificationTarget(notification, userRole);

                                return (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${!notification.read && !notification.isRead ? "unread" : ""}`}
                                        onClick={() => handleNotificationClick(notification)}
                                        style={{
                                            cursor: target ? "pointer" : "default",
                                        }}
                                    >
                    {notification.title && (
                      <h4 className="notification-title">{toText(notification.title)}</h4>
                    )}
                    <p className="notification-message">{toText(notification.message, "No details available")}</p>
                                        <span className="notification-time">
                                            {formatTime(notification.createdAt || notification.time)}
                                        </span>
                                    </div>
                                );
                            })()
                        ))
                    )}
                </div>
            </div>
    </>
  );
};
