"use client";
import Image from "next/image";
import DrawerComp from "../Drawer";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { deleteCookie } from "cookies-next";
import logo from "../../../public/logo.png";
import { useRouter } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import { useSnackbar } from "@/components/Snackbar";
import { useTheme, useMediaQuery } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

const Navbar = (props) => {
  const { handleShowForm } = props;
  const theme = useTheme();
  const router = useRouter();
  const snackBarMessage = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = async () => {
    try {
      deleteCookie("sessionToken");
      snackBarMessage({
        message: "Logout Successfully",
        type: "success",
      });
      router.push("/login");
    } catch (error) {
      snackBarMessage({
        type: "error",
        message: error,
      });
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "black;" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <Image src={logo} width={60} />
          </IconButton>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              color: "goldenrod;",
              fontSize: "22px",
            }}
          >
            Expense Tracker
          </Typography>
          <Toolbar>
            {isMatch ? (
              <>
                <DrawerComp handleShowForm={handleShowForm} />
              </>
            ) : (
              <>
                <Stack direction="row" spacing={2}>
                  <Button className={styles.button} onClick={handleShowForm}>
                    Add Expenses
                  </Button>
                  <Box className={styles.inputField}>
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="logo"
                      className={styles.button}
                    >
                      <LogoutOutlinedIcon
                        onClick={() => {
                          setModalOpen(true);
                        }}
                        sx={{ fontSize: "40px" }}
                      />
                    </IconButton>
                  </Box>
                </Stack>
              </>
            )}
          </Toolbar>
        </Toolbar>
      </AppBar>
      <DeleteModal
        open={modalOpen}
        title={"Logout"}
        cancel={"Cancel"}
        msg="Are your want to logout ?"
        onClose={() => setModalOpen(false)}
        onClick={handleLogout}
      />
    </>
  );
};
export default Navbar;
