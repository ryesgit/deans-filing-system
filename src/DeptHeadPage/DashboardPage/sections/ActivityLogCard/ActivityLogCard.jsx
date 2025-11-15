import React from "react";
import { activityLog } from "../../../../data/mockData";
import "./style.css";

export const ActivityLogCard = () => {
  const activities = activityLog;

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

            <img className="profile" alt="Profile" src={activity.avatar} />
          </div>
        ))}
      </div>
    </div>
  );
};
