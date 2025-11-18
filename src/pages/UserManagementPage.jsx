import React, { useState, useMemo, useEffect } from "react";
import "../DeptHeadPage/UserManagementPage/UserManagement.css";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { usersAPI } from "../services/api";

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOptions, setFilterOptions] = useState({
    showAll: true,
    showActive: false,
    showFaculty: false,
    showHeads: false,
    department: "all",
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();

  // Fetch users from API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersAPI.getAll();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!filterOptions.showAll) {
      if (filterOptions.showActive) {
        filtered = filtered.filter((user) => user.status === "active");
      }
      if (filterOptions.showFaculty) {
        filtered = filtered.filter((user) => user.role === "Faculty Member");
      }
      if (filterOptions.showHeads) {
        filtered = filtered.filter((user) => user.role === "Department Head");
      }
    }

    if (filterOptions.department !== "all") {
      filtered = filtered.filter(
        (user) => user.department === filterOptions.department
      );
    }

    return filtered;
  }, [users, filterOptions]);

  const statistics = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.tags.includes("active")).length,
      facultyMembers: users.filter((u) => u.tags.includes("faculty")).length,
      departmentHeads: users.filter((u) => u.tags.includes("head")).length,
    };
  }, [users]);

  const handleAddUser = async (newUser) => {
    try {
      const tags = [];
      if (newUser.status === "active") tags.push("active");
      if (newUser.role === "Faculty Member") tags.push("faculty");
      if (newUser.role === "Department Head") tags.push("head");

      const userData = {
        ...newUser,
        tags,
      };

      const response = await usersAPI.create(userData);
      setUsers([...users, response.data]);
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error('Failed to add user:', error);
      alert(error.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await usersAPI.delete(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleFilterApply = (filters) => {
    setFilterOptions(filters);
    setIsFilterModalOpen(false);
  };

  const departments = [...new Set(users.map((u) => u.department))];

  return (
    <>
      <SidePanel />
      <div className="user-management-container">
        <header className="usermanagement-header">
          <div className="welcome-message">
            <h1 className="text-wrapper-77">User Management</h1>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <form className="search-form">
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="user-summary-card">
          <p className="instruction">
            Lorem ipsum dolor sit amet consectetur. Purus in tellus nisl fames.
            Rutrum sem id diam semper.
          </p>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">{statistics.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{statistics.activeUsers}</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{statistics.facultyMembers}</div>
              <div className="stat-label">Faculty Members</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{statistics.departmentHeads}</div>
              <div className="stat-label">Department Heads</div>
            </div>
          </div>
        </div>
        <div className="users-section">
          <div className="section-header">
            <div className="header-left">
              <h2 className="text-wrapper-9">All Users</h2>
              <div className="users-count">
                <div className="text-wrapper-8">{filteredUsers.length}</div>
              </div>
            </div>

            <div className="header-right">
              <button
                className="filter-button"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <img
                  className="filter-icon"
                  alt="Filter icon"
                  src="https://c.animaapp.com/0TqWl1mS/img/filter-icon.svg"
                />
                <span className="button-text">Filter</span>
              </button>

              <button
                className="view-button"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <svg
                    className="view-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                ) : (
                  <svg
                    className="view-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                )}
                <span className="button-text">
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </span>
              </button>

              <button
                className="add-user-button"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                <span className="button-text">Add User</span>
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="cards-container">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="user-card"
                  onClick={() => {
                    setSelectedUser(user);
                    setTimeout(() => {
                      setSelectedUser(null); // Deselect after modal is likely closed
                    }, 3000); // Keep selected for a few seconds
                  }}
                >
                  <div className="rectangle" />
                  <div className="text-wrapper">{user.name}</div>
                  <div className="div">{user.role}</div>
                  <div className="text-wrapper-2">Department</div>
                  <div className="text-wrapper-3">{user.department}</div>
                  <div className="text-wrapper-4">{user.dateJoined}</div>
                  <div className="text-wrapper-5">Date Joined</div>
                  <div className="user-photo" />
                  <div
                    className={`status ${
                      user.status === "active" ? "active" : "inactive"
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="list-container">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="list-item"
                  onClick={() => {
                    setSelectedUser(user);
                    setTimeout(() => {
                      setSelectedUser(null); // Deselect after modal is likely closed
                    }, 3000); // Keep selected for a few seconds
                  }}
                >
                  <div className="list-photo" />
                  <div
                    className={`list-status ${
                      user.status === "active" ? "active" : "inactive"
                    }`}
                  />
                  <div className="list-content">
                    <div className="list-name">{user.name}</div>
                    <div className="list-details">
                      <span className="list-role">{user.role}</span>
                      <span className="list-separator">•</span>
                      <span className="list-department">{user.department}</span>
                      <span className="list-separator">•</span>
                      <span className={`list-status-text ${user.status}`}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="list-date">{user.dateJoined}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <AddUserModal
            onClose={() => setIsAddUserModalOpen(false)}
            onSave={handleAddUser}
          />
        )}

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <FilterModal
            currentFilters={filterOptions}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={handleFilterApply}
            departments={departments}
          />
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onDelete={handleDeleteUser}
          />
        )}

        <NotificationDropdown
          notifications={notifications}
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </>
  );
};

// Add User Modal Component
const AddUserModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "Faculty Member",
    department: "",
    status: "active",
    dateJoined: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.department) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content add-user-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Add New User</h2>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Faculty Member">Faculty Member</option>
              <option value="Department Head">Department Head</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter department"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date Joined</label>
            <input
              type="text"
              name="dateJoined"
              value={formData.dateJoined}
              onChange={handleChange}
              className="form-input"
              placeholder="MM/DD/YYYY"
            />
          </div>

          <button type="submit" className="form-submit">
            Save User
          </button>
        </form>
      </div>
    </div>
  );
};

// Filter Modal Component
const FilterModal = ({ currentFilters, onClose, onApply, departments }) => {
  const [filters, setFilters] = useState(currentFilters);

  const handleCheckboxChange = (filterName) => {
    if (filterName === "showAll") {
      setFilters({
        ...filters,
        showAll: true,
        showActive: false,
        showFaculty: false,
        showHeads: false,
      });
    } else {
      setFilters({
        ...filters,
        showAll: false,
        [filterName]: !filters[filterName],
      });
    }
  };

  const handleDepartmentChange = (e) => {
    setFilters({ ...filters, department: e.target.value });
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content filter-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">Filter Users</h2>

        <div className="filter-options">
          <div className={`filter-option ${filters.showAll ? "selected" : ""}`}>
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters.showAll}
                onChange={() => handleCheckboxChange("showAll")}
                className="filter-checkbox"
              />
              <span className="filter-text">Show All Users</span>
            </label>
          </div>

          <div
            className={`filter-option ${filters.showActive ? "selected" : ""}`}
          >
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters.showActive}
                onChange={() => handleCheckboxChange("showActive")}
                className="filter-checkbox"
              />
              <span className="filter-text">Show Active Users</span>
            </label>
          </div>

          <div
            className={`filter-option ${filters.showFaculty ? "selected" : ""}`}
          >
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters.showFaculty}
                onChange={() => handleCheckboxChange("showFaculty")}
                className="filter-checkbox"
              />
              <span className="filter-text">Show Faculty Members</span>
            </label>
          </div>

          <div
            className={`filter-option ${filters.showHeads ? "selected" : ""}`}
          >
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters.showHeads}
                onChange={() => handleCheckboxChange("showHeads")}
                className="filter-checkbox"
              />
              <span className="filter-text">Show Department Heads</span>
            </label>
          </div>

          <div className="filter-divider"></div>

          <div className="form-group">
            <label className="form-label">Filter by Department</label>
            <select
              value={filters.department}
              onChange={handleDepartmentChange}
              className="form-select"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleApply} className="filter-apply">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ user, onClose, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDelete(user.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content user-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="user-details-header">
          <div className="user-details-photo">
            <div className={`user-details-status ${user.status}`}></div>
          </div>
          <h2 className="user-details-name">{user.name}</h2>
          <p className="user-details-role">{user.role}</p>
        </div>

        <div className="user-details-info">
          <div className="info-row">
            <span className="info-label">Department</span>
            <span className="info-value">{user.department}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Status</span>
            <span className={`info-value status-badge ${user.status}`}>
              {user.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Date Joined</span>
            <span className="info-value">{user.dateJoined}</span>
          </div>
        </div>

        <button className="delete-user-button" onClick={handleDelete}>
          Delete User
        </button>
      </div>
    </div>
  );
};
