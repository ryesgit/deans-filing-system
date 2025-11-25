import React, { useState, useEffect } from "react";
import { statsAPI } from "../../../../services/api";
import "./style.css";

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
                  src={activity.avatar}
                />
              ) : (
                <div className="profile profile-placeholder"></div>
              )}

              <div className="text-content">
                <p className="p">
                  <span className="span">
                    {activity.userName} {activity.type}{" "}
                  </span>
                  <span className="text-wrapper-27">{activity.filename}</span>
                </p>

                <p className="due-oct">
                  <span className="text-wrapper-28">Time:</span>
                  <span className="text-wrapper-29">
                    {" "}
                    {new Date(activity.timestamp).toLocaleString()}
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
