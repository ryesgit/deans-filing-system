import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../components/Modal/AuthContext";
import "./style.css";

export const NotificationCard = () => {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState(() => {
    return localStorage.getItem("dashboardAnnouncementImage") || "";
  });
  const fileInputRef = useRef(null);

  const isAdminOrStaff = ["ADMIN", "STAFF"].includes(user?.role?.toUpperCase());

  // Listen for storage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "dashboardAnnouncementImage") {
        setImageUrl(e.newValue || "");
      }
    };
    
    // Custom event for same-tab updates
    const handleLocalChange = () => {
      setImageUrl(localStorage.getItem("dashboardAnnouncementImage") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("announcementImageUpdated", handleLocalChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("announcementImageUpdated", handleLocalChange);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem("dashboardAnnouncementImage", base64String);
        setImageUrl(base64String);
        window.dispatchEvent(new Event("announcementImageUpdated"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContainerClick = () => {
    if (isAdminOrStaff) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      className="notification-card-banner" 
      onClick={handleContainerClick} 
      style={{ cursor: isAdminOrStaff ? "pointer" : "default" }}
    >
      {!imageUrl && (
        <div className="placeholder-content">
          <div className="announcement-title">Announcements</div>
          <div className="notification-placeholder">
             {isAdminOrStaff ? "Click to upload an announcement image" : "No announcements at this time."}
          </div>
        </div>
      )}
      
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Announcement" 
          className="announcement-image" 
        />
      )}

      {isAdminOrStaff && (
        <>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          {imageUrl && (
             <div className="upload-overlay">
                Click to change image
             </div>
          )}
        </>
      )}
    </div>
  );
};
