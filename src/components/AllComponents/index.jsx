"use client";
import axios from "axios";
import React from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ExpenseForm from "@/components/ExpenseForm";
import { useSnackbar } from "@/components/Snackbar";
import ExpenseTable from "@/components/ExpenseTable";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfo,
  setShowForm,
  setLoading,
  clearEditData,
} from "@/redux/slice/expenseSlice";

const ExpensePage = () => {
  const dispatch = useDispatch();
  const snackBarMessage = useSnackbar();
  const loading = useSelector((state) => state.expense.loading);
  const showForm = useSelector((state) => state.expense.showForm);

  const getAllData = async () => {
    dispatch(setLoading(true));
    try {
      let res = await axios.get("/dashboard/api");
      dispatch(setUserInfo(res?.data?.data));
    } catch (error) {
      snackBarMessage(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleShowForm = () => {
    dispatch(setShowForm(true));
  };

  const handleClose = () => {
    dispatch(setShowForm(false));
    dispatch(clearEditData());
  };

  return (
    <>
      <Navbar handleShowForm={handleShowForm} />
      {!showForm && (
        <>
          <Header loading={loading} />
          <ExpenseTable
            getAllData={getAllData}
            loading={loading}
            handleShowForm={handleShowForm}
          />
        </>
      )}
      {showForm && (
        <ExpenseForm getAllData={getAllData} handleClose={handleClose} />
      )}
    </>
  );
};

export default ExpensePage;
