"use client";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { useSnackbar } from "@/components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/reduxToolkit/slices/loadingSlice";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const showAlertMessage = useSnackbar();
  const isLoading = useSelector((state) => state.loading.isLoading);

  function validate() {
    // Check if first name is empty
    if (!firstName) {
      showAlertMessage({ message: "First Name is required", type: "error" });
      return false;
    }

    // Check if last name is empty
    if (!lastName) {
      showAlertMessage({ message: "Last Name is required", type: "error" });
      return false;
    }

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

    // Check if confirm password is empty
    if (!confirmPassword) {
      showAlertMessage({
        message: "Confirm Password is required",
        type: "error",
      });
      return false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      showAlertMessage({ message: "Passwords do not match", type: "error" });
      return false;
    }

    return true; // All validations passed
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Api call

    await signup();
  }

  const signup = async () => {
    dispatch(startLoading());
    try {
      let res = await axios.post("signup/api", {
        firstName,
        lastName,
        email,
        password,
      });

      if (res?.status === 201) {
        showAlertMessage({
          message: res?.data?.message,
          type: "success",
        });

        setFirstName("");
        setLastName("");
        setEmail("");
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
      dispatch(stopLoading());
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.logoWrapper}>
            <Image src="/logo.png" alt="Logo" width={80} height={80} />
          </div>

          <h2 className={styles.title}>Create Account</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* First Name */}
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.inputField}
            />

            {/* Last Name */}
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.inputField}
            />

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
              Sign Up
            </button>
          </form>

          <p className={styles.loginText}>
            Already have an account? <Link href="/">login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
