export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  login: "login",
  signup: "signup",
  forgotPassword: "forgotPassword",
  resetPassword: "resetPassword",
  googleLogin: "googleLogin",
  expenseTable: {
    get: "getExpense",
    post: "postExpense",
    update: "updateExpense",
    delete: "deleteExpense",
  },
};
