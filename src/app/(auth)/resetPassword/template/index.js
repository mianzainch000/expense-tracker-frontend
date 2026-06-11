"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { useRouter } from "next/navigation";
import { apiConfig } from "@/config/apiConfig";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const ResetPassword = () => {
  const EyeOpen = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
  const EyeClosed = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showAlertMessage = useSnackbar();
  const router = useRouter();
  const validate = () => {
    if (!email.trim()) return showAlert("Email is required");
    if (!otp.trim()) return showAlert("OTP is required");
    if (!password.trim()) return showAlert("Password is required");
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
        router.push("/");
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
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.inputField}
            />

            {}
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
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>

            {}
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
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
