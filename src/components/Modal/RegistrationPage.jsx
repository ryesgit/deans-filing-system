import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./RegistrationPage.css";

export const RegistrationPage = ({ onClose }) => {
  const { register, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pupId: "",
    contactNumber: "",
    dob: "",
    gender: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    } else if (!/^\+639\d{9}$/.test(formData.contactNumber.replace(/\s/g, ""))) {
      newErrors.contactNumber =
        "Please enter a valid Philippine mobile number (e.g., +63 9XX XXX XXXX)";
    }
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) clearError();

    if (name === "contactNumber") {
      let numericValue = value.replace(/[^0-9+]/g, "");

      // Auto-add +63 if user starts typing a number
      if (numericValue && !numericValue.startsWith("+")) {
        if (numericValue.startsWith("63")) {
          numericValue = "+" + numericValue;
        } else if (numericValue.startsWith("9")) {
          numericValue = "+63" + numericValue;
        } else if (numericValue.startsWith("0")) {
          numericValue = "+63" + numericValue.substring(1);
        } else {
          numericValue = "+63" + numericValue;
        }
      }

      // Format: +63 9XX XXX XXXX
      if (numericValue.startsWith("+63")) {
        const digits = numericValue.substring(3);
        if (digits.length <= 3) {
          numericValue = "+63 " + digits;
        } else if (digits.length <= 6) {
          numericValue = "+63 " + digits.slice(0, 3) + " " + digits.slice(3);
        } else {
          numericValue = "+63 " + digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6, 10);
        }
      }

      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const registrationData = {
      userId: formData.pupId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      contactNumber: formData.contactNumber,
      dateOfBirth: formData.dob,
      gender: formData.gender,
      role: formData.role,
      department: formData.department,
    };

    const result = await register(registrationData);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onClose();
      }, 3000);
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
      {error && (
        <div className="registration-error" role="alert">
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="registration-success" role="alert">
          <span>{successMessage}</span>
        </div>
      )}

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
              inputMode="tel"
              maxLength="17"
              placeholder="+63 9XX XXX XXXX"
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
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
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

          <div className="form-group full-width">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "invalid" : ""}
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "invalid" : ""}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};
