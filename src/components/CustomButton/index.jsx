import React from "react";
import styles from "./styles.module.css";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const CustomeButton = ({ loading, title, save, onClick, ...props }) => {
  return (
    <Button
      {...props}
      onClick={onClick}
      variant="contained"
      disableElevation
      className={styles.btn}
    >
      {title}
      {loading ? <CircularProgress className={styles.loading} /> : null}
    </Button>
  );
};

export default CustomeButton;
