import React, { useState } from "react";
import "./style.css";

export const SidePanel = ({ onNavigate }) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigation = (item) => {
    setActiveItem(item);
    if (onNavigate) {
      onNavigate(item);
    }
  };
  return (
    <div className="side-panel">
      <div className="rectangle-6" />

      <div className="logout" onClick={() => handleNavigation("logout")}>
        <div className="text-wrapper-51">Log out</div>

        <img
          className="vector"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector.svg"
        />
      </div>

      <div className={`settings ${activeItem === "settings" ? "active" : ""}`} onClick={() => handleNavigation("settings")}>
        <div className="text-wrapper-52">Settings</div>

        <img
          className="vector-2"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-1.svg"
        />
      </div>

      <div className={`report-log ${activeItem === "report-log" ? "active" : ""}`} onClick={() => handleNavigation("report-log")}>
        <div className="text-wrapper-53">Reports &amp; Log</div>

        <img
          className="vector-3"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-2.svg"
        />
      </div>

      <div className={`user-management ${activeItem === "user-management" ? "active" : ""}`} onClick={() => handleNavigation("user-management")}>
        <div className="text-wrapper-53">User Management</div>

        <img
          className="vector-4"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-3.svg"
        />
      </div>

      <div className={`request ${activeItem === "request" ? "active" : ""}`} onClick={() => handleNavigation("request")}>
        <div className="text-wrapper-54">Request</div>

        <img
          className="vector-5"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-4.svg"
        />
      </div>

      <div className={`file-management ${activeItem === "file-management" ? "active" : ""}`} onClick={() => handleNavigation("file-management")}>
        <div className="text-wrapper-55">File Management</div>

        <img
          className="vector-6"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-5.svg"
        />
      </div>

      <div className="selected-shape" />

      <div className={`dashboard ${activeItem === "dashboard" ? "active" : ""}`} onClick={() => handleNavigation("dashboard")}>
        <img
          className="vector-7"
          alt="Vector"
          src="public/Vector.svg"
        />

        <div className="text-wrapper-56">Dashboard</div>
      </div>

      <div className="text-wrapper-57">MAIN MENU</div>
    </div>
  );
};

