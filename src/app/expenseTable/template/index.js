"use client";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import styles from "@/css/ExpenseTable.module.css";
import { useSnackbar } from "@/components/Snackbar";
import ConfirmModal from "@/components/ConfirmModal";

const ExpenseTable = () => {
  const showAlertMessage = useSnackbar();

  const [cash, setCash] = useState(0);
  const [account, setAccount] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [getExpenses, setGetExpenses] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  // Pagination

  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = getExpenses.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(getExpenses.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCookie("currentPage", page, { maxAge: 60 * 60 * 24 * 7 });
  };

  // Fetch expenses from backend

  const getExpense = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/expenseTable/api");
      if (res?.data?.expenses) {
        setGetExpenses(res.data.expenses);
        setTotalIncome(res.data.totalIncome || 0);
        setTotalExpense(res.data.totalExpenses || 0);
        setTotalBalance(res.data.totalBalance || 0);
        setCash(res.data.cash);
        setAccount(res.data.account);
      } else if (res?.data?.message) {
        showAlertMessage({ message: res.data.message, type: "error" });
      }
    } catch (error) {
      console.log(error);
      showAlertMessage({
        message:
          error.response?.data?.message || `Server error: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpense();
  }, []);

  // Set selected expense for editing
  const handleEdit = (row) => {
    localStorage.setItem(`expense_${row._id}`, JSON.stringify(row));
  };

  // Delete expense function
  const handleDelete = async (id) => {
    try {
      setLoading(true);

      const res = await axios.delete(`expenseTable/api/${id}`, {
        data: { id },
      });

      if (res?.status === 200) {
        showAlertMessage({ message: res.data.message, type: "success" });

        setGetExpenses((prev) => {
          const updatedExpenses = prev.filter((exp) => exp._id !== id);

          // Pagination adjustment
          const newTotalPages = Math.ceil(updatedExpenses.length / rowsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else if (newTotalPages === 0) {
            setCurrentPage(1);
          }

          // Totals calculation
          let totalIncome = 0;
          let totalExpense = 0;
          let cash = 0;
          let account = 0;

          updatedExpenses.forEach((exp) => {
            if (exp.type === "income") {
              totalIncome += Number(exp.amount);
            } else {
              totalExpense += Number(exp.amount);
            }

            if (exp.paymentType === "cash") cash += Number(exp.amount);
            if (exp.paymentType === "account") account += Number(exp.amount);
          });

          setTotalIncome(totalIncome);
          setTotalExpense(totalExpense);
          setTotalBalance(totalIncome - totalExpense);
          setCash(cash);
          setAccount(account);

          return updatedExpenses;
        });
      }
    } catch (error) {
      console.log(error);
      showAlertMessage({
        message:
          error.response?.data?.message || `Server error: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
      setDeleteId("");
      setModalOpen(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={styles.container}>
        <div className={styles.balanceContainer}>
          <div className={styles.balanceSection}>
            <div className={styles.balance}>
              Current Balance
              <span className={styles.balanceAmount}>{totalBalance}</span>
            </div>

            <div className={styles.totals}>
              <div className={styles.totalCard}>
                <span className={styles.label}>Total Income</span>
                <span className={styles.incomeAmount}>{totalIncome}</span>
              </div>
              <div className={styles.totalCard}>
                <span className={styles.label}>Total Expense</span>
                <span className={styles.expenseAmount}>{totalExpense}</span>
              </div>
            </div>

            <div className={styles.paymentType}>
              <div className={styles.paymentCard}>
                <span className={styles.label}>Cash</span>
                <span className={styles.cashAmount}>{cash}</span>
              </div>
              <div className={styles.paymentCard}>
                <span className={styles.label}>Account</span>
                <span className={styles.accountAmount}>{account}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Payment Type</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
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
                    <td data-label="Payment Type">{row.paymentType}</td>
                    <td data-label="Type">{row.type}</td>
                    <td data-label="Actions">
                      <Link href={`/expenseForm/${row._id}`}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleEdit(row)}
                        >
                          ✏️
                        </button>
                      </Link>

                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          setDeleteId(row._id);
                          setModalOpen(true);
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className={styles.noDataRow}>
                  <td colSpan="6">No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Expense"
        message="Are you sure you want to delete?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        windowSize={2}
      />
    </>
  );
};

export default ExpenseTable;
