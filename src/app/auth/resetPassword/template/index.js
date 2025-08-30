"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { apiConfig } from "@/config/apiConfig";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showAlertMessage = useSnackbar();

  const validate = () => {
    if (!email) return showAlert("Email is required");
    if (!otp) return showAlert("OTP is required");
    if (!password) return showAlert("Password is required");
    if (password !== confirmPassword)
      return showAlert("Passwords do not match");
    return true;
  };

  const showAlert = (message) => {
    showAlertMessage({ message, type: "error" });
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await ResetPasswordApi();
  };

  const ResetPasswordApi = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.resetPassword}`,
        { email, otp, newPassword: password },
      );
      if (res?.status === 200) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
      } else {
        showAlertMessage({
          message:
            res?.data?.errors || res?.data?.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlertMessage({
        message,
        type: "error",
      });
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
          <h2 className={styles.title}>Reset Password (OTP)</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.inputField}
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.inputField}
            />

            <button type="submit" className={styles.submitBtn}>
              Reset Password
            </button>
          </form>

          <p className={styles.loginText}>
            <Link href="/">Go to login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
