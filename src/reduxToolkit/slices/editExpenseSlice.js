const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  editExpense: null,
};

const Slice = createSlice({
  name: "Expense Tracker",
  initialState,
  reducers: {
    setEditExpense: (state, action) => {
      state.editExpense = action.payload;
    },
    clearEditExpense: (state) => {
      state.editExpense = null;
    },
  },
});

export const { setEditExpense, clearEditExpense } = Slice.actions;
export default Slice.reducer;
