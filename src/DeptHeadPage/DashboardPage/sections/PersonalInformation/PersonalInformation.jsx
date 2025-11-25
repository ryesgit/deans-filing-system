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

        <div className="profile-section">
          <div className={`profile-2 ${!user.avatar ? 'profile-placeholder' : ''}`}>
            {user.avatar && <img className="profile-image" alt="" src={user.avatar} />}
          </div>
          
          <div className="User-name">{user.name || 'N/A'}</div>
          <div className="User-email">{user.email || 'N/A'}</div>
        </div>

        <img
          className="linev"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-01.svg"
        />

        <div className="details-section">
          <div className="group">
            <div className="text-wrapper-43">ID Number</div>
            <div className="User-id">{user.userId || user.id || 'N/A'}</div>
          </div>

          <div className="info-group field-role">
            <div className="label">Role</div>
            <div className="value">{user.role || 'N/A'}</div>
          </div>

          <div className="info-group field-gender">
            <div className="label">Gender</div>
            <div className="value">{user.gender || 'N/A'}</div>
          </div>

          <div className="info-group field-dept">
            <div className="label">Department</div>
            <div className="value">{user.department || 'N/A'}</div>
          </div>

          <div className="info-group field-contact">
            <div className="label">Contact Number</div>
            <div className="value">{user.contactNumber || 'N/A'}</div>
          </div>

          <div className="info-group field-dob">
            <div className="label">Date of Birth</div>
            <div className="value">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
          </div>

          <div className="info-group field-status">
            <div className="label">Account Status</div>
            <div className="value">{user.status || 'ACTIVE'}</div>
          </div>

          <div className="info-group field-login">
            <div className="label">Last Login</div>
            <div className="value">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};