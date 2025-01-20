import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const TextInput = ({ icon, endIcon, InputProps, label, error, ...props }) => {
  return (
    <TextField
      autoComplete="off"
      sx={{
        "& fieldset": {
          borderWidth: error ? "1px !important" : "0px",
          borderColor: error ? "red !important" : "transparent !important",
        },
        "&:hover fieldset": {
          borderWidth: error ? "1px !important" : "0px",
          borderColor: error ? "red !important" : "transparent !important",
        },
        "&.Mui-focused fieldset": {
          borderWidth: error ? "1px !important" : "0px",
          borderColor: error ? "red !important" : "transparent  !important",
        },
        borderRadius: 2,
        width: "90%",
        backgroundColor: "rgba(247, 247, 247, 1)",
        color: "white",
        "& .css-19obg2t-MuiInputBase-root-MuiOutlinedInput-root": {
          color: "white",
        },
        "& .css-168ywxh-MuiInputBase-root-MuiOutlinedInput-root": {
          color: "white",
        },
        "& .css-opmmng-MuiInputBase-root-MuiOutlinedInput-root": {
          color: "white",
        },
      }}
      placeholder={label}
      {...props}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
      variant="outlined"
    />
  );
};

export default TextInput;
