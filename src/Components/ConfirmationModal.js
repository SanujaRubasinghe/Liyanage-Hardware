import React from 'react'
import "./ConfirmationModal.css"

const ConfirmationModal = ({isOpen, message, onClose}) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="ok-button" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal