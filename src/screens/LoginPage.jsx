import React, { useState } from "react";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted", { username, password });
  };

  const handleResetPassword = () => {
    console.log("Reset password clicked");
  };

  return (
    <div
      className="bg-[#c2c2c2] overflow-hidden w-full min-w-[1440px] min-h-[1024px] relative"
      data-model-id="1:2"
    >
      <img
        className="absolute top-0 left-0 w-[705px] h-[1024px] aspect-[0.73] object-cover"
        alt="Frame"
        src="https://c.animaapp.com/JQfrdw9b/img/frame-2-1.png"
      />

      <div className="absolute top-0 left-[661px] w-[783px] h-[1024px]">
        <div className="left-0 w-[779px] h-[1024px] bg-white rounded-[55px_0px_0px_55px] absolute top-0" />

        <button
          type="button"
          onClick={handleResetPassword}
          className="absolute top-[747px] left-[149px] w-[485px] h-[33px] cursor-pointer"
          aria-label="Reset your password"
        >
          <img
            className="absolute top-[15px] left-0 w-[483px] h-0.5"
            alt=""
            src="https://c.animaapp.com/JQfrdw9b/img/vector-1.svg"
          />

          <div className="left-32 w-[227px] h-[33px] bg-white absolute top-0" />

          <div className="absolute top-[3px] left-[151px] [font-family:'Poppins',Helvetica] font-normal text-[#800000] text-[17.5px] tracking-[0] leading-[normal]">
            Reset your password
          </div>
        </button>

        <form
          onSubmit={handleSubmit}
          className="absolute top-[638px] left-[126px] w-[532px] h-[60px]"
        >
          <button
            type="submit"
            className="left-0 w-[530px] h-[60px] bg-[#800000] rounded-[16.38px] absolute top-0 cursor-pointer hover:bg-[#a00000] transition-colors"
            aria-label="Log In"
          >
            <span className="absolute top-3 left-[233px] [font-family:'Poppins',Helvetica] font-medium text-white text-2xl tracking-[-1.44px] leading-[normal]">
              Log In
            </span>
          </button>
        </form>

        <div className="absolute top-[523px] left-[126px] w-[532px] h-[76px]">
          <div className="absolute top-4 left-0 w-[530px] h-[60px] rounded-[16.38px] border-[3.28px] border-solid border-[#d9d9d9]" />

          <label
            htmlFor="password"
            className="left-[21px] w-[111px] h-[33px] bg-white absolute top-0"
          >
            <span className="absolute top-0 left-[8px] [font-family:'Poppins',Helvetica] font-normal text-[#c2c2c2] text-[21.8px] tracking-[-1.31px] leading-[normal]">
              Password
            </span>
          </label>

          <img
            className="absolute w-[3.01%] h-[23.55%] top-[49.30%] left-[3.76%] pointer-events-none"
            alt=""
            src="https://c.animaapp.com/JQfrdw9b/img/password-icon.svg"
          />

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="absolute top-4 left-[50px] w-[420px] h-[60px] [font-family:'Poppins',Helvetica] font-normal text-black text-[21.8px] tracking-[-1.31px] leading-[normal] px-2"
            aria-label="Password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute w-[3.78%] h-[18.75%] top-[51.64%] left-[92.17%] cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <img
                src="public/View Icon.svg" // the hide icon
                alt="Hide password"
                className="w-full h-full"
              />
            ) : (
              <img
                src="public/Show Icon.svg" // the show icon
                alt="Show password"
                className="w-full h-full"
              />
            )}
          </button>

        </div>

        <div className="absolute top-[425px] left-[126px] w-[532px] h-[76px]">
          <div className="absolute top-4 left-0 w-[530px] h-[60px] rounded-[16.38px] border-[3.28px] border-solid border-[#d9d9d9]" />

          <label
            htmlFor="username"
            className="left-[21px] w-[119px] h-[33px] bg-white absolute top-0"
          >
            <span className="absolute top-0 left-[8px] [font-family:'Poppins',Helvetica] font-normal text-[#c2c2c2] text-[21.8px] tracking-[-1.31px] leading-[normal]">
              Username
            </span>
          </label>

          <img
            className="absolute w-[3.57%] h-[23.20%] top-[48.28%] left-[3.57%] pointer-events-none"
            alt=""
            src="https://c.animaapp.com/JQfrdw9b/img/username-icon.svg"
          />

          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="absolute top-4 left-[50px] w-[460px] h-[60px] [font-family:'Poppins',Helvetica] font-normal text-black text-[21.8px] tracking-[-1.31px] leading-[normal] px-2"
            aria-label="Username"
            required
          />
        </div>

        <p className="absolute top-[350px] left-[126px] w-[502px] [font-family:'Poppins',Helvetica] font-normal text-black text-[21.8px] tracking-[-1.31px] leading-[normal]">
          Lorem ipsum dolor sit amet consectetur. Risus enim.
        </p>

        <h1 className="absolute top-[245px] left-[125px] [font-family:'Poppins',Helvetica] font-semibold text-[#800000] text-[69.9px] tracking-[-4.19px] leading-[normal]">
          Welcome Back!
        </h1>

        <img
          className="absolute top-14 left-11 w-[489px] h-[53px] aspect-[9.22] object-cover"
          alt="Polytechnic University of the Philippines Logo"
          src="https://c.animaapp.com/JQfrdw9b/img/pup-logo@2x.png"
        />
      </div>
    </div>
  );
};
