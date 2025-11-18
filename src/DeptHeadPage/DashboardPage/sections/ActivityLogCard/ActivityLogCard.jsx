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
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activity log:', error);
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
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`profile-details${index > 0 ? `-${index + 1}` : ""}`}
          >
            <p className="p">
              <span className="span">{activity.name} {activity.action} </span>
              <span className="text-wrapper-27">{activity.fileName}</span>
            </p>

            <p className="due-oct">
              <span className="text-wrapper-28">Due:</span>
              <span className="text-wrapper-29"> {activity.dueDate}</span>
            </p>

            <img className="profile" alt="Profile" src={activity.avatar || "https://c.animaapp.com/27o9iVJi/img/profile-02.svg"} />
          </div>
        ))}
      </div>
    </div>
  );
};
