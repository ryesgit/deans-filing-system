import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import FileSearchInput from "../components/FileSearchInput";
import "../DeptHeadPage/RequestPage/RequestPage.css";
import "../DeptHeadPage/DashboardPage/style.css";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { requestsAPI } from "../services/api";
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div
        className="confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="confirm-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="confirm-modal-title">{title}</h2>
        <div className="confirm-modal-body">{children}</div>
        <div className="confirm-modal-actions">
          <button
            className="confirm-modal-btn confirm-modal-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="confirm-modal-btn confirm-modal-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const QRModal = ({ isOpen, onClose, qrValue, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="qr-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="qr-modal-title">Your QR Code</h2>
        <div className="qr-modal-code">
          <QRCodeSVG value={qrValue} size={300} level="H" />
        </div>
        <p className="qr-modal-user">{userName}</p>
      </div>
    </div>
  );
};

const FormCard = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fileName: "",
    department: "",
    fileCategory: "",
    purpose: "",
    copyType: "soft",
    returnDate: "",
    priority: "",
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const departments = [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Arts and Sciences",
    "Medical",
  ];

  const categories = [
    "Thesis",
    "Capstone",
    "Research",
    "Administrative",
    "Research Papers",
    "Reports",
    "Guidelines",
    "Handbooks",
    "Grant Documents",
  ];

  const priorities = ["Low", "Medium", "High"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (fileInfo) => {
    setFormData((prev) => ({
      ...prev,
      fileName: fileInfo.fileName,
      department: fileInfo.department || "",
      fileCategory: fileInfo.fileCategory || "",
    }));
  };

  const handleCopyTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      copyType: type,
      returnDate: type === "soft" ? "" : prev.returnDate,
      priority: type === "soft" ? "" : prev.priority,
    }));
  };

  const handleSubmitClick = () => {
    if (
      !formData.fileName ||
      !formData.department ||
      !formData.fileCategory ||
      !formData.purpose
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      formData.copyType === "original" &&
      (!formData.returnDate || !formData.priority)
    ) {
      alert(
        "Please select return date and priority for original copy requests"
      );
      return;
    }

    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    const requestData = {
      fileName: formData.fileName,
      department: formData.department,
      category: formData.fileCategory,
      purpose: formData.purpose,
      copyType: formData.copyType,
      returnDate: formData.copyType === "original" ? formData.returnDate : null,
      priority: formData.priority,
    };

    try {
      const response = await requestsAPI.create(requestData);
      onSubmit(response.data);
      setShowSubmitModal(false);
      handleClear();
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert(error.message || 'Failed to submit request');
      setShowSubmitModal(false);
    }
  };

  const handleClearClick = () => {
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    setFormData({
      fileName: "",
      department: "",
      fileCategory: "",
      purpose: "",
      copyType: "soft",
      returnDate: "",
      priority: "",
    });
    setShowClearModal(false);
  };

  const handleClear = () => {
    setFormData({
      fileName: "",
      department: "",
      fileCategory: "",
      purpose: "",
      copyType: "soft",
      returnDate: "",
      priority: "",
    });
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Request Form</h2>

      <div className="form-row-three">
        <div className="form-field">
          <FileSearchInput
            value={formData.fileName}
            onChange={(value) => handleChange("fileName", value)}
            onFileSelect={handleFileSelect}
          />
        </div>

        <div className="form-field">
          <select
            className="form-select"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
          >
            <option value="">Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <select
            className="form-select"
            value={formData.fileCategory}
            onChange={(e) => handleChange("fileCategory", e.target.value)}
          >
            <option value="">File Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="copy-type-section">
          <label className="copy-type-label">Copy Type</label>
          <div className="copy-type-buttons">
            <label
              className={`copy-type-label-btn ${
                formData.copyType === "soft" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="copyType"
                className="copy-type-btn"
                checked={formData.copyType === "soft"}
                onChange={() => handleCopyTypeChange("soft")}
              />
              Soft Copy Only
            </label>
            <label
              className={`copy-type-label-btn ${
                formData.copyType === "original" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="copyType"
                className="copy-type-btn"
                checked={formData.copyType === "original"}
                onChange={() => handleCopyTypeChange("original")}
              />
              Original Copy
            </label>
          </div>
        </div>
      </div>

      {formData.copyType === "original" && (
        <div className="form-row-two">
          <div className="form-field">
            <label className="copy-type-label">Return Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.returnDate}
              onChange={(e) => handleChange("returnDate", e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="form-field">
            <label className="copy-type-label">Priority</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option value="">Select Priority</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-field-full">
          <textarea
            className="form-textarea"
            placeholder="Purpose"
            value={formData.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            rows="4"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-clear" onClick={handleClearClick} type="button">
          Clear
        </button>
        <button
          className="btn-submit"
          onClick={handleSubmitClick}
          type="button"
        >
          Submit
        </button>
      </div>

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Request Submission"
        confirmText="Confirm"
        cancelText="Cancel"
      >
        <div className="confirm-detail-row">
          <span className="confirm-detail-label">File Name:</span>
          <span className="confirm-detail-value">{formData.fileName}</span>
        </div>
        <div className="confirm-detail-row">
          <span className="confirm-detail-label">Department:</span>
          <span className="confirm-detail-value">{formData.department}</span>
        </div>
        <div className="confirm-detail-row">
          <span className="confirm-detail-label">File Category:</span>
          <span className="confirm-detail-value">{formData.fileCategory}</span>
        </div>
        <div className="confirm-detail-row">
          <span className="confirm-detail-label">Purpose:</span>
          <span className="confirm-detail-value">{formData.purpose}</span>
        </div>
        <div className="confirm-detail-row">
          <span className="confirm-detail-label">Copy Type:</span>
          <span className="confirm-detail-value">
            {formData.copyType === "soft" ? "Soft Copy Only" : "Original Copy"}
          </span>
        </div>
        {formData.copyType === "original" && (
          <>
            <div className="confirm-detail-row">
              <span className="confirm-detail-label">Return Date:</span>
              <span className="confirm-detail-value">
                {formData.returnDate
                  ? format(new Date(formData.returnDate), "MM/dd/yyyy")
                  : "Not set"}
              </span>
            </div>
            <div className="confirm-detail-row">
              <span className="confirm-detail-label">Priority:</span>
              <span className="confirm-detail-value">{formData.priority}</span>
            </div>
          </>
        )}
      </ConfirmModal>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        title="Clear Form?"
        confirmText="Yes, Clear Form"
        cancelText="Cancel"
      >
        <p className="confirm-modal-message">
          Are you sure you want to clear all fields?
        </p>
      </ConfirmModal>
    </div>
  );
};

const QRCard = ({
  userName = "John Doe",
  userId = "USER-001",
  filesAssigned = 0,
  filesToReturn = 0,
  onQRCodeClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qrValue = `USER:${userId}|NAME:${userName}`;

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${userId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="qr-card">
      <h3 className="qr-card-title">Your QR Code</h3>
      <div
        className="qr-code-wrapper"
        onClick={onQRCodeClick}
        title="Click to enlarge"
      >
        <QRCodeSVG
          id="qr-code-svg"
          value={qrValue}
          size={180}
          level="H"
          className="qr-code-svg"
        />
      </div>
      <button className="qr-btn qr-btn-download" onClick={handleDownload}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.66669 6.66669L8.00002 10L11.3334 6.66669"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 10V2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download
      </button>

      <div className="qr-file-stats">
        <div className="qr-file-stat-item">
          <span className="qr-file-stat-label">Files Assigned:</span>
          <span className="qr-file-stat-value">{filesAssigned}</span>
        </div>
        <div className="qr-file-stat-item">
          <span className="qr-file-stat-label">Files to be Returned:</span>
          <span className="qr-file-stat-value">{filesToReturn}</span>
        </div>
      </div>
    </div>
  );
};

const RequestCard = ({ requests = [] }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      Pending: "status-pending",
      Approved: "status-approved",
      Borrowed: "status-borrowed",
      Returned: "status-returned",
      Declined: "status-declined",
      "View PDF": "status-view-pdf",
    };
    return statusMap[status] || "status-pending";
  };

  const handleStatusClick = (request) => {
    if (request.status === "View PDF") {
      alert(
        `Opening PDF: ${request.fileName}\n\nIn a real application, this would open the PDF viewer.`
      );
    }
  };

  return (
    <div className="request-card">
      <h3 className="request-card-title">Request Status</h3>
      <div className="table-container">
        <table className="request-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>File Name</th>
              <th>Date Requested</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-requests-row">
                  No requests yet. Submit a request to get started!
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="table-row">
                  <td>{request.id}</td>
                  <td className="file-name-cell" title={request.fileName}>
                    {request.fileName}
                  </td>
                  <td>{request.dateRequested}</td>
                  <td>{request.returnDue}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        request.status
                      )}`}
                      onClick={() => handleStatusClick(request)}
                      style={{
                        cursor:
                          request.status === "View PDF" ? "pointer" : "default",
                      }}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const { notifications, unreadCount } = useNotifications();

  // Fetch requests from API on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestsAPI.getAll();
        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmitRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const filesAssigned = requests.filter(
    (req) =>
      (req.status === "Approved" || req.status === "Borrowed") &&
      req.copyType === "original"
  ).length;

  const filesToReturn = requests.filter(
    (req) => req.status === "Borrowed"
  ).length;

  return (
    <>
      <SidePanel />
      <div className="page-content-wrapper">
        <div className="request-page-main-content request-page">
          <header className="request-header">
            <div className="welcome-message">
              <h1 className="text-wrapper-77">Request a File</h1>
            </div>
            <div className="header-actions">
              <div className="search-wrapper">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="search-form"
                >
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
                    placeholder="Search Requests..."
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
          <div className="request-page-container">
            <FormCard onSubmit={handleSubmitRequest} />
            <QRCard
              userName="John Doe"
              userId="USER-001"
              filesAssigned={filesAssigned}
              filesToReturn={filesToReturn}
              onQRCodeClick={() => setIsQRModalOpen(true)}
            />
            <RequestCard requests={requests} />
          </div>
          <QRModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            qrValue={`USER:USER-001|NAME:John Doe`}
            userName="John Doe"
          />
          <NotificationDropdown
            notifications={notifications}
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      </div>
    </>
  );
};
