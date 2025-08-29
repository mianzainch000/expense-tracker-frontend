"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { apiConfig } from "@/config/apiConfig";
import { useSearchParams } from "next/navigation";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const showAlertMessage = useSnackbar();

  const validate = () => {
    if (!password) {
      showAlertMessage({ message: "Password is required", type: "error" });
      return false;
    }
    if (!confirmPassword) {
      showAlertMessage({
        message: "Confirm Password is required",
        type: "error",
      });
      return false;
    }
    if (password !== confirmPassword) {
      showAlertMessage({ message: "Passwords do not match", type: "error" });
      return false;
    }
    return true;
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
        `${apiConfig.baseUrl}${apiConfig.resetPassword}/${token}`,
        {
          newPassword: password,
          token: token,
        },
      );
      if (res?.status === 200) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });
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
        // message: `${message}${status ? ` (Status: ${status})` : ""}`,
        message: message,
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

          <h2 className={styles.title}>Reset Password</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
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

            {/* Confirm Password */}
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
                {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
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
