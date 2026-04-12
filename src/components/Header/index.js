"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/css/Header.module.css";
import { useSnackbar } from "@/components/Snackbar";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { signOut } from "next-auth/react";


const Header = ({ initialTheme }) => {
  const router = useRouter();
  const showAlertMessage = useSnackbar();

  const [isModalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme || "light");

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

  const handleConfirm = () => {
    deleteCookie("sessionToken", { path: "/" });
    deleteCookie("firstName", { path: "/" });
    deleteCookie("lastName", { path: "/" });
    signOut({ callbackUrl: "/" }, { path: "/" });
    showAlertMessage({
      message: "✅ Logout successful",
      type: "success",
    });

    setTheme("light");
    document.documentElement.setAttribute("data-theme", "light");

    setModalOpen(false);
    router.push("/");
  };
  return (
    <>
      <header className={styles.header}>
        {/* Logo Left */}
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={45} height={45} priority />
          </Link>
        </div>

        {/* Right Section: Only Theme & Logout */}
        <div className={styles.actions}>
          <button className={styles.toggleTheme} onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button className={styles.logoutBtn} onClick={() => setModalOpen(true)}>
            Logout
          </button>
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