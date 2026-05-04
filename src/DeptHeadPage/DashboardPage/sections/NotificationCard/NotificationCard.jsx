import React from "react";
import { useNotifications } from "../../../../components/NotificationDropdown/NotificationContext";
import "./style.css";

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

export const NotificationCard = () => {
  const { notifications } = useNotifications();

  return (
    <div className="notification-card">
      <div className="rectangle-8" />
      <div className="text-wrapper-72">Notifications</div>
      <div className="notification-list">
        {notifications.slice(0, 3).map((notification, index) => (
          <div key={index} className={`notification-item ${notification.read ? "read" : "unread"}`}>
            {toText(notification.message, "No details available")}
          </div>
        ))}
      </div>    
    </div>
  );
};
