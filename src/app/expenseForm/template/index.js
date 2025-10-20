"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/css/ExpenseForm.module.css";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const ExpenseForm = ({ expenseData }) => {
  const router = useRouter();
  const [editId, setEditId] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [description, setDescription] = useState("");

  const showAlertMessage = useSnackbar();

  function validate() {
    if (!date.trim()) {
      showAlertMessage({ message: "Date is required", type: "error" });
      return false;
    }
    if (!description.trim()) {
      showAlertMessage({ message: "Description is required", type: "error" });
      return false;
    }
    if (!amount) {
      showAlertMessage({ message: "Amount is required", type: "error" });
      return false;
    }
    if (amount <= 0) {
      showAlertMessage({ message: "Enter a valid amount", type: "error" });
      return false;
    }
    if (!paymentType.trim()) {
      showAlertMessage({ message: "Payment Type is required", type: "error" });
      return false;
    }
    if (!type.trim()) {
      showAlertMessage({ message: "Type is required", type: "error" });
      return false;
    }
    return true;
  }

  useEffect(() => {
    setEditId(expenseData?._id || "");
    setDate(expenseData?.date || "");
    setDescription(expenseData?.description || "");
    setAmount(expenseData?.amount || 0);
    setPaymentType(expenseData?.paymentType || "");
    setType(expenseData?.type || "");
  }, [expenseData]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    submitData();
  }

  const submitData = async () => {
    setLoading(true);

    try {
      const url = editId ? `api/${editId}` : "expenseForm/api";
      const method = editId ? "put" : "post";

      const res = await axios({
        method: method,
        url: url,
        data: {
          date,
          description,
          amount,
          paymentType,
          type,
        },
      });

      if ((editId && res?.status === 200) || (!editId && res?.status === 201)) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });

        // Reset form fields
        setDate("");
        setDescription("");
        setAmount("");
        setPaymentType("");
        setType("");
        if (editId) setEditId("");

        if (editId) router.push("/expenseTable"); // redirect only after update
      } else {
        showAlertMessage({
          message:
            res?.data?.errors || res?.data?.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlertMessage({
        message: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h2 className={styles.title}>
            {!editId ? "Add Transaction" : "Edit Transcation"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
                placeholder="Enter description"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="amount">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className={styles.input}
                placeholder="Enter amount"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="type">
                Payment type
              </label>
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className={styles.select}
              >
                <option value="" disabled>
                  Payment Type
                </option>
                <option value="cash">Cash</option>
                <option value="account">Account</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="type">
                Type
              </label>
              <select
                id="type"
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

            <button type="submit" className={styles.button}>
              {!editId ? "Add Transaction" : "Edit Transcation"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ExpenseForm;
