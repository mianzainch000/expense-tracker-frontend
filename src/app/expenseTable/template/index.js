"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { setCookie } from "cookies-next";
import ExpenseForm from "@/components/Modal";
import Pagination from "@/components/Pagination";
import styles from "@/css/ExpenseTable.module.css";
import { useSnackbar } from "@/components/Snackbar";
import { useEffect, useState, useMemo } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import handleAxiosError from "@/components/HandleAxiosError";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const decodeDescription = (raw = "") => {
  const match = raw.match(/^\[(.+?)\]\s(.+)$/);
  if (match) return { category: match[1], description: match[2] };
  return { category: "", description: raw };
};

const enrichExpenses = (expenses) =>
  expenses.map((e) => {
    const { category, description } = decodeDescription(e.description || "");
    return { ...e, category, cleanDescription: description };
  });

const buildYearList = (expenses) => {
  const currentYear = new Date().getFullYear();
  if (!expenses.length) return [currentYear];
  const years = expenses.map((e) => parseInt(e.date?.slice(0, 4)));
  const minYear = Math.min(...years);
  const list = [];
  for (let y = currentYear; y >= minYear; y--) list.push(y);
  return list;
};

const getDateRange = (filterType, filterYear, filterMonth) => {
  const now = new Date();
  const toISO = (d) => d.toISOString().split("T")[0];
  const pad = (n) => String(n).padStart(2, "0");

  if (filterType === "today") {
    const t = toISO(now);
    return { from: t, to: t };
  }
  if (filterType === "week") {
    const day = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    return { from: toISO(mon), to: toISO(now) };
  }
  if (filterType === "year") {
    const y = filterYear || now.getFullYear();
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }
  if (filterType === "month") {
    const y = filterYear || now.getFullYear();
    const m = filterMonth !== null ? filterMonth : now.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    return {
      from: `${y}-${pad(m + 1)}-01`,
      to: `${y}-${pad(m + 1)}-${lastDay}`,
    };
  }
  return null;
};

