import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidePanel } from "../components/SidePanel";
import { ActivityLogCard } from "../DeptHeadPage/DashboardPage/sections/ActivityLogCard";
import { PersonalInformation } from "../DeptHeadPage/DashboardPage/sections/PersonalInformation";
import { QuickActionCard } from "../DeptHeadPage/DashboardPage/sections/QuickActionCard";
import { RequestCard } from "../DeptHeadPage/DashboardPage/sections/RequestCard/RequestCard";
import { NotificationCard } from "../DeptHeadPage/DashboardPage/sections/NotificationCard";

import { NotificationDropdown } from "../components/NotificationDropdown";
import { useAuth } from "../components/Modal/AuthContext";
import { statsAPI } from "../services/api";
import "../DeptHeadPage/DashboardPage/style.css";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statsData, setStatsData] = useState({
    files: { total: 0, newlyAdded: 0 },
    borrowing: { activeBorrowed: 0, returnedToday: 0 },
    approvals: { pending: 0, approved: 0 },
    overdueFiles: { overdue: 0, resolved: 0 }
  });
  const [loading, setLoading] = useState(true);
  const { notifications, unreadCount } = useNotifications();
  const { user } = useAuth();

  // Fetch dashboard stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getDashboard();
        const stats = response.data?.stats || response.data;
        setStatsData({
          files: stats?.files || { total: 0, newlyAdded: 0 },
          borrowing: stats?.borrowing || { activeBorrowed: 0, returnedToday: 0 },
          approvals: stats?.approvals || { pending: 0, approved: 0 },
          overdueFiles: stats?.overdueFiles || { overdue: 0, resolved: 0 },
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };

  // Debug logging
  console.log('User role:', user?.role);
  console.log('User role uppercase:', user?.role?.toUpperCase());
  const isStudent = user?.role?.toUpperCase() === 'STUDENT';
  console.log('Is STUDENT?:', isStudent);
  console.log('Dashboard class:', `department-head-page ${isStudent ? 'user-dashboard' : ''}`);

  return (
    <>
      <SidePanel />
      <div className={`department-head-page ${isStudent ? 'user-dashboard' : ''}`} data-model-id="176:157">
        <header className="dashboard-header">
          <div className="welcome-message">
            <div className="text-wrapper-71">Mabuhay,</div>
            <div className="text-wrapper-70">
              {user?.name || 'User'}!
            </div>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <form onSubmit={handleSearch} className="search-form">
                <svg
                  className="search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search files, users, or requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div
              className="notification-button-wrapper"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <img
                className="notification-button"
                alt="Notification button"
                src="https://c.animaapp.com/27o9iVJi/img/notification-button@2x.png"
              />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
          </div>
        </header>

        <PersonalInformation />

        {user?.role?.toUpperCase() !== 'STUDENT' && <ActivityLogCard />}
        <QuickActionCard
          onAddFile={() => navigate('/file-management')}
          onRequest={() => navigate('/request')}
          onAddMember={() => navigate('/user-management')}
          role={user?.role}
        />
        <NotificationCard />

        <div className="files-card">
          <div className="rectangle-7" />
          <div className="text-wrapper-62">Files</div>
          <img
            className="files-icon"
            alt="Files icon"
            src="https://c.animaapp.com/27o9iVJi/img/files-icon.svg"
          />
          <img
            className="lineh-2"
            alt="Lineh"
            src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
          />
          <div className="stats-content">
            <div className="stat-item">
              <div className="text-wrapper-61">{statsData.files.total}</div>
              <div className="text-wrapper-60">Total Files</div>
            </div>
            <img
              className="linev-2"
              alt="Linev"
              src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
            />
            <div className="stat-item">
              <div className="text-wrapper-59">
                {statsData.files.newlyAdded}
              </div>
              <div className="text-wrapper-58">Newly Added</div>
            </div>
          </div>
        </div>

        <div className="borrowing-card">
          <div className="rectangle-7" />
          <div className="text-wrapper-65">Borrowing</div>
          <img
            className="borrowing-icon"
            alt="Borrowing icon"
            src="https://c.animaapp.com/27o9iVJi/img/borrowing-icon.svg"
          />
          <img
            className="lineh-2"
            alt="Lineh"
            src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
          />
          <div className="stats-content">
            <div className="stat-item">
              <div className="text-wrapper-61">
                {statsData.borrowing.activeBorrowed}
              </div>
              <div className="text-wrapper-64">Active Borrowed</div>
            </div>
            <img
              className="linev-2"
              alt="Linev"
              src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
            />
            <div className="stat-item">
              <div className="text-wrapper-59">
                {statsData.borrowing.returnedToday}
              </div>
              <div className="text-wrapper-63">Returned Today</div>
            </div>
          </div>
        </div>

        <div className="approval-card">
          <div className="rectangle-7" />
          <div className="text-wrapper-65">Approvals</div>
          <img
            className="approval-icon"
            alt="Approval icon"
            src="https://c.animaapp.com/27o9iVJi/img/approval-icon.svg"
          />
          <img
            className="lineh-2"
            alt="Lineh"
            src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
          />
          <div className="stats-content">
            <div className="stat-item">
              <div className="text-wrapper-61">
                {statsData.approvals.pending}
              </div>
              <div className="text-wrapper-67">Pending</div>
            </div>
            <img
              className="linev-2"
              alt="Linev"
              src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
            />
            <div className="stat-item">
              <div className="text-wrapper-59">
                {statsData.approvals.approved}
              </div>
              <div className="text-wrapper-66">Approved</div>
            </div>
          </div>
        </div>

        <div className="overdue-files-card">
          <div className="rectangle-7" />
          <div className="text-wrapper-65">Overdue</div>
          <img
            className="overdue-files-icon"
            alt="Overdue files icon"
            src="https://c.animaapp.com/27o9iVJi/img/overdue-files-icon.svg"
          />
          <img
            className="lineh-3"
            alt="Lineh"
            src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
          />
          <div className="stats-content">
            <div className="stat-item">
              <div className="text-wrapper-61">
                {statsData.overdueFiles.overdue}
              </div>
              <div className="text-wrapper-69">Overdue</div>
            </div>
            <img
              className="linev-2"
              alt="Linev"
              src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
            />
            <div className="stat-item">
              <div className="text-wrapper-59">
                {statsData.overdueFiles.resolved}
              </div>
              <div className="text-wrapper-68">Resolved</div>
            </div>
          </div>
        </div>

        <RequestCard />

        <NotificationDropdown
          notifications={notifications}
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </>
  );
};
