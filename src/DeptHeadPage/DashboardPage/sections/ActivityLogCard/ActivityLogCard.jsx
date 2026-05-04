import React, { useState, useEffect } from "react";
import { statsAPI } from "../../../../services/api";
import { API_BASE_URL } from "../../../../config/apiBaseUrl";
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

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const formatActivityType = (type) => {
  if (!type) return "";

  const lowerType = type.toLowerCase().trim();

  // Map of activity types to their past tense forms
  const pastTenseMap = {
    'check out': 'checked out',
    'checkout': 'checked out',
    'borrow': 'borrowed',
    'return': 'returned',
    'request': 'requested',
    'approve': 'approved',
    'decline': 'declined',
    'declined': 'declined',
    'upload': 'uploaded',
    'download': 'downloaded',
    'delete': 'deleted',
    'update': 'updated',
    'create': 'created',
    'retrieval': 'retrieved',
    'retrieve': 'retrieved',
    'borrowed': 'borrowed',
    'returned': 'returned',
    'requested': 'requested',
    'approved': 'approved',
    'uploaded': 'uploaded',
    'downloaded': 'downloaded',
    'deleted': 'deleted',
    'updated': 'updated',
    'created': 'created',
    'retrieved': 'retrieved'
  };

  return pastTenseMap[lowerType] || lowerType;
};

export const ActivityLogCard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const response = await statsAPI.getActivityLog();
        const { activityLog } = response.data;
        setActivities(Array.isArray(activityLog) ? activityLog : []);
      } catch (error) {
        console.error("Failed to fetch activity log:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLog();
  }, []);

  if (loading) {
    return <div className="activity-log-card">Loading...</div>;
  }

  return (
    <div className="activity-log-card">
      <div className="al-content">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`profile-details${index > 0 ? `-${index + 1}` : ""}`}
            >
              {activity.avatar ? (
                <img
                  className="profile"
                  alt="Profile"
                  src={
                    activity.avatar.startsWith('http') || activity.avatar.startsWith('data:')
                      ? activity.avatar
                      : `${API_BASE_URL}${activity.avatar}`
                  }
                />
              ) : (
                <div className="profile profile-initials">
                  {getInitials(activity.userName)}
                </div>
              )}

              <div className="text-content">
                <p className="p">
                  <span className="span">
                    {toText(activity.userName, "Unknown user")} {toText(formatActivityType(activity.type), "did something")}{" "}
                  </span>
                  <span className="text-wrapper-27">{toText(activity.filename, "Unnamed file")}</span>
                </p>

                <p className="due-oct">
                  <span className="text-wrapper-28">Time:</span>
                  <span className="text-wrapper-29">
                    {" "}
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : "N/A"}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", color: "#8c8c8c" }}>
            No activity log yet
          </div>
        )}
      </div>
    </div>
  );
};
