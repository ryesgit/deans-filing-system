import React, { createContext, useState, useContext } from "react";

// 1. Define initial state with all notifications combined
const initialNotifications = [
  { id: 1, message: "New user 'Alex' was added.", read: false },
  { id: 2, message: "User 'Maria Santos' updated their profile.", read: false },
  { id: 3, message: "A request was approved.", read: true },
  { id: 4, message: "Monthly report for October is ready.", read: false },
  { id: 5, message: "Your password was changed successfully.", read: true },
  { id: 6, message: "Request #123 has been approved.", read: false },
  { id: 7, message: "Annual user activity report generated.", read: true },
];

// 2. Create the context
const NotificationContext = createContext();

// 3. Create a custom hook for easy access to the context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

// 4. Create the Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
