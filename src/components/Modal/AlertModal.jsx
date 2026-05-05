import React from "react";
import { Modal } from "./Modal";

export const AlertModal = ({
    isOpen,
    onClose,
    title = "Notice",
    message,
    buttonText = "OK",
    type = "info" // info, success, error
}) => {
    const getIcon = () => {
        switch (type) {
            case "success": return "✓";
            case "error": return "✕";
            default: return "i";
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success": return "#4ccf47";
            case "error": return "#dd0303";
            default: return "#800000";
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="alert-modal-content" style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ 
                    width: '80px',
                    height: '80px',
                    backgroundColor: `${getIconColor()}15`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px', 
                    color: getIconColor(), 
                    marginBottom: '25px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    border: `2px solid ${getIconColor()}30`
                }}>
                    {getIcon()}
                </div>
                <p style={{ 
                    fontSize: '17px', 
                    color: '#333', 
                    lineHeight: '1.6',
                    fontWeight: '500',
                    margin: '0 auto',
                    maxWidth: '80%'
                }}>{message}</p>
                <div className="modal-actions" style={{ justifyContent: 'center', borderTop: 'none', marginTop: '20px' }}>
                    <button
                        className="modal-btn modal-btn-primary"
                        onClick={onClose}
                        style={{ padding: '12px 60px' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
