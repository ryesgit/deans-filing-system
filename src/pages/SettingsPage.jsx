import React from "react";
import { SidePanel } from '../components/SidePanel';
import "../DeptHeadPage/DashboardPage/style.css"; // Import shared styles

export const SettingsPage = () => {
  return (
    <div className="w-screen h-screen bg-gray-50 overflow-hidden">
      <SidePanel />
      <div className="ml-[271px] p-8">
        <header className="dashboard-header mb-8">
          <div className="welcome-message">
            <h1 className="page-title">Settings</h1>
          </div>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Settings Content</h2>
          <p className="text-gray-600 mt-2">This is where your settings components will go.</p>
        </div>
      </div>
    </div>
  );
};
