import React, { useState, useMemo, useEffect } from "react";
import "../DeptHeadPage/UserManagementPage/UserManagement.css";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { usersAPI } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch users from API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersAPI.getAll();
        const usersData = response.data.users || response.data;
        const mappedUsers = Array.isArray(usersData)
          ? usersData.map((user) => ({
              id: user.id,
              userId: user.userId,
              name: user.name,
              username: user.username,
              email: user.email,
              idNumber: user.idNumber,
              contactNumber: user.contactNumber,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
              profilePicture: user.avatar ? `${API_BASE_URL}${user.avatar}` : user.profilePicture,
              role: user.role,
              department: user.department || "N/A",
              status: user.status,
              dateJoined: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A",
              tags: [
                user.status === "ACTIVE" ? "active" : "inactive",
                user.role === "FACULTY" ? "faculty" : null,
                user.role === "ADMIN" ? "head" : null,
                user.role === "STAFF" ? "head" : null,
              ].filter(Boolean),
            }))
          : [];
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!filterOptions.showAll) {
      // Apply filters with AND logic - all selected filters must match
      if (filterOptions.showActive) {
        filtered = filtered.filter((user) => user.status === "ACTIVE");
      }
      if (filterOptions.showFaculty) {
        filtered = filtered.filter((user) => user.role === "FACULTY");
      }
      if (filterOptions.showHeads) {
        filtered = filtered.filter(
          (user) => user.role === "ADMIN" || user.role === "STAFF"
        );
      }
    }

    if (filterOptions.department !== "all") {
      filtered = filtered.filter(
        (user) => user.department === filterOptions.department
      );
    }

    return filtered;
  }, [users, filterOptions, searchTerm]);

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
      const userData = {
        userId: `USER${Date.now()}`,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email || null,
        idNumber: newUser.idNumber || null,
        contactNumber: newUser.contactNumber || null,
        dateOfBirth: newUser.dateOfBirth || null,
        gender: newUser.gender || null,
        profilePicture: newUser.profilePicture || null,
        password: "password123",
        role: newUser.role,
        department: newUser.department,
        status: newUser.status === "active" ? "ACTIVE" : "INACTIVE",
      };

      const response = await usersAPI.create(userData);
      const createdUser = response.data.user || response.data;

      const mappedUser = {
        id: createdUser.id,
        userId: createdUser.userId,
        name: createdUser.name,
        username: createdUser.username,
        email: createdUser.email,
        idNumber: createdUser.idNumber,
        contactNumber: createdUser.contactNumber,
        dateOfBirth: createdUser.dateOfBirth,
        gender: createdUser.gender,
        profilePicture: createdUser.avatar ? `${API_BASE_URL}${createdUser.avatar}` : createdUser.profilePicture,
        role: createdUser.role,
        department: createdUser.department || "N/A",
        status: createdUser.status,
        dateJoined: createdUser.createdAt
          ? new Date(createdUser.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
        tags: [
          createdUser.status === "ACTIVE" ? "active" : "inactive",
          createdUser.role === "FACULTY" ? "faculty" : null,
          createdUser.role === "ADMIN" ? "head" : null,
          createdUser.role === "STAFF" ? "head" : null,
        ].filter(Boolean),
      };

      setUsers([...users, mappedUser]);
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error("Failed to add user:", error);
      alert(error.message || "Failed to add user");
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const userData = {
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email || null,
        idNumber: updatedUser.idNumber || null,
        contactNumber: updatedUser.contactNumber || null,
        dateOfBirth: updatedUser.dateOfBirth || null,
        gender: updatedUser.gender || null,
        profilePicture: updatedUser.profilePicture || null,
        role: updatedUser.role,
        department: updatedUser.department,
        status: updatedUser.status === "active" ? "ACTIVE" : "INACTIVE",
      };

      const response = await usersAPI.update(selectedUser.id, userData);
      const editedUser = response.data.user || response.data;

      const mappedUser = {
        id: editedUser.id,
        userId: editedUser.userId,
        name: editedUser.name,
        username: editedUser.username,
        email: editedUser.email,
        idNumber: editedUser.idNumber,
        contactNumber: editedUser.contactNumber,
        dateOfBirth: editedUser.dateOfBirth,
        gender: editedUser.gender,
        profilePicture: editedUser.avatar ? `${API_BASE_URL}${editedUser.avatar}` : editedUser.profilePicture,
        role: editedUser.role,
        department: editedUser.department || "N/A",
        status: editedUser.status,
        dateJoined: editedUser.createdAt
          ? new Date(editedUser.createdAt).toLocaleDateString()
          : updatedUser.dateJoined,
        tags: [
          editedUser.status === "ACTIVE" ? "active" : "inactive",
          editedUser.role === "FACULTY" ? "faculty" : null,
          editedUser.role === "ADMIN" ? "head" : null,
          editedUser.role === "STAFF" ? "head" : null,
        ].filter(Boolean),
      };

      setUsers(
        users.map((user) => (user.id === editedUser.id ? mappedUser : user))
      );
      setIsEditUserModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to edit user:", error);
      alert(error.message || "Failed to edit user");
    }
  };

  const handleDeleteUser = async (userIdToDelete) => {
    try {
      await usersAPI.delete(userIdToDelete);
      setUsers(users.filter((user) => user.userId !== userIdToDelete));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(error.message || "Failed to delete user");
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
                  <div className="user-datejoined">{user.dateJoined}</div>
                  <div className="Date-joined">Date Joined</div>
                  <div className="user-photo">
                    {user.profilePicture && (
                      <img src={user.profilePicture} alt={user.name} />
                    )}
                  </div>
                  <div
                    className={`status ${
                      user.status === "ACTIVE" ? "active" : "inactive"
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
                      user.status === "ACTIVE" ? "active" : "inactive"
                    }`}
                  />
                  <div className="list-content">
                    <div className="list-name">{user.name}</div>
                    <div className="list-details">
                      <span className="list-role">{user.role}</span>
                      <span className="list-separator">•</span>
                      <span className="list-department">{user.department}</span>
                      <span className="list-separator">•</span>
                      <span
                        className={`list-status-text ${
                          user.status === "ACTIVE" ? "active" : "inactive"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Active" : "Inactive"}
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
            departments={departments}
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
            departments={departments}
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

// Helper functions
const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
    7,
    11
  )}`;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

// User Form Modal Component (for both add and edit)
const UserFormModal = ({
  mode = "add",
  user = null,
  onClose,
  onSave,
  departments = [],
}) => {
  const [formData, setFormData] = useState(
    mode === "edit" && user
      ? {
          username: user.username || "",
          name: user.name || "",
          email: user.email || "",
          idNumber: user.idNumber || "",
          contactNumber: user.contactNumber || "",
          dateOfBirth: formatDateForInput(user.dateOfBirth),
          gender: user.gender || "",
          role: user.role || "FACULTY",
          department: user.department || "",
          status: user.status === "ACTIVE" ? "active" : "inactive",
          dateJoined:
            user.dateJoined ||
            new Date().toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }),
          profilePicture: user.profilePicture || "",
        }
      : {
          username: "",
          name: "",
          email: "",
          idNumber: "",
          contactNumber: "",
          dateOfBirth: "",
          gender: "",
          role: "FACULTY",
          department: "",
          status: "active",
          dateJoined: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          profilePicture: "",
        }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "profilePicture" && e.target.files[0]) {
      const file = e.target.files[0];
      toBase64(file).then((base64) => {
        setFormData((prev) => ({ ...prev, profilePicture: base64 }));
      });
    } else if (name === "contactNumber") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.status) newErrors.status = "Status is required";

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
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? "error" : ""}`}
              placeholder="Enter username"
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
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
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`form-input ${errors.dateOfBirth ? "error" : ""}`}
            />
            {errors.dateOfBirth && (
              <span className="error-text">{errors.dateOfBirth}</span>
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
              <option value="">Select a gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <span className="error-text">{errors.gender}</span>
            )}
          </div>

          {mode === "add" && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input">
                Default password will be auto-generated.
              </div>
            </div>
          )}

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
              <option value="FACULTY">Faculty Member</option>
              <option value="ADMIN">Department Head</option>
              <option value="STAFF">Staff</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`form-select ${errors.department ? "error" : ""}`}
            >
              <option value="" disabled>
                Select a department
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <span className="error-text">{errors.department}</span>
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
      onDelete(user.userId);
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
            <span className="info-label">Username</span>
            <span className="info-value">{user.username}</span>
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
            <span
              className={`info-value status-badge ${
                user.status === "ACTIVE" ? "active" : "inactive"
              }`}
            >
              {user.status === "ACTIVE"
                ? "Active"
                : user.status === "INACTIVE"
                ? "Inactive"
                : user.status}
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
