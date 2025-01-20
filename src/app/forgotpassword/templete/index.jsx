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
import { useSnackbar } from "@/components/Snackbar";
import CustomButton from "@/components/CustomButton";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import {
  useMediaQuery,
  useTheme,
  IconButton,
  Grid,
  Box,
  Typography,
} from "@mui/material";

const ForgotPage = () => {
  const theme = useTheme();
  const snackBarMessage = useSnackbar();
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      postData(values);
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .matches(/\S+@\S+\.\S+/, "Invalid email"),
    }),
  });

  const postData = async (values) => {
    setLoading(true);
    try {
      let res = await axios.post("forgotpassword/api", {
        email: values.email,
      });

      if (res?.data?.status === true) {
        snackBarMessage({
          type: "success",
          message: res?.data.message,
        });
        formik.handleReset();
      } else {
        snackBarMessage({
          type: "error",
          message: res?.data.message,
        });
      }
    } catch (error) {
      snackBarMessage(error);
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
              xs: "80vh",
              marginTop: { lg: "0", md: "0", sm: "0", xs: "100px" },
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
                  Forgot Password
                </Typography>
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
                <CustomButton
                  loading={loading}
                  title={"Verify"}
                  type="submit"
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  <Typography sx={{ margin: "10px 40px" }}>
                    Remember it ? Go back to login
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

export default ForgotPage;
