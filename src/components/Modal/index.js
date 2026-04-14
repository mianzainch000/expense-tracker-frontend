"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import styles from "@/css/Modal.module.css";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const ExpenseForm = ({ expenseData, isOpen, onClose, refreshData }) => {
  const [editId, setEditId] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [description, setDescription] = useState("");

  const showAlertMessage = useSnackbar();

  const resetForm = () => {
    setDate("");
    setDescription("");
    setAmount("");
    setPaymentType("");
    setType("");
    setEditId("");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    if (expenseData && isOpen) {
      setEditId(expenseData?._id || "");
      setDate(expenseData?.date || "");
      setDescription(expenseData?.description || "");
      setAmount(expenseData?.amount || 0);
      setPaymentType(expenseData?.paymentType || "");
      setType(expenseData?.type || "");
    } else if (!expenseData && isOpen) {
      resetForm();
    }
  }, [expenseData, isOpen]);

  const validate = () => {
    if (
      !date ||
      !description.trim() ||
      !amount ||
      amount <= 0 ||
      !paymentType ||
      !type
    ) {
      showAlertMessage({
        message: "Please fill all required fields correctly",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = editId ? `/expenseTable/api/${editId}` : "/expenseTable/api";
      const method = editId ? "put" : "post";

      const res = await axios({
        method: method,
        url: url,
        data: { date, description, amount, paymentType, type },
      });

      if (res.status === 200 || res.status === 201) {
        showAlertMessage({
          message: res.data.message || "Success!",
          type: "success",
        });
        refreshData();
        onClose();
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlertMessage({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <Loader />}

        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.title}>
              {!editId ? "Add Transaction" : "Update Transaction"}
            </h2>
            <p className={styles.subtitle}>Fill in the details below</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={submitData} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Amount</label>
              <input
                // type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              placeholder="What was this for?"
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Payment Mode</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className={styles.select}
              >
                <option value="" disabled>
                  Select Mode
                </option>
                <option value="cash">Cash</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={styles.select}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {!editId ? "Save Transaction" : "Update Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
