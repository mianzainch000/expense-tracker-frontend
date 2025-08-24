"use client";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import styles from "@/css/Header.module.css";
import { useSnackbar } from "@/components/Snackbar";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter, usePathname } from "next/navigation";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { clearEditExpense } from "@/reduxToolkit/slices/editExpenseSlice";
import { openConfirmModal } from "@/reduxToolkit/slices/confirmModalSlice";

const Header = ({ initialTheme, initialFirstName, initialLastName }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const showAlertMessage = useSnackbar();

  // Theme state: props > cookie > default
  const [theme, setTheme] = useState(initialTheme || "light");

  useEffect(() => {
    const savedTheme = getCookie("theme") || theme;
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Clear the edit expense state
  const clearEditId = () => {
    dispatch(clearEditExpense());
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCookie("theme", newTheme, { maxAge: 60 * 60 * 24 * 365 });
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Confirm logout
  const confirmLogout = () => {
    dispatch(
      openConfirmModal({
        title: "Logout",
        message: "Are you sure you want to logout?",
        onConfirm: () => {
          deleteCookie("sessionToken");
          deleteCookie("firstName");
          deleteCookie("lastName");

          // Reset theme state
          setTheme("light");
          document.documentElement.setAttribute("data-theme", "light");

          dispatch(clearEditExpense());
          showAlertMessage({
            message: "✅ Logout successful",
            type: "success",
          });

          router.push("/");
        },
      }),
    );
  };

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" onClick={clearEditId}>
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
          </Link>
        </div>

        {/* Welcome Text */}
        <div className={styles.centerText}>
          Welcome {initialFirstName || "Guest"} {initialLastName || ""}
        </div>

        {/* Buttons */}
        <div className={styles.actions}>
          <Link
            href="/expenseForm"
            onClick={clearEditId}
            className={`${styles.btn} ${
              pathname === "/expenseForm" ? styles.active : ""
            }`}
          >
            Add Expense
          </Link>

          <Link
            href="/expenseTable"
            className={`${styles.btn} ${
              pathname === "/expenseTable" ? styles.active : ""
            }`}
          >
            Table
          </Link>

          <button className={styles.toggleTheme} onClick={toggleTheme}>
            <span>{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <button
            className={`${styles.btn} ${styles.logout}`}
            onClick={confirmLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Confirm Modal */}
      <ConfirmModal />
    </>
  );
};

export default Header;
