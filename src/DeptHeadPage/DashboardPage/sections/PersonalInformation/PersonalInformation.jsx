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

        <div className="text-wrapper-33">{user.name || 'N/A'}</div>
        <div className="text-wrapper-34">{user.email || 'N/A'}</div>

        <img className="profile-2" alt="Profile" src={user.avatar || "https://c.animaapp.com/27o9iVJi/img/profile-01.svg"} />

        <img
          className="linev"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-01.svg"
        />

        <div className="text-wrapper-35">{user.role || 'N/A'}</div>
        <div className="text-wrapper-36">{user.gender || 'N/A'}</div>
        <div className="text-wrapper-37">{user.department || 'N/A'}</div>
        <div className="text-wrapper-38">{user.contactNumber || 'N/A'}</div>
        <div className="text-wrapper-39">
          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
        </div>
        <div className="text-wrapper-40">{user.status || 'ACTIVE'}</div>
        <div className="text-wrapper-41">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
        </div>

        <div className="group">
          <div className="text-wrapper-42">{user.userId || user.id || 'N/A'}</div>
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
