import React, { useState, useMemo } from "react";
import "../DeptHeadPage/UserManagementPage/UserManagement.css";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";

export const UserManagementPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Joshua Pagkaliwangan",
      email: "joshua.p@example.com",
      profilePicture: null,
      idNumber: "FAC-001",
      role: "Faculty Member",
      department: "Computer Engineering",
      dateJoined: "10/25/2025",
      status: "active",
      gender: "Male",
      contactNumber: "0912 345 6789",
      dateOfBirth: "01/15/1990",
      tags: ["active", "faculty"],
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.s@example.com",
      profilePicture: null,
      idNumber: "DPH-002",
      role: "Department Head",
      department: "Electrical Engineering",
      dateJoined: "09/15/2024",
      status: "active",
      gender: "Female",
      contactNumber: "0923 456 7890",
      dateOfBirth: "05/20/1985",
      tags: ["active", "head"],
    },
    {
      id: 3,
      name: "John Dela Cruz",
      email: "john.dc@example.com",
      profilePicture: null,
      idNumber: "FAC-003",
      role: "Faculty Member",
      department: "Mechanical Engineering",
      dateJoined: "11/10/2024",
      status: "active",
      gender: "Male",
      contactNumber: "0934 567 8901",
      dateOfBirth: "08/10/1992",
      tags: ["active", "faculty"],
    },
    {
      id: 4,
      name: "Anna Reyes",
      email: "anna.r@example.com",
      profilePicture: null,
      idNumber: "FAC-004",
      role: "Faculty Member",
      department: "Civil Engineering",
      dateJoined: "08/20/2024",
      status: "inactive",
      gender: "Female",
      contactNumber: "0945 678 9012",
      dateOfBirth: "11/25/1988",
      tags: ["faculty"],
    },
    {
      id: 5,
      name: "Carlos Mendoza",
      email: "carlos.m@example.com",
      profilePicture: null,
      idNumber: "DPH-005",
      role: "Department Head",
      department: "Computer Engineering",
      dateJoined: "07/05/2024",
      status: "active",
      gender: "Male",
      contactNumber: "0956 789 0123",
      dateOfBirth: "03/30/1980",
      tags: ["active", "head"],
    },
    {
      id: 6,
      name: "Lisa Garcia",
      email: "lisa.g@example.com",
      profilePicture: null,
      idNumber: "FAC-006",
      role: "Faculty Member",
      department: "Computer Engineering",
      dateJoined: "12/01/2024",
      status: "active",
      gender: "Female",
      contactNumber: "0967 890 1234",
      dateOfBirth: "07/12/1995",
      tags: ["active", "faculty"],
    },
  ]);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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

  const { notifications, unreadCount } = useNotifications();

  // Helper function to generate tags
  const generateUserTags = (user) => {
    const tags = [];
    if (user.status === "active") tags.push("active");
    if (user.role === "Faculty Member") tags.push("faculty");
    if (user.role === "Department Head") tags.push("head");
    return tags;
  };

  // FIXED: Filter logic with proper AND logic
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!filterOptions.showAll) {
      // Apply filters with AND logic - all selected filters must match
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
  }, [users, searchTerm, filterOptions]);

  const statistics = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.tags.includes("active")).length,
      facultyMembers: users.filter((u) => u.tags.includes("faculty")).length,
      departmentHeads: users.filter((u) => u.tags.includes("head")).length,
    };
  }, [users]);

  const handleAddUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: users.length + 1,
      tags: generateUserTags(newUser),
    };

    setUsers([...users, userWithId]);
    setIsAddUserModalOpen(false);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(
      users.map((user) =>
        user.id === updatedUser.id
          ? { ...updatedUser, tags: generateUserTags(updatedUser) }
          : user
      )
    );
    setIsEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
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
                <svg
                  className="filter-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
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
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="rectangle" />
                  <div className="text-wrapper">{user.name}</div>
                  <div className="div">{user.role}</div>
                  <div className="text-wrapper-2">Department</div>
                  <div className="text-wrapper-3">{user.department}</div>
                  <div className="text-wrapper-4">{user.dateJoined}</div>
                  <div className="text-wrapper-5">Date Joined</div>
                  <div className="user-photo">
                    {user.profilePicture && (
                      <img src={user.profilePicture} alt={user.name} />
                    )}
                  </div>
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
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="list-photo">
                    {user.profilePicture && (
                      <img src={user.profilePicture} alt={user.name} />
                    )}
                  </div>
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
          <UserFormModal
            mode="add"
            onClose={() => setIsAddUserModalOpen(false)}
            onSave={handleAddUser}
          />
        )}

        {/* Edit User Modal */}
        {isEditUserModalOpen && selectedUser && (
          <UserFormModal
            mode="edit"
            user={selectedUser}
            onClose={() => {
              setIsEditUserModalOpen(false);
              setSelectedUser(null);
            }}
            onSave={handleEditUser}
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
        {selectedUser && !isEditUserModalOpen && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onEdit={() => setIsEditUserModalOpen(true)}
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

// Combined Add/Edit User Modal Component
const UserFormModal = ({ mode = "add", user = null, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    user || {
      name: "",
      email: "",
      idNumber: "",
      profilePicture: null,
      gender: "",
      contactNumber: "",
      dateOfBirth: "",
      role: "",
      department: "",
      status: "",
      dateJoined: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    }
  );

  const [errors, setErrors] = useState({});

  // Base64 conversion helper
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Format phone number for Philippine format (0XXX XXX XXXX)
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7)
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
      7,
      11
    )}`;
  };

  // Validate date format and logic
  const isValidDate = (dateString) => {
    if (!dateString || dateString.length !== 10) return false;

    const [month, day, year] = dateString.split("/").map(Number);

    if (!month || !day || !year) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;

    // Check day range based on month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    // Check if date is not in the future
    const inputDate = new Date(year, month - 1, day);
    if (inputDate > new Date()) return false;

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "profilePicture" && e.target.files[0]) {
      const file = e.target.files[0];
      toBase64(file).then((base64) => {
        setFormData((prev) => ({ ...prev, profilePicture: base64 }));
      });
    } else if (name === "dateOfBirth") {
      const cleaned = value.replace(/\D/g, "");
      const month = cleaned.slice(0, 2);
      const day = cleaned.slice(2, 4);
      const year = cleaned.slice(4, 8);

      let formattedDate = month;
      if (cleaned.length > 2) {
        formattedDate += "/" + day;
      }
      if (cleaned.length > 4) {
        formattedDate += "/" + year;
      }

      setFormData((prev) => ({ ...prev, [name]: formattedDate }));
    } else if (name === "contactNumber") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.idNumber.trim()) newErrors.idNumber = "ID Number is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (formData.dateOfBirth && !isValidDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Invalid date. Use MM/DD/YYYY format.";
    }

    if (
      formData.contactNumber &&
      formData.contactNumber.replace(/\D/g, "").length !== 11
    ) {
      newErrors.contactNumber = "Contact number must be 11 digits";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    } else {
      setErrors(newErrors);
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

        <h2 className="modal-title">
          {mode === "add" ? "Add New User" : "Edit User"}
        </h2>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group-centered">
            <label
              htmlFor="profilePictureInput"
              className="circular-upload-area"
            >
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile Preview"
                  className="profile-image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <span>Upload your profile here</span>
                </div>
              )}
            </label>
            <input
              id="profilePictureInput"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Enter full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className={`form-input ${errors.idNumber ? "error" : ""}`}
              placeholder="Enter ID number"
            />
            {errors.idNumber && (
              <span className="error-text">{errors.idNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={`form-input ${errors.contactNumber ? "error" : ""}`}
              placeholder="0XXX XXX XXXX"
              maxLength="13"
            />
            {errors.contactNumber && (
              <span className="error-text">{errors.contactNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="text"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`form-input ${errors.dateOfBirth ? "error" : ""}`}
              placeholder="MM/DD/YYYY"
              maxLength="10"
            />
            {errors.dateOfBirth && (
              <span className="error-text">{errors.dateOfBirth}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`form-select ${errors.role ? "error" : ""}`}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="Faculty Member">Faculty Member</option>
              <option value="Department Head">Department Head</option>
              <option value="Staff">Staff</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-input ${errors.department ? "error" : ""}`}
              placeholder="Enter department"
            />
            {errors.department && (
              <span className="error-text">{errors.department}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`form-select ${errors.gender ? "error" : ""}`}
            >
              <option value="" disabled>
                Select a gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <span className="error-text">{errors.gender}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`form-select ${errors.status ? "error" : ""}`}
            >
              <option value="" disabled>
                Select a status
              </option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <span className="error-text">{errors.status}</span>
            )}
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
            {mode === "add" ? "Save User" : "Update User"}
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

// User Details Modal Component with Edit Button
const UserDetailsModal = ({ user, onClose, onEdit, onDelete }) => {
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
            {user.profilePicture && (
              <img src={user.profilePicture} alt={user.name} />
            )}
          </div>
          <h2 className="user-details-name">{user.name}</h2>
          <p className="user-details-role">{user.role}</p>
        </div>

        <div className="user-details-info">
          <div className="info-row">
            <span className="info-label">ID Number</span>
            <span className="info-value">{user.idNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Department</span>
            <span className="info-value">{user.department}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date Joined</span>
            <span className="info-value">{user.dateJoined}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Gender</span>
            <span className="info-value">{user.gender}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Contact Number</span>
            <span className="info-value">{user.contactNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date of Birth</span>
            <span className="info-value">{user.dateOfBirth}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className={`info-value status-badge ${user.status}`}>
              {user.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="user-details-actions">
          <button className="edit-user-button" onClick={onEdit}>
            Edit User
          </button>
          <button className="delete-user-button" onClick={handleDelete}>
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};
