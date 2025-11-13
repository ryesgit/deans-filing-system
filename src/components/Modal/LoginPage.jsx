import React, { useState } from "react";
import { useAuth } from "./AuthContext";

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
    <div className="bg-[#c2c2c2] w-full h-screen relative overflow-hidden">
      {/* Left side - Background Image */}
      <img
        className="absolute top-0 left-0 w-[705px] h-full object-cover"
        alt="Frame"
        src="public/Frame 2.png"
      />

      {/* Right side - Login panel (overlapping) */}
      <div className="absolute top-0 left-[661px] right-0 h-full">
        {/* Error Message */}
        {error && (
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-20"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="w-full h-full bg-white rounded-l-[55px] relative">
          <div className="absolute top-14 left-11">
            <img
              className="w-[489px] h-[53px] object-contain"
              alt="Polytechnic University of the Philippines Logo"
              src="https://c.animaapp.com/JQfrdw9b/img/pup-logo@2x.png"
            />
          </div>

          <h1 className="absolute top-[225px] left-[155px] [font-family:'Poppins',Helvetica] font-semibold text-[#800000] text-[65px] tracking-[-3.5px] leading-[normal]">
            Welcome Back!
          </h1>

          <p className="absolute top-[300px] left-[155px] w-[502px] [font-family:'Poppins',Helvetica] font-normal text-black text-[20px] tracking-[-1.1px] leading-[normal]">
            Lorem ipsum dolor sit amet consectetur. Risus enim.
          </p>

          {/* Username field */}
          <div className="absolute top-[360px] left-[155px] w-[532px] h-[76px]">
            <div
              className={`absolute top-4 left-0 w-[530px] h-[60px] rounded-[16.38px] border-[3.28px] border-solid transition-colors duration-300 ${
                usernameFocused ? "border-[#800000]" : "border-[#d9d9d9]"
              }`}
            />

            <label
              htmlFor="username"
              className="left-[21px] w-[119px] h-[33px] bg-white absolute top-0 z-10"
            >
              <span
                className={`absolute top-0 left-[18px] [font-family:'Poppins',Helvetica] font-normal text-[18px] tracking-[-1.1px] leading-[normal] transition-colors duration-300 ${
                  usernameFocused ? "text-[#800000]" : "text-[#c2c2c2]"
                }`}
              >
                Username
              </span>
            </label>

            <div className="absolute w-[19px] h-[18px] top-[37px] left-[19px] pointer-events-none z-10">
              <svg className={`w-full h-full transition-all duration-300`}>
                <image
                  href="https://c.animaapp.com/JQfrdw9b/img/username-icon.svg"
                  width="19"
                  height="18"
                  style={{
                    filter: usernameFocused
                      ? "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(50%) contrast(150%)"
                      : "none",
                  }}
                />
              </svg>
            </div>

            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              className="absolute top-4 left-[50px] w-[460px] h-[60px] bg-transparent border-0 outline-none [font-family:'Poppins',Helvetica] font-normal text-black text-[18px] tracking-[-1.1px] leading-[normal] px-2"
              aria-label="Username"
              required
            />
          </div>

          {/* Password field */}
          <div className="absolute top-[458px] left-[155px] w-[532px] h-[76px]">
            <div
              className={`absolute top-4 left-0 w-[530px] h-[60px] rounded-[16.38px] border-[3.28px] border-solid transition-colors duration-300 ${
                passwordFocused ? "border-[#800000]" : "border-[#d9d9d9]"
              }`}
            />

            <label
              htmlFor="password"
              className="left-[21px] w-[111px] h-[33px] bg-white absolute top-0 z-10"
            >
              <span
                className={`absolute top-0 left-[18px] [font-family:'Poppins',Helvetica] font-normal text-[18px] tracking-[-1.1px] leading-[normal] transition-colors duration-300 ${
                  passwordFocused ? "text-[#800000]" : "text-[#c2c2c2]"
                }`}
              >
                Password
              </span>
            </label>

            <div className="absolute w-[16px] h-[18px] top-[37px] left-[20px] pointer-events-none z-10">
              <svg className={`w-full h-full transition-all duration-300`}>
                <image
                  href="https://c.animaapp.com/JQfrdw9b/img/password-icon.svg"
                  width="16"
                  height="18"
                  style={{
                    filter: passwordFocused
                      ? "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(50%) contrast(150%)"
                      : "none",
                  }}
                />
              </svg>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="absolute top-4 left-[50px] w-[420px] h-[60px] bg-transparent border-0 outline-none [font-family:'Poppins',Helvetica] font-normal text-black text-[18px] tracking-[-1.1px] leading-[normal] px-2"
              aria-label="Password"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute w-[20px] h-[14px] top-[39px] left-[490px] cursor-pointer bg-transparent border-0 p-0 z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <img
                  src="public/Show Icon.svg"
                  alt="Hide password"
                  className="w-full h-full"
                />
              ) : (
                <img
                  src="public/View Icon.svg"
                  alt="Show password"
                  className="w-full h-full opacity-50"
                />
              )}
            </button>
          </div>

          {/* Login button */}
          <div className="absolute top-[573px] left-[155px] w-[532px] h-[60px]">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-[530px] h-[60px] bg-[#800000] rounded-[16.38px] cursor-pointer hover:bg-[#a00000] transition-colors border-0"
              aria-label="Log In"
            >
              <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-[20px] tracking-[-1.2px] leading-[normal]">
                Log In
              </span>
            </button>
          </div>

          {/* Reset password */}
          <button
            type="button"
            onClick={handleResetPassword}
            className="absolute top-[688px] left-[178px] w-[485px] h-[33px] cursor-pointer bg-transparent border-0 p-0"
            aria-label="Reset your password"
          >
            <img
              className="absolute top-[15px] left-0 w-[483px] h-0.5"
              alt=""
              src="https://c.animaapp.com/JQfrdw9b/img/vector-1.svg"
            />

            <div className="absolute left-32 w-[227px] h-[33px] bg-white top-0" />

            <div className="absolute top-[3px] left-[164.5px] [font-family:'Poppins',Helvetica] font-normal text-[#800000] text-[14.5px] tracking-[0] leading-[normal]">
              Reset your password
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
