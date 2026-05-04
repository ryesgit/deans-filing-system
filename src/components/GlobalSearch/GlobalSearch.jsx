import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { filesAPI, requestsAPI, usersAPI } from "../../services/api";
import { useAuth } from "../Modal/AuthContext";
import "./GlobalSearch.css";

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

export const GlobalSearch = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    files: [],
    requests: [],
    users: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults({ files: [], requests: [], users: [] });
        setShowResults(false);
      }
      if (onSearchChange) {
        onSearchChange(searchQuery.trim());
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, onSearchChange]);

  const isAdminOrStaff = ['ADMIN', 'STAFF'].includes(user?.role?.toUpperCase());

  const performSearch = async (query) => {
    setIsSearching(true);
    setShowResults(true);

    try {
      const lowerQuery = query.toLowerCase();

      if (isAdminOrStaff) {
        // ADMIN/STAFF: search all files, all requests, and users (admin only)
        const [filesResponse, requestsResponse, usersResponse] = await Promise.allSettled([
          filesAPI.search(query),
          requestsAPI.getAll(),
          user?.role?.toUpperCase() === "ADMIN" ? usersAPI.getAll() : Promise.resolve({ data: { users: [] } }),
        ]);

        const files = filesResponse.status === "fulfilled"
          ? (filesResponse.value.data.files || filesResponse.value.data || [])
          : [];

        // Filter out archived files
        let archivedIds = [];
        try {
          archivedIds = JSON.parse(localStorage.getItem('archivedFileIds') || '[]');
        } catch {}
        const filteredFiles = files.filter((f) => !archivedIds.includes(String(f.id)));

        const allRequests = requestsResponse.status === "fulfilled"
          ? (requestsResponse.value.data.requests || requestsResponse.value.data || [])
          : [];
        const requests = allRequests.filter(
          (req) =>
            req.title?.toLowerCase().includes(lowerQuery) ||
            req.description?.toLowerCase().includes(lowerQuery) ||
            req.id?.toString().includes(query)
        );

        const allUsers = usersResponse.status === "fulfilled"
          ? (usersResponse.value.data.users || usersResponse.value.data || [])
          : [];
        const users = allUsers.filter(
          (u) =>
            u.name?.toLowerCase().includes(lowerQuery) ||
            u.email?.toLowerCase().includes(lowerQuery) ||
            u.userId?.toLowerCase().includes(lowerQuery)
        );

        setSearchResults({ files: filteredFiles, requests, users });
      } else {
        // FACULTY/STUDENT: only show files from their own approved soft-copy requests
        const requestsResponse = await requestsAPI.getAll();
        const allRequests = requestsResponse.data?.requests || requestsResponse.data || [];
        const userId = user?.userId || user?.id;

        // Filter to only this user's requests
        const myRequests = Array.isArray(allRequests)
          ? allRequests.filter(
              (req) => String(req.userId) === String(userId)
            )
          : [];

        // Files section: extract file info from approved soft-copy requests that match the query
        const myApprovedSoftCopyFiles = myRequests
          .filter(
            (req) =>
              (req.status === "APPROVED" || req.status === "Approved") &&
              req.description?.includes("Soft Copy")
          )
          .filter((req) => {
            const title = (req.title || "").toLowerCase();
            const desc = (req.description || "").toLowerCase();
            return title.includes(lowerQuery) || desc.includes(lowerQuery) || String(req.id).includes(query);
          })
          .map((req) => ({
            id: req.fileId || req.id,
            filename: req.title || "Unnamed file",
            category: req.file?.category?.name || req.file?.category || "N/A",
            department: req.file?.department || req.user?.department || "N/A",
            _requestId: req.id,
          }));

        // Requests section: match the user's own requests
        const matchedRequests = myRequests.filter(
          (req) =>
            req.title?.toLowerCase().includes(lowerQuery) ||
            req.description?.toLowerCase().includes(lowerQuery) ||
            req.id?.toString().includes(query)
        );

        setSearchResults({
          files: myApprovedSoftCopyFiles,
          requests: matchedRequests,
          users: [],
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ files: [], requests: [], users: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setSearchQuery("");

    switch (type) {
      case "file":
        if (isAdminOrStaff) {
          navigate("/file-management", { state: { selectedFile: item } });
        } else {
          // FACULTY/STUDENT: navigate to request page, open the specific request
          navigate("/request", {
            state: {
              selectedRequestId: item._requestId || null,
              requestFocusNonce: Date.now(),
            },
          });
        }
        break;
      case "request":
        navigate("/request", {
          state: {
            selectedRequestId: item.id,
            requestFocusNonce: Date.now(),
          },
        });
        break;
      case "user":
        navigate("/user-management", { state: { selectedUser: item } });
        break;
      default:
        break;
    }
  };

  const totalResults =
    searchResults.files.length +
    searchResults.requests.length +
    searchResults.users.length;

  return (
    <div className="global-search" ref={searchRef}>
      <div className="global-search-input-wrapper">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          className="global-search-input"
          placeholder={isAdminOrStaff ? "Search files, requests, users..." : "Search my requests and files..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
        />
        {isSearching && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {showResults && searchQuery && (
        <div className="global-search-results">
          {totalResults === 0 && !isSearching && (
            <div className="search-no-results">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}

          {searchResults.files.length > 0 && (
            <div className="search-results-section">
              <h4 className="search-results-header">{isAdminOrStaff ? "Files" : "My Files"} ({searchResults.files.length})</h4>
              {searchResults.files.slice(0, 5).map((file) => (
                <div
                  key={file.id}
                  className="search-result-item"
                  onClick={() => handleResultClick("file", file)}
                >
                  <div className="search-result-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                  <div className="search-result-content">
                    <div className="search-result-title">{toText(file.filename, "Unnamed file")}</div>
                    <div className="search-result-subtitle">
                      {toText(file.category, "Uncategorized")} • {toText(file.department, "N/A")}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.files.length > 5 && (
                <div className="search-more-results">
                  +{searchResults.files.length - 5} more files
                </div>
              )}
            </div>
          )}

          {searchResults.requests.length > 0 && (
            <div className="search-results-section">
              <h4 className="search-results-header">{isAdminOrStaff ? "Requests" : "My Requests"} ({searchResults.requests.length})</h4>
              {searchResults.requests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="search-result-item"
                  onClick={() => handleResultClick("request", request)}
                >
                  <div className="search-result-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="search-result-content">
                    <div className="search-result-title">Request #{toText(request.id, "N/A")}</div>
                    <div className="search-result-subtitle">
                      {toText(request.title, "Untitled request")} • Status: {toText(request.status, "Unknown")}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.requests.length > 5 && (
                <div className="search-more-results">
                  +{searchResults.requests.length - 5} more requests
                </div>
              )}
            </div>
          )}

          {searchResults.users.length > 0 && user?.role === "ADMIN" && (
            <div className="search-results-section">
              <h4 className="search-results-header">Users ({searchResults.users.length})</h4>
              {searchResults.users.slice(0, 5).map((userItem) => (
                <div
                  key={userItem.userId}
                  className="search-result-item"
                  onClick={() => handleResultClick("user", userItem)}
                >
                  <div className="search-result-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="search-result-content">
                    <div className="search-result-title">{toText(userItem.name, "Unknown user")}</div>
                    <div className="search-result-subtitle">
                      {toText(userItem.email, "N/A")} • {toText(userItem.role, "N/A")}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.users.length > 5 && (
                <div className="search-more-results">
                  +{searchResults.users.length - 5} more users
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
