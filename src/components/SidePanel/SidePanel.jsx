import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Modal/AuthContext";
import { Modal } from "../Modal/Modal";
import "./style.css";

export const SidePanel = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  useEffect(() => {
    document.body.classList.add("has-side-panel");
    return () => {
      document.body.classList.remove("has-side-panel");
      document.body.classList.remove("side-panel-open");
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("side-panel-open", isMobileMenuOpen);
    return () => {
      document.body.classList.remove("side-panel-open");
    };
  }, [isMobileMenuOpen]);

  // The activeItem from the URL will take precedence
  const currentActiveItem = getActiveItem() || activeItem;

  return (
    <>
      <button
        type="button"
        className={`mobile-nav-toggle ${isMobileMenuOpen ? "is-open" : ""}`}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        {/* Logo replaces hamburger on mobile — spans hidden via CSS */}
        <img
          className="nav-toggle-logo"
          src="/pup_logo.png"
          alt="PUP Logo — open navigation"
        />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div
        className={`side-panel-backdrop ${isMobileMenuOpen ? "is-visible" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`side-panel ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="rectangle-6" />

        <img className="side-panel-logo" alt="Logo" src="/pup_logo.png" />

        <div className="text-wrapper-57">MAIN MENU</div>

        <nav className="side-panel-nav">
          <Link
            to="/dashboard"
            className={`dashboard ${currentActiveItem === "dashboard" ? "active" : ""
              }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <img className="vector-7" alt="Vector" src="/dashboard_icon.svg" />
            <div className="text-wrapper-56">Dashboard</div>
          </Link>

          {['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase()) && (
            <Link
              to="/file-management"
              className={`file-management ${currentActiveItem === "file-management" ? "active" : ""
                }`}
              onClick={() => handleNavigation("file-management")}
            >
              <img
                className="vector-6"
                alt="Vector"
                src="https://c.animaapp.com/27o9iVJi/img/vector-5.svg"
              />
              <div className="text-wrapper-55">File Management</div>
            </Link>
          )}

          <Link
            to="/request"
            className={`request ${currentActiveItem === "request" ? "active" : ""
              }`}
            onClick={() => handleNavigation("request")}
          >
            <img
              className="vector-5"
              alt="Vector"
              src="https://c.animaapp.com/27o9iVJi/img/vector-4.svg"
            />
            <div className="text-wrapper-54">Request</div>
          </Link>

          {user?.role?.toUpperCase() === 'ADMIN' && (
            <Link
              to="/user-management"
              className={`user-management ${currentActiveItem === "user-management" ? "active" : ""
                }`}
              onClick={() => handleNavigation("user-management")}
            >
              <img
                className="vector-4"
                alt="Vector"
                src="https://c.animaapp.com/27o9iVJi/img/vector-3.svg"
              />
              <div className="text-wrapper-53">User Management</div>
            </Link>
          )}

          <Link
            to="/reports"
            className={`report-log ${currentActiveItem === "report-log" ? "active" : ""
              }`}
            onClick={() => handleNavigation("report-log")}
          >
            <img
              className="vector-3"
              alt="Vector"
              src="https://c.animaapp.com/27o9iVJi/img/vector-2.svg"
            />
            <div className="text-wrapper-53">Reports &amp; Log</div>
          </Link>

          <Link
            to="/settings"
            className={`settings ${currentActiveItem === "settings" ? "active" : ""
              }`}
            onClick={() => handleNavigation("settings")}
          >
            <img
              className="vector-2"
              alt="Vector"
              src="https://c.animaapp.com/27o9iVJi/img/vector-1.svg"
            />
            <div className="text-wrapper-52">Settings</div>
          </Link>
        </nav>

        <div className="logout" onClick={handleLogout}>
          <img
            className="vector"
            alt="Vector"
            src="https://c.animaapp.com/27o9iVJi/img/vector.svg"
          />
          <div className="text-wrapper-51">Log out</div>
        </div>

        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          showCloseButton={false}
        >
          <p className="confirmation-text-02">
            Are you sure you want to log out?
          </p>
          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={confirmLogout}>
              Log Out
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};
