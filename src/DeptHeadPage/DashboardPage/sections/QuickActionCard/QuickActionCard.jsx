import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const QuickActionCard = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div className="quick-action-card">
      <div className="quick-action-header">
        <h3 className="quick-action-title">Quick Actions</h3>
        <p className="quick-action-instruction">
          Quickly access common tasks and navigate to key features.
        </p>
      </div>
      <div className="quick-action-buttons">
        {(role === "ADMIN" || role === "STAFF") && (
          <button
            className="action-btn"
            onClick={() => navigate("/file-management")}
          >
            Add File
          </button>
        )}
        <button className="action-btn" onClick={() => navigate("/request")}>
          Request
        </button>
        {role === "ADMIN" && (
          <button
            className="action-btn"
            onClick={() => navigate("/user-management")}
          >
            Add Member
          </button>
        )}
      </div>
    </div>
  );
};
