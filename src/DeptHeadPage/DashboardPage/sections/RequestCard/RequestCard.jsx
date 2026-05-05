import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../components/Modal/AuthContext";
import {
  requestsAPI,
  filesAPI,
  notificationsAPI,
} from "../../../../services/api";
import { Modal } from "../../../../components/Modal/Modal";
import { AlertModal, PromptModal } from "../../../../components/Modal";
import "./style.css";

const toText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};

export const RequestCard = ({
  selectedRequestId = null,
  requestFocusNonce = null,
}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequestForDetails, setSelectedRequestForDetails] =
    useState(null);
  const { user } = useAuth();

  // Modal states for dialog replacements
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", title: "", type: "info" });
  const [promptConfig, setPromptConfig] = useState({ isOpen: false, message: "", title: "", onConfirm: () => { } });

  const showAlert = (message, title = "Notice", type = "info") => {
    setAlertConfig({ isOpen: true, message, title, type });
  };

  const showPrompt = (message, onConfirm, title = "Provide Reason") => {
    setPromptConfig({ isOpen: true, message, onConfirm, title });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.userId && !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await requestsAPI.getAll();
        const requestsArray = Array.isArray(response.data.requests)
          ? response.data.requests
          : [];

        console.log('All requests:', requestsArray);
        console.log('Current user:', user);

        const filteredRequests = requestsArray.filter(
          (req) => req.status !== "CANCELLED" && req.status !== "COMPLETED"
        );

        // Filter requests based on role
        // ADMIN and STAFF see all requests, others see only their own
        const roleFilteredRequests = ['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase())
          ? filteredRequests
          : filteredRequests.filter(
              (req) => {
                const match = req.userId === user.userId || req.userId === user.id;
                return match;
              }
            );

        console.log('Filtered requests:', roleFilteredRequests);
        setRequests(roleFilteredRequests.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // Check if request is for soft copy based on description
  const isSoftCopy = (description) => {
    return description?.includes("Soft Copy Only");
  };

  // Handle View PDF click
  const handleViewPDF = async (request) => {
    if (!request.fileId) {
      showAlert("File not available. Please contact support.", "Error", "error");
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
      showAlert("Failed to load PDF. Please try again or contact support.", "Error", "error");
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

  const handleApprove = async (requestId) => {
    try {
      await requestsAPI.approve(requestId);

      // Create notification for the user
      const request = requests.find((r) => r.id === requestId);
      if (request) {
        try {
          await notificationsAPI.create({
            userId: request.userId,
            message: `Your request for ${
              request.fileName || "item"
            } has been APPROVED.`,
            type: "success",
            read: false,
          });
        } catch (notifError) {
          console.error("Failed to create notification:", notifError);
        }
      }

      // Refetch requests to ensure UI is in sync with database
      const response = await requestsAPI.getAll();
      const requestsArray = Array.isArray(response.data.requests)
        ? response.data.requests
        : [];
      const filteredRequests = requestsArray.filter(
        (req) => req.status !== "CANCELLED" && req.status !== "COMPLETED"
      );
      const roleFilteredRequests = ['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase())
        ? filteredRequests
        : filteredRequests.filter((req) => req.userId === user.userId || req.userId === user.id);
      setRequests(roleFilteredRequests.slice(0, 5));
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleDecline = (requestId) => {
    showPrompt("Please enter the reason for declining this request:", async (reason) => {
      if (!reason) return;

      try {
        await requestsAPI.decline(requestId, reason);

        // Create notification for the user
        const request = requests.find((r) => r.id === requestId);
        if (request) {
          try {
            await notificationsAPI.create({
              userId: request.userId,
              message: `Your request for ${request.fileName || "item"
                } has been DECLINED. Reason: ${reason || "No reason provided."}`,
              type: "error",
              read: false,
            });
          } catch (notifError) {
            console.error("Failed to create notification:", notifError);
          }
        }

        // Refetch requests to ensure UI is in sync with database
        const response = await requestsAPI.getAll();
        const requestsArray = Array.isArray(response.data.requests)
          ? response.data.requests
          : [];
        const filteredRequests = requestsArray.filter(
          (req) => req.status !== "CANCELLED" && req.status !== "COMPLETED"
        );
        const roleFilteredRequests = ['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase())
          ? filteredRequests
          : filteredRequests.filter((req) => req.userId === user.userId || req.userId === user.id);
        setRequests(roleFilteredRequests.slice(0, 5));
        setPromptConfig({ ...promptConfig, isOpen: false });
      } catch (error) {
        console.error("Failed to decline request:", error);
        showAlert(error.message || "Failed to decline request", "Error", "error");
      }
    }, "Decline Request");
  };

  const handleShowDetails = (request, e) => {
    // Prevent modal from opening when clicking on buttons inside the row
    if (e.target.closest("button, .status-badge")) {
      return;
    }

    setSelectedRequestForDetails(request);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (selectedRequestId === null || selectedRequestId === undefined) {
      return;
    }

    const matchedRequest = requests.find(
      (request) => String(request.id) === String(selectedRequestId)
    );

    if (matchedRequest) {
      setSelectedRequestForDetails(matchedRequest);
      setShowDetailsModal(true);
    }
  }, [requests, selectedRequestId, requestFocusNonce]);

  if (loading) {
    return <div className="request-card">Loading...</div>;
  }

  return (
    <>
      <div className="request-card">
        <div className="request-card-header">
          <h2 className="request-card-title">
            {['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase()) ? 'Recent Requests' : 'My Requests'}
          </h2>
        </div>

        <div className="request-table">
          <div className="request-table-header">
            <div className="header-cell request-id-col">Request ID</div>
            <div className="header-cell faculty-name-col">Name</div>
            <div className="header-cell file-name-col">File Name</div>
            <div className="header-cell copy-type-col">Copy Type</div>
            <div className="header-cell date-col">Date Requested</div>
            <div className="header-cell status-col">Status</div>
          </div>

          <div className="request-table-body">
            {requests.length === 0 ? (
              <div className="no-requests-message">No recent requests.</div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="request-row"
                  onClick={(e) => handleShowDetails(request, e)}
                >
                  <div className="table-cell request-id-col">{request.id}</div>
                  <div className="table-cell faculty-name-col">
                    {toText(request.user?.name, "N/A")}
                  </div>
                  <div className="table-cell file-name-col">
                    {toText(request.title, "Untitled request")}
                  </div>
                  <div className="table-cell copy-type-col">
                    {isSoftCopy(request.description)
                      ? "Soft Copy"
                      : "Hard Copy"}
                  </div>
                  <div className="table-cell date-col">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                  <div className="table-cell status-col">
                    {request.status === "PENDING" &&
                    ['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase()) ? (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="decline-btn"
                          onClick={() => handleDecline(request.id)}
                        >
                          Decline
                        </button>
                      </div>
                    ) : request.status === "APPROVED" &&
                      isSoftCopy(request.description) &&
                      user?.role !== "ADMIN" &&
                      user?.role !== "STAFF" ? (
                      <span
                        className="status-badge status-view-pdf"
                        onClick={() => handleViewPDF(request)}
                        title="Click to view PDF"
                        style={{ cursor: "pointer" }}
                      >
                        View PDF
                      </span>
                    ) : (
                      <div
                        className={`status-badge ${request.status.toLowerCase()}`}
                      >
                        {request.status === "PENDING"
                          ? "Pending"
                          : request.status === "APPROVED"
                          ? "Approved"
                          : "Declined"}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
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
                <span className="file-info-value">{toText(selectedRequest.title, "Untitled request")}</span>
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
              <span className="file-info-label">Name:</span>
              <span className="file-info-value">
                {toText(selectedRequestForDetails.user?.name, "N/A")}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Department:</span>
              <span className="file-info-value">
                {toText(selectedRequestForDetails.user?.department, "N/A")}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">File Name:</span>
              <span className="file-info-value">
                {toText(selectedRequestForDetails.title, "Untitled request")}
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
            {/* Expected Return Date — parsed from description */}
            {(() => {
              const returnDateMatch = selectedRequestForDetails.description?.match(/Return Date:\s*(.+)/);
              const expectedDate = selectedRequestForDetails.returnDate || selectedRequestForDetails.returnDue || (returnDateMatch ? returnDateMatch[1].trim() : null);
              if (expectedDate && expectedDate !== "N/A") {
                return (
                  <div className="details-row">
                    <span className="file-info-label">Expected Return Date:</span>
                    <span className="file-info-value">
                      {isNaN(new Date(expectedDate).getTime()) ? expectedDate : new Date(expectedDate).toLocaleDateString()}
                    </span>
                  </div>
                );
              }
              return null;
            })()}
            {/* Actual Returned Date — from returnedAt field */}
            <div className="details-row">
              <span className="file-info-label">Returned Date:</span>
              <span className="file-info-value">
                {selectedRequestForDetails.returnedAt
                  ? new Date(selectedRequestForDetails.returnedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="details-row">
              <span className="file-info-label">Purpose:</span>
              <span className="file-info-value purpose">
                {(() => {
                  const desc = selectedRequestForDetails.description || "No description";
                  // Extract only the actual purpose, stripping redundant metadata lines
                  const purposeMatch = desc.match(/Purpose:\s*(.+)/);
                  if (purposeMatch) {
                    return purposeMatch[1].trim();
                  }
                  // If no "Purpose:" prefix, return the full description but strip known metadata lines
                  return desc
                    .split('\n')
                    .filter(line => {
                      const trimmed = line.trim();
                      return !trimmed.startsWith('Department:') &&
                             !trimmed.startsWith('Category:') &&
                             !trimmed.startsWith('Copy Type:') &&
                             !trimmed.startsWith('Return Date:');
                    })
                    .join('\n')
                    .trim() || "No description";
                })()}
              </span>
            </div>
          </div>
        )}
      </Modal>

      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

      <PromptModal
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig({ ...promptConfig, isOpen: false })}
        onConfirm={promptConfig.onConfirm}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder="Type the reason here..."
      />
    </>
  );
};
