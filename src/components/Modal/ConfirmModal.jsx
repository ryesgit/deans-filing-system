import React from "react";
import { Modal } from "./Modal";

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "primary", // primary, danger
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="confirm-modal-body" style={{ padding: '10px 0', fontSize: '16px', color: '#333' }}>
                {children}
            </div>
            <div className="modal-actions">
                <button
                    className="modal-btn modal-btn-secondary"
                    onClick={onClose}
                >
                    {cancelText}
                </button>
                <button
                    className={`modal-btn ${type === 'danger' ? 'modal-btn-danger' : 'modal-btn-primary'}`}
                    onClick={onConfirm}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};
