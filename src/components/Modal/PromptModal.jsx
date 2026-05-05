import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";

export const PromptModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Provide Reason",
    message = "Please enter a reason:",
    placeholder = "Enter reason here...",
    confirmText = "Submit",
    cancelText = "Cancel",
    initialValue = ""
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) setValue(initialValue);
    }, [isOpen, initialValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(value);
        setValue("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <div className="prompt-modal-body" style={{ padding: '10px 0' }}>
                    <p style={{ marginBottom: '15px', fontSize: '15px', color: '#555', fontWeight: '500' }}>{message}</p>
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        required
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: '16px',
                            border: '2px solid #f0f0f0',
                            borderRadius: '12px',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                            resize: 'vertical',
                            outline: 'none',
                            transition: 'border-color 0.2s ease',
                            backgroundColor: '#fafafa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#800000'}
                        onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
                    />
                </div>
                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-btn modal-btn-secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="submit"
                        className="modal-btn modal-btn-primary"
                    >
                        {confirmText}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
