import React from "react";
import { notifications } from "../../../../data/mockData";
import "./style.css";

export const NotificationCard = () => {
  return (
    <div className="notification-card">
      <div className="rectangle-8" />
      <div className="text-wrapper-72">Notifications</div>
      <div className="notification-list">
        {notifications.slice(0, 3).map((notification, index) => (
          <div key={index} className={`notification-item ${notification.read ? "read" : "unread"}`}>
            {notification.message}
          </div>
        ))}
      </div>    
    </div>
  );
};
