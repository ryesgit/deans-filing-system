import React, { useState, useEffect } from "react";
import { SidePanel } from "../components/SidePanel";
import { Modal } from "../components/Modal/Modal";
import "../DeptHeadPage/FileManagementPage/style.css";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { RequestCard } from "../DeptHeadPage/DashboardPage/sections/RequestCard/RequestCard";
import { filesAPI, categoriesAPI } from "../services/api";

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
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [addFolderForm, setAddFolderForm] = useState({
    name: "",
    category: "",
  });
  const [editFolderForm, setEditFolderForm] = useState({
    name: "",
    category: "",
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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        const categoriesData = Array.isArray(response.data.categories) ? response.data.categories : [];
        setFolders(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddFolder = async () => {
    if (addFolderForm.name) {
      try {
        const response = await categoriesAPI.create({
          name: addFolderForm.name,
          description: addFolderForm.category,
        });
        const newFolder = {
          ...response.data.category,
          fileCount: 0,
          files: []
        };
        setFolders([...folders, newFolder]);
        setAddFolderForm({ name: "", category: "" });
        setShowFolderModal(false);
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    }
  };

  const handleUpdateFolder = async () => {
    if (folderToEdit && editFolderForm.name) {
      try {
        await categoriesAPI.update(folderToEdit.id, {
          name: editFolderForm.name,
          description: editFolderForm.category,
        });
        const updatedFolders = folders.map((folder) =>
          folder.id === folderToEdit.id
            ? {
                ...folder,
                name: editFolderForm.name,
                description: editFolderForm.category,
              }
            : folder
        );
        setFolders(updatedFolders);
        setShowEditFolderModal(false);
        setFolderToEdit(null);
      } catch (error) {
        console.error('Failed to update category:', error);
      }
    }
  };

  const confirmDeleteFolder = async () => {
    if (folderToDelete) {
      try {
        await categoriesAPI.delete(folderToDelete.id);
        setFolders(folders.filter((folder) => folder.id !== folderToDelete.id));
        if (selectedFolder && selectedFolder.id === folderToDelete.id) {
          setSelectedFolder(null);
        }
        setShowDeleteFolderModal(false);
        setFolderToDelete(null);
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert(error.message || 'Failed to delete category. It may contain files.');
      }
    }
  };

  const handleFolderClick = async (folder) => {
    if (openDropdownFolderId === folder.id) {
      setOpenDropdownFolderId(null);
      return;
    }
    try {
      const response = await categoriesAPI.getById(folder.id);
      const categoryWithFiles = response.data.category;
      setSelectedFolder({
        ...categoryWithFiles,
        files: categoryWithFiles.files || []
      });
      setOpenDropdownFolderId(null);
    } catch (error) {
      console.error('Failed to fetch category files:', error);
      setSelectedFolder({
        ...folder,
        files: []
      });
      setOpenDropdownFolderId(null);
    }
  };

  const handleAddFile = async () => {
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

    try {
      const formData = new FormData();
      formData.append('file', fileForm.file);
      formData.append('name', fileForm.name);
      formData.append('department', fileForm.department);
      formData.append('category', fileForm.category);
      if (selectedFolder) {
        formData.append('folderId', selectedFolder.id);
      }

      const response = await filesAPI.upload(formData);
      const newFile = response.data;

      if (selectedFolder) {
        const updatedFolders = folders.map((folder) =>
          folder.id === selectedFolder.id
            ? {
                ...folder,
                files: [...(folder.files || []), newFile],
                fileCount: (folder.fileCount || 0) + 1,
              }
            : folder
        );

        setFolders(updatedFolders);
        setSelectedFolder({
          ...selectedFolder,
          files: [...(selectedFolder.files || []), newFile],
          fileCount: (selectedFolder.fileCount || 0) + 1,
        });
      }
      
      setFileForm({ name: "", department: "", category: "", file: null });
      setShowFileModal(false);
    } catch (error) {
      console.error('Failed to upload file:', error);
      setFileError(error.message || 'Failed to upload file');
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

  const handleUpdateFile = async () => {
    if (selectedFolder && selectedFile) {
      try {
        const updateData = {
          name: fileForm.name,
          department: fileForm.department,
          category: fileForm.category,
        };

        await filesAPI.update(selectedFile.id, updateData);

        const updatedFolders = folders.map((folder) =>
          folder.id === selectedFolder.id
            ? {
                ...folder,
                files: (folder.files || []).map((f) =>
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
          files: (selectedFolder.files || []).map((f) =>
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
      } catch (error) {
        console.error('Failed to update file:', error);
        setFileError(error.message || 'Failed to update file');
      }
    }
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDeleteFile = async () => {
    if (selectedFolder && fileToDelete) {
      try {
        await filesAPI.delete(fileToDelete.id);

        const updatedFolders = folders.map((folder) =>
          folder.id === selectedFolder.id
            ? {
                ...folder,
                files: (folder.files || []).filter((f) => f.id !== fileToDelete.id),
                fileCount: (folder.fileCount || 0) - 1,
              }
            : folder
        );

        setFolders(updatedFolders);
        setSelectedFolder({
          ...selectedFolder,
          files: (selectedFolder.files || []).filter((f) => f.id !== fileToDelete.id),
          fileCount: (selectedFolder.fileCount || 0) - 1,
        });
        setShowDeleteModal(false);
        setFileToDelete(null);
      } catch (error) {
        console.error('Failed to delete file:', error);
        alert(error.message || 'Failed to delete file');
      }
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
    setEditFolderForm({ name: folder.name, category: folder.category });
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
                      {(selectedFolder.files || []).length}
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

                {(selectedFolder.files || []).map((file) => (
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
          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowFolderModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddFolder}
              disabled={!addFolderForm.name || !addFolderForm.category}
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
          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowEditFolderModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdateFolder}
              disabled={!editFolderForm.name || !editFolderForm.category}
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
        <div className="modal-actions">
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
          <div className="modal-actions">
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
        title="File Details"
      >
        {selectedFile && (
          <>
            <div className="file-info">
              <div className="file-info-row">
                <span className="file-info-label">File Name:</span>
                <span className="file-info-value">{selectedFile.name}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Department:</span>
                <span className="file-info-value">
                  {selectedFile.department}
                </span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Category:</span>
                <span className="file-info-value">{selectedFile.category}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Date Added:</span>
                <span className="file-info-value">
                  {selectedFile.dateAdded}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" style={{ width: "100%" }}>
                Download PDF
              </button>
            </div>
          </>
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
