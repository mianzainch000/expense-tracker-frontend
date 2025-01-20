"use client";
YupPassword(Yup);
import axios from "axios";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import React, { useState } from "react";
import styles from "./styles.module.css";
import TextInput from "@/components/TextInput";
import logo from "../../../../public/logo.png";
import { useSearchParams } from "next/navigation";
import { useSnackbar } from "@/components/Snackbar";
import CustomButton from "@/components/CustomButton";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PasswordUpdateSuccess from "@/components/PasswordUpdateSuccess";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  useMediaQuery,
  useTheme,
  IconButton,
  Grid,
  Box,
  Typography,
} from "@mui/material";

const ResetPassword = () => {
  const theme = useTheme();
  const snackBarMessage = useSnackbar();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      postData({ ...values, token });
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .password()
        .minLowercase(1, "at least one lowerCase")
        .minUppercase(1, "at least one upperCase")
        .minSymbols(1, "at least one Symbol")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
  });

  const postData = async (values) => {
    setLoading(true);
    try {
      let res = await axios.post(`resetpassword/api/${token}`, {
        password: values.password,
        token: values.token,
      });

      if (res?.data?.status === true) {
        setSuccessMessage(res?.data.message);
        // snackBarMessage({
        //   type: "success",
        //   message: res?.data.message,
        // });

        // Close success message after 3 seconds

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        formik.handleReset();
      } else {
        snackBarMessage({
          type: "error",
          message: res?.data.message,
        });
      }
    } catch (error) {
      snackBarMessage({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container lg={12}>
      <Grid lg={6} md={6} sm={6} xs={12}>
        {!isMatch && (
          <Image
            alt="logo"
            src={logo}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </Grid>

      <Grid lg={6} md={6} sm={6} xs={12}>
        <Box
          sx={{
            height: {
              lg: "100vh",
              md: "100vh",
              sm: "100vh",
              xs: "90vh",
              marginTop: { lg: "0", md: "0", sm: "0", xs: "100px" },
            },
          }}
          className={styles.centeredContainer}
        >
          {successMessage ? (
            <PasswordUpdateSuccess />
          ) : (
            <Box
              component="form"
              sx={{
                width: "100%",
                overflowY: "auto",
              }}
              className={styles.centeredContainer}
              onSubmit={formik.handleSubmit}
            >
              {isMatch && (
                <Image
                  alt="logo"
                  src={logo}
                  style={{
                    width: "30%",
                    height: "100px",
                    marginTop: "20px",
                  }}
                />
              )}

              <Grid
                container
                spacing={2}
                sx={{ marginTop: "10px", overflowY: "auto" }}
                xs={12}
              >
                <Grid item xs={12} className={styles.centeredContainer}>
                  <Typography
                    fontSize={"20px"}
                    fontWeight={"bolder"}
                    color={"blue"}
                  >
                    Reset Password
                  </Typography>
                </Grid>
                <Grid item xs={12} className={styles.centeredContainer}>
                  <TextInput
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    icon={
                      <IconButton edge="start">
                        <LockRoundedIcon />
                      </IconButton>
                    }
                    endIcon={
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    }
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <Typography className={styles.error}>
                      {formik.errors.password}
                    </Typography>
                  ) : (
                    ""
                  )}
                </Grid>

                <Grid item xs={12} className={styles.centeredContainer}>
                  <TextInput
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    icon={
                      <IconButton edge="start">
                        <LockRoundedIcon />
                      </IconButton>
                    }
                    endIcon={
                      <IconButton
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    }
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                  />
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <Typography className={styles.error}>
                      {formik.errors.confirmPassword}
                    </Typography>
                  ) : (
                    ""
                  )}
                </Grid>

                <Grid item xs={12} className={styles.centeredContainer}>
                  <CustomButton
                    type="submit"
                    loading={loading}
                    title={"Reset Password"}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item>
                  <Link href="/" variant="body2">
                    <Typography sx={{ margin: "10px 40px" }}>
                      Go back to login
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
