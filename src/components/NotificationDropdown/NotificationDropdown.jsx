import React from "react";
import "./style.css";

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

export const NotificationDropdown = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;

  const notificationList = Array.isArray(notifications) ? notifications : [];

  return (
    <>
      <div className="notification-backdrop" onClick={onClose} />
      <div className="notification-dropdown">
        <div className="notification-header">
          <h3>Notifications</h3>
          <span className="notification-count">{notificationList.filter(n => !n.read).length} new</span>
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
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? "unread" : ""}`}
              >
                {notification.title && (
                  <h4 className="notification-title">{notification.title}</h4>
                )}
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {formatTime(notification.createdAt || notification.time)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
