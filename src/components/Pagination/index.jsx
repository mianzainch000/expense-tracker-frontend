import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

const PaginationComp = (props) => {
  const { count, page, onChange } = props;
  const showPaginationIcons = count > 1;

  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "20px",
          },
          "& .MuiSvgIcon-root": {
            width: "50px",
            height: "50px",
            visibility: showPaginationIcons ? "visible" : "hidden",
          },
        }}
      />
    </Stack>
  );
};

export default PaginationComp;
