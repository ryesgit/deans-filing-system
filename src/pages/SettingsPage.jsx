import React, { useState } from "react";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { User } from "lucide-react";
import "../DeptHeadPage/DashboardPage/style.css";
import "../DeptHeadPage/SettingsPage/Settings.css";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { useAuth } from "../components/Modal/AuthContext";

export const SettingsPage = () => {
  const { user: currentUser } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirmation password do not match.");
      return;
    }
    alert("Password changed successfully!");
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="department-head-page settings-page-layout">
      <SidePanel />
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

      <main className="settings-main-content">
        <div className="settings-grid-single">
          <section className="settings-card user-profile-card">
            <div className="profile-left">
              <div className="profile-avatar-container">
                <User className="profile-avatar-icon" size={80} />
              </div>
              <h2 className="profile-name">{currentUser?.name || "N/A"}</h2>
              <p className="profile-email">{currentUser?.email || "N/A"}</p>
            </div>
            <div className="profile-divider"></div>
            <div className="profile-right">
              <div className="profile-detail-group">
                <span className="profile-detail-label">ID Number</span>
                <span className="profile-detail-value">
                  {currentUser?.idNumber || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Role</span>
                <span className="profile-detail-value">{currentUser?.role || "N/A"}</span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Gender</span>
                <span className="profile-detail-value">
                  {currentUser?.gender || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Department</span>
                <span className="profile-detail-value">
                  {currentUser?.department || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Contact Number</span>
                <span className="profile-detail-value">
                  {currentUser?.contactNumber || "N/A"}
                </span>
              </div>
              <div className="profile-.detail-group">
                <span className="profile-detail-label">Date of Birth</span>
                <span className="profile-detail-value">
                  {currentUser?.dateOfBirth || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Account Status</span>
                <span className="profile-detail-value">
                  {currentUser?.accountStatus || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Last Login</span>
                <span className="profile-detail-value">
                  {currentUser?.lastLogin || "N/A"}
                </span>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <h2 className="settings-card-title">Account Actions</h2>
            <button
              className="reset-password-btn"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Reset Password
            </button>
          </section>

          <section className="settings-card">
            <h2 className="settings-card-title">Notification Preferences</h2>
            <div className="notification-preference-item">
              <span className="preference-label">Push Notifications</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications((prev) => !prev)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="notification-preference-item">
              <span className="preference-label">Email Notifications</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications((prev) => !prev)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </section>
        </div>
        {isPasswordModalOpen && (
          <div className="modal-backdrop">
            <div className="password-modal-content">
              <h3 className="modal-title">Change Password</h3>
              <form onSubmit={handleSaveNewPassword}>
                <div className="modal-form-group">
                  <label className="modal-label" htmlFor="oldPassword">
                    Old Password
                  </label>
                  <input
                    className="modal-input"
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    className="modal-input"
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label className="modal-label" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    className="modal-input"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn modal-btn-secondary"
                    onClick={() => setIsPasswordModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn modal-btn-primary">
                    Save New Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <NotificationDropdown
          notifications={notifications}
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </main>
    </div>
  );
};