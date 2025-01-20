"use client";
import styles from "./styles.module.css";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import Loader from "@/components/Loading";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const Header = (props) => {
  const { loading } = props;
  const theme = useTheme();
  const firstName = getCookie("firstName");
  const lastName = getCookie("lastName");
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  const userInfo = useSelector((state) => state.expense.userInfo);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            paddingTop: "10px",
            textAlign: "center",
          }}
        >
          {isMatch ? (
            <>
              <Typography className={styles.username}>Welcome</Typography>
              <Box className={styles.usernameContainer}>
                <Typography className={styles.username}>
                  {firstName && firstName ? firstName : "No user data"}
                </Typography>
                <Typography className={styles.username}>
                  {lastName && lastName ? lastName : "No user data"}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography className={styles.username}>
              Welcome {firstName && firstName ? firstName : "No user data"}
              &nbsp;
              {lastName && lastName ? lastName : "No user data"}
            </Typography>
          )}

          <Typography fontSize="30px">Current Balance</Typography>
          <Typography className={styles.line}></Typography>
          <Typography variant="h3"> {userInfo?.currentBalance} Rs</Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box className={styles.income_expense}>
              <Box>
                {" "}
                <Typography fontSize="30px">Income</Typography>
                <Typography fontSize="30px">
                  {" "}
                  {userInfo?.totalIncome} Rs{" "}
                </Typography>
              </Box>
              <Box>
                {" "}
                <Typography fontSize="30px">Expense</Typography>
                <Typography fontSize="30px">
                  {" "}
                  {userInfo?.totalExpenses} Rs
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box className={styles.income_expense}>
              <Box>
                {" "}
                <Typography fontSize="30px">Cash</Typography>
                <Typography fontSize="30px"> {userInfo?.cash} Rs </Typography>
              </Box>
              <Box>
                {" "}
                <Typography fontSize="30px">Account</Typography>
                <Typography fontSize="30px"> {userInfo?.account} Rs</Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="h4" marginTop="10px">
            Transaction History
          </Typography>
          <br />
          <br />
        </Box>
      )}
    </>
  );
};

export default Header;
