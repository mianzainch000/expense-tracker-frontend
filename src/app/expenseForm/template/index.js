"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/css/ExpenseForm.module.css";
import { useSnackbar } from "@/components/Snackbar";

const ExpenseForm = ({ expenseData }) => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [description, setDescription] = useState("");

  const showAlertMessage = useSnackbar();

  function validate() {
    if (!date) {
      showAlertMessage({ message: "Date is required", type: "error" });
      return false;
    }
    if (!description) {
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
    if (!paymentType) {
      showAlertMessage({ message: "Payment Type is required", type: "error" });
      return false;
    }
    if (!type) {
      showAlertMessage({ message: "Type is required", type: "error" });
      return false;
    }
    return true;
  }

  useEffect(() => {
    setId(expenseData?._id || "");
    setDate(expenseData?.date || "");
    setDescription(expenseData?.description || "");
    setAmount(expenseData?.amount || 0);
    setPaymentType(expenseData?.paymentType || "");
    setType(expenseData?.type || "");
  }, [expenseData]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (id) {
      await updatetData();
    } else {
      await postData();
    }
  }

  const postData = async () => {
    setLoading(true);
    try {
      let res = await axios.post("expenseForm/api", {
        date,
        description,
        amount,
        paymentType,
        type,
      });

      if (res?.status === 201) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });

        setDate("");
        setDescription("");
        setAmount("");
        setPaymentType("");
        setType("");
      } else {
        showAlertMessage({
          message:
            res?.data?.errors || res?.data?.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);

      if (error instanceof ReferenceError) {
        showAlertMessage({
          message: `Missing dependency: ${error.message}`,
          type: "error",
        });
      } else {
        showAlertMessage({
          message: error.response?.data?.message || "Server error",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updatetData = async () => {
    setLoading(true);
    try {
      let res = await axios.put(`api/${id}`, {
        date,
        description,
        amount,
        paymentType,
        type,
      });
      if (res?.status === 200) {
        showAlertMessage({
          message: res?.data?.data?.message,
          type: "success",
        });
        router.push("/expenseTable");
        setDate("");
        setDescription("");
        setAmount("");
        setPaymentType("");
        setType("");
        setId("");
      } else {
        showAlertMessage({
          message:
            res?.data?.data?.errors ||
            res?.data?.message ||
            "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);

      if (error instanceof ReferenceError) {
        showAlertMessage({
          message: `Missing dependency: ${error.message}`,
          type: "error",
        });
      } else {
        showAlertMessage({
          message: error.response?.data?.data?.message || "Server error",
          type: "error",
        });
      }
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
            {!id ? "Add Transaction" : "Edit Transcation"}
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
              {!id ? "Add Transaction" : "Edit Transcation"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ExpenseForm;
