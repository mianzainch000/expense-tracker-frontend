"use client";
import axios from "axios";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import styles from "@/css/Modal.module.css";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

// ─── Encode/Decode helpers ─────────────────────────────────────
export const encodeDescription = (category, description) => {
  if (!category) return description;
  return `[${category}] ${description}`;
};

export const decodeDescription = (raw = "") => {
  const match = raw.match(/^\[(.+?)\]\s(.+)$/);
  if (match) return { category: match[1], description: match[2] };
  return { category: "", description: raw };
};

// ─── Component ─────────────────────────────────────────────────
const ExpenseForm = ({ expenseData, isOpen, onClose, refreshData }) => {
  const [editId, setEditId] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Dynamic categories
  const [groupedCategories, setGroupedCategories] = useState({ income: [], expense: [] });
  const [catLoading, setCatLoading] = useState(false);

  // Manage-categories UI
  const [showManage, setShowManage] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState("expense");
  const [editingCat, setEditingCat] = useState(null); // { _id, name, type }
  const [editingName, setEditingName] = useState("");

  const showAlertMessage = useSnackbar();

  const resetForm = () => {
    setDate(""); setDescription(""); setAmount("");
    setPaymentType(""); setType(""); setEditId(""); setCategory("");
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await axios.get("/expenseTable/api/categories");
      if (res.data?.grouped) setGroupedCategories(res.data.grouped);
    } catch (err) {
      // silent — form still usable without categories
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchCategories();
    } else {
      document.body.style.overflow = "unset";
      setShowManage(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (expenseData && isOpen) {
      setEditId(expenseData?._id || "");
      setDate(expenseData?.date || "");
      setAmount(expenseData?.amount || 0);
      setPaymentType(expenseData?.paymentType || "");
      setType(expenseData?.type || "");
      const { category: cat, description: desc } = decodeDescription(expenseData?.description || "");
      setCategory(cat);
      setDescription(desc);
    } else if (!expenseData && isOpen) {
      resetForm();
    }
  }, [expenseData, isOpen]);

  useEffect(() => { setCategory(""); }, [type]);

  const validate = () => {
    if (!date || !description.trim() || !amount || amount <= 0 || !paymentType || !type) {
      showAlertMessage({ message: "Please fill all required fields correctly", type: "error" });
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
      const encodedDescription = encodeDescription(category, description);
      const res = await axios({ method, url, data: { date, description: encodedDescription, amount, paymentType, type } });
      if (res.status === 200 || res.status === 201) {
        showAlertMessage({ message: res.data.message || "Success!", type: "success" });
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

  // ── Category management handlers ──────────────────────────────
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return showAlertMessage({ message: "Enter a category name", type: "error" });
    try {
      const res = await axios.post("/expenseTable/api/categories", { name: newCatName.trim(), type: newCatType });
      showAlertMessage({ message: res.data.message || "Category added", type: "success" });
      setNewCatName("");
      await fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || "Could not add category";
      showAlertMessage({ message: msg, type: "error" });
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingName.trim()) return showAlertMessage({ message: "Enter a name", type: "error" });
    try {
      const res = await axios.put(`/expenseTable/api/categories/${id}`, { name: editingName.trim() });
      showAlertMessage({ message: res.data.message || "Updated", type: "success" });
      setEditingCat(null);
      await fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || "Could not update";
      showAlertMessage({ message: msg, type: "error" });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/expenseTable/api/categories/${id}`);
      showAlertMessage({ message: res.data.message || "Deleted", type: "success" });
      await fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || "Could not delete";
      showAlertMessage({ message: msg, type: "error" });
    }
  };

  if (!isOpen) return null;

  const categoryOptions = type ? (groupedCategories[type] || []) : [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {loading && <Loader />}

        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.title}>{!editId ? "Add Transaction" : "Update Transaction"}</h2>
            <p className={styles.subtitle}>Fill in the details below</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className={styles.manageCatBtn}
              onClick={() => setShowManage((v) => !v)}
              title="Manage Categories"
            >
              ⚙ Categories
            </button>
            <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* ── Manage Categories Panel ── */}
        {showManage && (
          <div className={styles.manageCatPanel}>
            <p className={styles.manageCatTitle}>Manage Categories</p>

            {/* Add new */}
            <div className={styles.addCatRow}>
              <select
                className={styles.addCatTypeSelect}
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                className={styles.addCatInput}
                placeholder="New category name…"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
              />
              <button type="button" className={styles.addCatBtn} onClick={handleAddCategory}>+</button>
            </div>

            {/* List */}
            {catLoading ? (
              <p style={{ textAlign: "center", color: "var(--muted-color)", fontSize: "0.8rem", padding: "8px 0" }}>Loading…</p>
            ) : (
              ["expense", "income"].map((t) => (
                <div key={t} className={styles.catTypeSection}>
                  <p className={styles.catTypeLabel}>{t === "expense" ? "Expense" : "Income"}</p>
                  {(groupedCategories[t] || []).length === 0 && (
                    <p style={{ color: "var(--muted-color)", fontSize: "0.78rem", padding: "4px 0" }}>No categories</p>
                  )}
                  {(groupedCategories[t] || []).map((cat) => (
                    <div key={cat._id} className={styles.catItem}>
                      {editingCat?._id === cat._id ? (
                        <>
                          <input
                            className={styles.catEditInput}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUpdateCategory(cat._id))}
                            autoFocus
                          />
                          <button type="button" className={styles.catSaveBtn} onClick={() => handleUpdateCategory(cat._id)}>✓</button>
                          <button type="button" className={styles.catCancelBtn} onClick={() => setEditingCat(null)}>✕</button>
                        </>
                      ) : (
                        <>
                          <span className={styles.catName}>{cat.name}</span>
                          <button type="button" className={styles.catEditBtn}
                            onClick={() => { setEditingCat(cat); setEditingName(cat.name); }}>✎</button>
                          <button type="button" className={styles.catDeleteBtn}
                            onClick={() => handleDeleteCategory(cat._id)}>🗑</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {!showManage && (
          <form onSubmit={submitData} className={styles.form}>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Amount</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} className={styles.input} placeholder="0.00" />
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Transaction Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={styles.select}>
                  <option value="" disabled>Select Type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Payment Mode</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={styles.select}>
                  <option value="" disabled>Select Mode</option>
                  <option value="cash">Cash</option>
                  <option value="account">Account</option>
                </select>
              </div>
            </div>

            {type && (
              <div className={styles.field}>
                <label className={styles.label}>
                  Category
                  <span style={{ fontWeight: 400, color: "var(--muted-color)", fontSize: "0.8rem", marginLeft: 6 }}>
                    (optional)
                  </span>
                </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                  <option value="">— No Category —</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}

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

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button type="submit" className={styles.submitBtn}>
                {!editId ? "Save Transaction" : "Update Changes"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
