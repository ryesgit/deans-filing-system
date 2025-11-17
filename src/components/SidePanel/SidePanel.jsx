import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Modal/AuthContext";
import "./style.css";

export const SidePanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/file-management") return "file-management";
    if (path === "/request") return "request";
    if (path === "/user-management") return "user-management";
    if (path === "/reports") return "report-log";
    if (path === "/settings") return "settings";
    return "";
  };

  const handleNavigation = (item) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    logout();
  };

  // The activeItem from the URL will take precedence
  const currentActiveItem = getActiveItem() || activeItem;

  return (
    <div className="side-panel">
      <div className="rectangle-6" />

      <img
        className="side-panel-logo"
        alt="Logo"
        src="public/PUP Logo.png"
      />

      <Link
        to="/login"
        className="logout"
        onClick={handleLogout}
      >
        <div className="text-wrapper-51">Log out</div>
        <img
          className="vector"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector.svg"
        />
      </Link>

      <Link
        to="/settings"
        className={`settings ${
          currentActiveItem === "settings" ? "active" : ""
        }`}
        onClick={() => handleNavigation("settings")}
      >
        <div className="text-wrapper-52">Settings</div>
        <img
          className="vector-2"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-1.svg"
        />
      </Link>

      <Link
        to="/reports"
        className={`report-log ${
          currentActiveItem === "report-log" ? "active" : ""
        }`}
        onClick={() => handleNavigation("report-log")}
      >
        <div className="text-wrapper-53">Reports &amp; Log</div>
        <img
          className="vector-3"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-2.svg"
        />
      </Link>

      {user?.role === "admin" && (
        <Link
          to="/user-management"
          className={`user-management ${
            currentActiveItem === "user-management" ? "active" : ""
          }`}
          onClick={() => handleNavigation("user-management")}
        >
          <div className="text-wrapper-53">User Management</div>
          <img
            className="vector-4"
            alt="Vector"
            src="https://c.animaapp.com/27o9iVJi/img/vector-3.svg"
          />
        </Link>
      )}

      <Link
        to="/request"
        className={`request ${currentActiveItem === "request" ? "active" : ""}`}
        onClick={() => handleNavigation("request")}
      >
        <div className="text-wrapper-54">Request</div>
        <img
          className="vector-5"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-4.svg"
        />
      </Link>

      <Link
        to="/file-management"
        className={`file-management ${
          currentActiveItem === "file-management" ? "active" : ""
        }`}
        onClick={() => handleNavigation("file-management")}
      >
        <div className="text-wrapper-55">File Management</div>
        <img
          className="vector-6"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-5.svg"
        />
      </Link>

      <Link
        to="/dashboard"
        className={`dashboard ${
          currentActiveItem === "dashboard" ? "active" : ""
        }`}
        onClick={() => handleNavigation("dashboard")}
      >
        <img className="vector-7" alt="Vector" src="public/dashboard icon.png" />
        <div className="text-wrapper-56">Dashboard</div>
      </Link>

      <div className="text-wrapper-57">MAIN MENU</div>
    </div>
  );
};
