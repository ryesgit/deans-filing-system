import React, { useState, useEffect } from "react";
import { requestsAPI } from "../../../../services/api";
import "./style.css";

export const RequestCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestsAPI.getAll();
        const requestsArray = Array.isArray(response.data.requests) ? response.data.requests : [];
        const filteredRequests = requestsArray.filter(req => req.status !== 'CANCELLED');
        setRequests(filteredRequests.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await requestsAPI.approve(requestId);
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
    <div className="request-card">
      <div className="request-card-header">
        <h2 className="request-card-title">Recent Requests</h2>
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
                  {request.status === "PENDING" ? (
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
                  ) : (
                    <div className={`status-badge ${request.status.toLowerCase()}`}>
                      {request.status === "APPROVED" ? "Approved" : "Declined"}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
