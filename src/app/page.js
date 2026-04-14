import React from "react";
import Login from "../app/(auth)/login/template";

const LoginForm = () => {
  return <Login />;
};

export default LoginForm;

export function generateMetadata() {
  return { title: "Login" };
}
