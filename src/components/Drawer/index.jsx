"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./styles.module.css";
import logo from "../../../public/logo.png";
import CustomButton from "../CustomButton";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DeleteModal from "@/components/DeleteModal";
import { useSnackbar } from "@/components/Snackbar";
import { Drawer, Box, Grid, Button, IconButton } from "@mui/material";

const DrawerComp = (props) => {
  const { handleShowForm } = props;
  const router = useRouter();
  const snackBarMessage = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDraweOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
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
        message: "Logout Failed",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <Box onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </Box>
      <Drawer
        anchor="right"
        open={isDraweOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
          },
        }}
      >
        <Grid container sx={{ padding: "30px 5px" }}>
          <Grid md={10} xs={10}>
            <Image src={logo} width={60} />
          </Grid>

          <Grid md={1} xs={1}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Box className={styles.drawer}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              className={styles.button}
              onClick={() => {
                setDrawerOpen(false);
                handleShowForm();
              }}
            >
              Add Expenses
            </Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CustomButton
              loading={loading}
              title={" Logout"}
              onClick={() => {
                setModalOpen(true);
              }}
            />
          </Box>
        </Box>
      </Drawer>
      <DeleteModal
        open={modalOpen}
        title={"Logout"}
        cancel={"Cancel"}
        msg="Are your want to logout ?"
        onClose={() => setModalOpen(false)}
        onClick={handleLogout}
      />
    </Box>
  );
};

export default DrawerComp;
