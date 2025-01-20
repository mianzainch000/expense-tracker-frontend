"use client";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./styles.module.css";
import CustomButton from "../CustomButton";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "@/components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { clearEditData } from "@/redux/slice/expenseSlice";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import {
  Grid,
  Box,
  MenuItem,
  Typography,
  IconButton,
  Button,
} from "@mui/material";

const ExpenseForm = (props) => {
  const { getAllData, handleClose } = props;
  const dispatch = useDispatch();
  const snackBarMessage = useSnackbar();
  const income = useSelector((state) => state.expense.userInfo);
  const editData = useSelector((state) => state.expense.editData);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      date: "",
      description: "",
      amount: "",
      paymentType: "",
      type: "",
    },

    onSubmit: async (values) => {
      if (editData._id) {
        updateData(values);
      } else {
        postData(values);
      }
    },

    validationSchema: Yup.object({
      date: Yup.string().required("Date is required"),
      description: Yup.string().required("Description is required"),
      amount: Yup.string()
        .required("Amount is required")
        .matches(/^[0-9]+$/, "Only numbers are allowed"),
      paymentType: Yup.string().required("Please select one"),
      type: Yup.string().required("Please select one"),
    }),
  });

  const postData = async (values) => {
    const amount = parseFloat(values.amount);

    if (amount <= 0) {
      snackBarMessage({
        message: "Amount must be greater than 0",
      });
      return false;
    }

    if (values.type === "expense") {
      if (values.paymentType === "cash" && amount > income?.cash) {
        snackBarMessage({ message: "You don't have enough cash" });
        return false;
      }

      if (values.paymentType === "account" && amount > income?.account) {
        snackBarMessage({
          message: "You don't have enough income in the account",
        });
        return false;
      }
    }

    setLoading(true);
    try {
      let res = await axios.post("dashboard/api", {
        date: values.date,
        description: values.description,
        amount: values.amount,
        paymentType: values.paymentType,
        type: values.type,
      });

      if (res?.data?.status === true) {
        getAllData();
        snackBarMessage({
          type: "success",
          message: res?.data?.message,
        });
        formik.handleReset();
      } else {
        snackBarMessage({
          message: res?.data?.message,
        });
        formik.handleReset();
      }
    } catch (error) {
      snackBarMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (values) => {
    const amount = parseFloat(values.amount);

    if (amount <= 0) {
      snackBarMessage({
        message: "Amount must be greater than 0",
      });
      return false;
    }

    if (values.type === "expense") {
      if (values.paymentType === "cash" && amount > income?.cash) {
        snackBarMessage({ message: "You don't have enough cash" });
        return false;
      }

      if (values.paymentType === "account" && amount > income?.account) {
        snackBarMessage({
          message: "You don't have enough income in the account",
        });
        return false;
      }
    }

    setLoading(true);
    try {
      let res = await axios.put(`dashboard/api/${editData._id}`, {
        _id: editData._id,
        date: values.date,
        description: values.description,
        amount: values.amount,
        paymentType: values.paymentType,
        type: values.type,
      });

      if (res?.data?.status === true) {
        getAllData();
        snackBarMessage({
          type: "warning",
          message: res?.data?.message,
        });
        dispatch(clearEditData());
        formik.handleReset();
      } else {
        snackBarMessage({
          message: res?.data?.message,
        });
      }
    } catch (error) {
      snackBarMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    formik.handleReset();
    dispatch(clearEditData());
  };

  useEffect(() => {
    if (editData._id) {
      formik.setFieldValue("date", editData.date);
      formik.setFieldValue("description", editData.description);
      formik.setFieldValue("amount", editData.amount);
      formik.setFieldValue("paymentType", editData.paymentType);
      formik.setFieldValue("type", editData.type);
    }
  }, [editData]);

  return (
    <>
      <br />

      <Box className={styles.iconContainer}>
        <Box className={styles.iconsubContainer}>
          <IconButton onClick={handleClose}>
            <ChevronLeftOutlinedIcon
              className={styles.ChevronLeftOutlinedIcon}
            />
          </IconButton>

          <Typography variant="h5" textAlign={"center"}>
            {editData._id ? " Update Transaction" : "Add Transaction"}
          </Typography>
          <Button onClick={clearForm} className={styles.clearBtn}>
            Clear
          </Button>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid item container lg={12} spacing={2} sx={{ overflowY: "auto" }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <TextInput
                placeholder="Enter Date"
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
              />
            </Box>

            {formik.touched.date && formik.errors.date ? (
              <Box className={styles.error}>{formik.errors.date}</Box>
            ) : (
              ""
            )}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <TextInput
                label="Description"
                type="text"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
              />
            </Box>

            {formik.touched.description && formik.errors.description ? (
              <Box className={styles.error}>{formik.errors.description}</Box>
            ) : (
              ""
            )}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <TextInput
                label="Amount"
                type="number"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
              />
            </Box>

            {formik.touched.amount && formik.errors.amount ? (
              <Box className={styles.error}>{formik.errors.amount}</Box>
            ) : (
              ""
            )}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <SelectInput
                label="Payment Type"
                name="paymentType"
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.paymentType &&
                  Boolean(formik.errors.paymentType)
                }
              >
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </SelectInput>
            </Box>

            {formik.touched.paymentType && formik.errors.paymentType ? (
              <Box className={styles.error}>{formik.errors.paymentType}</Box>
            ) : (
              ""
            )}
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <SelectInput
                label="Type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </SelectInput>
            </Box>

            {formik.touched.type && formik.errors.type ? (
              <Box className={styles.error}>{formik.errors.type}</Box>
            ) : (
              ""
            )}
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <CustomButton
                type="submit"
                loading={loading}
                title={editData._id ? " Update Transaction" : "Add Transaction"}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ExpenseForm;
