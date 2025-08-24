"use client";
import React from "react";
import styles from "@/css/ConfirmModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { closeConfirmModal } from "@/reduxToolkit/slices/confirmModalSlice";

const ConfirmModal = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, onConfirm } = useSelector(
    (state) => state.confirmModal,
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    dispatch(closeConfirmModal());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Cross button */}
        <button
          className={styles.closeBtn}
          onClick={() => dispatch(closeConfirmModal())}
        >
          ×
        </button>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          <button
            className={`${styles.actionBtn} ${styles.cancelBtn}`}
            onClick={() => dispatch(closeConfirmModal())}
          >
            Cancel
          </button>
          <button
            className={`${styles.actionBtn} ${styles.confirmBtn}`}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
