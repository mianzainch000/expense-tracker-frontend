export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  login: "login",
  signup: "signup",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
  googleLogin: "googleLogin",
  expenseForm: {
    post: "postExpense",
    update: "updateExpense",
  },
  expenseTable: {
    get: "getExpense",
    delete: "deleteExpense",
  },
};
