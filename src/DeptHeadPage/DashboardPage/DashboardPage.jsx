import React, { useState } from "react";
import { ActivityLogCard } from "./sections/ActivityLogCard";
import { PersonalInformation } from "./sections/PersonalInformation";
import { QuickActionCard } from "./sections/QuickActionCard";
import { RequestCard } from "./sections/RequestCard";
import { SidePanel } from "./sections/SidePanel";
import { Modal } from "../../components/Modal";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { userData, statsData, notifications } from "../../data/mockData";
import "./style.css";

export const DashboardPage = () => {
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigation = (item) => {
    console.log(`Navigating to: ${item}`);
    if (item === "logout") {
      if (window.confirm("Are you sure you want to logout?")) {
        console.log("User logged out");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
  };
  return (
    <div className="department-head-page" data-model-id="176:157">
      <RequestCard />
      
      <Modal
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        title="Add New File"
      >
        <form className="modal-form">
          <div className="form-group">
            <label>File Name</label>
            <input type="text" placeholder="Enter file name" />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select>
              <option>Computer Engineering</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
            </select>
          </div>
          <div className="form-group">
            <label>Upload File</label>
            <input type="file" />
          </div>
          <button type="submit" className="submit-btn">Add File</button>
        </form>
      </Modal>

      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="New Request"
      >
        <form className="modal-form">
          <div className="form-group">
            <label>Faculty Name</label>
            <input type="text" placeholder="Enter faculty name" />
          </div>
          <div className="form-group">
            <label>File Name</label>
            <input type="text" placeholder="Enter file name" />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select>
              <option>Computer Engineering</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Submit Request</button>
        </form>
      </Modal>

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add New Member"
      >
        <form className="modal-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter full name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select>
              <option>Faculty</option>
              <option>Department Head</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select>
              <option>Computer Engineering</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Add Member</button>
        </form>
      </Modal>

      <NotificationDropdown
        notifications={notifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <div className="files-card">
        <div className="rectangle-7" />

        <div className="text-wrapper-58">Newly Added</div>

        <div className="text-wrapper-59">{statsData.files.newlyAdded}</div>

        <img
          className="linev-2"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
        />

        <div className="text-wrapper-60">Total Files</div>

        <div className="text-wrapper-61">{statsData.files.total}</div>

        <img
          className="lineh-2"
          alt="Lineh"
          src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
        />

        <div className="text-wrapper-62">Files</div>

        <img
          className="files-icon"
          alt="Files icon"
          src="https://c.animaapp.com/27o9iVJi/img/files-icon.svg"
        />
      </div>

      <div className="borrowing-card">
        <div className="rectangle-7" />

        <div className="text-wrapper-63">Returned Today</div>

        <div className="text-wrapper-59">{statsData.borrowing.returnedToday}</div>

        <img
          className="linev-2"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
        />

        <div className="text-wrapper-64">Active Borrowed</div>

        <div className="text-wrapper-61">{statsData.borrowing.activeBorrowed}</div>

        <img
          className="lineh-2"
          alt="Lineh"
          src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
        />

        <div className="text-wrapper-65">Borrowing</div>

        <img
          className="borrowing-icon"
          alt="Borrowing icon"
          src="https://c.animaapp.com/27o9iVJi/img/borrowing-icon.svg"
        />
      </div>

      <div className="approval-card">
        <div className="rectangle-7" />

        <div className="text-wrapper-66">Approved</div>

        <div className="text-wrapper-59">{statsData.approvals.approved}</div>

        <img
          className="linev-2"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
        />

        <div className="text-wrapper-67">Pending</div>

        <div className="text-wrapper-61">{statsData.approvals.pending}</div>

        <img
          className="lineh-2"
          alt="Lineh"
          src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
        />

        <div className="text-wrapper-65">Approvals</div>

        <img
          className="approval-icon"
          alt="Approval icon"
          src="https://c.animaapp.com/27o9iVJi/img/approval-icon.svg"
        />
      </div>

      <div className="overdue-files-card">
        <div className="rectangle-7" />

        <div className="text-wrapper-65">Overdue Files</div>

        <div className="text-wrapper-59">{statsData.overdueFiles.overdue}</div>

        <img
          className="linev-2"
          alt="Linev"
          src="https://c.animaapp.com/27o9iVJi/img/linev-05.svg"
        />

        <div className="text-wrapper-68">Resolved</div>

        <div className="text-wrapper-61">{statsData.overdueFiles.resolved}</div>

        <img
          className="lineh-3"
          alt="Lineh"
          src="https://c.animaapp.com/27o9iVJi/img/lineh-04.svg"
        />

        <div className="text-wrapper-69">Overdue</div>

        <img
          className="overdue-files-icon"
          alt="Overdue files icon"
          src="https://c.animaapp.com/27o9iVJi/img/overdue-files-icon.svg"
        />
      </div>

      <ActivityLogCard />
      <QuickActionCard
        onAddFile={() => setIsAddFileModalOpen(true)}
        onRequest={() => setIsRequestModalOpen(true)}
        onAddMember={() => setIsAddMemberModalOpen(true)}
      />
      <PersonalInformation />
      <div 
        className="notification-button-wrapper"
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
      >
        <img
          className="notification-button"
          alt="Notification button"
          src="https://c.animaapp.com/27o9iVJi/img/notification-button@2x.png"
        />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
        )}
      </div>

      <div className="search-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      <div className="text-wrapper-70">{userData.name.split(' ')[0]} {userData.name.split(' ')[1]} {userData.name.split(' ')[2]}!</div>

      <div className="text-wrapper-71">Welcome Back,</div>

      <SidePanel onNavigate={handleNavigation} />
      <div className="notification-card">
        <div className="rectangle-8" />

        <div className="text-wrapper-72">Notification + Calendar</div>
      </div>
    </div>
  );
};
