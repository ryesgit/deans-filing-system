import React, { useState } from "react";
import { recentRequests as initialRequests } from "../../../../data/mockData";
import "./style.css";

export const RequestCard = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (requestId) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleDecline = (requestId) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: "declined" } : req
      )
    );
  };

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
          {requests.map((request) => (
            <div key={request.id} className="request-row">
              <div className="table-cell request-id-col">{request.id}</div>
              <div className="table-cell faculty-name-col">{request.facultyName}</div>
              <div className="table-cell department-col">{request.department}</div>
              <div className="table-cell file-name-col">{request.fileName}</div>
              <div className="table-cell date-col">{request.dateRequested}</div>
              <div className="table-cell status-col">
                {request.status === "pending" ? (
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
                  <div className={`status-badge ${request.status}`}>
                    {request.status === "approved" ? "Approved" : "Declined"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
