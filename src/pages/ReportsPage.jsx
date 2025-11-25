import React, { useState, useEffect } from "react";
import { SidePanel } from "../components/SidePanel";
import "../DeptHeadPage/ReportsPage/ReportsPage.css";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { useAuth } from "../components/Modal/AuthContext";
import { reportsAPI } from "../services/api";
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransactionForDetails, setSelectedTransactionForDetails] =
    useState(null);
  const { notifications, unreadCount } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user?.userId) {
          setLoading(false);
          return;
        }

        const response = await reportsAPI.getUserActivity(user.userId, 365);
        const transactions = Array.isArray(response.data.report.recentTransactions)
          ? response.data.report.recentTransactions
          : [];

        setReportsData({
          request: transactions.filter((t) => t.type === "CHECKOUT"),
          borrowed: transactions.filter(
            (t) => t.type === "CHECKOUT" && !t.returnedAt
          ),
          returned: transactions.filter(
            (t) => t.type === "RETURN" || t.returnedAt
          ),
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
            "File Name",
            "Date",
            "Type",
          ]
        : [
            "Transaction ID",
            "File Name",
            `Date ${activeTab === "borrowed" ? "Borrowed" : "Returned"}`,
          ];

    let csv = headers.join(",") + "\n";
    data.forEach((row) => {
      const dateField =
        activeTab === "returned" ? row.returnedAt || row.timestamp : row.timestamp;
      const values = [
        row.id,
        row.file?.filename || "N/A",
        new Date(dateField).toLocaleDateString(),
        ...(activeTab === "request" ? [row.type] : []),
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

  const handleShowDetails = (transaction, e) => {
    setSelectedTransactionForDetails(transaction);
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
                <th>File Name</th>
                <th>
                  Date{" "}
                  {activeTab === "borrowed"
                    ? "Borrowed"
                    : activeTab === "returned"
                    ? "Returned"
                    : "Transaction"}
                </th>
                {activeTab === "request" && <th>Type</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const dateField =
                  activeTab === "returned"
                    ? row.returnedAt || row.timestamp
                    : row.timestamp;
                return (
                  <tr
                    key={index}
                    onClick={(e) => handleShowDetails(row, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <td data-label="Transaction ID">{row.id}</td>
                    <td data-label="File Name">{row.file?.filename || "N/A"}</td>
                    <td
                      data-label={`Date ${
                        activeTab === "borrowed"
                          ? "Borrowed"
                          : activeTab === "returned"
                          ? "Returned"
                          : "Transaction"
                      }`}
                    >
                      {new Date(dateField).toLocaleDateString()}
                    </td>
                    {activeTab === "request" && (
                      <td data-label="Type">
                        <span className={`status-badge status-${row.type?.toLowerCase()}`}>
                          {row.type}
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

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Transaction Details"
      >
        {selectedTransactionForDetails && (
          <div className="request-details-modal-content">
            <div className="details-row">
              <span className="file-info-label">Transaction ID:</span>
              <span className="file-info-value">
                {selectedTransactionForDetails.id}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">File Name:</span>
              <span className="file-info-value">
                {selectedTransactionForDetails.file?.filename || "N/A"}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Transaction Type:</span>
              <span className="file-info-value">
                {selectedTransactionForDetails.type}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Date:</span>
              <span className="file-info-value">
                {new Date(
                  selectedTransactionForDetails.timestamp
                ).toLocaleDateString()}
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
    </>
  );
};
