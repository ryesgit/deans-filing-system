import React from "react";
import { useAuth } from "../../../../components/Modal/AuthContext";
import "./style.css";

export const PersonalInformation = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="personal-information">
      <div className="pi-content">
        <div className="rectangle-5" />

        <div className="User-name">{user.name || 'N/A'}</div>
        <div className="User-email">{user.email || 'N/A'}</div>

        <div className={`profile-2 ${!user.avatar ? 'profile-placeholder' : ''}`}>
          {user.avatar && <img className="profile-image" alt="" src={user.avatar} />}
        </div>

        <img
          className="linev"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-01.svg"
        />

        <div className="User-role">{user.role || 'N/A'}</div>
        <div className="User-gender">{user.gender || 'N/A'}</div>
        <div className="User-department">{user.department || 'N/A'}</div>
        <div className="User-contact-number">{user.contactNumber || 'N/A'}</div>
        <div className="User-date-of-birth">
          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
        </div>
        <div className="User-account-status">{user.status || 'ACTIVE'}</div>
        <div className="User-last-login">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
        </div>

        <div className="group">
          <div className="User-id">{user.userId || user.id || 'N/A'}</div>
          <div className="text-wrapper-43">ID Number</div>
        </div>

        <div className="text-wrapper-44">Role</div>
        <div className="text-wrapper-45">Contact Number</div>
        <div className="text-wrapper-46">Date of Birth</div>
        <div className="text-wrapper-47">Gender</div>
        <div className="text-wrapper-48">Department</div>
        <div className="text-wrapper-49">Account Status</div>
        <div className="text-wrapper-50">Last Login</div>
      </div>
    </div>
  );
};