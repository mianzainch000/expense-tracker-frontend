import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  onConfirm: null,
};

const confirmModalSlice = createSlice({
  name: "confirmModal",
  initialState,
  reducers: {
    openConfirmModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
    },
    closeConfirmModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.onConfirm = null;
    },
  },
});

export const { openConfirmModal, closeConfirmModal } =
  confirmModalSlice.actions;
export default confirmModalSlice.reducer;
