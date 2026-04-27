import React, { useState, useEffect } from "react";
import { SidePanel } from "../components/SidePanel";
import "../DeptHeadPage/ReportsPage/ReportsPage.css";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { GlobalSearch } from "../components/GlobalSearch/GlobalSearch";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { useAuth } from "../components/Modal/AuthContext";
import { reportsAPI, filesAPI, categoriesAPI } from "../services/api";
import { Modal } from "../components/Modal/Modal";

const normalizeId = (value) =>
  value === null || value === undefined ? null : String(value);

const belongsToUser = (request, currentUser) => {
  const requestUserIds = [request?.userId, request?.user?.userId, request?.user?.id]
    .map(normalizeId)
    .filter(Boolean);
  const currentUserIds = [currentUser?.userId, currentUser?.id]
    .map(normalizeId)
    .filter(Boolean);

  return currentUserIds.some((userId) => requestUserIds.includes(userId));
};

const isReturnedRequest = (request) =>
  ["RETURNED", "COMPLETED"].includes(request?.status) || Boolean(request?.returnedAt);

const isBorrowedRequest = (request) =>
  !isReturnedRequest(request) && request?.status === "BORROWED";

const getRequestDate = (activeTab, row) => {
  if (activeTab === "returned") {
    return row.returnedAt || row.updatedAt || row.createdAt;
  }

  if (activeTab === "borrowed") {
    return row.borrowedAt || row.approvedAt || row.updatedAt || row.createdAt;
  }

  return row.createdAt || row.updatedAt;
};

const getFileName = (row) =>
  row.file?.filename || row.file?.name || row.title || "N/A";

const getCopyType = (row) =>
  row.description?.includes("Soft Copy Only") ? "Soft Copy" : "Hard Copy";

const getStatusClass = (status) =>
  status ? `status-${status.toLowerCase()}` : "status-pending";

