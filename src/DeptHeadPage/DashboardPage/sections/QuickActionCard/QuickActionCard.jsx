import React from "react";
import "./style.css";

export const QuickActionCard = ({ onAddFile, onRequest, onAddMember }) => {
  return (
    <div className="quick-action-card">
      <img
        className="img"
        alt="Rectangle"
        src="https://c.animaapp.com/27o9iVJi/img/rectangle-23.svg"
      />

      <div className="add-member-button" onClick={onAddMember}>
        <div className="rectangle-4" />

        <div className="text-wrapper-30">Add Member</div>
      </div>

      <div className="request-button" onClick={onRequest}>
        <div className="rectangle-4" />

        <div className="text-wrapper-31">Request</div>
      </div>

      <div className="add-file-button" onClick={onAddFile}>
        <div className="rectangle-4" />

        <div className="text-wrapper-31">Add File</div>
      </div>

      <p className="instruction">
        Lorem ipsum dolor sit amet consectetur. Risus enim.
      </p>

      <div className="text-wrapper-32">Quick Action</div>
    </div>
  );
};
