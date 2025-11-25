import React, { useState } from "react";
import "./RegistrationPage.css";

export const RegistrationPage = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pupId: "",
    contactNumber: "",
    dob: "",
    gender: "",
    role: "",
    department: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.pupId) newErrors.pupId = "PUP ID is required";
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
    } else if (!/^09\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber =
        "Please enter a valid 11-digit mobile number (e.g., 09123456789)";
    }
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("Form Data Submitted:", formData);
      // Here you would typically call a registration API
      alert("Registration successful! Check the console for the form data.");
      onClose(); // Close modal on successful submission
    }
  };

  const departments = [
    "IT",
    "Engineering",
    "Business",
    "Education",
    "Arts and Sciences",
  ];

  return (
    <div className="registration-page">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "invalid" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "invalid" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="pupId">PUP ID</label>
            <input
              type="text"
              id="pupId"
              name="pupId"
              value={formData.pupId}
              onChange={handleChange}
              className={errors.pupId ? "invalid" : ""}
            />
            {errors.pupId && <span className="error-text">{errors.pupId}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              inputMode="numeric"
              maxLength="11"
              placeholder="09123456789"
              className={errors.contactNumber ? "invalid" : ""}
            />
            {errors.contactNumber && (
              <span className="error-text">{errors.contactNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={errors.dob ? "invalid" : ""}
            />
            {errors.dob && <span className="error-text">{errors.dob}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? "invalid" : ""}
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <span className="error-text">{errors.gender}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? "invalid" : ""}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? "invalid" : ""}
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
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
