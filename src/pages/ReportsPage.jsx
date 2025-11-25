import React, { useState, useEffect } from "react";
import { SidePanel } from "../components/SidePanel";
import "../DeptHeadPage/ReportsPage/ReportsPage.css";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { useAuth } from "../components/Modal/AuthContext";
import { requestsAPI, filesAPI } from "../services/api";
import { Modal } from "../components/Modal/Modal";

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [reportsData, setReportsData] = useState({
    request: [],
    borrowed: [],
    returned: [],
  });
  const [loading, setLoading] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequestForDetails, setSelectedRequestForDetails] =
    useState(null);
  const { notifications, unreadCount } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await requestsAPI.getAll();
        const data = Array.isArray(response.data.requests)
          ? response.data.requests
          : [];

        // Filter data based on user role
        // USER role should only see their own reports
        // ADMIN and STAFF can see all reports
        const userRole = user?.role?.toUpperCase();
        const filteredData =
          userRole === "ADMIN" || userRole === "STAFF" ? data : data;

        setReportsData({
          request: filteredData,
          borrowed: filteredData.filter((r) => r.status === "APPROVED"),
          returned: filteredData.filter((r) => r.status === "RETURNED"),
        });
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setReportsData({
          request: [],
          borrowed: [],
          returned: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleExport = () => {
    const data = Array.isArray(reportsData[activeTab])
      ? reportsData[activeTab]
      : [];
    const headers =
      activeTab === "request"
        ? [
            "Transaction ID",
            "Faculty Name",
            "Department",
            "File Name",
            "Date",
            "Status",
          ]
        : [
            "Transaction ID",
            "Faculty Name",
            "Department",
            "File Name",
            `Date ${activeTab === "borrowed" ? "Borrowed" : "Returned"}`,
          ];

    let csv = headers.join(",") + "\n";
    data.forEach((row) => {
      const values = [
        row.id,
        row.user?.name || "N/A",
        row.user?.department || "N/A",
        row.title,
        new Date(row.createdAt).toLocaleDateString(),
        ...(activeTab === "request" ? [row.status] : []),
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

  // Check if request is for soft copy based on description
  const isSoftCopy = (description) => {
    return description?.includes("Soft Copy Only");
  };

  // Handle View PDF click
  const handleViewPDF = async (request) => {
    if (!request.fileId) {
      alert("File not available. Please contact support.");
      return;
    }

    setSelectedRequest(request);
    setShowPDFModal(true);
    setPdfLoading(true);
    setPdfUrl(null);

    try {
      const response = await filesAPI.download(request.fileId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Failed to load PDF:", error);
      alert("Failed to load PDF. Please try again or contact support.");
    } finally {
      setPdfLoading(false);
    }
  };

  // Clean up PDF URL when modal closes
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleShowDetails = (request, e) => {
    // Prevent modal from opening when clicking on elements with their own onClick
    if (e.target.closest(".status-badge")) {
      return;
    }

    setSelectedRequestForDetails(request);
    setShowDetailsModal(true);
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
                <th>Transaction ID</th>
                <th>Faculty Name</th>
                <th>Department</th>
                <th>File Name</th>
                <th>
                  Date{" "}
                  {activeTab === "borrowed"
                    ? "Borrowed"
                    : activeTab === "returned"
                    ? "Returned"
                    : "Requested"}
                </th>
                {activeTab === "request" && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  onClick={(e) => handleShowDetails(row, e)}
                  style={{ cursor: "pointer" }}
                >
                  <td data-label="Transaction ID">{row.id}</td>
                  <td data-label="Faculty Name">{row.user?.name || "N/A"}</td>
                  <td data-label="Department">
                    {row.user?.department || "N/A"}
                  </td>
                  <td data-label="File Name">{row.title}</td>
                  <td
                    data-label={`Date ${
                      activeTab === "borrowed"
                        ? "Borrowed"
                        : activeTab === "returned"
                        ? "Returned"
                        : "Requested"
                    }`}
                  >
                    {new Date(row.createdAt).toLocaleDateString()}
                  </td>
                  {activeTab === "request" && (
                    <td data-label="Status">
                      {row.status === "APPROVED" &&
                      isSoftCopy(row.description) &&
                      user?.role !== "ADMIN" &&
                      user?.role !== "STAFF" ? (
                        <span
                          className="status-badge status-view-pdf"
                          onClick={() => handleViewPDF(row)}
                          title="Click to view PDF"
                          style={{ cursor: "pointer" }}
                        >
                          View PDF
                        </span>
                      ) : (
                        <span
                          className={`status-badge status-${
                            row.status?.toLowerCase() || "pending"
                          }`}
                        >
                          {row.status[0] + row.status.slice(1).toLowerCase()}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
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
                    placeholder="Search reports..."
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

            {renderTable()}
          </div>
          <NotificationDropdown
            notifications={notifications}
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <Modal
        isOpen={showPDFModal}
        onClose={() => {
          setShowPDFModal(false);
          if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
          }
          setPdfUrl(null);
          setPdfLoading(false);
        }}
        title="File Preview"
      >
        {selectedRequest && (
          <>
            <div className="file-info">
              <div className="file-info-row">
                <span className="file-info-label">File Name:</span>
                <span className="file-info-value">{selectedRequest.title}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Request ID:</span>
                <span className="file-info-value">{selectedRequest.id}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Date Requested:</span>
                <span className="file-info-value">
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {pdfLoading && (
              <div
                className="pdf-preview"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "600px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  marginTop: "20px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <p
                  style={{
                    fontFamily: "Poppins, Helvetica",
                    fontSize: "16px",
                    color: "#666",
                  }}
                >
                  Loading PDF...
                </p>
              </div>
            )}
            {!pdfLoading && pdfUrl && (
              <div className="pdf-preview">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                />
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Request Details"
      >
        {selectedRequestForDetails && (
          <div className="request-details-modal-content">
            <div className="details-row">
              <span className="file-info-label">Request ID:</span>
              <span className="file-info-value">
                {selectedRequestForDetails.id}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Faculty Name:</span>
              <span className="file-info-value">
                {selectedRequestForDetails.user?.name || "N/A"}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Department:</span>
              <span className="file-info-value">
                {selectedRequestForDetails.user?.department || "N/A"}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">File Name:</span>
              <span className="file-info-value">
                {selectedRequestForDetails.title}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Copy Type:</span>
              <span className="file-info-value">
                {isSoftCopy(selectedRequestForDetails.description)
                  ? "Soft Copy"
                  : "Hard Copy"}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Date Submitted:</span>
              <span className="file-info-value">
                {new Date(
                  selectedRequestForDetails.createdAt
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Returned Date:</span>
              <span className="file-info-value">
                {selectedRequestForDetails.returnedAt
                  ? new Date(
                      selectedRequestForDetails.returnedAt
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Purpose:</span>
              <span className="file-info-value purpose">
                {selectedRequestForDetails.description || "No description"}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
