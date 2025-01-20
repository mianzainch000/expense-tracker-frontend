import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  editData: {},
  loading: false,
  showForm: false,
  currentPage: 1,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setEditData: (state, action) => {
      state.editData = action.payload;
    },
    clearEditData: (state) => {
      state.editData = {};
    },
    setShowForm: (state, action) => {
      state.showForm = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setUserInfo,
  setEditData,
  clearEditData,
  setShowForm,
  setLoading,
  setCurrentPage,
} = expenseSlice.actions;
export default expenseSlice.reducer;
