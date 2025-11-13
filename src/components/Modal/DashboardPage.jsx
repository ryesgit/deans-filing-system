import React from "react";
import { useAuth } from "../components/Modal/AuthContext";

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user ? user.name : "Guest"}!
          </h1>
          <button
            onClick={logout}
            className="bg-[#800000] hover:bg-[#a00000] text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p>This is your protected dashboard content.</p>
        </div>
      </div>
    </div>
  );
};
