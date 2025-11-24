import React, { useState, useEffect } from "react";
import { statsAPI } from "../../../../services/api";
import "./style.css";

export const RecentRequestsCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const response = await statsAPI.getDashboard();
        const stats = response.data?.stats || response.data;
        const recentRequests = stats?.recentRequests || [];
        const filteredRequests = recentRequests.filter(req => req.status !== 'CANCELLED');
        setRequests(filteredRequests.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch recent requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRequests();
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      PENDING: "status-pending",
      APPROVED: "status-approved",
      DECLINED: "status-declined",
      CANCELLED: "status-cancelled",
    };
    return statusMap[status] || "status-pending";
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      PENDING: "Pending",
      APPROVED: "Approved",
      DECLINED: "Declined",
      CANCELLED: "Cancelled",
    };
    return labelMap[status] || status;
  };

  if (loading) {
    return (
      <div className="recent-requests-card">
        <div className="recent-requests-header">
          <h3 className="recent-requests-title">Recent Requests</h3>
        </div>
        <div className="recent-requests-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="recent-requests-card">
      <div className="recent-requests-header">
        <h3 className="recent-requests-title">Recent Requests</h3>
      </div>

      <div className="recent-requests-list">
        {requests.length === 0 ? (
          <div className="no-recent-requests">No recent requests.</div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="recent-request-item">
              <div className="recent-request-main">
                <div className="recent-request-title">{request.title}</div>
                <div className="recent-request-meta">
                  <span className="recent-request-user">{request.userName || 'N/A'}</span>
                  <span className="recent-request-separator">•</span>
                  <span className="recent-request-department">{request.department || 'N/A'}</span>
                </div>
              </div>
              <div className="recent-request-status">
                <span className={`status-badge ${getStatusClass(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
