import React, { useState, useEffect } from "react";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { Camera } from "lucide-react";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { useAuth } from "../components/Modal/AuthContext";
import { usersAPI, authAPI } from "../services/api";
import { GlobalSearch } from "../components/GlobalSearch/GlobalSearch";
import { UserManual } from "../DeptHeadPage/SettingsPage/UserManual.jsx";
import "../DeptHeadPage/SettingsPage/UserManual.css";
import "../DeptHeadPage/SettingsPage/Settings.css";
// Helper to convert file to base64
const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export const SettingsPage = () => {
    const { user: currentUser, updateUser, logout } = useAuth();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };
    const [isSavingProfilePicture, setIsSavingProfilePicture] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);
    const { notifications, unreadCount } = useNotifications();
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Fetch latest user data on mount to ensure all fields (like Date Joined) are up to date
    useEffect(() => {
        const fetchLatestUserData = async () => {
            setIsLoadingUserData(true);
            try {
                const response = await authAPI.getMe();
                const userData = response.data.user || response.data;
                if (userData) {
                    updateUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch latest user data in settings:", error);
            } finally {
                setIsLoadingUserData(false);
            }
        };

        fetchLatestUserData();
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveNewPassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New password and confirmation password do not match.");
            return;
        }

        try {
            const userIdentifier = currentUser?.id || currentUser?.userId;
            if (!userIdentifier) {
                throw new Error("User identifier not found.");
            }

            // Use the dedicated change-password endpoint (PUT /api/auth/change-password)
            // This is the correct endpoint that actually hashes and persists the new password
            await authAPI.changePassword({
                userId: currentUser.userId,
                id: currentUser.id,
                currentPassword: passwords.oldPassword,
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
                password: passwords.newPassword,
            });

            alert("Password changed successfully! For security reasons, you will now be logged out. Please log in again using your new password.");
            
            // Clear passwords state
            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsPasswordModalOpen(false);
            
            // Perform logout to force a fresh session with the new credentials
            logout();
        } catch (error) {
            console.error("Failed to change password:", error);
            // Provide more detailed error info if available
            const errorMsg = error.response?.data?.message || error.message || "Failed to change password. Please ensure your old password is correct.";
            alert(errorMsg);
        }
    };
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                try {
                    const base64 = await toBase64(file);
                    const userIdentifier = currentUser?.id || currentUser?.userId;

                    if (!userIdentifier) {
                        throw new Error("Current user is missing an identifier.");
                    }

                    // Optimistic update
                    setProfilePicturePreview(base64);
                    setIsSavingProfilePicture(true);

                    const response = await usersAPI.update(userIdentifier, { avatar: base64 });
                    const updatedUser = response.data.user || response.data;

                    // Update context
                    updateUser({
                        ...currentUser,
                        ...updatedUser,
                        profilePicture: updatedUser?.profilePicture || updatedUser?.avatar || base64,
                        avatar: updatedUser?.avatar || base64,
                    });
                    setProfilePicturePreview(null);
                    alert("Profile picture updated successfully!");
                } catch (error) {
                    console.error("Failed to update profile picture:", error);
                    alert("Failed to update profile picture. Please try again.");
                    setProfilePicturePreview(null); // Revert on failure
                } finally {
                    setIsSavingProfilePicture(false);
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
                        <GlobalSearch />
                    </div>
                    <div
                        className={`notification-button-wrapper${isNotificationOpen ? " active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsNotificationOpen(!isNotificationOpen);
                        }}
                    >
                        <img
                            className="notification-button"
                            alt="Notification button"
                            src="https://c.animaapp.com/27o9iVJi/img/notification-button@2x.png"
                        />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                        <NotificationDropdown
                          isOpen={isNotificationOpen}
                          onClose={() => setIsNotificationOpen(false)}
                        />
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
                                    <div className="profile-avatar-icon" style={{ fontSize: 60, fontWeight: 700 }}>
                                        {getInitials(currentUser?.name)}
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
                                disabled={isSavingProfilePicture}
                                style={{ display: "none" }}
                            />

                            <h2 className="profile-name">{currentUser?.name || "N/A"}</h2>
                            <p className="profile-email">{currentUser?.email || "N/A"}</p>
                        </div>
                        <div className="profile-divider"></div>
                        <div className="profile-right">
                            <div className="profile-detail-group">
                                <span className="profile-detail-label">User ID</span>
                                <span className="profile-detail-value">
                                    {currentUser?.userId || currentUser?.id || "N/A"}
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
                                    {(() => {
                                        // Comprehensive list of possible date fields from different parts of the system
                                        const rawDate = currentUser?.createdAt || 
                                                        currentUser?.created_at || 
                                                        currentUser?.dateJoined || 
                                                        currentUser?.date_joined || 
                                                        currentUser?.datejoined ||
                                                        currentUser?.joinedAt ||
                                                        currentUser?.joined_at ||
                                                        currentUser?.dateAdded ||
                                                        currentUser?.date_added ||
                                                        currentUser?.registrationDate ||
                                                        currentUser?.registration_date ||
                                                        currentUser?.updatedAt; // Last resort fallback
                                        
                                        if (!rawDate || rawDate === "N/A") {
                                            return isLoadingUserData ? "Loading..." : "N/A";
                                        }
                                        
                                        // If it's already a pre-formatted string (e.g., "MM/DD/YYYY" or "YYYY-MM-DD")
                                        if (typeof rawDate === 'string' && 
                                            (rawDate.includes('/') || (rawDate.includes('-') && rawDate.length <= 10))) {
                                            return rawDate;
                                        }
                                        
                                        try {
                                            const date = new Date(rawDate);
                                            // Handle invalid dates (e.g., if the string was something else)
                                            return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
                                        } catch (e) {
                                            return "N/A";
                                        }
                                    })()}
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

                    <UserManual role={currentUser?.role} />
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
                                    <div className="password-input-wrapper">
                                        <input
                                            className="modal-input"
                                            type={showPasswords.old ? "text" : "password"}
                                            id="oldPassword"
                                            name="oldPassword"
                                            value={passwords.oldPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => togglePasswordVisibility("old")}
                                            aria-label={showPasswords.old ? "Hide password" : "Show password"}
                                        >
                                            <img 
                                                src={showPasswords.old ? "/view_icon.svg" : "/show_icon.svg"} 
                                                alt="" 
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-form-group">
                                    <label className="modal-label" htmlFor="newPassword">
                                        New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            className="modal-input"
                                            type={showPasswords.new ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => togglePasswordVisibility("new")}
                                            aria-label={showPasswords.new ? "Hide password" : "Show password"}
                                        >
                                            <img 
                                                src={showPasswords.new ? "/view_icon.svg" : "/show_icon.svg"} 
                                                alt="" 
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-form-group">
                                    <label className="modal-label" htmlFor="confirmPassword">
                                        Confirm New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            className="modal-input"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => togglePasswordVisibility("confirm")}
                                            aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                                        >
                                            <img 
                                                src={showPasswords.confirm ? "/view_icon.svg" : "/show_icon.svg"} 
                                                alt="" 
                                            />
                                        </button>
                                    </div>
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
            </main>
        </div>
    );
};
