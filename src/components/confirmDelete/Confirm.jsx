"use client"
import React from 'react'
import "./Confirm.css";
const Confirm = ({open,onConfirm,onCancel}) => {
    if(!open)return null;
  return (
    <div className="modal-container">
      <div className="modal-backdrop">
        <div className="modal-box">
          <h2 className="modal-title">Confirm Action</h2>
          <p className="modal-message">Do you want to Delet the product</p>

          <div className="modal-buttons">
            <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
            <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>

    </div>      
  )
}

export default Confirm