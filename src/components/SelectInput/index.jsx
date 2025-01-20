import { Box, Select, FormControl, InputLabel } from "@mui/material";
const SelectInput = ({ label, error, ...props }) => {
  return (
    <Box sx={{ width: "90%" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label={label}
          {...props}
          sx={{
            backgroundColor: "rgba(247, 247, 247, 1)",
            "& fieldset": {
              borderWidth: error ? "1px !important" : "1px",
              borderColor: error
                ? "red !important"
                : "rgba(0, 0, 0, 0.23) !important",
            },
            "& .MuiOutlinedInput-root": {
              borderWidth: error ? "1px 1px !important" : "0px",
              borderColor: error ? "red !important" : "transparent !important",
            },
            "&:hover .MuiOutlinedInput-root": {
              borderWidth: error ? "1px !important" : "0px",
              borderColor: error ? "red !important" : "transparent !important",
            },
            "&.Mui-focused .MuiOutlinedInput-root": {
              borderWidth: error ? "1px !important" : "0px",
              borderColor: error ? "red !important" : "transparent !important",
            },
          }}
          variant="outlined"
          error={error}
        >
          {props.children}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectInput;
