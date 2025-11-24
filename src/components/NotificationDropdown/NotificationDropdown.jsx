import React from "react";
import "./style.css";

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
          {notificationList.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? "unread" : ""}`}
            >
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
