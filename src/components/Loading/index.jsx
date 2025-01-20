import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress sx={{ color: "red" }} />
    </Box>
  );
};

export default Loading;
