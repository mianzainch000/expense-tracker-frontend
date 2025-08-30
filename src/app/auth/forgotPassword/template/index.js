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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const showAlertMessage = useSnackbar();

  function validate() {
    if (!email) {
      showAlertMessage({ message: "Email is required", type: "error" });
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      showAlertMessage({ message: "Enter a valid email", type: "error" });
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await ForgotPasswordApi();
  }

  const ForgotPasswordApi = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.forgotPassword}`,
        { email },
      );
      if (res?.status === 200) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });
        setEmail("");
        router.push("/auth/resetPassword");
      } else {
        showAlertMessage({
          message: res?.data.message,
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
          <h2 className={styles.title}>Forgot Password</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
            <button type="submit" className={styles.submitBtn}>
              Send OTP
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

export default ForgotPassword;
