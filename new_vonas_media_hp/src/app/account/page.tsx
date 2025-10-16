import React from "react";
import { Metadata } from "next";
import AccountMain from "@/_pages/account/account-main";

export const metadata: Metadata = {
  title: "Liko - Account page",
};

const AccountPage = () => {
  return (
    <AccountMain/>
  );
};

export default AccountPage;
