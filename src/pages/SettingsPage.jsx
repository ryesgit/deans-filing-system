import React, { useState } from "react";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import "../DeptHeadPage/DashboardPage/style.css"; // Reusing dashboard styles for consistency
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";

export const SettingsPage = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { notifications, unreadCount } = useNotifications();

  return (
    <>
      <SidePanel />
      <div className="department-head-page">
        <header className="dashboard-header">
          <div className="welcome-message">
            <h1 className="text-wrapper-70">Settings</h1>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <form className="search-form">
                <svg
                  className="search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div
              className="notification-button-wrapper"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <img
                className="notification-button"
                alt="Notification button"
                src="https://c.animaapp.com/27o9iVJi/img/notification-button@2x.png"
              />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page content for Settings will go here */}

        <NotificationDropdown
          notifications={notifications}
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </>
  );
};
