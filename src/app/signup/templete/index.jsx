"use client";
import axios from "axios";
import * as Yup from "yup";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import TextInput from "@/components/TextInput";
import logo from "../../../../public/logo.png";
import { useSnackbar } from "@/components/Snackbar";
import CustomButton from "@/components/CustomButton";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
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
YupPassword(Yup);
const Signup = () => {
  const theme = useTheme();
  const router = useRouter();
  const snackBarMessage = useSnackbar();
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      postData(values);
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .required("Email is required")
        .matches(/\S+@\S+\.\S+/, "Invalid email"),
      password: Yup.string()
        .password()
        .minLowercase(1, "at least one lowercase")
        .minUppercase(1, "at least one uppercase")
        .minSymbols(1, "at least one symbol")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
  });

  const postData = async (values) => {
    try {
      setLoading(true);
      let res = await axios.post("signup/api", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      if (res?.data?.status === true) {
        snackBarMessage({
          type: "success",
          message: res?.data.message,
        });
        router.push("/login");
        formik.handleReset();
      } else {
        snackBarMessage({ message: res?.data?.message });
      }
    } catch (error) {
      snackBarMessage({ message: error.message });
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
              xs: "100vh",
            },
          }}
          className={styles.centeredContainer}
        >
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
                  Signup Form
                </Typography>
              </Grid>
              <Grid item xs={12} className={styles.centeredContainer}>
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  icon={
                    <IconButton edge="start">
                      <Person2RoundedIcon />
                    </IconButton>
                  }
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <Typography className={styles.error}>
                    {formik.errors.firstName}
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12} className={styles.centeredContainer}>
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  icon={
                    <IconButton edge="start">
                      <Person2RoundedIcon />
                    </IconButton>
                  }
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <Typography className={styles.error}>
                    {formik.errors.lastName}
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={12} className={styles.centeredContainer}>
                <TextInput
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  icon={
                    <IconButton edge="start">
                      <EmailRoundedIcon />
                    </IconButton>
                  }
                />
                {formik.touched.email && formik.errors.email ? (
                  <Typography className={styles.error}>
                    {formik.errors.email}
                  </Typography>
                ) : (
                  ""
                )}
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
                  loading={loading}
                  title={"Sign up"}
                  type="submit"
                />
              </Grid>
              <Grid item>
                <Link href="/" variant="body2">
                  <Typography className={styles.alreadyAccount}>
                    Already Account ? Login
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
