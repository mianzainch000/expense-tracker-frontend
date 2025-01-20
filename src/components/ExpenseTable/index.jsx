"use client";
import axios from "axios";
import Loading from "../Loading";
import styles from "./styles.module.css";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@/components/Pagination";
import React, { useState, useEffect } from "react";
import DeleteModal from "@/components/DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "@/components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { setEditData, setCurrentPage } from "@/redux/slice/expenseSlice";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  Paper,
  Box,
} from "@mui/material";

const ExpenseTable = (props) => {
  const { getAllData, loading, handleShowForm } = props;
  const dispatch = useDispatch();
  const snackBarMessage = useSnackbar();
  const userInfo = useSelector((state) => state.expense.userInfo);
  const currentPage = useSelector((state) => state.expense.currentPage);
  const [deleteId, setDeleteId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const itemsPerPage = 5;

  const handleDelete = async (id) => {
    try {
      let res = await axios.delete(`dashboard/api/${id}`, {
        data: { id: id },
      });
      snackBarMessage({
        message: res?.data?.message,
      });
      if (res?.data?.status === true) {
        getAllData();
      }
    } catch (error) {
      snackBarMessage(error);
    }
  };

  const editItem = (data) => {
    dispatch(setEditData(data));
    handleShowForm();
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userInfo?.expensess?.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    // Adjust the current page if the current page becomes empty
    if (currentItems?.length === 0 && currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  }, [userInfo, currentPage, dispatch]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userInfo?.expensess?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(userInfo?.expensess?.length / itemsPerPage);

  return (
    <Box className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table aria-label="simple table" stickyHeader>
              {currentItems?.map((item) => (
                <React.Fragment key={item._id}>
                  <TableRow
                    sx={{
                      backgroundColor: item.type === "income" ? "green" : "red",
                    }}
                  >
                    <TableCell className={styles.tableCell}>
                      {item.date}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {item.description}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {item.amount}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {item.paymentType}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {item.type}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setDeleteId(item._id);
                        setModalOpen(true);
                      }}
                    >
                      <DeleteIcon
                        sx={{
                          color: "white",
                          fontSize: {
                            lg: "40px",
                            md: "40px",
                            sm: "40px",
                            xs: "30px",
                          },
                          cursor: "pointer",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <EditIcon
                        sx={{
                          color: "yellow",
                          fontSize: {
                            lg: "40px",
                            md: "40px",
                            sm: "40px",
                            xs: "30px",
                          },
                          cursor: "pointer",
                        }}
                        onClick={() => editItem(item)}
                      />
                    </TableCell>
                  </TableRow>
                  <br></br>
                </React.Fragment>
              ))}
            </Table>
          </TableContainer>

          <Box className={styles.pagination}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => dispatch(setCurrentPage(value))}
            />
          </Box>
        </>
      )}

      <DeleteModal
        open={modalOpen}
        msg={"Are your want to delete ?"}
        title={"Delete"}
        cancel={"Cancel"}
        onClose={() => setModalOpen(false)}
        onClick={() => handleDelete(deleteId)}
      />
    </Box>
  );
};

export default ExpenseTable;