const getStatusLabel = (status) => status || "Unknown";

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [reportsData, setReportsData] = useState({
    request: [],
    borrowed: [],
    returned: [],
    validityDue: [],
  });
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransactionForDetails, setSelectedTransactionForDetails] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showCabinetReminder, setShowCabinetReminder] = useState(false);
  const [deletedFileName, setDeletedFileName] = useState("");
  const { notifications, unreadCount } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user?.userId && !user?.id) {
          setLoading(false);
          return;
        }

        const response = await requestsAPI.getAll();
        const requests = Array.isArray(response.data.requests)
          ? response.data.requests
          : Array.isArray(response.data)
            ? response.data
            : [];

        const userRequests = requests
          .filter((request) => request?.status !== "CANCELLED")
          .filter((request) => belongsToUser(request, user));

        setReportsData({
          request: userRequests.filter(
            (request) => !isBorrowedRequest(request) && !isReturnedRequest(request)
          ),
          borrowed: userRequests.filter((request) => isBorrowedRequest(request)),
          returned: userRequests.filter((request) => isReturnedRequest(request)),
        });
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setReportsData({
          request: [],
          borrowed: [],
          returned: [],
          validityDue: [],
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchValidityFiles = async () => {
      try {
        // Fetch all files and all folders (categories) in parallel
        const [filesResponse, foldersResponse] = await Promise.all([
          filesAPI.getAll(),
          categoriesAPI.getAll(),
        ]);

        const allFiles = Array.isArray(filesResponse.data?.files)
          ? filesResponse.data.files
          : Array.isArray(filesResponse.data)
            ? filesResponse.data
            : [];

        const allFolders = Array.isArray(foldersResponse.data?.categories)
          ? foldersResponse.data.categories
          : Array.isArray(foldersResponse.data)
            ? foldersResponse.data
            : [];

        // Build a map of folder ID -> folder name
        const folderMap = {};
        allFolders.forEach((folder) => {
          folderMap[folder.id] = folder.name;
        });

        // Read validity dates from localStorage (since backend doesn't store them)
        let validityMap = {};
        try {
          validityMap = JSON.parse(localStorage.getItem('fileValidityMap') || '{}');
        } catch {
          validityMap = {};
        }

        // Merge localStorage validity dates and resolve folder names
        const filesWithValidity = allFiles
          .map((f) => ({
            ...f,
            validUntil: f.validUntil || validityMap[f.id] || null,
            folderName: folderMap[f.categoryId] || folderMap[f.category_id] || null,
          }))
          .filter((f) => f.validUntil)
          .sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));

        setReportsData((prev) => ({
          ...prev,
          validityDue: filesWithValidity,
        }));
      } catch (error) {
        console.error("Failed to fetch files for validity:", error);
      }
    };

    fetchReports();
    fetchValidityFiles();
  }, [user]);

  const handleExport = () => {
    if (activeTab === "validityDue") {
      const data = Array.isArray(reportsData.validityDue) ? reportsData.validityDue : [];
      const headers = ["File ID", "File Name", "Department", "Category", "Valid Until", "Status"];
      let csv = headers.join(",") + "\n";
      const now = new Date();
      data.forEach((file) => {
        const validDate = new Date(file.validUntil);
        const daysLeft = Math.ceil((validDate - now) / (1000 * 60 * 60 * 24));
        const status = daysLeft < 0 ? "Expired" : daysLeft <= 30 ? "Due Soon" : "Valid";
        const values = [
          file.id,
          file.filename || file.name || "N/A",
          file.user?.department || file.department || "N/A",
          file.category?.name || file.category || "N/A",
          new Date(file.validUntil).toLocaleDateString(),
          status,
        ];
        csv += values.join(",") + "\n";
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `validity_due_report_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      return;
    }

    const data = Array.isArray(reportsData[activeTab])
      ? reportsData[activeTab]
      : [];
    const headers =
      activeTab === "request"
        ? ["Request ID", "File Name", "Date Submitted", "Status"]
        : [
            "Request ID",
            "File Name",
            `Date ${activeTab === "borrowed" ? "Borrowed" : "Returned"}`,
          ];

    let csv = headers.join(",") + "\n";
    data.forEach((row) => {
      const dateField = getRequestDate(activeTab, row);
      const values = [
        row.id,
        getFileName(row),
        dateField ? new Date(dateField).toLocaleDateString() : "N/A",
        ...(activeTab === "request" ? [row.status || "N/A"] : []),
      ];
      csv += values.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  const handleShowDetails = (transaction) => {
    setSelectedTransactionForDetails(transaction);
    setShowDetailsModal(true);
  };

  const handleDeleteValidityFile = async () => {
    if (!fileToDelete) return;
    const fileName = fileToDelete.filename || fileToDelete.name || 'the file';
    const folderName = fileToDelete.category?.name || '';
    try {
      await filesAPI.delete(fileToDelete.id);
      // Remove from localStorage validity map
      try {
        const map = JSON.parse(localStorage.getItem('fileValidityMap') || '{}');
        delete map[fileToDelete.id];
        localStorage.setItem('fileValidityMap', JSON.stringify(map));
      } catch {}
      // Remove from local state
      setReportsData((prev) => ({
        ...prev,
        validityDue: prev.validityDue.filter((f) => f.id !== fileToDelete.id),
      }));
      setShowDeleteModal(false);
      setFileToDelete(null);
      // Show cabinet reminder
      setDeletedFileName(folderName ? `"${fileName}" from folder "${folderName}"` : `"${fileName}"`);
      setShowCabinetReminder(true);
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert(error.message || "Failed to delete file");
    }
  };

  const renderValidityTable = () => {
    const data = Array.isArray(reportsData.validityDue) ? reportsData.validityDue : [];
    const now = new Date();

    if (loading) {
      return (
        <div className="table-container">
          <p>Loading...</p>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="table-container">
          <p>No files with validity dates found.</p>
        </div>
      );
    }

    return (
      <div className="table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>File ID</th>
                <th>File Name</th>
                <th>Folder</th>
                <th>Department</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((file, index) => {
                const validDate = new Date(file.validUntil);
                const daysLeft = Math.ceil((validDate - now) / (1000 * 60 * 60 * 24));
                let statusClass = "status-valid";
                let statusText = "Valid";
                if (daysLeft < 0) {
                  statusClass = "status-expired";
                  statusText = "Expired";
                } else if (daysLeft <= 30) {
                  statusClass = "status-due-soon";
                  statusText = `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
                }

                return (
                  <tr key={index}>
                    <td data-label="File ID">{file.id}</td>
                    <td data-label="File Name">{file.filename || file.name || "N/A"}</td>
                    <td data-label="Folder">{file.folderName || "N/A"}</td>
                    <td data-label="Department">{file.user?.department || file.department || "N/A"}</td>
                    <td data-label="Valid Until">{validDate.toLocaleDateString()}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td data-label="Action">
                      <button
                        className="status-badge status-expired"
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileToDelete(file);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    const data = Array.isArray(reportsData[activeTab])
      ? reportsData[activeTab]
      : [];

    if (loading) {
      return (
        <div className="table-container">
          <p>Loading...</p>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="table-container">
          <p>No {activeTab} records found.</p>
        </div>
      );
    }

    return (
      <div className="table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>File Name</th>
                <th>
                  Date{" "}
                  {activeTab === "borrowed"
                    ? "Borrowed"
                    : activeTab === "returned"
                    ? "Returned"
                    : "Submitted"}
                </th>
                {activeTab === "request" && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const dateField = getRequestDate(activeTab, row);
                return (
                  <tr
                    key={row.id}
                    onClick={() => handleShowDetails(row)}
                    style={{ cursor: "pointer" }}
                  >
                    <td data-label="Request ID">{row.id}</td>
                    <td data-label="File Name">{getFileName(row)}</td>
                    <td
                      data-label={`Date ${
                        activeTab === "borrowed"
                          ? "Borrowed"
                          : activeTab === "returned"
                          ? "Returned"
                          : "Submitted"
                      }`}
                    >
                      {dateField ? new Date(dateField).toLocaleDateString() : "N/A"}
                    </td>
                    {activeTab === "request" && (
                      <td data-label="Status">
                        <span className={`status-badge ${getStatusClass(row.status)}`}>
                          {getStatusLabel(row.status)}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <SidePanel />
      <div className="page-content-wrapper">
        <div className="reports-main-content">
          <header className="reports-header">
            <div className="welcome-message">
              <h1 className="text-wrapper-77">Report & Log</h1>
            </div>
            <div className="header-actions">
              <div className="search-wrapper">
                <GlobalSearch />
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

          <div className="content-card">
            <div className="tabs-header">
              <div className="tabs-container">
                <button
                  className={`tab ${activeTab === "request" ? "active" : ""}`}
                  onClick={() => setActiveTab("request")}
                >
                  Request
                </button>
                <button
                  className={`tab ${activeTab === "borrowed" ? "active" : ""}`}
                  onClick={() => setActiveTab("borrowed")}
                >
                  Borrowed
                </button>
                <button
                  className={`tab ${activeTab === "returned" ? "active" : ""}`}
                  onClick={() => setActiveTab("returned")}
                >
                  Returned
                </button>
                <button
                  className={`tab ${activeTab === "validityDue" ? "active" : ""}`}
                  onClick={() => setActiveTab("validityDue")}
                >
                  Validity Due
                </button>
              </div>
              <button className="export-button" onClick={handleExport}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export
              </button>
            </div>

            {activeTab === "validityDue" ? renderValidityTable() : renderTable()}
          </div>
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      </div>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Request Details"
      >
        {selectedTransactionForDetails && (
          <div className="request-details-modal-content">
            <div className="details-row">
              <span className="file-info-label">Request ID:</span>
              <span className="file-info-value">
                {selectedTransactionForDetails.id}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">File Name:</span>
              <span className="file-info-value">
                {getFileName(selectedTransactionForDetails)}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Request Status:</span>
              <span className="file-info-value">
                {getStatusLabel(selectedTransactionForDetails.status)}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Copy Type:</span>
              <span className="file-info-value">
                {getCopyType(selectedTransactionForDetails)}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Date Submitted:</span>
              <span className="file-info-value">
                {selectedTransactionForDetails.createdAt
                  ? new Date(selectedTransactionForDetails.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            {selectedTransactionForDetails.returnedAt && (
              <div className="details-row">
                <span className="file-info-label">Returned Date:</span>
                <span className="file-info-value">
                  {new Date(
                    selectedTransactionForDetails.returnedAt
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
            {selectedTransactionForDetails.notes && (
              <div className="details-row">
                <span className="file-info-label">Notes:</span>
                <span className="file-info-value purpose">
                  {selectedTransactionForDetails.notes}
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete File Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFileToDelete(null);
        }}
        title="Confirm Delete"
      >
        <p style={{
          fontFamily: 'Poppins, Helvetica',
          fontSize: '14px',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Are you sure you want to delete the file <strong>{fileToDelete?.filename || fileToDelete?.name || 'this file'}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setFileToDelete(null);
            }}
            style={{
              padding: '0.6rem 1.5rem',
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, Helvetica',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteValidityFile}
            style={{
              padding: '0.6rem 1.5rem',
              backgroundColor: '#dd0303',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, Helvetica',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Cabinet Reminder Modal */}
      <Modal
        isOpen={showCabinetReminder}
        onClose={() => setShowCabinetReminder(false)}
        title="File Deleted Successfully"
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#fff3cd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '28px',
          }}>
            ⚠️
          </div>
          <p style={{
            fontFamily: 'Poppins, Helvetica',
            fontSize: '14px',
            marginBottom: '0.5rem',
            color: '#333',
          }}>
            The file {deletedFileName} has been deleted from the system.
          </p>
          <p style={{
            fontFamily: 'Poppins, Helvetica',
            fontSize: '15px',
            fontWeight: '600',
            color: '#800000',
            marginBottom: '1.5rem',
          }}>
            📁 Please remember to remove the physical file from the cabinet.
          </p>
          <button
            onClick={() => setShowCabinetReminder(false)}
            style={{
              padding: '0.7rem 2.5rem',
              backgroundColor: '#800000',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Poppins, Helvetica',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#a00000'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#800000'}
          >
            Got it
          </button>
        </div>
      </Modal>
    </>
  );
};
