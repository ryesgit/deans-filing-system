import React, { useState } from "react";
import { Modal } from "./Modal";
import { authAPI } from "../../services/api";

export const ForceChangePasswordModal = ({ user, onPasswordChanged }) => {
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (passwords.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (passwords.newPassword === "password123") {
            setError("You cannot use the default password. Please choose a new one.");
            return;
        }

        setLoading(true);
        try {
            await authAPI.changePassword({
                userId: user.userId,
                id: user.id,
                currentPassword: "password123", // Assuming they are here because they have the default
                newPassword: passwords.newPassword,
            });
            onPasswordChanged();
        } catch (err) {
            console.error("Failed to change password:", err);
            setError(err.message || "Failed to change password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={() => {}} title="Action Required: Change Password" showCloseButton={false} size="sm">
            <div className="force-password-container">
                <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.5' }}>
                    Welcome to the Dean's Filing System! For your security, you are required to change your default password before proceeding.
                </p>

                {error && (
                    <div style={{ 
                        padding: '12px', 
                        backgroundColor: '#fff5f5', 
                        color: '#e53e3e', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        fontSize: '14px',
                        borderLeft: '4px solid #e53e3e'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>
                            New Password
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #f0f0f0',
                                borderRadius: '10px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>
                            Confirm New Password
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm new password"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #f0f0f0',
                                borderRadius: '10px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                            type="checkbox" 
                            id="show-pass" 
                            checked={showPasswords} 
                            onChange={() => setShowPasswords(!showPasswords)} 
                        />
                        <label htmlFor="show-pass" style={{ fontSize: '14px', color: '#666', cursor: 'pointer' }}>
                            Show Passwords
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#800000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? "Updating..." : "Update Password & Continue"}
                    </button>
                </form>
            </div>
        </Modal>
    );
};
