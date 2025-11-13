import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";

export const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    const result = await login({ username, password });
    if (!result.success) {
      setError(result.message || "An unexpected error occurred.");
    }
  };

  const handleResetPassword = () => {
    console.log("Reset password clicked");
  };

  return (
    <div className="login-page">
      <img
        className="login-page-image"
        alt="Frame"
        src="public/Frame 2.png"
      />

      <div className="login-page-right">
        {error && (
          <div className="login-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="login-panel">
          <img
            className="login-logo"
            alt="Polytechnic University of the Philippines Logo"
            src="https://c.animaapp.com/JQfrdw9b/img/pup-logo@2x.png"
          />

          <h1 className="login-title">
            Welcome Back!
          </h1>

          <p className="login-subtitle">
            Lorem ipsum dolor sit amet consectetur. Risus enim.
          </p>

          <div className="login-field username">
            <div className={`login-field-border ${usernameFocused ? "focused" : "default"}`} />

            <label htmlFor="username" className="login-field-label username-label">
              <span className={`login-field-label-text ${usernameFocused ? "focused" : "default"}`}>
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
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              placeholder=""
              className="login-field-input username-input"
              aria-label="Username"
              required
            />
          </div>

          <div className="login-field password">
            <div className={`login-field-border ${passwordFocused ? "focused" : "default"}`} />

            <label htmlFor="password" className="login-field-label password-label">
              <span className={`login-field-label-text ${passwordFocused ? "focused" : "default"}`}>
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
              onChange={(e) => setPassword(e.target.value)}
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
                <img
                  src="public/View Icon.svg"
                  alt="Hide password"
                />
              ) : (
                <img
                  src="public/Show Icon.svg"
                  alt="Show password"
                />
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
              <span className="login-button-text">
                Log In
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetPassword}
            className="reset-password-button"
            aria-label="Reset your password"
          >
            <img
              className="reset-password-line"
              alt=""
              src="https://c.animaapp.com/JQfrdw9b/img/vector-1.svg"
            />

            <div className="reset-password-bg" />

            <div className="reset-password-text">
              Reset your password
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
