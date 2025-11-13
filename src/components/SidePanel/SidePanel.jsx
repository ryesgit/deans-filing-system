import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export const SidePanel = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const activeItem = getActiveItem();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="side-panel">
      <div className="rectangle-6" />

      <div className="logout" onClick={handleLogout}>
        <div className="text-wrapper-51">Log out</div>
        <img
          className="vector"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector.svg"
        />
      </div>

      <Link to="/settings" className={`settings ${activeItem === "settings" ? "active" : ""}`}>
        <div className="text-wrapper-52">Settings</div>
        <img
          className="vector-2"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-1.svg"
        />
      </Link>

      <Link to="/reports" className={`report-log ${activeItem === "report-log" ? "active" : ""}`}>
        <div className="text-wrapper-53">Reports &amp; Log</div>
        <img
          className="vector-3"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-2.svg"
        />
      </Link>

      <Link to="/user-management" className={`user-management ${activeItem === "user-management" ? "active" : ""}`}>
        <div className="text-wrapper-53">User Management</div>
        <img
          className="vector-4"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-3.svg"
        />
      </Link>

      <Link to="/request" className={`request ${activeItem === "request" ? "active" : ""}`}>
        <div className="text-wrapper-54">Request</div>
        <img
          className="vector-5"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-4.svg"
        />
      </Link>

      <Link to="/file-management" className={`file-management ${activeItem === "file-management" ? "active" : ""}`}>
        <div className="text-wrapper-55">File Management</div>
        <img
          className="vector-6"
          alt="Vector"
          src="https://c.animaapp.com/27o9iVJi/img/vector-5.svg"
        />
      </Link>


      <Link to="/dashboard" className={`dashboard ${activeItem === "dashboard" ? "active" : ""}`}>
        <img
          className="vector-7"
          alt="Vector"
          src="public/Vector.svg"
        />
        <div className="text-wrapper-56">Dashboard</div>
      </Link>

      <div className="text-wrapper-57">MAIN MENU</div>
    </div>
  );
};
