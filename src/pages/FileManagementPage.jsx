import React, { useState, useEffect } from "react";
import { SidePanel } from "../components/SidePanel";
import { Modal } from "../components/Modal/Modal";
import "../DeptHeadPage/FileManagementPage/style.css";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { RequestCard } from "../DeptHeadPage/DashboardPage/sections/RequestCard/RequestCard";
import { GlobalSearch } from "../components/GlobalSearch/GlobalSearch";
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
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

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
      formData.append('filename', fileForm.name); // Backend expects 'filename'
      formData.append('department', fileForm.department);
      // Backend expects 'categoryId'
      if (selectedFolder) {
        formData.append('categoryId', selectedFolder.id);
      } else if (fileForm.category) {
         // If user selected category from dropdown but not inside a folder view
         // We might need to find the category ID based on name, but for now let's send the name
         // and let the backend handle it or update the UI to store ID.
         // Ideally, the dropdown should store IDs.
         // For now, let's assume the dropdown values are names and we might need to look them up
         // or just send it if the backend supports it (it doesn't seem to support name lookup directly in upload).
         // Let's rely on selectedFolder for now as the primary way.
      }
      
      // Add default physical location values as they are required by backend schema but missing in UI
      formData.append('rowPosition', '1');
      formData.append('columnPosition', '1');
      formData.append('shelfNumber', '1');

      const response = await filesAPI.upload(formData);
      const newFile = response.data.file || response.data; // Handle potential response structure variations

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

  const handleViewFile = async (file) => {
    setSelectedFile(file);
    setShowViewModal(true);
    setPdfLoading(true);
    setPdfUrl(null);

    try {
      const response = await filesAPI.download(file.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to load PDF:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleEditFile = (file) => {
    setSelectedFile(file);
    setFileForm({
      name: file.filename || file.name,
      department: file.user?.department || file.department || '',
      category: file.category?.name || file.category || '',
      file: null,
    });
    setShowEditModal(true);
  };

  const handleUpdateFile = async () => {
    if (selectedFolder && selectedFile) {
      try {
        const updateData = {
          name: fileForm.name,
          category: fileForm.category,
        };

        const response = await filesAPI.update(selectedFile.id, updateData);
        const updatedFile = response.data.file;

        const updatedFolders = folders.map((folder) =>
          folder.id === selectedFolder.id
            ? {
                ...folder,
                files: (folder.files || []).map((f) =>
                  f.id === selectedFile.id ? updatedFile : f
                ),
              }
            : folder
        );

        setFolders(updatedFolders);
        setSelectedFolder({
          ...selectedFolder,
          files: (selectedFolder.files || []).map((f) =>
            f.id === selectedFile.id ? updatedFile : f
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

  const handleDownloadPdf = async () => {
    if (selectedFile) {
      try {
        const response = await filesAPI.download(selectedFile.id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', selectedFile.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    }
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
                <GlobalSearch />
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
                      {file.filename || file.name || 'N/A'}
                    </div>
                    <div data-label="Date Added">
                      {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : (file.dateAdded || 'N/A')}
                    </div>
                    <div data-label="Department">{file.user?.department || file.department || 'N/A'}</div>
                    <div data-label="Category">{file.category?.name || file.category || 'N/A'}</div>
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
        onClose={() => {
          setShowViewModal(false);
          if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
          }
          setPdfUrl(null);
          setPdfLoading(false);
        }}
        title="File Preview"
      >
        {selectedFile && (
          <>
            <div className="file-info">
              <div className="file-info-row">
                <span className="file-info-label">File Name:</span>
                <span className="file-info-value">{selectedFile.filename || selectedFile.name || 'N/A'}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Department:</span>
                <span className="file-info-value">
                  {selectedFile.user?.department || selectedFile.department || 'N/A'}
                </span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Category:</span>
                <span className="file-info-value">{selectedFile.category?.name || selectedFile.category || 'N/A'}</span>
              </div>
              <div className="file-info-row">
                <span className="file-info-label">Date Added:</span>
                <span className="file-info-value">
                  {selectedFile.createdAt ? new Date(selectedFile.createdAt).toLocaleDateString() : (selectedFile.dateAdded || 'N/A')}
                </span>
              </div>
            </div>
            {pdfLoading && (
              <div className="pdf-preview" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '600px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginTop: '20px',
                backgroundColor: '#f5f5f5'
              }}>
                <p style={{
                  fontFamily: 'Poppins, Helvetica',
                  fontSize: '16px',
                  color: '#666'
                }}>Loading PDF...</p>
              </div>
            )}
            {!pdfLoading && pdfUrl && (
              <div className="pdf-preview">
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                  style={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: '20px' }}
                />
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleDownloadPdf}>
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

        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};
