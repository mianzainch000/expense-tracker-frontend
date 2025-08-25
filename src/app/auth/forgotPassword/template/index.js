"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { apiConfig } from "@/config/apiConfig";
import { useSnackbar } from "@/components/Snackbar";

const ForgortPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const showAlertMessage = useSnackbar();

  function validate() {
    // Check if email is empty or invalid
    if (!email) {
      showAlertMessage({ message: "Email is required", type: "error" });
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      showAlertMessage({ message: "Enter a valid email", type: "error" });
      return false;
    }
    return true; // All validations passed
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Api call

    await ForgotPasswordApi();
  }

  const ForgotPasswordApi = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.forgotPassword}`,
        { email },
      );
      // let res = await axios.post("forgotPassword/api", { email });

      if (res?.status === 201) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });
        setEmail("");
      } else {
        showAlertMessage({
          message: res?.data.message,
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

          <h2 className={styles.title}>Forgot Password</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
            <button type="submit" className={styles.submitBtn}>
              Reset Link
            </button>
          </form>

          <p className={styles.loginText}>
            <Link href="/"> Go to login </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgortPassword;
