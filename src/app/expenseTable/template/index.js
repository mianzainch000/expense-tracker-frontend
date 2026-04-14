"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import ExpenseForm from "@/components/Modal";
import Pagination from "@/components/Pagination";
import styles from "@/css/ExpenseTable.module.css";
import { useSnackbar } from "@/components/Snackbar";
import ConfirmModal from "@/components/ConfirmModal";
import handleAxiosError from "@/components/HandleAxiosError";

const ExpenseTable = () => {
  const showAlertMessage = useSnackbar();

  const [getExpenses, setGetExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    cash: 0,
    account: 0,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(getExpenses.length / rowsPerPage);
  const currentRows = getExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCookie("currentPage", page, { maxAge: 60 * 60 * 24 * 7 });
  };

  const getExpenseData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/expenseTable/api");
      if (res?.data?.expenses) {
        setGetExpenses(res.data.expenses);
        setTotals({
          income: res.data.totalIncome || 0,
          expense: res.data.totalExpenses || 0,
          balance: res.data.totalBalance || 0,
          cash: res.data.cash || 0,
          account: res.data.account || 0,
        });
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlertMessage({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenseData();
  }, []);

  const handleAddNew = () => {
    setSelectedExpense(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedExpense(row);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`expenseTable/api/${deleteId}`, {
        data: { id: deleteId },
      });

      if (res?.status === 200) {
        showAlertMessage({
          message: res.data.message || "Deleted successfully",
          type: "success",
        });

        const deletedItem = getExpenses.find((item) => item._id === deleteId);
        const updatedExpenses = getExpenses.filter((item) => item._id !== deleteId);
        setGetExpenses(updatedExpenses);

        const newTotalPages = Math.ceil(updatedExpenses.length / rowsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          handlePageChange(newTotalPages);
        } else if (updatedExpenses.length === 0) {
          handlePageChange(1);
        }
        if (deletedItem) {
          setTotals((prev) => {
            const isIncome = deletedItem.type === "income";
            const amount = Number(deletedItem.amount);

            return {
              ...prev,
              income: isIncome ? prev.income - amount : prev.income,
              expense: !isIncome ? prev.expense - amount : prev.expense,
              balance: isIncome ? prev.balance - amount : prev.balance + amount,
              cash: deletedItem.paymentType === "cash"
                ? (isIncome ? prev.cash - amount : prev.cash + amount)
                : prev.cash,
              account: deletedItem.paymentType === "account"
                ? (isIncome ? prev.account - amount : prev.account + amount)
                : prev.account,
            };
          });
        }
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlertMessage({ message, type: "error" });
    } finally {
      setDeleteModalOpen(false);
      setDeleteId("");
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loader />}

      <div className={styles.container}>
        { }
        <div className={styles.headerSection}>
          <button className={styles.addBtn} onClick={handleAddNew}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Transaction
          </button>
        </div>

        { }
        <div className={styles.balanceContainer}>
          <div className={styles.balanceSection}>
            <div className={styles.balance}>
              Current Balance
              <span className={styles.balanceAmount}>{totals.balance}</span>
            </div>
            <div className={styles.totals}>
              <div className={styles.totalCard}>
                <span className={styles.label}>Total Income</span>
                <span className={styles.incomeAmount}>{totals.income}</span>
              </div>
              <div className={styles.totalCard}>
                <span className={styles.label}>Total Expense</span>
                <span className={styles.expenseAmount}>{totals.expense}</span>
              </div>
            </div>
            <div className={styles.paymentType}>
              <div className={styles.paymentCard}>
                <span className={styles.label}>Cash</span>
                <span className={styles.cashAmount}>{totals.cash}</span>
              </div>
              <div className={styles.paymentCard}>
                <span className={styles.label}>Account</span>
                <span className={styles.accountAmount}>{totals.account}</span>
              </div>
            </div>
          </div>
        </div>

        { }
        {getExpenses.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr
                    key={row._id}
                    className={
                      row.type === "income"
                        ? styles.incomeRow
                        : styles.expenseRow
                    }
                  >
                    <td data-label="Date">{row.date}</td>
                    <td data-label="Description">{row.description}</td>
                    <td data-label="Amount">{row.amount}</td>
                    <td data-label="Payment">{row.paymentType}</td>
                    <td data-label="Type">{row.type}</td>
                    <td data-label="Actions">
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(row)}
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDeleteClick(row._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noDataFound}>
            <p>No Data Found</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          windowSize={2}
        />
      </div>

      { }
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        expenseData={selectedExpense}
        refreshData={getExpenseData}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Expense"
        message="Are you sure you want to delete?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default ExpenseTable;
