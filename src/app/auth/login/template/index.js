"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/components/Snackbar";

const Login = () => {
  const router = useRouter();
  const showAlertMessage = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    // Check if email is empty or invalid
    if (!email) {
      showAlertMessage({ message: "Email is required", type: "error" });
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      showAlertMessage({ message: "Enter a valid email", type: "error" });
      return false;
    }

    // Check if password is empty
    if (!password) {
      showAlertMessage({ message: "Password is required", type: "error" });
      return false;
    }
    return true; // All validations passed
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Api call

    await Login();
  }

  const Login = async () => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (res?.ok) {
        showAlertMessage({
          message: "✅ Login successful",
          type: "success",
        });

        setEmail("");
        setPassword("");

        router.push("/expenseForm");
      } else {
        showAlertMessage({
          message: `❌ ${res?.error}`,
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

  return (
    <>
      {loading && <Loader />}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.logoWrapper}>
            <Image src="/logo.png" alt="Logo" width={80} height={80} />
          </div>

          <h2 className={styles.title}>Login</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />

            {/* Password */}
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
            <div className={styles.forgotWrapper}>
              <Link href="/auth/forgotPassword" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>
          </form>

          <p className={styles.loginText}>
            Create new Account ? <Link href="/auth/signup">signup</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
