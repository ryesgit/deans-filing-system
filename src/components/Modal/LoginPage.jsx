import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";
import { Modal } from "./Modal";
import { RegistrationPage } from "./RegistrationPage";

export const LoginPage = () => {
  const { login, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleUsernameChange = (e) => {
    if (error) clearError();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (error) clearError();
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ userId: username, password });
  };

  const handleRegisterClick = () => {
    setIsRegistrationOpen(true);
  };

  return (
    <div className="login-page">
      <Modal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        title="Register New User"
      >
        <RegistrationPage onClose={() => setIsRegistrationOpen(false)} />
      </Modal>

      <img className="login-page-image" alt="Frame" src="/frame_2.png" />

      <div className="login-page-right">
        {error && (
          <div className="login-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="login-panel">
          <div className="login-panel-content">
            <img
              className="login-logo"
              alt="Polytechnic University of the Philippines Logo"
              src="https://c.animaapp.com/JQfrdw9b/img/pup-logo@2x.png"
            />

            <h1 className="login-title">Welcome Back!</h1>

            <p className="login-subtitle">
              Lorem ipsum dolor sit amet consectetur. Risus enim.
            </p>

            <div className="login-field username">
              <div
                className={`login-field-border ${
                  usernameFocused ? "focused" : "default"
                }`}
              />

              <label
                htmlFor="username"
                className="login-field-label username-label"
              >
                <span
                  className={`login-field-label-text ${
                    usernameFocused ? "focused" : "default"
                  }`}
                >
                  Username
                </span>
              </label>

              <img
                className="login-field-icon username-icon"
                alt=""
                src="https://c.animaapp.com/JQfrdw9b/img/username-icon.svg"
              />

              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                placeholder=""
                className="login-field-input username-input"
                aria-label="Username"
                required
              />
            </div>

            <div className="login-field password">
              <div
                className={`login-field-border ${
                  passwordFocused ? "focused" : "default"
                }`}
              />

              <label
                htmlFor="password"
                className="login-field-label password-label"
              >
                <span
                  className={`login-field-label-text ${
                    passwordFocused ? "focused" : "default"
                  }`}
                >
                  Password
                </span>
              </label>

              <img
                className="login-field-icon password-icon"
                alt=""
                src="https://c.animaapp.com/JQfrdw9b/img/password-icon.svg"
              />

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder=""
                className="login-field-input password-input"
                aria-label="Password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <img src="/view_icon.svg" alt="Hide password" />
                ) : (
                  <img src="/show_icon.svg" alt="Show password" />
                )}
              </button>
            </div>

            <div className="login-button-wrapper">
              <button
                type="submit"
                onClick={handleSubmit}
                className="login-button"
                aria-label="Log In"
              >
                <span className="login-button-text">Log In</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRegisterClick}
              className="reset-password-button"
              aria-label="Reset your password"
            >
              <img
                className="reset-password-line"
                alt=""
                src="https://c.animaapp.com/JQfrdw9b/img/vector-1.svg"
              />

              <div className="reset-password-bg" />

              <div className="reset-password-text">Register here</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
