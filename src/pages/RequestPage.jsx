import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import { SidePanel } from "../components/SidePanel";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { GlobalSearch } from "../components/GlobalSearch/GlobalSearch";
import FileSearchInput from "../components/FileSearchInput";
import "../DeptHeadPage/RequestPage/RequestPage.css";
import "../DeptHeadPage/DashboardPage/style.css";
import { useNotifications } from "../components/NotificationDropdown/NotificationContext";
import { requestsAPI, filesAPI, categoriesAPI } from "../services/api";
import { Modal } from "../components/Modal/Modal";
import { useAuth } from "../components/Modal/AuthContext";
import { sendReturnDateReminderEmail } from "../utils/email";
import { sanitizeData } from "../utils/sanitization";

const normalizeId = (value) =>
    value === null || value === undefined ? null : String(value);

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

const belongsToUser = (request, currentUser) => {
    const requestUserIds = [request?.userId, request?.user?.userId, request?.user?.id]
        .map(normalizeId)
        .filter(Boolean);
    const currentUserIds = [currentUser?.userId, currentUser?.id]
        .map(normalizeId)
        .filter(Boolean);

    return currentUserIds.some((userId) => requestUserIds.includes(userId));
};

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div
                className="confirm-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="confirm-modal-close" onClick={onClose}>
                    ×
                </button>
                <h2 className="confirm-modal-title">{title}</h2>
                <div className="confirm-modal-body">{children}</div>
                <div className="confirm-modal-actions">
                    {cancelText && (
                        <button
                            className="confirm-modal-btn confirm-modal-cancel"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    )}
                    {confirmText && (
                        <button
                            className="confirm-modal-btn confirm-modal-confirm"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const QRModal = ({ isOpen, onClose, userName, qrValue }) => {
    if (!isOpen) return null;

    return (
        <div className="qr-modal-overlay" onClick={onClose}>
            <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="qr-modal-close" onClick={onClose}>
                    ×
                </button>
                <h2 className="qr-modal-title">Your QR Code</h2>
                <div className="qr-modal-code">
                    <QRCodeSVG value={qrValue} size={300} level="H" />
                </div>
                <p className="qr-modal-user">{userName}</p>
            </div>
        </div>
    );
};

const FormCard = ({ onSubmit, hasActiveOriginalFile, requests }) => {
    const { user } = useAuth();
    const isRestrictedRole = ["FACULTY", "STUDENT"].includes(user?.role?.toUpperCase());

    const [formData, setFormData] = useState({
        fileName: "",
        department: "",
        fileCategory: "",
        purpose: "",
        copyType: isRestrictedRole ? "original" : "soft",
        returnDate: "",
        priority: "",
        fileId: null,
    });

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [showFileLimitModal, setShowFileLimitModal] = useState(false);

    const departments = [
        "Civil Engineering",
        "Industrial Engineering",
        "Electronics and Communications Engineering",
        "Mechanical Engineering",
        "Computer Engineering",
        "Electrical Engineering",
        "Railway Engineering Management",
    ];

    const categories = [
        "Thesis",
        "Capstone",
        "Research",
        "Administrative",
        "Research Papers",
        "Reports",
        "Guidelines",
        "Handbooks",
        "Grant Documents",
    ];

    const priorities = ["Low", "Medium", "High"];

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileSelect = (fileInfo) => {
        const rawCategory = fileInfo.fileCategory;
        const resolvedCategory =
            rawCategory && typeof rawCategory === "object"
                ? rawCategory.name || ""
                : rawCategory || "";

        setFormData((prev) => ({
            ...prev,
            fileName: fileInfo.fileName,
            fileId: fileInfo.fileData?.id,
            department: fileInfo.department || prev.department,
            fileCategory: resolvedCategory || prev.fileCategory,
        }));
    };

    const handleCopyTypeChange = (type) => {
        setFormData((prev) => ({
            ...prev,
            copyType: type,
            returnDate: type === "soft" ? "" : prev.returnDate,
            priority: type === "soft" ? "" : prev.priority,
        }));
    };

    const handleSubmitClick = () => {
        if (
            !formData.fileName ||
            !formData.department ||
            !formData.fileCategory ||
            !formData.purpose
        ) {
            alert("Please fill in all required fields");
            return;
        }

        if (formData.copyType === "original" && hasActiveOriginalFile) {
            setShowFileLimitModal(true);
            return;
        }

        const isDuplicate = requests.some(
            (req) => 
                req.fileId === formData.fileId && 
                (req.status === "PENDING" || req.status === "Pending")
        );

        if (isDuplicate) {
            alert("You already have a pending request for this file. Please wait for it to be processed.");
            return;
        }

        if (formData.copyType === "original") {
            if (!formData.returnDate) {
                alert("Please select a return date for original copy requests");
                return;
            }
            if (!formData.priority) {
                alert("Please select priority for original copy requests");
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const returnDate = new Date(formData.returnDate);
            returnDate.setHours(0, 0, 0, 0);
            
            const diffTime = Math.abs(returnDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 1 || diffDays > 3) {
                alert("For original copies, the return date must be between 1 and 3 days from today.");
                return;
            }
        }

        setShowSubmitModal(true);
    };

    const handleConfirmSubmit = async () => {
        const descriptionParts = [
            `Purpose: ${formData.purpose}`,
            `Department: ${formData.department}`,
            `Category: ${formData.fileCategory}`,
            `Copy Type: ${formData.copyType === "soft" ? "Soft Copy Only" : "Original Copy"
            }`,
        ];

        if (formData.copyType === "original" && formData.returnDate) {
            descriptionParts.push(`Return Date: ${formData.returnDate}`);
        }

        const requestData = sanitizeData({
            title: formData.fileName,
            description: descriptionParts.join("\n"),
            type: "FILE_ACCESS",
            priority: formData.priority || "normal",
            fileId: formData.fileId,
        });

        try {
            const response = await requestsAPI.create(requestData);
            onSubmit(response.data.request || response.data);
            setShowSubmitModal(false);
            handleClear();
        } catch (error) {
            console.error("Failed to submit request:", error);
            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to submit request"
            );
            setShowSubmitModal(false);
        }
    };

    const handleClearClick = () => {
        setShowClearModal(true);
    };

    const handleConfirmClear = () => {
        handleClear();
        setShowClearModal(false);
    };

    const handleClear = () => {
        setFormData({
            fileName: "",
            department: "",
            fileCategory: "",
            purpose: "",
            copyType: isRestrictedRole ? "original" : "soft",
            returnDate: "",
            priority: "",
            fileId: null,
        });
    };

    return (
        <div className="form-card">
            <h2 className="form-title">Request Form</h2>

            <div className="form-row-three">
                <div className="form-field">
                    <FileSearchInput
                        value={formData.fileName}
                        onChange={(value) => handleChange("fileName", value)}
                        onFileSelect={handleFileSelect}
                        copyType={formData.copyType}
                    />
                </div>

                <div className="form-field">
                    <select
                        className="form-select"
                        value={formData.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                    >
                        <option value="">Department</option>
                        {formData.department && !departments.includes(formData.department) && (
                            <option key={formData.department} value={formData.department}>
                                {formData.department}
                            </option>
                        )}
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <select
                        className="form-select"
                        value={formData.fileCategory}
                        onChange={(e) => handleChange("fileCategory", e.target.value)}
                    >
                        <option value="">File Category</option>
                        {formData.fileCategory && !categories.includes(formData.fileCategory) && (
                            <option key={formData.fileCategory} value={formData.fileCategory}>
                                {formData.fileCategory}
                            </option>
                        )}
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="copy-type-section">
                    <label className="copy-type-label">Copy Type</label>
                    <div className="copy-type-buttons">
                        {!isRestrictedRole && (
                            <label
                                className={`copy-type-label-btn ${formData.copyType === "soft" ? "active" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="copyType"
                                    className="copy-type-btn"
                                    checked={formData.copyType === "soft"}
                                    onChange={() => handleCopyTypeChange("soft")}
                                />
                                Soft Copy Only
                            </label>
                        )}
                        <label
                            className={`copy-type-label-btn ${formData.copyType === "original" ? "active" : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name="copyType"
                                className="copy-type-btn"
                                checked={formData.copyType === "original"}
                                onChange={() => handleCopyTypeChange("original")}
                            />
                            Original Copy
                        </label>
                    </div>
                </div>
            </div>

            {formData.copyType === "original" && (
                <div className="form-row-two">
                    <div className="form-field">
                        <label className="copy-type-label">Return Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.returnDate}
                            onChange={(e) => handleChange("returnDate", e.target.value)}
                            min={format(new Date(), "yyyy-MM-dd")}
                        />
                    </div>

                    <div className="form-field">
                        <label className="copy-type-label">Priority</label>
                        <select
                            className="form-select"
                            value={formData.priority}
                            onChange={(e) => handleChange("priority", e.target.value)}
                        >
                            <option value="">Select Priority</option>
                            {priorities.map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="form-row">
                <div className="form-field-full">
                    <textarea
                        className="form-textarea"
                        placeholder="Purpose"
                        value={formData.purpose}
                        onChange={(e) => handleChange("purpose", e.target.value)}
                        rows="4"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button className="btn-clear" onClick={handleClearClick} type="button">
                    Clear
                </button>
                <button
                    className="btn-submit"
                    onClick={handleSubmitClick}
                    type="button"
                >
                    Submit
                </button>
            </div>

            <ConfirmModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Request Submission"
                confirmText="Confirm"
                cancelText="Cancel"
            >
                <div className="confirm-detail-row">
                    <span className="confirm-detail-label">File Name:</span>
                    <span className="confirm-detail-value">{formData.fileName}</span>
                </div>
                <div className="confirm-detail-row">
                    <span className="confirm-detail-label">Department:</span>
                    <span className="confirm-detail-value">{formData.department}</span>
                </div>
                <div className="confirm-detail-row">
                    <span className="confirm-detail-label">File Category:</span>
                    <span className="confirm-detail-value">{formData.fileCategory}</span>
                </div>
                <div className="confirm-detail-row">
                    <span className="confirm-detail-label">Purpose:</span>
                    <span className="confirm-detail-value">{formData.purpose}</span>
                </div>
                <div className="confirm-detail-row">
                    <span className="confirm-detail-label">Copy Type:</span>
                    <span className="confirm-detail-value">
                        {formData.copyType === "soft" ? "Soft Copy Only" : "Original Copy"}
                    </span>
                </div>
                {formData.copyType === "original" && (
                    <>
                        <div className="confirm-detail-row">
                            <span className="confirm-detail-label">Return Date:</span>
                            <span className="confirm-detail-value">
                                {formData.returnDate
                                    ? format(new Date(formData.returnDate), "MM/dd/yyyy")
                                    : "Not set"}
                            </span>
                        </div>
                        <div className="confirm-detail-row">
                            <span className="confirm-detail-label">Priority:</span>
                            <span className="confirm-detail-value">{formData.priority}</span>
                        </div>
                    </>
                )}
            </ConfirmModal>

            <ConfirmModal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                onConfirm={handleConfirmClear}
                title="Clear Form?"
                confirmText="Yes, Clear Form"
                cancelText="Cancel"
            >
                <p className="confirm-modal-message">
                    Are you sure you want to clear all fields?
                </p>
            </ConfirmModal>

            <ConfirmModal
                isOpen={showFileLimitModal}
                onClose={() => setShowFileLimitModal(false)}
                onConfirm={() => setShowFileLimitModal(false)}
                title="File Borrowing Limit Reached"
                confirmText="OK"
                cancelText=""
            >
                <p className="confirm-modal-message">
                    You currently have a file assigned for borrowing.
                    <br />
                    <br />
                    Please return your current file before requesting another original copy.
                    <br />
                    <br />
                    <strong>Note:</strong> You can still request soft copies.
                </p>
            </ConfirmModal>
        </div>
    );
};

const QRCard = ({
    userName = "John Doe",
    userId = "USER-001",
    assignedFile = null,
    onQRCodeClick,
}) => {
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const qrValue = userId || "USER-UNKNOWN";

    const handleDownloadQROnly = () => {
        const svg = document.getElementById("qr-code-svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `QR_${userId}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
            setShowDownloadModal(false);
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const handleDownloadWithDetails = async () => {
        const qrCardElement = document.getElementById("qr-card-content");
        const downloadButton = document.getElementById("qr-download-button");
        if (!qrCardElement) return;

        try {
            if (downloadButton) downloadButton.style.display = 'none';

            const canvas = await html2canvas(qrCardElement, {
                backgroundColor: "#ffffff",
                scale: 2,
                logging: false,
                useCORS: true,
            });

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR_${userId}_with_details.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
            setShowDownloadModal(false);
        } catch (error) {
            console.error("Failed to download QR with details:", error);
            alert("Failed to download. Please try again.");
        } finally {
            if (downloadButton) downloadButton.style.display = 'flex';
        }
    };

    return (
        <div className="qr-card">
            <div id="qr-card-content" style={{ width: '100%' }}>
                <div
                    className="qr-code-wrapper"
                    onClick={onQRCodeClick}
                    title="Click to enlarge"
                    style={{
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "2px solid #f0f0f0",
                        minHeight: "220px",
                        minWidth: "220px",
                    }}
                >
                    <div style={{ width: "180px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={qrValue}
                            size={180}
                            level="H"
                            className="qr-code-svg"
                            style={{ display: "block" }}
                        />
                    </div>
                </div>
                <button
                    id="qr-download-button"
                    className="qr-btn qr-btn-download"
                    onClick={() => setShowDownloadModal(true)}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.66669 6.66669L8.00002 10L11.3334 6.66669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download
                </button>

                {assignedFile ? (
                    <div className="qr-file-stats">
                        <div className="qr-file-stat-item">
                            <span className="qr-file-stat-label">Assigned File:</span>
                            <span className="qr-file-stat-value">{assignedFile.fileName || 'N/A'}</span>
                        </div>
                        <div className="qr-file-stat-item">
                            <span className="qr-file-stat-label">Folder Number:</span>
                            <span className="qr-file-stat-value">{assignedFile.folderNumber || 'N/A'}</span>
                        </div>
                        <div className="qr-file-stat-item">
                            <span className="qr-file-stat-label">Folder Name:</span>
                            <span className="qr-file-stat-value">{assignedFile.folderName || 'N/A'}</span>
                        </div>
                        <div className="qr-file-stat-item">
                            <span className="qr-file-stat-label">Return Date:</span>
                            <span className="qr-file-stat-value">{assignedFile.returnDate || 'N/A'}</span>
                        </div>
                        <div className="qr-file-stat-item">
                            <span className="qr-file-stat-label">Location:</span>
                            <span className="qr-file-stat-value">
                                Row {assignedFile.row || 'N/A'} - Column {assignedFile.column || 'N/A'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="qr-file-stats">
                        <div className="qr-file-stat-item">
                            <span className="qr-file-stat-label">No file assigned</span>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                onConfirm={() => setShowDownloadModal(false)}
                title="Download QR Code"
                confirmText=""
                cancelText="Cancel"
            >
                <p style={{ fontFamily: 'Poppins, Helvetica', fontSize: '14px', marginBottom: '1rem', textAlign: 'center' }}>
                    Choose download option:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={handleDownloadQROnly}
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#800000', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Poppins, Helvetica', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Download QR Code Only
                    </button>
                    {assignedFile && (
                        <button
                            onClick={handleDownloadWithDetails}
                            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#800000', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Poppins, Helvetica', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            Download with File Details
                        </button>
                    )}
                </div>
            </ConfirmModal>
        </div>
    );
};

const RequestCard = ({
    requests = [],
    onRequestCancelled,
    selectedRequestId = null,
    requestFocusNonce = null,
}) => {
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequestForDetails, setSelectedRequestForDetails] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const { user } = useAuth();

    const isSoftCopy = (description) => {
        return description?.includes("Soft Copy Only");
    };

    const handleViewPDF = async (request) => {
        if (!request.fileId) {
            alert("File not available. Please contact support.");
            return;
        }

        setSelectedRequest(request);
        setShowPDFModal(true);
        setPdfLoading(true);
        setPdfUrl(null);

        try {
            const response = await filesAPI.download(request.fileId);
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Failed to load PDF:", error);
            alert("Failed to load PDF. Please try again or contact support.");
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId && !event.target.closest(".three-dot-menu")) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openMenuId]);

    useEffect(() => {
        if (selectedRequestId === null || selectedRequestId === undefined) return;

        const matchedRequest = requests.find(
            (request) => String(request.id) === String(selectedRequestId)
        );

        if (matchedRequest) {
            setSelectedRequestForDetails(matchedRequest);
            setShowDetailsModal(true);
        }
    }, [requests, selectedRequestId, requestFocusNonce]);

    const handleShowDetails = (request, e) => {
        if (e.target.closest(".status-badge") || e.target.closest(".three-dot-menu")) return;
        setSelectedRequestForDetails(request);
        setShowDetailsModal(true);
    };

    const toggleMenu = (id, e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleCancelClick = (request, e) => {
        e.stopPropagation();
        setRequestToCancel(request);
        setShowCancelModal(true);
        setOpenMenuId(null);
    };

    const handleConfirmCancel = async () => {
        if (!requestToCancel) return;

        try {
            await requestsAPI.delete(requestToCancel.id);
            setShowCancelModal(false);
            setRequestToCancel(null);
            if (onRequestCancelled) {
                onRequestCancelled(requestToCancel.id);
            }
        } catch (error) {
            console.error("Failed to cancel request:", error);
            alert("Failed to cancel request. Please try again.");
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            PENDING: "status-pending",
            APPROVED: "status-approved",
            DECLINED: "status-declined",
            CANCELLED: "status-cancelled",
            Borrowed: "status-borrowed",
            Returned: "status-returned",
            Pending: "status-pending",
            Approved: "status-approved",
            Declined: "status-declined",
        };
        return statusMap[status] || "status-pending";
    };

    const getStatusLabel = (status) => {
        const labelMap = {
            PENDING: "Pending",
            APPROVED: "Approved",
            DECLINED: "Declined",
            CANCELLED: "Cancelled",
            BORROWED: "Borrowed",
            RETURNED: "Returned",
        };
        return labelMap[status?.toUpperCase()] || status;
    };

    return (
        <>
            <div className="request-card">
                <h3 className="request-card-title">Request Status</h3>
                <div className="table-container">
                    <table className="request-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>File Name</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="no-requests-row">
                                        No requests yet. Submit a request to get started!
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr
                                        key={request.id}
                                        className="table-row"
                                        onClick={(e) => handleShowDetails(request, e)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{request.id}</td>
                                        <td className="file-name-cell" title={request.fileName}>
                                            {request.fileName}
                                        </td>
                                        <td>{request.returnDue}</td>
                                        <td>
                                            {request.status === "APPROVED" &&
                                                isSoftCopy(request.description) &&
                                                user?.role !== "ADMIN" &&
                                                user?.role !== "STAFF" ? (
                                                <span
                                                    className="status-badge status-view-pdf"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewPDF(request);
                                                    }}
                                                    title="Click to view PDF"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    View PDF
                                                </span>
                                            ) : (
                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        request.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(request.status)}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ position: "relative", textAlign: "center" }}>
                                            <div style={{ position: "relative", display: "inline-block" }} className="three-dot-menu">
                                                <button
                                                    onClick={(e) => toggleMenu(request.id, e)}
                                                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", padding: "4px 8px" }}
                                                >
                                                    ⋯
                                                </button>
                                                {openMenuId === request.id && (
                                                    <div
                                                        style={{ position: "absolute", right: 0, top: "100%", backgroundColor: "white", border: "1px solid #ddd", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 1000, minWidth: "120px" }}
                                                    >
                                                        <button
                                                            onClick={request.status === "PENDING" ? (e) => handleCancelClick(request, e) : undefined}
                                                            disabled={request.status !== "PENDING"}
                                                            style={{ width: "100%", padding: "8px 16px", border: "none", background: "none", textAlign: "left", cursor: request.status === "PENDING" ? "pointer" : "not-allowed", color: request.status === "PENDING" ? "#d32f2f" : "#999", opacity: request.status === "PENDING" ? 1 : 0.5 }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showPDFModal}
                onClose={() => {
                    setShowPDFModal(false);
                    if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                    setPdfLoading(false);
                }}
                title="File Preview"
            >
                {selectedRequest && (
                    <>
                        <div className="file-info">
                            <div className="file-info-row">
                                <span className="file-info-label">File Name:</span>
                                <span className="file-info-value">{selectedRequest.fileName}</span>
                            </div>
                            <div className="file-info-row">
                                <span className="file-info-label">Request ID:</span>
                                <span className="file-info-value">{selectedRequest.id}</span>
                            </div>
                            <div className="file-info-row">
                                <span className="file-info-label">Date Requested:</span>
                                <span className="file-info-value">{selectedRequest.dateRequested}</span>
                            </div>
                        </div>
                        {pdfLoading && (
                            <div className="pdf-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px", border: "1px solid #e0e0e0", borderRadius: "8px", marginTop: "20px", backgroundColor: "#f5f5f5" }}>
                                <p style={{ color: "#666" }}>Loading PDF...</p>
                            </div>
                        )}
                        {!pdfLoading && pdfUrl && (
                            <div className="pdf-preview">
                                <iframe src={pdfUrl} title="PDF Preview" width="100%" height="600px" style={{ border: "1px solid #e0e0e0", borderRadius: "8px", marginTop: "20px" }} />
                            </div>
                        )}
                    </>
                )}
            </Modal>

            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Request Details"
            >
                {selectedRequestForDetails && (
                    <div className="request-details-modal-content">
                        <div className="details-row">
                            <span className="file-info-label">Request ID:</span>
                            <span className="file-info-value">{selectedRequestForDetails.id}</span>
                        </div>
                        <div className="details-row">
                            <span className="file-info-label">File Name:</span>
                            <span className="file-info-value">{selectedRequestForDetails.fileName}</span>
                        </div>
                        <div className="details-row">
                            <span className="file-info-label">Copy Type:</span>
                            <span className="file-info-value">
                                {isSoftCopy(selectedRequestForDetails.description) ? "Soft Copy" : "Original Copy"}
                            </span>
                        </div>
                        <div className="details-row">
                            <span className="file-info-label">Date Submitted:</span>
                            <span className="file-info-value">{selectedRequestForDetails.dateRequested}</span>
                        </div>
                        {(() => {
                            const desc = selectedRequestForDetails.description || "";
                            const returnDateMatch = desc.match(/Return Date:\s*(.+)/);
                            const expectedDate = selectedRequestForDetails.returnDate || selectedRequestForDetails.returnDue || (returnDateMatch ? returnDateMatch[1].trim() : null);
                            if (expectedDate && expectedDate !== "N/A") {
                                return (
                                    <div className="details-row">
                                        <span className="file-info-label">Expected Return Date:</span>
                                        <span className="file-info-value">
                                            {isNaN(new Date(expectedDate).getTime()) ? expectedDate : new Date(expectedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                        <div className="details-row">
                            <span className="file-info-label">Returned Date:</span>
                            <span className="file-info-value">
                                {selectedRequestForDetails.returnedAt ? new Date(selectedRequestForDetails.returnedAt).toLocaleDateString() : "N/A"}
                            </span>
                        </div>
                        <div className="details-row">
                            <span className="file-info-label">Status:</span>
                            <span className={`file-info-value status-text ${getStatusClass(selectedRequestForDetails.status)}`}>
                                {getStatusLabel(selectedRequestForDetails.status)}
                            </span>
                        </div>
                        {selectedRequestForDetails.status === "DECLINED" && selectedRequestForDetails.rejectionReason && (
                            <div className="details-row rejection-row">
                                <span className="file-info-label">Rejection Reason:</span>
                                <span className="file-info-value rejection-reason">{selectedRequestForDetails.rejectionReason}</span>
                            </div>
                        )}
                        <div className="details-row">
                            <span className="file-info-label">Purpose:</span>
                            <span className="file-info-value purpose">
                                {(() => {
                                    const desc = selectedRequestForDetails.description || "No description";
                                    const purposeMatch = desc.match(/Purpose:\s*(.+)/);
                                    if (purposeMatch) return purposeMatch[1].trim();
                                    return desc.split('\n').filter(line => {
                                        const t = line.trim();
                                        return !t.startsWith('Department:') && !t.startsWith('Category:') && !t.startsWith('Copy Type:') && !t.startsWith('Return Date:');
                                    }).join('\n').trim() || "No description";
                                })()}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setRequestToCancel(null);
                }}
                onConfirm={handleConfirmCancel}
                title="Cancel Request"
                confirmText="Yes, Cancel Request"
                cancelText="No, Keep Request"
            >
                <p className="confirm-modal-message">
                    Are you sure you want to cancel this request?
                    {requestToCancel && (
                        <>
                            <br />
                            <strong>Request ID: {requestToCancel.id}</strong>
                            <br />
                            <strong>File: {requestToCancel.fileName}</strong>
                        </>
                    )}
                </p>
            </ConfirmModal>
        </>
    );
};

export const RequestPage = () => {
    const location = useLocation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const { user: currentUser } = useAuth();
    const { unreadCount } = useNotifications();

    useEffect(() => {
        const fetchRequests = async () => {
            if (!currentUser?.userId && !currentUser?.id) {
                setLoading(false);
                return;
            }

            try {
                const response = await requestsAPI.getAll();
                const requestsData = response.data.requests || response.data;

                if (!Array.isArray(requestsData)) {
                    setRequests([]);
                    return;
                }

                const filteredRequests = requestsData
                    .filter((req) => req.status !== "CANCELLED")
                    .filter((req) => belongsToUser(req, currentUser));

                const hasApprovedOriginal = filteredRequests.some(
                    (req) =>
                        (req.status === "APPROVED" || req.status === "Approved") &&
                        req.description?.includes("Original Copy") &&
                        req.fileId
                );

                let filesById = new Map();
                let allCategories = [];
                if (hasApprovedOriginal) {
                    try {
                        const catResponse = await categoriesAPI.getAll();
                        allCategories = catResponse.data?.categories || catResponse.data || [];
                    } catch (error) {
                        console.error("Failed to fetch categories:", error);
                    }

                    const needsFileLookup = filteredRequests.some(
                        (req) =>
                            (req.status === "APPROVED" || req.status === "Approved") &&
                            req.description?.includes("Original Copy") &&
                            req.fileId &&
                            !req.file
                    );
                    if (needsFileLookup) {
                        try {
                            const fileResponse = await filesAPI.getAll();
                            const allFiles = fileResponse.data.files || fileResponse.data || [];
                            filesById = new Map(allFiles.map((file) => [file.id, file]));
                        } catch (error) {
                            console.error("Failed to fetch files:", error);
                        }
                    }
                }

                const mappedRequests = await Promise.all(
                    filteredRequests.map(async (req) => {
                        const baseRequest = {
                            id: req.id,
                            fileName: req.title,
                            dateRequested: req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A",
                            returnDue: req.approvedAt ? new Date(req.approvedAt).toLocaleDateString() : "N/A",
                            status: req.status,
                            copyType: req.type,
                            fileId: req.fileId,
                            description: req.description,
                            file: req.file ? { ...req.file } : null,
                            createdAt: req.createdAt,
                            approvedAt: req.approvedAt,
                            returnedAt: req.returnedAt,
                        };

                        if ((req.status === "APPROVED" || req.status === "Approved") && req.description?.includes("Original Copy") && req.fileId) {
                            if (!baseRequest.file) {
                                const fileDetails = filesById.get(req.fileId);
                                if (fileDetails) baseRequest.file = { ...fileDetails };
                            }

                            if (baseRequest.file && allCategories.length > 0) {
                                const catId = baseRequest.file.categoryId || baseRequest.file.category?.id;
                                const catName = typeof baseRequest.file.category === 'string' ? baseRequest.file.category : baseRequest.file.category?.name;
                                let matchedCategory = allCategories.find((c) => c.id === catId) || allCategories.find((c) => c.name === catName);

                                if (matchedCategory) {
                                    baseRequest.file.category = matchedCategory;
                                    baseRequest.file.folderName = matchedCategory.name;
                                    baseRequest.file.folderNumber = matchedCategory.folderNumber;
                                    baseRequest.file.rowPosition = baseRequest.file.rowPosition || matchedCategory.row;
                                    baseRequest.file.columnPosition = baseRequest.file.columnPosition || matchedCategory.column;
                                }
                            }
                        }
                        return baseRequest;
                    })
                );

                setRequests(mappedRequests);
            } catch (error) {
                console.error("Failed to fetch requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [currentUser]);

    useEffect(() => {
        if (!requests.length || !currentUser) return;
        const REMINDER_DAYS = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        requests.forEach((req) => {
            if ((req.status !== "APPROVED" && req.status !== "Approved") || !req.description?.includes("Original Copy")) return;

            const returnDateMatch = req.description?.match(/Return Date:\s*(.+)/);
            if (!returnDateMatch) return;

            const returnDate = new Date(returnDateMatch[1].trim());
            if (isNaN(returnDate.getTime())) return;
            returnDate.setHours(0, 0, 0, 0);

            const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
            if (daysLeft < 0 || daysLeft > REMINDER_DAYS) return;

            const reminderKey = `return_reminder_${req.id}_${returnDate.toISOString().split('T')[0]}_day${daysLeft}`;
            if (localStorage.getItem(reminderKey)) return;

            const userEmail = currentUser?.email || currentUser?.emailAddress || "";
            if (!userEmail) return;

            sendReturnDateReminderEmail({
                toEmail: userEmail,
                toName: currentUser?.name || "User",
                fileName: req.fileName || "your borrowed file",
                returnDate: returnDate.toLocaleDateString(),
                daysLeft,
            }).then(() => {
                localStorage.setItem(reminderKey, "sent");
            });
        });
    }, [requests, currentUser]);

    const handleSubmitRequest = (newRequest) => {
        const mappedRequest = {
            id: newRequest.id,
            fileName: newRequest.title,
            dateRequested: new Date().toLocaleDateString(),
            returnDue: "N/A",
            status: newRequest.status,
            copyType: newRequest.type,
            fileId: newRequest.fileId,
            description: newRequest.description,
            file: newRequest.file,
        };
        setRequests((prev) => [mappedRequest, ...prev]);
    };

    const handleRequestCancelled = (requestId) => {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
    };

    const isOriginalCopy = (req) => req.description?.includes("Original Copy");

    const buildAssignedFile = () => {
        const approvedOriginalRequest = requests.find(req => (req.status === "APPROVED" || req.status === "Approved") && !["COMPLETED", "Completed"].includes(req.status) && isOriginalCopy(req));
        if (!approvedOriginalRequest) return null;

        const file = approvedOriginalRequest.file || {};
        const returnDateMatch = (approvedOriginalRequest.description || "").match(/Return Date:\s*(.+)/);
        
        return {
            fileName: file.filename || file.name || approvedOriginalRequest.fileName || "N/A",
            folderNumber: file.folderNumber || file.category?.folderNumber || "N/A",
            folderName: file.folderName || file.category?.name || "N/A",
            column: file.columnPosition || file.column || "N/A",
            row: file.rowPosition || file.row || "N/A",
            returnDate: returnDateMatch ? returnDateMatch[1].trim() : "N/A",
        };
    };

    const assignedFile = buildAssignedFile();
    const filesAssigned = requests.filter(req => (req.status === "APPROVED" || req.status === "Approved") && isOriginalCopy(req)).length;
    const filesToReturn = requests.filter(req => (req.status === "BORROWED" || req.status === "Borrowed") && isOriginalCopy(req)).length;
    const hasActiveOriginalFile = filesAssigned > 0 || filesToReturn > 0;
    
    const selectedRequestId = location.state?.selectedRequestId ?? null;
    const requestFocusNonce = location.state?.requestFocusNonce ?? null;

    if (loading) {
        return <div className="loading-overlay">Loading...</div>;
    }

    return (
        <>
            <SidePanel />
            <div className="page-content-wrapper">
                <div className="request-page-main-content request-page">
                    <header className="request-header">
                        <div className="welcome-message">
                            <h1 className="text-wrapper-77">Request a File</h1>
                        </div>
                        <div className="header-actions">
                            <div className="search-wrapper">
                                <GlobalSearch />
                            </div>
                            <div className="notification-button-wrapper" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                                <img className="notification-button" alt="Notification button" src="https://c.animaapp.com/27o9iVJi/img/notification-button@2x.png" />
                                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                                <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                            </div>
                        </div>
                    </header>
                    <div className="request-page-container">
                        <FormCard onSubmit={handleSubmitRequest} hasActiveOriginalFile={hasActiveOriginalFile} requests={requests} />
                        <QRCard 
                            userName={currentUser?.name || "User"} 
                            userId={currentUser?.userId || "ID"} 
                            assignedFile={assignedFile} 
                            onQRCodeClick={() => setIsQRModalOpen(true)} 
                        />
                        <RequestCard 
                            requests={requests} 
                            onRequestCancelled={handleRequestCancelled} 
                            selectedRequestId={selectedRequestId} 
                            requestFocusNonce={requestFocusNonce} 
                        />
                    </div>
                    <QRModal 
                        isOpen={isQRModalOpen} 
                        onClose={() => setIsQRModalOpen(false)} 
                        qrValue={currentUser?.userId || currentUser?.id || "USER-UNKNOWN"} 
                        userName={currentUser?.name || "User"} 
                    />
                </div>
            </div>
        </>
    );
};
