"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/css/Header.module.css";
import { useSnackbar } from "@/components/Snackbar";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter, usePathname } from "next/navigation";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

const Header = ({ initialTheme, initialFirstName, initialLastName }) => {
  const router = useRouter();
  const pathname = usePathname();
  const showAlertMessage = useSnackbar();

  const [isModalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme || "light");
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = getCookie("theme") || theme;
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCookie("theme", newTheme, { maxAge: 60 * 60 * 24 * 365 });
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const confirmLogout = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handleConfirm = () => {
    deleteCookie("sessionToken");
    deleteCookie("firstName");
    deleteCookie("lastName");

    showAlertMessage({
      message: "✅ Logout successful",
      type: "success",
    });

    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");

    setModalOpen(false);
    router.push("/");
  };

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <>
      <header className={styles.header}>
        {/* Logo Left */}
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
          </Link>
        </div>

        {/* Desktop Welcome */}
        <div className={styles.centerText}>
          Welcome {initialFirstName || "Guest"} {initialLastName || ""}
        </div>

        {/* Desktop Buttons */}
        <div className={styles.actions}>
          <Link
            href="/expenseForm"
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
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>

          <button
            className={`${styles.btn} ${styles.logout}`}
            onClick={confirmLogout}
          >
            Logout
          </button>
        </div>

        {/* Hamburger Right for Mobile */}
        <button className={styles.menuIcon} onClick={toggleMenu}>
          ☰
        </button>

        {/* Fullscreen Mobile Menu */}
        <div
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}
        >
          <button className={styles.closeBtn} onClick={toggleMenu}>
            ✕
          </button>

          <div className={styles.menuContent}>
            <Link
              href="/expenseForm"
              className={pathname === "/expenseForm" ? styles.active : ""}
              onClick={toggleMenu}
            >
              Add Expense
            </Link>

            <Link
              href="/expenseTable"
              className={pathname === "/expenseTable" ? styles.active : ""}
              onClick={toggleMenu}
            >
              Table
            </Link>

            <button className={styles.themeToggleMobile} onClick={toggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button className={styles.logout} onClick={confirmLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
};

export default Header;
