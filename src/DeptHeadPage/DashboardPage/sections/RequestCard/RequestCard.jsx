import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../components/Modal/AuthContext";
import { requestsAPI, filesAPI, notificationsAPI } from "../../../../services/api";
import { Modal } from "../../../../components/Modal/Modal";
import "./style.css";

export const RequestCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestsAPI.getAll();
        const requestsArray = Array.isArray(response.data.requests) ? response.data.requests : [];
        const filteredRequests = requestsArray.filter(req => req.status !== 'CANCELLED');

        // Filter requests based on user role
        // USER role should only see their own requests
        // ADMIN and STAFF can see all requests
        const roleFilteredRequests = user?.role === 'USER'
          ? filteredRequests.filter(req => req.userId === user.id)
          : filteredRequests;

        setRequests(roleFilteredRequests.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // Check if request is for soft copy based on description
  const isSoftCopy = (description) => {
    return description?.includes('Soft Copy Only');
  };

  // Handle View PDF click
  const handleViewPDF = async (request) => {
    if (!request.fileId) {
      alert('File not available. Please contact support.');
      return;
    }

    setSelectedRequest(request);
    setShowPDFModal(true);
    setPdfLoading(true);
    setPdfUrl(null);

    try {
      const response = await filesAPI.download(request.fileId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to load PDF:', error);
      alert('Failed to load PDF. Please try again or contact support.');
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
      const request = requests.find(r => r.id === requestId);
      if (request) {
        try {
          await notificationsAPI.create({
            userId: request.userId,
            message: `Your request for ${request.fileName || 'item'} has been APPROVED.`,
            type: 'success',
            read: false
          });
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
        }
      }

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "APPROVED" } : req
        )
      );
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await requestsAPI.decline(requestId);

      // Create notification for the user
      const request = requests.find(r => r.id === requestId);
      if (request) {
        try {
          await notificationsAPI.create({
            userId: request.userId,
            message: `Your request for ${request.fileName || 'item'} has been DECLINED.`,
            type: 'error',
            read: false
          });
        } catch (notifError) {
          console.error('Failed to create notification:', notifError);
        }
      }

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "DECLINED" } : req
        )
      );
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

  if (loading) {
    return <div className="request-card">Loading...</div>;
  }

  return (
    <>
      <div className="request-card">
        <div className="request-card-header">
          <h2 className="request-card-title">
            {user?.role === 'USER' ? 'My Requests' : 'Recent Requests'}
          </h2>
        </div>

        <div className="request-table">
          <div className="request-table-header">
            <div className="header-cell request-id-col">Request ID</div>
            <div className="header-cell faculty-name-col">Faculty Name</div>
            <div className="header-cell department-col">Department</div>
            <div className="header-cell file-name-col">File Name</div>
            <div className="header-cell date-col">Date Requested</div>
            <div className="header-cell status-col">Status</div>
          </div>

          <div className="request-table-body">
            {requests.length === 0 ? (
              <div className="no-requests-message">No recent requests.</div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="request-row">
                  <div className="table-cell request-id-col">{request.id}</div>
                  <div className="table-cell faculty-name-col">{request.user?.name || 'N/A'}</div>
                  <div className="table-cell department-col">{request.user?.department || 'N/A'}</div>
                  <div className="table-cell file-name-col">{request.title}</div>
                  <div className="table-cell date-col">{new Date(request.createdAt).toLocaleDateString()}</div>
                  <div className="table-cell status-col">
                    {request.status === "PENDING" && (user?.role === "ADMIN" || user?.role === "STAFF") ? (
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
                    ) : request.status === "APPROVED" && isSoftCopy(request.description) && user?.role !== 'ADMIN' && user?.role !== 'STAFF' ? (
                      <span
                        className="status-badge status-view-pdf"
                        onClick={() => handleViewPDF(request)}
                        title="Click to view PDF"
                        style={{ cursor: 'pointer' }}
                      >
                        View PDF
                      </span>
                    ) : (
                      <div className={`status-badge ${request.status.toLowerCase()}`}>
                        {request.status === "PENDING" ? "Pending" :
                          request.status === "APPROVED" ? "Approved" : "Declined"}
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
                <span className="file-info-value">{selectedRequest.title}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Request ID:</span>
                <span className="file-info-value">{selectedRequest.id}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Date Requested:</span>
                <span className="file-info-value">{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {pdfLoading && (
              <div className="pdf-preview" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '600px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginTop: '20px',
                backgroundColor: '#f5f5f5'
              }}>
                <p style={{
                  fontFamily: 'Poppins, Helvetica',
                  fontSize: '16px',
                  color: '#666'
                }}>Loading PDF...</p>
              </div>
            )}
            {!pdfLoading && pdfUrl && (
              <div className="pdf-preview">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                  style={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: '20px' }}
                />
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};