const ExpenseTable = () => {
  const showAlertMessage = useSnackbar();

  const [rawExpenses, setRawExpenses] = useState([]);
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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const rowsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const allExpenses = useMemo(() => enrichExpenses(rawExpenses), [rawExpenses]);

  const yearList = useMemo(() => buildYearList(allExpenses), [allExpenses]);

  const categoryList = useMemo(() => {
    const cats = new Set();
    allExpenses.forEach((e) => {
      if (e.category) cats.add(e.category);
    });
    return Array.from(cats).sort();
  }, [allExpenses]);

  const filteredExpenses = useMemo(() => {
    let data = [...allExpenses];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (r) =>
          r.cleanDescription?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q) ||
          String(r.amount).includes(q) ||
          r.type?.toLowerCase().includes(q) ||
          r.paymentType?.toLowerCase().includes(q) ||
          r.date?.includes(q),
      );
    }
    if (typeFilter !== "all") data = data.filter((r) => r.type === typeFilter);
    if (paymentFilter !== "all")
      data = data.filter((r) => r.paymentType === paymentFilter);
    if (categoryFilter !== "all")
      data = data.filter((r) => r.category === categoryFilter);

    const range = getDateRange(filterType, filterYear, filterMonth);
    if (range)
      data = data.filter((r) => r.date >= range.from && r.date <= range.to);

    return data;
  }, [
    allExpenses,
    searchQuery,
    filterType,
    filterYear,
    filterMonth,
    typeFilter,
    paymentFilter,
    categoryFilter,
  ]);

  const filteredTotals = useMemo(() => {
    return filteredExpenses.reduce(
      (acc, r) => {
        const amt = Number(r.amount);
        if (r.type === "income") {
          acc.income += amt;
          acc.balance += amt;
          if (r.paymentType === "cash") acc.cash += amt;
          if (r.paymentType === "account") acc.account += amt;
        } else {
          acc.expense += amt;
          acc.balance -= amt;
          if (r.paymentType === "cash") acc.cash -= amt;
          if (r.paymentType === "account") acc.account -= amt;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0, cash: 0, account: 0 },
    );
  }, [filteredExpenses]);

  const isFiltered =
    searchQuery ||
    filterType !== "all" ||
    typeFilter !== "all" ||
    paymentFilter !== "all" ||
    categoryFilter !== "all";

  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);
  const currentRows = filteredExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCookie("currentPage", page, { maxAge: 60 * 60 * 24 * 7 });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filterType,
    filterYear,
    filterMonth,
    typeFilter,
    paymentFilter,
    categoryFilter,
  ]);

  const getExpenseData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/expenseTable/api");
      if (res?.data?.expenses) {
        setRawExpenses(res.data.expenses);
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
        const deletedItem = rawExpenses.find((item) => item._id === deleteId);
        const updatedExpenses = rawExpenses.filter(
          (item) => item._id !== deleteId,
        );
        setRawExpenses(updatedExpenses);
        const newTotalPages = Math.ceil(updatedExpenses.length / rowsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0)
          handlePageChange(newTotalPages);
        else if (updatedExpenses.length === 0) handlePageChange(1);
        if (deletedItem) {
          setTotals((prev) => {
            const isIncome = deletedItem.type === "income";
            const amount = Number(deletedItem.amount);
            return {
              ...prev,
              income: isIncome ? prev.income - amount : prev.income,
              expense: !isIncome ? prev.expense - amount : prev.expense,
              balance: isIncome ? prev.balance - amount : prev.balance + amount,
              cash:
                deletedItem.paymentType === "cash"
                  ? isIncome
                    ? prev.cash - amount
                    : prev.cash + amount
                  : prev.cash,
              account:
                deletedItem.paymentType === "account"
                  ? isIncome
                    ? prev.account - amount
                    : prev.account + amount
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

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterYear(new Date().getFullYear());
    setFilterMonth(null);
    setTypeFilter("all");
    setPaymentFilter("all");
    setCategoryFilter("all");
  };

  const fmtAmount = (n) =>
    Number(n).toLocaleString("en-PK", { minimumFractionDigits: 0 });

  const getFilterLabel = () => {
    if (filterType === "today") return "Today";
    if (filterType === "week") return "This Week";
    if (filterType === "year") return `Year ${filterYear}`;
    if (filterType === "month")
      return `${MONTH_NAMES[filterMonth ?? new Date().getMonth()]} ${filterYear}`;
    return null;
  };

  return (
    <>
      {loading && <Loader />}
      <div className={styles.container}>
        {}
        <div className={styles.topBar}>
          <button className={styles.addBtn} onClick={handleAddNew}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Transaction
          </button>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search description, category, amount…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {}
        <div className={styles.filtersRow}>
          <div className={styles.dateFilterGroup}>
            <button
              className={`${styles.filterPill} ${filterType === "all" ? styles.filterPillActive : ""}`}
              onClick={() => {
                setFilterType("all");
                setFilterMonth(null);
              }}
            >
              All Time
            </button>

            <button
              className={`${styles.filterPill} ${filterType === "today" ? styles.filterPillActive : ""}`}
              onClick={() => {
                setFilterType("today");
                setFilterMonth(null);
              }}
            >
              Today
            </button>

            <button
              className={`${styles.filterPill} ${filterType === "week" ? styles.filterPillActive : ""}`}
              onClick={() => {
                setFilterType("week");
                setFilterMonth(null);
              }}
            >
              This Week
            </button>

            {}
            <div className={styles.dropdownWrap}>
              <button
                className={`${styles.filterPill} ${styles.filterPillDropdown} ${filterType === "year" ? styles.filterPillActive : ""}`}
                onClick={() => {
                  setFilterType("year");
                  setFilterMonth(null);
                }}
              >
                {filterType === "year" ? `Year ${filterYear}` : "Year"} ▾
              </button>
              <div className={styles.dropdownMenu}>
                {yearList.map((y) => (
                  <button
                    key={y}
                    className={`${styles.dropdownItem} ${filterType === "year" && filterYear === y ? styles.dropdownItemActive : ""}`}
                    onClick={() => {
                      setFilterType("year");
                      setFilterYear(y);
                      setFilterMonth(null);
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {}
            <div className={styles.dropdownWrap}>
              <button
                className={`${styles.filterPill} ${styles.filterPillDropdown} ${filterType === "month" ? styles.filterPillActive : ""}`}
                onClick={() => {
                  if (filterType !== "month") {
                    setFilterType("month");
                    setFilterMonth(new Date().getMonth());
                  }
                }}
              >
                {filterType === "month"
                  ? `${MONTH_NAMES[filterMonth ?? new Date().getMonth()].slice(0, 3)} ${filterYear}`
                  : "Month"}{" "}
                ▾
              </button>
              <div
                className={`${styles.dropdownMenu} ${styles.dropdownMenuMonth}`}
              >
                <div className={styles.dropdownYearRow}>
                  {yearList.map((y) => (
                    <button
                      key={y}
                      className={`${styles.dropdownYearBtn} ${filterYear === y ? styles.dropdownYearBtnActive : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterYear(y);
                        setFilterType("month");
                      }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                <div className={styles.dropdownDivider} />
                <div className={styles.dropdownMonthGrid}>
                  {MONTH_NAMES.map((name, idx) => (
                    <button
                      key={idx}
                      className={`${styles.dropdownMonthBtn} ${filterType === "month" && filterMonth === idx ? styles.dropdownItemActive : ""}`}
                      onClick={() => {
                        setFilterType("month");
                        setFilterMonth(idx);
                      }}
                    >
                      {name.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.selectGroup}>
            <select
              className={styles.filterSelect}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              className={styles.filterSelect}
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="cash">Cash</option>
              <option value="account">Account</option>
            </select>
            {categoryList.length > 0 && (
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {}
        {getFilterLabel() && (
          <div className={styles.activeFilterBadge}>
            <span>📅 {getFilterLabel()}</span>
            <button
              onClick={() => {
                setFilterType("all");
                setFilterMonth(null);
              }}
            >
              ×
            </button>
          </div>
        )}

        {}
        {}
        <div className={styles.summaryGrid}>
          <div className={`${styles.summaryCard} ${styles.summaryBalance}`}>
            <span className={styles.summaryLabel}>Current Balance</span>
            <span className={styles.summaryValue}>
              {fmtAmount(totals.balance)}
            </span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Income</span>
            <span className={`${styles.summaryValue} ${styles.incomeColor}`}>
              {fmtAmount(totals.income)}
            </span>
          </div>
          <div
            className={`${styles.summaryCard} ${isFiltered ? styles.summaryCardActive : ""}`}
          >
            <span className={styles.summaryLabel}>
              {isFiltered ? "Filtered Expense" : "Total Expense"}
            </span>
            <span className={`${styles.summaryValue} ${styles.expenseColor}`}>
              {fmtAmount(filteredTotals.expense)}
            </span>
            {isFiltered && (
              <span className={styles.cardHint}>
                of {fmtAmount(totals.expense)} total
              </span>
            )}
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Cash</span>
            <span className={`${styles.summaryValue} ${styles.cashColor}`}>
              {fmtAmount(totals.cash)}
            </span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Account</span>
            <span className={`${styles.summaryValue} ${styles.accountColor}`}>
              {fmtAmount(totals.account)}
            </span>
          </div>
        </div>

        {}
        {isFiltered && (
          <div className={styles.resultsInfo}>
            Showing <strong>{filteredExpenses.length}</strong> of{" "}
            <strong>{allExpenses.length}</strong> transactions
            <button
              className={styles.clearFiltersBtn}
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          </div>
        )}

        {}
        {filteredExpenses.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
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
                    <td data-label="Description">{row.cleanDescription}</td>
                    <td data-label="Category">
                      {row.category ? (
                        <span className={styles.categoryBadge}>
                          {row.category}
                        </span>
                      ) : (
                        <span className={styles.noCat}>—</span>
                      )}
                    </td>
                    <td data-label="Amount">
                      <span
                        className={
                          row.type === "income"
                            ? styles.incomeChip
                            : styles.expenseChip
                        }
                      >
                        {row.type === "income" ? "+" : "-"}
                        {fmtAmount(row.amount)}
                      </span>
                    </td>
                    <td data-label="Payment">
                      <span
                        className={
                          row.paymentType === "cash"
                            ? styles.cashBadge
                            : styles.accountBadge
                        }
                      >
                        {row.paymentType}
                      </span>
                    </td>
                    <td data-label="Type">
                      <span
                        className={
                          row.type === "income"
                            ? styles.incomeTypeBadge
                            : styles.expenseTypeBadge
                        }
                      >
                        {row.type}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className={styles.actionGroup}>
                        <button
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => handleEdit(row)}
                          title="Edit"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteClick(row._id)}
                          title="Delete"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <p className={styles.emptyTitle}>
              {isFiltered
                ? "No transactions match your filters"
                : "No transactions yet"}
            </p>
            <p className={styles.emptySubtitle}>
              {isFiltered
                ? "Try adjusting your search or filters"
                : "Tap 'Add Transaction' to get started"}
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          windowSize={2}
        />
      </div>

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        expenseData={selectedExpense}
        refreshData={getExpenseData}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default ExpenseTable;
