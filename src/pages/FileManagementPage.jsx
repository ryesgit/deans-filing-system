import React, { useState } from "react";
import { SidePanel } from "../components/SidePanel";
import { Modal } from "../components/Modal/Modal";
import "../DeptHeadPage/FileManagementPage/style.css";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { RequestCard } from "../DeptHeadPage/DashboardPage/sections/RequestCard/RequestCard";

const mockFolders = [
  {
    id: 1,
    name: "Thesis Papers",
    fileCount: 1,
    category: "Research",
    files: [
      {
        id: "0001",
        name: "AI_in_Education.pdf",
        dateAdded: "Oct 20, 2025",
        department: "Computer Engineering",
        category: "Research",
      },
    ],
  },
  {
    id: 2,
    name: "Course Syllabi",
    fileCount: 0,
    category: "Academics",
    files: [],
  },
];

const categories = [
  "Research",
  "Academics",
  "Administrative",
  "Student Records",
];
const departments = [
  "Computer Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];

export const FileManagementPage = () => {
  const [folders, setFolders] = useState(mockFolders);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [showFolderDetailsModal, setShowFolderDetailsModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [addFolderForm, setAddFolderForm] = useState({
    name: "",
    category: "",
    row: "",
    column: "",
  });
  const [editFolderForm, setEditFolderForm] = useState({
    name: "",
    category: "",
    row: "",
    column: "",
  });
  const [fileForm, setFileForm] = useState({
    name: "",
    department: "",
    category: "",
    file: null,
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [openDropdownFolderId, setOpenDropdownFolderId] = useState(null);
  const [fileError, setFileError] = useState("");

  const { notifications, unreadCount } = useNotifications();
  const handleAddFolder = () => {
    if (
      addFolderForm.name &&
      addFolderForm.category &&
      addFolderForm.row &&
      addFolderForm.column
    ) {
      const newFolder = {
        id: Date.now(),
        name: addFolderForm.name,
        fileCount: 0,
        category: addFolderForm.category,
        row: addFolderForm.row,
        column: addFolderForm.column,
        files: [],
      };
      setFolders([...folders, newFolder]);
      setAddFolderForm({ name: "", category: "", row: "", column: "" });
      setShowFolderModal(false);
    }
  };

  const handleUpdateFolder = () => {
    if (
      folderToEdit &&
      editFolderForm.name &&
      editFolderForm.category &&
      editFolderForm.row &&
      editFolderForm.column
    ) {
      const updatedFolders = folders.map((folder) =>
        folder.id === folderToEdit.id
          ? {
              ...folder,
              name: editFolderForm.name,
              category: editFolderForm.category,
              row: editFolderForm.row,
              column: editFolderForm.column,
            }
          : folder
      );
      setFolders(updatedFolders);
      setShowEditFolderModal(false);
      setFolderToEdit(null);
    }
  };

  const confirmDeleteFolder = () => {
    if (folderToDelete) {
      setFolders(folders.filter((folder) => folder.id !== folderToDelete.id));
      if (selectedFolder && selectedFolder.id === folderToDelete.id) {
        setSelectedFolder(null);
      }
      setShowDeleteFolderModal(false);
      setFolderToDelete(null);
    }
  };

  const handleFolderClick = (folder) => {
    if (openDropdownFolderId === folder.id) {
      setOpenDropdownFolderId(null);
      return;
    }
    setSelectedFolder(folder);
    setOpenDropdownFolderId(null);
  };

  const handleAddFile = () => {
    setFileError("");

    if (!fileForm.name || !fileForm.department || !fileForm.category) {
      setFileError("Please fill in all fields");
      return;
    }

    if (!fileForm.file) {
      setFileError("Please select a PDF file");
      return;
    }

    if (fileForm.file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed");
      return;
    }

    if (selectedFolder) {
      const newFile = {
        id: String(selectedFolder.files.length + 1).padStart(4, "0"),
        name: fileForm.file.name,
        dateAdded: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        department: fileForm.department,
        category: fileForm.category,
        url: URL.createObjectURL(fileForm.file), // Create a URL for the preview
      };

      const updatedFolders = folders.map((folder) =>
        folder.id === selectedFolder.id
          ? {
              ...folder,
              files: [...folder.files, newFile],
              fileCount: folder.fileCount + 1,
            }
          : folder
      );

      setFolders(updatedFolders);
      setSelectedFolder({
        ...selectedFolder,
        files: [...selectedFolder.files, newFile],
        fileCount: selectedFolder.fileCount + 1,
      });
      setFileForm({ name: "", department: "", category: "", file: null });
      setShowFileModal(false);
    }
  };

  const handleDownloadFile = () => {
    if (selectedFile && selectedFile.url) {
      const link = document.createElement("a");
      link.href = selectedFile.url;
      link.download = selectedFile.name; // The name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are allowed");
        setFileForm({ ...fileForm, file: null });
        e.target.value = "";
        return;
      }
      setFileForm({ ...fileForm, file });
    }
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setShowViewModal(true);
  };

  const handleEditFile = (file) => {
    setSelectedFile(file);
    setFileForm({
      name: file.name,
      department: file.department,
      category: file.category,
      file: null,
    });
    setShowEditModal(true);
  };

  const handleUpdateFile = () => {
    if (selectedFolder && selectedFile) {
      const updatedFolders = folders.map((folder) =>
        folder.id === selectedFolder.id
          ? {
              ...folder,
              files: folder.files.map((f) =>
                f.id === selectedFile.id
                  ? {
                      ...f,
                      name: fileForm.name,
                      department: fileForm.department,
                      category: fileForm.category,
                    }
                  : f
              ),
            }
          : folder
      );

      setFolders(updatedFolders);
      setSelectedFolder({
        ...selectedFolder,
        files: selectedFolder.files.map((f) =>
          f.id === selectedFile.id
            ? {
                ...f,
                name: fileForm.name,
                department: fileForm.department,
                category: fileForm.category,
              }
            : f
        ),
      });
      setShowEditModal(false);
      setFileForm({ name: "", department: "", category: "", file: null });
    }
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDeleteFile = () => {
    if (selectedFolder && fileToDelete) {
      const updatedFolders = folders.map((folder) =>
        folder.id === selectedFolder.id
          ? {
              ...folder,
              files: folder.files.filter((f) => f.id !== fileToDelete.id),
              fileCount: folder.fileCount - 1,
            }
          : folder
      );

      setFolders(updatedFolders);
      setSelectedFolder({
        ...selectedFolder,
        files: selectedFolder.files.filter((f) => f.id !== fileToDelete.id),
        fileCount: selectedFolder.fileCount - 1,
      });
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const handleMoreIconClick = (e, folderId) => {
    e.stopPropagation();
    setOpenDropdownFolderId(
      openDropdownFolderId === folderId ? null : folderId
    );
  };

  const handleEditFolder = (e, folder) => {
    e.stopPropagation();
    setFolderToEdit(folder);
    setEditFolderForm({
      name: folder.name,
      category: folder.category,
      row: folder.row || "",
      column: folder.column || "",
    });
    setShowEditFolderModal(true);
    setOpenDropdownFolderId(null);
  };

  const handleDeleteFolder = (e, folder) => {
    e.stopPropagation();
    setFolderToDelete(folder);
    setShowDeleteFolderModal(true);
    setOpenDropdownFolderId(null);
  };

  const handleShowDetails = (e, folder) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    setShowFolderDetailsModal(true);
    setOpenDropdownFolderId(null);
  };

  return (
    <>
      <SidePanel />
      <div className="file-management-page">
        <div className="group">
          {/* Header Section */}
          <div className="filemanagement-header">
            <div className="welcome-message">
              <span className="text-wrapper-77">File Management</span>
            </div>
            <div className="header-actions">
              <div className="search-wrapper">
                <form className="search-form">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search files, folders..."
                  />
                  <svg
                    className="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 21L16.65 16.65"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </form>
              </div>
              <div
                className="notification-button-wrapper"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <img
                  className="notification-button"
                  alt="Notification"
                  src="https://c.animaapp.com/27o9iVJi/img/notification-button@2x.png"
                />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </div>
            </div>
          </div>

          {/* Request Card Section */}
          <RequestCard />

          {/* Folder Section */}
          <div className="folder-section-card">
            <div className="folder-header">
              <div className="folder-title-wrapper">
                <h2 className="text-wrapper-31">Folders</h2>
                <div className="folder-count">
                  <span className="text-wrapper-30">{folders.length}</span>
                </div>
              </div>

              <button
                className="add-folder-button"
                onClick={() => setShowFolderModal(true)}
              >
                <span className="text-wrapper-29">Add Folder</span>
              </button>
            </div>

            <div className="folder-grid">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="folder-card"
                  onClick={() => handleFolderClick(folder)}
                >
                  <img
                    className="more-icon"
                    alt="More icon"
                    src="https://c.animaapp.com/mhuvdo9nn0JUE7/img/more-01-icon-.svg"
                    onClick={(e) => handleMoreIconClick(e, folder.id)}
                  />
                  {openDropdownFolderId === folder.id && (
                    <div className="folder-dropdown">
                      <div
                        className="folder-dropdown-item"
                        onClick={(e) => handleEditFolder(e, folder)}
                      >
                        Edit Folder
                      </div>
                      <div
                        className="folder-dropdown-item"
                        onClick={(e) => handleDeleteFolder(e, folder)}
                      >
                        Delete Folder
                      </div>
                      <div
                        className="folder-dropdown-item"
                        onClick={(e) => handleShowDetails(e, folder)}
                      >
                        Show Details
                      </div>
                    </div>
                  )}
                  <img
                    className="folder-icon"
                    alt="Folder icon"
                    src="https://c.animaapp.com/mhuvdo9nn0JUE7/img/folder-01-icon.svg"
                  />
                  <div className="text-wrapper-27">{folder.name}</div>
                  <div className="text-wrapper-28">
                    {folder.fileCount} files
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Folder Files Section */}
          {selectedFolder && (
            <div
              className={`folder-files-card ${
                selectedFolder ? "folder-files-visible" : ""
              }`}
            >
              <div className="files-header">
                <div className="files-title-wrapper">
                  <h2 className="text-wrapper-32">{selectedFolder.name}</h2>
                  <div className="file-count-2">
                    <span className="text-wrapper-30">
                      {selectedFolder.files.length}
                    </span>
                  </div>
                </div>

                <button
                  className="file-count"
                  onClick={() => setShowFileModal(true)}
                >
                  <span className="text-wrapper-33">Add File</span>
                </button>
              </div>

              <div className="files-table">
                <div className="files-table-header">
                  <div>File ID</div>
                  <div>File Name</div>
                  <div>Date Added</div>
                  <div>Department</div>
                  <div>Category</div>
                  <div>Actions</div>
                </div>

                {selectedFolder.files.map((file) => (
                  <div key={file.id} className="file-row">
                    <div data-label="File ID">{file.id}</div>
                    <div data-label="File Name">
                      <img
                        className="file-icon-cell"
                        alt="File icon"
                        src="https://c.animaapp.com/mhuvdo9nn0JUE7/img/file-icon-05.svg"
                      />
                      {file.name}
                    </div>
                    <div data-label="Date Added">{file.dateAdded}</div>
                    <div data-label="Department">{file.department}</div>
                    <div data-label="Category">{file.category}</div>
                    <div data-label="Actions" className="file-actions">
                      <button
                        className="file-action-btn view"
                        onClick={() => handleViewFile(file)}
                      >
                        View
                      </button>
                      <button
                        className="file-action-btn edit"
                        onClick={() => handleEditFile(file)}
                      >
                        Edit
                      </button>
                      <button
                        className="file-action-btn delete"
                        onClick={() => handleDeleteFile(file)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        title="Add New Folder"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Folder Name</label>
            <input
              type="text"
              value={addFolderForm.name}
              onChange={(e) =>
                setAddFolderForm({ ...addFolderForm, name: e.target.value })
              }
              placeholder="Enter folder name"
            />
          </div>
          <div className="form-group">
            <label>Folder Category</label>
            <select
              value={addFolderForm.category}
              onChange={(e) =>
                setAddFolderForm({ ...addFolderForm, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-row-col">
            <div className="form-row-split">
              <div className="form-group">
                <label>Row</label>
                <select
                  value={addFolderForm.row}
                  onChange={(e) =>
                    setAddFolderForm({ ...addFolderForm, row: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Row
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="form-group">
                <label>Column</label>
                <select
                  value={addFolderForm.column}
                  onChange={(e) =>
                    setAddFolderForm({
                      ...addFolderForm,
                      column: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select Column
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </div>
          </div>
          <div className="folder-modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowFolderModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddFolder}
              disabled={
                !addFolderForm.name ||
                !addFolderForm.category ||
                !addFolderForm.row ||
                !addFolderForm.column
              }
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Folder Modal */}
      <Modal
        isOpen={showEditFolderModal}
        onClose={() => {
          setShowEditFolderModal(false);
          setFolderToEdit(null);
        }}
        title="Edit Folder"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Folder Name</label>
            <input
              type="text"
              value={editFolderForm.name}
              onChange={(e) =>
                setEditFolderForm({ ...editFolderForm, name: e.target.value })
              }
              placeholder="Enter folder name"
            />
          </div>
          <div className="form-group">
            <label>Folder Category</label>
            <select
              value={editFolderForm.category}
              onChange={(e) =>
                setEditFolderForm({
                  ...editFolderForm,
                  category: e.target.value,
                })
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group-row-col">
            <div className="form-row-split">
              <div className="form-group">
                <label>Row</label>
                <select
                  value={editFolderForm.row}
                  onChange={(e) =>
                    setEditFolderForm({
                      ...editFolderForm,
                      row: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select Row
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="form-group">
                <label>Column</label>
                <select
                  value={editFolderForm.column}
                  onChange={(e) =>
                    setEditFolderForm({
                      ...editFolderForm,
                      column: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select Column
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </div>
          </div>
          <div className="folder-modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowEditFolderModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdateFolder}
              disabled={
                !editFolderForm.name ||
                !editFolderForm.category ||
                !editFolderForm.row ||
                !editFolderForm.column
              }
            >
              Update
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Folder Modal */}
      <Modal
        isOpen={showDeleteFolderModal}
        onClose={() => setShowDeleteFolderModal(false)}
        title="Confirm Delete"
      >
        <p className="confirmation-text">
          Are you sure you want to delete this folder and all its contents? This
          action cannot be undone.
        </p>
        <div className="folder-modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteFolderModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={confirmDeleteFolder}
            style={{ backgroundColor: "#dd0303" }}
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Folder Details Modal */}
      <Modal
        isOpen={showFolderDetailsModal}
        onClose={() => setShowFolderDetailsModal(false)}
        title="Folder Details"
      >
        {selectedFolder && (
          <>
            <div className="file-info">
              <div className="file-info-row">
                <span className="file-info-label">Folder Name:</span>
                <span className="file-info-value">{selectedFolder.name}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Category:</span>
                <span className="file-info-value">
                  {selectedFolder.category}
                </span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">File Count:</span>
                <span className="file-info-value">
                  {selectedFolder.fileCount}
                </span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Row:</span>
                <span className="file-info-value">{selectedFolder.row}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Column:</span>
                <span className="file-info-value">{selectedFolder.column}</span>
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={showFileModal}
        onClose={() => {
          setShowFileModal(false);
          setFileForm({ name: "", department: "", category: "", file: null });
          setFileError("");
        }}
        title="Add New File"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>File Name</label>
            <input
              type="text"
              value={fileForm.name}
              onChange={(e) =>
                setFileForm({ ...fileForm, name: e.target.value })
              }
              placeholder="Enter file name"
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              value={fileForm.department}
              onChange={(e) =>
                setFileForm({ ...fileForm, department: e.target.value })
              }
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={fileForm.category}
              onChange={(e) =>
                setFileForm({ ...fileForm, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Upload PDF File *</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {fileError && <div className="error-message">{fileError}</div>}
          </div>
          <div className="file-modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowFileModal(false);
                setFileForm({
                  name: "",
                  department: "",
                  category: "",
                  file: null,
                });
                setFileError("");
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddFile}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedFile ? selectedFile.name : "File Preview"}
      >
        {selectedFile && (
          <div className="file-preview-container">
            {selectedFile.url ? (
              <iframe
                src={`${selectedFile.url}#toolbar=0`}
                title={selectedFile.name}
                className="pdf-preview-iframe"
              />
            ) : (
              <div className="no-preview-message">
                <p>No preview available for this file.</p>
              </div>
            )}
            <div className="download-modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleDownloadFile}
                disabled={!selectedFile.url}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setFileForm({ name: "", department: "", category: "", file: null });
        }}
        title="Edit File"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>File Name</label>
            <input
              type="text"
              value={fileForm.name}
              onChange={(e) =>
                setFileForm({ ...fileForm, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              value={fileForm.department}
              onChange={(e) =>
                setFileForm({ ...fileForm, department: e.target.value })
              }
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={fileForm.category}
              onChange={(e) =>
                setFileForm({ ...fileForm, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowEditModal(false);
                setFileForm({
                  name: "",
                  department: "",
                  category: "",
                  file: null,
                });
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdateFile}>
              Update
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <p className="confirmation-text">
          Are you sure you want to delete this file?
        </p>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={confirmDeleteFile}
            style={{ backgroundColor: "#dd0303" }}
          >
            Delete
          </button>
        </div>
      </Modal>

      <NotificationDropdown
        notifications={notifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};
