import React from "react";
import "./style.css";

export const QuickActionCard = ({
  onAddFile,
  onRequest,
  onAddMember,
  role,
}) => {
  return (
    <div className="quick-action-card">
      <div className="quick-action-header">
        <h3 className="quick-action-title">Quick Actions</h3>
        <p className="quick-action-instruction">
          Lorem ipsum dolor sit amet consectetur. Risus enim.
        </p>
      </div>
      <div className="quick-action-buttons">
        <button className="action-btn" onClick={onAddFile}>
          Add File
        </button>
        <button className="action-btn" onClick={onRequest}>
          Request
        </button>
        {role === "ADMIN" && (
          <button className="action-btn" onClick={onAddMember}>
            Add Member
          </button>
        )}
      </div>
    </div>
  );
};
