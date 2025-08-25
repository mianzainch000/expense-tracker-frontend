"use client";
import React from "react";
import styles from "@/css/ConfirmModal.module.css";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onCancel}>
          ×
        </button>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={onCancel}>
            Cancel
          </button>
          <button className={`${styles.actionBtn} ${styles.confirmBtn}`} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
