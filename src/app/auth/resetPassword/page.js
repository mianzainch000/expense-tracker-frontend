import ResetPassword from "./template";
import React, { Suspense } from "react";

const ResetPasswordForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordForm;

export function generateMetadata() {
  return { title: "Reset Password" };
}
