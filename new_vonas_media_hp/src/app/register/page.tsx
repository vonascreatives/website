import React from "react";
import { Metadata } from "next";
import RegisterMain from "@/_pages/register/register-main";

export const metadata: Metadata = {
  title: "Liko - Register page",
};

const RegisterPage = () => {
  return (
    <RegisterMain/>
  );
};

export default RegisterPage;
