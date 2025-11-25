import React, { useState } from "react";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { Camera } from "lucide-react";
import "../DeptHeadPage/SettingsPage/Settings.css";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { useAuth } from "../components/Modal/AuthContext";
import { usersAPI } from "../services/api";

// Helper to convert file to base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const SettingsPage = () => {
  const { user: currentUser, updateUser } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
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
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        try {
          const base64 = await toBase64(file);
          
          // Optimistic update
          setProfilePicturePreview(base64);
          
          await usersAPI.update(currentUser.id, { avatar: base64 });

          // Update context
          updateUser({ ...currentUser, profilePicture: base64, avatar: base64 });
          alert("Profile picture updated successfully!");
        } catch (error) {
          console.error("Failed to update profile picture:", error);
          alert("Failed to update profile picture. Please try again.");
          setProfilePicturePreview(null); // Revert on failure
        }
      } else {
        alert("Please select an image file.");
      }
    }
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
              <label
                htmlFor="profilePictureInput"
                className="profile-avatar-container"
                style={{ cursor: "pointer" }}
              >
                {profilePicturePreview ||
                currentUser?.profilePicture ||
                currentUser?.avatar ? (
                  <img
                    src={
                      profilePicturePreview ||
                      currentUser.profilePicture ||
                      currentUser.avatar
                    }
                    alt=""
                  />
                ) : (
                  <div className="profile-avatar-icon" style={{ fontSize: 80 }}>
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="profile-avatar-overlay">
                  <Camera size={40} />
                  <span>Change</span>
                </div>
              </label>
              <input
                id="profilePictureInput"
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
              />

              <h2 className="profile-name">{currentUser?.name || "N/A"}</h2>
              <p className="profile-email">{currentUser?.email || "N/A"}</p>
            </div>
            <div className="profile-divider"></div>
            <div className="profile-right">
              <div className="profile-detail-group">
                <span className="profile-detail-label">ID Number</span>
                <span className="profile-detail-value">
                  {currentUser?.userId || currentUser?.id || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Username</span>
                <span className="profile-detail-value">
                  {currentUser?.username || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Role</span>
                <span className="profile-detail-value">
                  {currentUser?.role || "N/A"}
                </span>
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
              <div className="profile-detail-group">
                <span className="profile-detail-label">Date of Birth</span>
                <span className="profile-detail-value">
                  {currentUser?.dateOfBirth
                    ? new Date(currentUser.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Account Status</span>
                <span className="profile-detail-value">
                  {currentUser?.status || "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Last Login</span>
                <span className="profile-detail-value">
                  {currentUser?.lastLogin
                    ? new Date(currentUser.lastLogin).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="profile-detail-group">
                <span className="profile-detail-label">Date Joined</span>
                <span className="profile-detail-value">
                  {currentUser?.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : "N/A"}
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
