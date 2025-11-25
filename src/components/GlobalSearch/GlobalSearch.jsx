import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { filesAPI, requestsAPI, usersAPI } from "../../services/api";
import { useAuth } from "../Modal/AuthContext";
import "./GlobalSearch.css";

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

  const performSearch = async (query) => {
    setIsSearching(true);
    setShowResults(true);

    try {
      const [filesResponse, requestsResponse, usersResponse] = await Promise.allSettled([
        filesAPI.search(query),
        requestsAPI.getAll(),
        user?.role === "ADMIN" ? usersAPI.getAll() : Promise.resolve({ data: { users: [] } }),
      ]);

      const files = filesResponse.status === "fulfilled"
        ? (filesResponse.value.data.files || filesResponse.value.data || [])
        : [];

      const allRequests = requestsResponse.status === "fulfilled"
        ? (requestsResponse.value.data.requests || requestsResponse.value.data || [])
        : [];
      const requests = allRequests.filter(
        (req) =>
          req.title?.toLowerCase().includes(query.toLowerCase()) ||
          req.description?.toLowerCase().includes(query.toLowerCase()) ||
          req.id?.toString().includes(query)
      );

      const allUsers = usersResponse.status === "fulfilled"
        ? (usersResponse.value.data.users || usersResponse.value.data || [])
        : [];
      const users = allUsers.filter(
        (u) =>
          u.name?.toLowerCase().includes(query.toLowerCase()) ||
          u.email?.toLowerCase().includes(query.toLowerCase()) ||
          u.userId?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({ files, requests, users });
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
        navigate("/file-management", { state: { selectedFile: item } });
        break;
      case "request":
        navigate("/request", { state: { selectedRequest: item } });
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
          placeholder="Search files, requests, users..."
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
              <h4 className="search-results-header">Files ({searchResults.files.length})</h4>
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
                    <div className="search-result-title">{file.filename}</div>
                    <div className="search-result-subtitle">
                      {file.category || "Uncategorized"} • {file.department || "N/A"}
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
              <h4 className="search-results-header">Requests ({searchResults.requests.length})</h4>
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
                    <div className="search-result-title">Request #{request.id}</div>
                    <div className="search-result-subtitle">
                      {request.title} • Status: {request.status}
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
                    <div className="search-result-title">{userItem.name}</div>
                    <div className="search-result-subtitle">
                      {userItem.email} • {userItem.role}
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
